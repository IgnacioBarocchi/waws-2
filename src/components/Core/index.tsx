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
  Background,
  BackgroundVariant,
  ReactFlow as Scenario,
  ReactFlowProvider as ScenarioProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from "reactflow";

import NodeComponents from "../../components/NodeTypes/NodeComponents";
import { DEFAULT_GAME_SPEED } from "../../constants/config/game";
import { useObjectManager } from "../../containers/ObjectManagerContext";
import { useGameEngine } from "../../containers/GameEngineContext";
import UI from "../UI";

function Core() {
  const selectedBuilding = "PlantFactory";
  const objectManager = useObjectManager();
  const engine = useGameEngine();

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
  const [nodes, setNodes, onNodesChange] = useNodesState(
    objectManager.getData(undefined).nodes
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    objectManager.getEdges()
  );

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
    console.count("is running: " + engine.running);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const onConnectStart = useCallback(
    engine.connectionSystem.getOnConnectStartCallback(connectingNodeId),
    []
  );

  const getClosestEdge = useCallback(
    engine.connectionSystem.getClosestEdgeCallbackFromNodesStore(store),
    [store]
  );

  const connectToClosestEdge = useCallback(
    engine.connectionSystem.getConnectToClosestEdgeCallback(
      store,
      getClosestEdge
    ),
    [getClosestEdge, store]
  );

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

  /**
   * Plays the game.
   * @returns {void}
   */
  const play = (): void => {
    /**
     * Retrieves indexed nodes from the object manager.
     * @type {Array}
     */
    const indexedNodes: Array<any> = objectManager.getData("tick").nodes;

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
    // Todo: Move to game engine play method
    newNodes.forEach((n) => connectToClosestEdge(undefined, n));
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
  <ScenarioProvider>
    <Core />
  </ScenarioProvider>
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
