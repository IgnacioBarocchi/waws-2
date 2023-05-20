import { createContext, useContext } from "react";
import GameEngine from "../services/@GameEngine";

// Create a context for the object manager instance
export const GameEngineContext = createContext<GameEngine | null>(null);

// Custom hook to access the object manager instance from a component
export function useGameEngine(): GameEngine {
  const gameEngine = useContext(GameEngineContext);
  if (!gameEngine) {
    throw new Error("Object Manager instance not found");
  }
  return gameEngine;
}
