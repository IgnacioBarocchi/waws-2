import React, { createContext, useContext } from "react";
import * as THREE from "three";

// Create the 3D context
interface ThreeContextValue {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

const ThreeContext = createContext<ThreeContextValue | undefined>(undefined);

// Create a provider component
interface ThreeProviderProps {
  children: React.ReactNode;
}

export function ThreeProvider({ children }: ThreeProviderProps) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  return (
    <ThreeContext.Provider value={{ scene, camera }}>
      {children}
    </ThreeContext.Provider>
  );
}

// Custom hook to access the 3D context
export function useThree() {
  const context = useContext(ThreeContext);
  if (!context) {
    throw new Error("useThree must be used within a ThreeProvider");
  }
  return context;
}
