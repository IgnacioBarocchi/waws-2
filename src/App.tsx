import "./App.css";
import { useMemo, useEffect as useGameTriggerEffect } from "react";

import GameEngine from "./services/@GameEngine";
import ObjectManager from "./services/ObjectManager";
import GameTrigger from "./trigger/GameTrigger";

import { GameEngineContext } from "./containers/GameEngineContext";
import { ObjectManagerContext } from "./containers/ObjectManagerContext";

import Core from "./components/Core";

const objectManager = new ObjectManager("DEV", {});
const gameEngine = new GameEngine(objectManager);

export default function App() {
  const gameTrigger = useMemo(
    () => new GameTrigger(objectManager),
    [objectManager]
  );

  useGameTriggerEffect(() => {
    if (!objectManager.gameIsCreated) gameTrigger.trigger("start game");
  });

  return (
    <ObjectManagerContext.Provider value={objectManager}>
      <GameEngineContext.Provider value={gameEngine}>
        <Core />
      </GameEngineContext.Provider>
    </ObjectManagerContext.Provider>
  );
}

/*import { useEffect, useMemo, useState } from "react";
import LocalStorageService from "./services/LocalStorageService";
import GameTrigger from "./trigger/GameTrigger";
import ObjectManager from "./services/ObjectManager";
import GameEngine from "./services/@GameEngine";*/
/*
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shouldTrigger, setShouldTrigger] = useState<boolean>(false);
  const localStorageService = LocalStorageService.getInstance();

  const loadObject = async () => {
    if (!localStorageService.getGameEngine()) {
      const objectManager = new ObjectManager("DEV", {});
      const engine = new GameEngine(objectManager);
      localStorageService.setGameEngine(engine);
      setShouldTrigger(true);
    }
  };

  useEffect(() => {
    loadObject();
    if (shouldTrigger) {
      const objectManager = localStorageService.getGameEngine().objectManager;
      const gameTrigger = new GameTrigger(objectManager);

      if (!objectManager.gameIsCreated) {
        gameTrigger.trigger("start game");
        setShouldTrigger(false);
        setIsLoading(false);
      }
    }
  }, []);
  if (isLoading) return <div>is loading</div>;
  */

/*
onNodeClick={(_, node) => {
  dispatch({
    type: "SET_SELECTED_UNIT",
    payload: SentientUnit.getSentientUnitInstance(
      node.id
    ) as SentientUnit,
  });
}}
*/

// const existingData = localStorageService.getData();
// const keys = ["recodTypes", "gameEngine", "UIState"];
// if (existingData) {
//   alert(JSON.stringify(existingData));
//   // setIsLoading(false);
//   return;
// }

// const dataFromWorker = await loadCollection();
// if (dataFromWorker) {
//   localStorageService.setdata(dataFromWorker);
//   console.log("entities are loaded");
//   setIsLoading(false);
// }
