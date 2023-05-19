este juego es la version mejorada de un proyecto anterior. anteriormente tenía el siguiente componente:

// importación de módulos ...

function GameEngine() {
    // * Load application state
    const {
      state: { selectedBuilding },
      dispatch,
    } = useApplicationState();
  
    // * Load custom nodes
    type nodeComponentProps = JSX.IntrinsicAttributes & { data: any };
    const nodeTypes = useMemo(
      () => ({
        building: (_: nodeComponentProps) => <AnimalFactoryNode data='' />,
        diamond: (_: nodeComponentProps) => <DiamondNode data='' />,
        diamondMine: (_: nodeComponentProps) => <DiamondMineNode data='' />,
        unit: (props: Node) => <AnimalNode nodeData={props} />,
        animal: (props: Node) => <AnimalNode nodeData={props} />,
      }),
      []
    );
  
    const reactFlowWrapper = useRef(null);
  
    const connectingNodeId = useRef(null);
  
    const [nodes, setNodes, onNodesChange] = useNodesState(initialObjects.nodes);
  
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialObjects.edges);
  
    const [units, setUnits] = useState(initialObjects.units);
  
    const [isPlaying, setIsPlaying] = useState(true);
  
    const store = useStoreApi();
  
    const play = () => {
      //units.map(getDataFromUnits);
      const unitNodes = getAllNodes();
      const newNodes = [...nodes, ...unitNodes].filter(Boolean);
      // ! 1# WARNING: set nodes is asynchronous.
      setNodes(newNodes);
  
      // ! 2# WARNING: do not loop trough nodes, hence the value is not updated inmediately
      // ! not even when we do: setNodes((prevNodes) => [...prevNodes, ...unitNodes]);
      newNodes.forEach((n) => connectToClosestEdge(undefined, n));
    };
  
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Space') {
          setIsPlaying((prevState) => !prevState);
          console.table({ isPlaying });
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
  
      return () => window.removeEventListener('keydown', handleKeyDown, false);
    }, [isPlaying]);
  
    useEffect(() => {
      if (isPlaying) {
        const intervalId = setInterval(play, DEFAULT_GAME_SPEED);
        return () => {
          clearInterval(intervalId);
        };
      }
    }, [isPlaying]);
  
    const { project } = useReactFlow();
  
    const onConnect = useCallback(
      (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
      []
    );
  
    const onConnectStart = useCallback(
      (_: ReactMouseEvent | ReactTouchEvent, { nodeId }: OnConnectStartParams) => {
        connectingNodeId.current = nodeId;
      },
      []
    );
  
    const onConnectEnd = useCallback(
      getOnConnectEndCallback(
        connectingNodeId,
        reactFlowWrapper,
        selectedBuilding,
        setNodes,
        setEdges,
        setUnits,
        dispatch
      ),
      [project, selectedBuilding]
    );
  
    const getClosestEdge = useCallback(getClosestEdgeCallbackFromNodesStore(store), [store]);
  
    const connectToClosestEdge = useCallback(
      getConnectToClosestEdgeCallback(units, setUnits, store, getClosestEdge, setEdges),
      [getClosestEdge, store]
    );
  
    return (
      <div className='wrapper' ref={reactFlowWrapper}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeClick={(_, node) => {
            dispatch({
              type: 'SET_SELECTED_UNIT',
              payload: SentientUnit.getSentientUnitInstance(node.id) as SentientUnit,
            });
          }}
          style={{ backgroundColor: '#254117' }}
          fitView
        ></ReactFlow>
      </div>
    );
  }
  
  export default memo(GameEngine);

Mí pregunta es, teniendo en cuenta la Entity que implementada por una clase derivada(Unit) ¿Puedo trasladar la lógica de react para que sea manejada por Entity ?
Es decir, que los handlers onNodesChange, onEdgesChange, onConnect, onConnectStart, onConnectEnd se produzcan dentro la clase.