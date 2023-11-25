import { AppUIStateProvider, useAppUIState } from "./containers/AppUIContext";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import EnviromentSystem, {
  BiomeType,
  DayMoment,
  SeasonType,
} from "./services/EnviromentSystem";
import {
  useEffect as useGameTriggerEffect,
  useEffect as useLoadDataEffect,
  useMemo,
  useState,
} from "react";

import Core from "./components/Core";
import GameEngine from "./services/@GameEngine";
import { GameEngineContext } from "./containers/GameEngineContext";
import GameTrigger from "./trigger/GameTrigger";
import GlobalGameEntitiesStyler from "./containers/GlobalGameEntitiesStyler";
import LocalStorageService from "./services/LocalStorageService";
import ObjectManager from "./services/ObjectManager";
import { ObjectManagerContext } from "./containers/ObjectManagerContext";
import { ReactFlowProvider as ScenarioProvider } from "reactflow";
import { loadAnimalRecordTypes } from "./workers/loadAnimalRecordTypes";
const timeSettings = {
  startingTime: 10,
  startingDayMoment: DayMoment.Day,
  startingSeason: SeasonType.Summer,
  ticksPerMinute: 100,
  startingTick: 10,
  totalDayMinutes: 10,
};

const biome = {
  temperature: 545,
  chanceOfRain: 0.4,
  chanceOfSnow: 0.5,
};

// BiomeType.Forest
const objectManager = new ObjectManager("DEV", {});
const environment = new EnviromentSystem(
  BiomeType.Forest,
  timeSettings,
  objectManager,
  1
);

const gameEngine = new GameEngine(environment, objectManager, {
  graphics: "l",
  time: 1,
});
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
          <GlobalGameEntitiesStyler />
          <ScenarioProvider>
            {/* <Canvas camera={{ position: [-3, 8, -6.5] }}>
              <ambientLight />
              <pointLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-3, -3, 2]} /> */}
            <Core />
            {/* </Canvas> */}
          </ScenarioProvider>
        </GameEngineContext.Provider>
      </ObjectManagerContext.Provider>
    </AppUIStateProvider>
  );
}
