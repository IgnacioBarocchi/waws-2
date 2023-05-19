import {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";

import {
  Connection,
  Edge,
  Node,
  NodeInternals,
  ReactFlowState,
  HandleType,
  OnNodesChange,
  useNodesState,
  OnEdgesChange,
  addEdge,
  useEdgesState,
} from "reactflow";

import GameEngine from "./@GameEngine";
import ObjectManager from "./ObjectManager";

import {
  edgeExists,
  edgeIsValid,
  filterEdgesByDistance,
  findClosestNode,
  getBondRoles,
  getClientPosition,
  getFarEdgesFrom,
  targetIsPane,
} from "../util/ConnectionSystemUtil";

import { IFlowable } from "./interfaces/IFlowable";

const MAX_DISTANCE = 350;

export default class ConnectionSystem implements IFlowable {
  private gameEngine: GameEngine;
  private objectManager: ObjectManager;
  public useEdgesState: any;
  public useNodesState: any;
  public setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  public edges: Edge[];
  public onEdgesChange: OnEdgesChange | undefined;
  public nodes: Node<any, string | undefined>[];
  public setNodes: React.Dispatch<
    React.SetStateAction<Node<any, string | undefined>[]>
  >;
  public onNodesChange: OnNodesChange | undefined;
  public addEdge: (edgeParams: Edge | Connection, edges: Edge[]) => Edge[];

  constructor(gameEngine: GameEngine) {
    this.gameEngine = gameEngine;
    this.objectManager = gameEngine.objectManager;

    this.addEdge = addEdge;
    this.useEdgesState = useEdgesState;
    this.useNodesState = useNodesState;

    const [edges, setEdges, onEdgesChange] = this.gameEngine.useEdgesState(
      this.objectManager.getEdges()
    );

    this.edges = edges;
    this.setEdges = setEdges;
    this.onEdgesChange = onEdgesChange;

    const [nodes, setNodes, onNodesChange] = useNodesState(
      this.objectManager.getData(undefined).nodes
    );

    this.nodes = nodes;
    this.setNodes = setNodes;
    this.onNodesChange = onNodesChange;
  }

  getConnectToClosestEdgeCallback(
    store: IStore,
    getClosestEdge: (node: Node) => Edge<any> | null
  ) {
    if (!store || Object.keys(store).length === 0) {
      return () => {
        console.warn("No store found");
      };
    }

    if (typeof getClosestEdge !== "function") {
      return () => {
        console.warn(`"getClosestEdge" is not a function`);
      };
    }

    return (_: MouseEvent | TouchEvent | undefined, node: Node) => {
      const closeEdge = getClosestEdge(node);

      const setEdgesCallback = (es: Iterable<unknown> | null | undefined) => {
        // todo: improve performance
        // @ts-ignore
        const nextEdges = [...new Set(es)] as Edge[];

        if (edgeIsValid(closeEdge) && edgeExists(closeEdge, nextEdges)) {
          nextEdges.push(closeEdge as Edge);
        }

        const internalValues = store.getState().nodeInternals.values();
        const storedNodes = Array.from(internalValues);
        const farEdgesToRemove = getFarEdgesFrom(node, storedNodes, nextEdges);

        if (farEdgesToRemove && farEdgesToRemove.length > 0) {
          console.info(
            "TODO IMPLEMENT REMOVE EDGES: " + JSON.stringify(farEdgesToRemove)
          );
        }

        return nextEdges;
      };

      this.setEdges(setEdgesCallback);
    };
  }

  getClosestEdgeCallbackFromNodesStore(store: IStore) {
    const guardedCallback = (node: Node) => {
      // * Ignore buildings
      if (node.type?.toLowerCase().includes("factory")) return null;

      const { nodeInternals, edges } = store.getState();
      const storedNodes: NodeInternals[] = Array.from(
        nodeInternals.values() as
          | Iterable<NodeInternals>
          | ArrayLike<NodeInternals>
      );

      const closestNode = findClosestNode(storedNodes, node);

      // @ts-ignore
      if (!closestNode.node) {
        return null;
      }

      // @ts-ignore
      const closeNode = closestNode.node as Node;

      // @ts-ignore
      const { source, target } = getBondRoles(closeNode, node);

      const newBond = this.objectManager.createBond(
        String(source),
        String(target)
      );

      const newEdge = newBond.getEdge();
      const nextEdges = filterEdgesByDistance(
        closeNode,
        edges,
        storedNodes,
        MAX_DISTANCE
      );

      if (edgeExists(newEdge, nextEdges)) {
        this.objectManager.deleteInstance(newBond);
        return null;
      }

      // console.info(JSON.stringify(newEdge));
      return newEdge;
    };

    return guardedCallback;
  }

  getOnConnectStartCallback(connectingNodeId: React.MutableRefObject<null>) {
    const guardedCallback = (
      _: ReactMouseEvent | ReactTouchEvent,
      {
        nodeId,
      }: {
        nodeId: string | null;
        handleId: string | null;
        handleType: HandleType | null;
      }
    ) => {
      //@ts-ignore
      connectingNodeId.current = nodeId;
    };
    return guardedCallback;
  }

  // @ts-ignore
  getOnConnectEndCallback(
    connectingNodeId: React.MutableRefObject<null>,
    reactFlowWrapper: React.MutableRefObject<null>,
    selectedBuilding: string
  ) {
    if (!this.gameEngine.running) return this.pausedGameCallback();

    const createBuildingCallback = (event: MouseEvent | TouchEvent) => {
      const newNodePosition = getClientPosition(reactFlowWrapper, event);
      const xOffset = 75;
      newNodePosition.x = newNodePosition.x - xOffset;
      // todo: create building using the
      // todo: using connectingNodeId podemos hacer source: connectingNodeId.current
      // todo: eds.concat({ id: idSuffix, source: connectingNodeId.current, target: idSuffix })
      // todo: resetear selected building to ""
      selectedBuilding = "PlantFactory";
      const building = this.objectManager.createBuilding(
        selectedBuilding,
        newNodePosition
      );

      const newBond = this.objectManager.createBond(
        String(connectingNodeId.current),
        String(building?.id)
      );

      this.setEdges((eds) => this.gameEngine.addEdge(newBond.getEdge(), eds));
    };

    return (event: MouseEvent | TouchEvent) => {
      if (targetIsPane(event?.target as Element) && selectedBuilding) {
        return createBuildingCallback;
      }
    };
  }

  getOnConnectCallback(): (params: Edge | Connection) => void {
    if (!this.gameEngine.running) return this.pausedGameCallback();

    if (!this.setEdges)
      throw new Error(
        `Dependecy error: the guarded callback depends on "setEdges". Set edges is: ${this.setEdges}`
      );

    if (!this.gameEngine.addEdge)
      throw new Error(
        `Dependecy error: the guarded callback depends on "addEdge". Add edge is: ${this.gameEngine.addEdge}`
      );

    return (params: Edge | Connection) => {
      const { source, target } = params;
      const newBond = this.objectManager.createBond(
        String(source),
        String(target)
      );
      this.setEdges((eds) => this.gameEngine.addEdge(newBond.getEdge(), eds));
    };
  }

  private pausedGameCallback() {
    return () => {
      console.log("paused");
    };
  }
}

interface IStore {
  getState: () => ReactFlowState;
  setState: (
    partial:
      | ReactFlowState
      | Partial<ReactFlowState>
      | ((state: ReactFlowState) => ReactFlowState | Partial<ReactFlowState>),
    replace?: boolean | undefined
  ) => void;
  subscribe: (
    listener: (state: ReactFlowState, prevState: ReactFlowState) => void
  ) => () => void;
  destroy: () => void;
}

/*
  useNodesState: <NodeData = any>(
    initialItems: Node<NodeData, string | undefined>[]
  ) => [
    Node<NodeData, string | undefined>[],
    Dispatch<SetStateAction<Node<NodeData, string | undefined>[]>>,
    OnChange<NodeChange>
  ];
  useEdgesState: <EdgeData = any>(
    initialItems: Edge<EdgeData>[]
  ) => [
    Edge<EdgeData>[],
    Dispatch<SetStateAction<Edge<EdgeData>[]>>,
    OnChange<EdgeChange>
  ];
*/
