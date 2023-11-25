import { createContext, useContext } from "react";
import ObjectManager from "../services/ObjectManager";

// Create a context for the object manager instance
export const ObjectManagerContext = createContext<ObjectManager | null>(null);

// Custom hook to access the object manager instance from a component
export function useObjectManager(): ObjectManager {
  const objectManager = useContext(ObjectManagerContext);
  if (!objectManager) {
    throw new Error("Object Manager instance not found");
  }
  return objectManager;
}
