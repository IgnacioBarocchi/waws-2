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
  useReactFlow,
  useStoreApi,
} from "reactflow";

import GameEngine from "../../services/@GameEngine";
import GameTrigger from "../../trigger/GameTrigger";
import ObjectManager from "../../services/ObjectManager";
import NodeComponents from "../../components/NodeTypes/NodeComponents";
import { DEFAULT_GAME_SPEED } from "../../constants/config/game";

const selectedBuilding = "PlantFactory";

function Core() {
  const objectManager = useMemo(() => new ObjectManager("DEV", {}), []);
  const gameTrigger = useMemo(
    () => new GameTrigger(objectManager),
    [objectManager]
  );
  const engine = useMemo(() => new GameEngine(objectManager), [objectManager]);

  useGameTriggerEffect(() => {
    if (!objectManager.gameIsCreated) gameTrigger.trigger("start game");
  });

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
  // const [nodes, setNodes, onNodesChange] = useNodesState(
  //   objectManager.getData(undefined).nodes
  // );

  // const [edges, setEdges, onEdgesChange] = useEdgesState(
  //   objectManager.getEdges()
  // );

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
    [engine.connectionSystem.setEdges, engine.connectionSystem.setEdges]
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
    const newNodes: Array<any> = [
      ...engine.connectionSystem.nodes,
      ...indexedNodes,
    ].filter(Boolean);

    // ! 1# WARNING: set nodes is asynchronous.

    /**
     * Sets the nodes asynchronously.
     * @returns {void}
     */
    engine.connectionSystem.setNodes(newNodes);

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
        nodes={engine.connectionSystem.nodes}
        edges={engine.connectionSystem.edges}
        // * Hooks
        onNodesChange={engine.connectionSystem.onNodesChange}
        onEdgesChange={engine.connectionSystem.onEdgesChange}
        // * Game engine handlers
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        // * Style
        fitView
      >
        <Background variant={BackgroundVariant.Cross} gap={50} />
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
