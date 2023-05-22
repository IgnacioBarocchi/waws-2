import "reactflow/dist/style.css";
import {
  useCallback,
  useRef,
  useMemo,
  useEffect as useGameTriggerEffect,
  useEffect as useKeyboardEventEffect,
  useEffect as usePlayGameEffect,
  useState,
} from "react";

import {
  ReactFlow as Scenario,
  ReactFlowProvider as ScenarioProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";

import NodeComponents from "../../components/NodeTypes/NodeComponents";
import { DEFAULT_GAME_SPEED, MIN_DISTANCE } from "../../constants/config/game";
import { useObjectManager } from "../../containers/ObjectManagerContext";
import { useGameEngine } from "../../containers/GameEngineContext";
import UI from "../UI";
import { useAppUIState } from "../../containers/AppUIContext";

function Core() {
  const selectedBuilding = "PlantFactory";
  const objectManager = useObjectManager();
  const initalNodes = objectManager.getData(undefined).nodes;
  const initalEdges = objectManager.getEdges();
  const engine = useGameEngine();

  const { dispatch } = useAppUIState();

  // ! Mutable state
  const store = useStoreApi();
  // ! Mutable state
  const { project } = useReactFlow();

  // * Load custom node components
  const nodeTypes = useMemo(() => NodeComponents, []);

  // * Declare references
  const scenarioWrapper = useRef(null);

  const connectingNodeId = useRef(null);

  // * Use React Flow variables
  const [nodes, setNodes, onNodesChange] = useNodesState(initalNodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initalEdges);

  // * Load React Hooks dependencies in the class context
  // Todo: find another way
  // eg: pass useNodesState and useEdgesState to the class
  engine.injectSetterHooks(setNodes, setEdges, addEdge);

  // * After loading the game loops
  const [isPlaying, setIsPlaying] = useState(engine.running);

  // * Handle hotkeys
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      engine.running = !engine.running;
      setIsPlaying((prevState) => !prevState);
    }
  };

  useKeyboardEventEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const onConnectStart = useCallback(
    engine.connectionSystem.getOnConnectStartCallback(connectingNodeId),
    []
  );

  // const getClosestEdge = useCallback(
  //   engine.connectionSystem.getClosestEdgeCallbackFromNodesStore(store),
  //   [store]
  // );

  //   useCallback(
  //   engine.connectionSystem.getConnectToClosestEdgeCallback(
  //     store
  //     // getClosestEdge
  //   ),
  //   [store]
  //   // [getClosestEdge, store]
  // );

  const onConnect = useCallback(
    engine.connectionSystem.getOnConnectCallback(),
    [setEdges, engine.setEdges]
  );

  const onConnectEnd = useCallback(
    engine.connectionSystem.getOnConnectEndCallback(
      connectingNodeId,
      scenarioWrapper,
      selectedBuilding
    ),
    [project, selectedBuilding]
  );
  // @ts-ignore
  const getClosestEdge = useCallback((node) => {
    const { nodeInternals } = store.getState();
    const storeNodes = Array.from(nodeInternals.values());
    const closestNode = storeNodes.reduce(
      (res, n) => {
        if (n.id !== node.id) {
          // ! IMPORTANTE
          // ! node no tiene position absolute porque no es el nodo capturado por el evento dragging.
          // ! sin embargo, "n" si tiene
          // @ts-ignore
          const dx = n.positionAbsolute.x - node.position.x;
          // @ts-ignore
          const dy = n.positionAbsolute.y - node.position.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            // @ts-ignore
            res.node = n;
          }
        }
        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
      }
    );

    if (!closestNode.node) {
      return null;
    }
    // ! SE ESPERA QUE EL RESULTADO SI TENGA ABS POSITION (closestNode.node.positionAbsolute)
    // ! PERO COMO VIMOS ANTES NODE NO TIENE (node)
    // @ts-ignore
    const closeNodeIsSource =
      // @ts-ignore
      closestNode.node.positionAbsolute.x < node.position.x;
    // closestNode.node.positionAbsolute.x < node.positionAbsolute.x;

    return {
      // @ts-ignore
      id: `${node.id}-${closestNode.node.id}`,
      // @ts-ignore
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      // @ts-ignore
      target: closeNodeIsSource ? node.id : closestNode.node.id,
    };
  }, []);

  const connectToClosestEdge = useCallback(
    // @ts-ignore
    (node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          const commitedEdge = objectManager.createBond(
            closeEdge.source,
            closeEdge.target
          );
          // @ts-ignore //! ACA LE DA EL NOMBRE DE LA CLASE TEMPORAL!
          commitedEdge.className = "commited";
          nextEdges.push(commitedEdge);
          // closeEdge.className = "temp";
          // nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );
  /**
   * Plays the game.
   * @returns {void}
   */
  const play = (): void => {
    engine.enviromentSystem.advanceTime(1);
    dispatch({
      type: "SET_ENVIROMENT_DATA",
      payload: engine.enviromentSystem.getData(),
    });

    /**
     * Retrieves indexed nodes from the object manager.
     * @type {Array}
     */
    const indexedNodes: Array<any> = objectManager.getData(undefined).nodes;

    /**
     * Combines existing nodes with indexed nodes and filters out any falsy values.
     * @type {Array}
     */
    const newNodes: Array<any> = [...nodes, ...indexedNodes].filter(Boolean);

    // ! 1# WARNING: set nodes is asynchronous.

    /**
     * Sets the nodes asynchronously.
     * @returns {void}
     */
    setNodes(newNodes);

    // ! 2# WARNING: do not loop through nodes, hence the value is not updated immediately
    // ! not even when we do: setNodes((prevNodes) => [...prevNodes, ...unitNodes]);

    /**
     * Connects each new node to the closest edge.
     * @param {*} _ Unused parameter.
     * @param {*} n The node to connect to the closest edge.
     * @returns {void}
     */
    newNodes.forEach(connectToClosestEdge);
    // newNodes.forEach((n) => {
    //   // console.log("connect loop");
    //   // console.info(JSON.stringify(store));
    //   // connectToClosestEdge(undefined, n);
    // });
  };

  usePlayGameEffect(() => {
    if (isPlaying) {
      const intervalId = setInterval(play, DEFAULT_GAME_SPEED);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isPlaying]);

  return (
    <div className="wrapper" ref={scenarioWrapper}>
      <Scenario
        // * Renderable entities
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        // * Hooks
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // * Game engine handlers
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        // * Style
        fitView
      >
        <UI />
      </Scenario>
    </div>
  );
}

export default () => (
  // <ScenarioProvider>
  <Core />
  // </ScenarioProvider>
);
// * Initialize
// const objectManager = new ObjectManager("DEV", {});
// const gameTrigger = new GameTrigger(objectManager); // todo: improve observables
// const engine = new GameEngine(objectManager);
// gameTrigger.trigger("start game");
/*
engine.setNodes = setNodes;
engine.setEdges = setEdges;
engine.addEdge = addEdge;
*/
/*
  if (targetNode.positionAbsolute && sourceNode.positionAbsolute) {
    const dx = targetNode.positionAbsolute.x - sourceNode.positionAbsolute.x;
    const dy = targetNode.positionAbsolute.y - sourceNode.positionAbsolute.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  const dx = targetNode.position.x - sourceNode.position.x;
  const dy = targetNode.position.y - sourceNode.position.y;
  return Math.sqrt(dx * dx + dy * dy);
*/
