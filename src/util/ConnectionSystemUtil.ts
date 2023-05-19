import { Edge, Node, NodeInternals } from "reactflow";
import { MAX_DISTANCE } from "../constants/config/game";
const MIN_DISTANCE = 300;

export function getDistance(sourceNode: Node, targetNode: Node): number {
  if (targetNode.positionAbsolute && sourceNode.positionAbsolute) {
    const dx = targetNode.positionAbsolute.x - sourceNode.positionAbsolute.x;
    const dy = targetNode.positionAbsolute.y - sourceNode.positionAbsolute.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  const dx = targetNode.position.x - sourceNode.position.x;
  const dy = targetNode.position.y - sourceNode.position.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function filterEdgesByDistance(
  node: Node,
  nextEdges: Edge[],
  storeNodes: NodeInternals[],
  maxDistance: number
): Edge[] {
  return nextEdges.filter((edge: Edge) => {
    const isSourceOrTarget = edge.source === node.id || edge.target === node.id;

    if (isSourceOrTarget) {
      // @ts-ignore
      const sourceNode: Node | undefined = storeNodes.find(
        // @ts-ignore
        (n) => n?.id === edge.source
      );

      // @ts-ignore
      const targetNode: Node | undefined = storeNodes.find(
        // @ts-ignore
        (n) => n?.id === edge.target
      );

      if (sourceNode && targetNode) {
        // todo: type checking
        // @ts-ignore

        if (getDistance(sourceNode, targetNode) > maxDistance) {
          return false;
        }
      }
    }

    // * Keep edge
    return true;
  });
}

export function findClosestNode(storeNodes: NodeInternals[], node: Node): Node {
  return storeNodes.reduce(
    (res: any, n: any) => {
      if (n.id !== node.id) {
        const dx = n.positionAbsolute?.x - node.position.x;
        const dy = n.positionAbsolute?.y - node.position.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < res.distance && d < MIN_DISTANCE) {
          res.distance = d;
          res.node = n;
        }
      }

      return res;
    },
    {
      distance: Number.MAX_VALUE,
      node: null,
    }
  ) as Node;
}

export const getClientPosition = (
  reference: any,
  event: MouseEvent | TouchEvent
) => {
  const { top, left } = reference.current.getBoundingClientRect();
  if ("clientX" in event) {
    return {
      x: event.clientX - left,
      y: event.clientY - top,
    };
  } else {
    throw new Error("Touch events are not supported");
  }
};

export const targetIsPane = (element: Element): boolean =>
  element.classList.contains("react-flow__pane");

export const getBondRoles = (closeNode: Node, otherNode: Node) => {
  const closeNodeIsSource = closeNode.positionAbsolute
    ? closeNode.positionAbsolute.x < otherNode.position.x
    : closeNode.position.x < otherNode.position.x;

  const source = closeNodeIsSource ? closeNode.id : otherNode.id;
  const target = closeNodeIsSource ? otherNode.id : closeNode.id;

  return { source, target };
};

export const edgeExists = (edge: Edge | null, edges: Edge[]) => {
  if (edges.length === 0) return false;
  if (!edge) return false;

  return edges.some(
    (e) =>
      e.id === edge.id || (e.source === edge.source && e.target === edge.target)
  );
};

export const edgeIsValid = (edge: Edge | null) => {
  if (!edge) return false;
  if (!edge.source || !edge.target) return false;
  return true;
};

export const getFarEdgesFrom = (
  node: Node,
  storedNodes: Node<any, string | undefined>[],
  edges: Edge[]
): Edge[] => {
  const thefilter = (edge: Edge) => {
    const sourceNode: Node | undefined = storedNodes.find(
      (node) => node.id === edge.source
    );

    const targetNode: Node | undefined = storedNodes.find(
      (node) => node.id === edge.target
    );

    if (
      (sourceNode && targetNode) ||
      sourceNode?.id === node.id ||
      targetNode?.id === node.id
    ) {
      return getDistance(sourceNode as Node, targetNode as Node) > MAX_DISTANCE;
    }

    return false;
  };

  return edges.filter(thefilter);
};

// if (getDistance(sourceNode as Node, targetNode as Node) > MAX_DISTANCE) {
//   edge = removeRemoveRelationshipFromEdge(edge, sourceNode, targetNode);
//   nextEdges.splice(nextEdges.indexOf(edge), 1);
// }
