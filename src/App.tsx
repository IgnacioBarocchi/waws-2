import {
  useState,
  useMemo,
  useEffect as useGameTriggerEffect,
  useEffect as useLoadDataEffect,
} from "react";
import GameEngine from "./services/@GameEngine";
import ObjectManager from "./services/ObjectManager";
import GameTrigger from "./trigger/GameTrigger";
import { GameEngineContext } from "./containers/GameEngineContext";
import { ObjectManagerContext } from "./containers/ObjectManagerContext";
import Core from "./components/Core";
import { AppUIStateProvider, useAppUIState } from "./containers/AppUIContext";
import GlobalGameEntitiesStyler from "./containers/GlobalGameEntitiesStyler";
import { loadAnimalRecordTypes } from "./workers/loadAnimalRecordTypes";
import LocalStorageService from "./services/LocalStorageService";
import { ThreeProvider } from "./containers/ThreeContext";
import { ReactFlowProvider as ScenarioProvider } from "reactflow";
const objectManager = new ObjectManager("DEV", {});
const gameEngine = new GameEngine(objectManager, { graphics: "l", time: 1 });
const localStorageService = LocalStorageService.getInstance();
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const gameTrigger = useMemo(
    () => new GameTrigger(objectManager),
    [objectManager]
  );

  useGameTriggerEffect(() => {
    if (!isLoading && !objectManager.gameIsCreated)
      gameTrigger.trigger("start game");
  }, [isLoading]);

  useLoadDataEffect(() => {
    const loadData = async () => {
      try {
        // Check if animal record types are already stored in the storage
        const storedAnimalRecordTypes =
          localStorageService.getAnimalRecordTypes();
        if (storedAnimalRecordTypes) {
          setIsLoading(false);
        } else {
          // Animal record types not stored, load them from the JSON file
          const animalRecordTypes = await loadAnimalRecordTypes();
          localStorageService.setAnimalRecordTypes(animalRecordTypes);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading animal record types:", error);
      }
    };

    loadData();
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AppUIStateProvider>
      <ObjectManagerContext.Provider value={objectManager}>
        <GameEngineContext.Provider value={gameEngine}>
          <ThreeProvider>
            <GlobalGameEntitiesStyler />
            <ScenarioProvider>
              <Core />
            </ScenarioProvider>
          </ThreeProvider>
        </GameEngineContext.Provider>
      </ObjectManagerContext.Provider>
    </AppUIStateProvider>
  );
}
