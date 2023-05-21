import React from "react";
import ObjectManager from "./ObjectManager";
import { Connection, Edge, Node } from "reactflow";

import ConnectionSystem from "./ConnectionSystem";

export default class GameEngine {
  public running: boolean;
  public objectManager: ObjectManager;
  public connectionSystem: ConnectionSystem;
  public hooksLoaded: boolean;
  private _setNodes: React.Dispatch<
    React.SetStateAction<Node<any, string | undefined>[]>
  >;
  private _setEdges: {
    (value: React.SetStateAction<Edge<any>[]>): void;
    (value: React.SetStateAction<Edge<any>[]>): void;
  };
  private _addEdge: {
    (edgeParams: Edge | Connection, edges: Edge[]): Edge[];
    (edgeParams: Edge | Connection, edges: Edge[]): Edge[];
  };
  gameSettings: { graphics: "l" | "m" | "h"; time: any };

  constructor(
    objectManager: ObjectManager,
    gameSettings: {
      graphics: "l" | "m" | "h";
      time: any;
    }
  ) {
    this.running = true;
    this.objectManager = objectManager;
    this._setNodes = null as any;
    this._setEdges = null as any;
    this._addEdge = null as any;
    this.connectionSystem = new ConnectionSystem(this);
    this.hooksLoaded = false;
    this.gameSettings = gameSettings;
  }

  public injectSetterHooks(
    setNodes: React.Dispatch<
      React.SetStateAction<Node<any, string | undefined>[]>
    >,
    setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>,
    addEdge: (edgeParams: Edge | Connection, edges: Edge[]) => Edge[]
  ): void {
    this.setNodes = setNodes;
    this.setEdges = setEdges;
    this.addEdge = addEdge;
    this.hooksLoaded = true;
  }

  get setNodes(): React.Dispatch<
    React.SetStateAction<Node<any, string | undefined>[]>
  > {
    return this._setNodes;
  }

  set setNodes(
    v: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>
  ) {
    this._setNodes = v;
  }

  get setEdges(): React.Dispatch<React.SetStateAction<Edge<any>[]>> {
    return this._setEdges;
  }

  set setEdges(v: React.Dispatch<React.SetStateAction<Edge<any>[]>>) {
    this._setEdges = v;
  }

  get addEdge(): (edgeParams: Edge | Connection, edges: Edge[]) => Edge[] {
    return this._addEdge;
  }

  set addEdge(v: (edgeParams: Edge | Connection, edges: Edge[]) => Edge[]) {
    this._addEdge = v;
  }

  togglePause(): void {
    this.running = !this.running;
  }
}

// save(): void {
//   LocalStorageService.getInstance().setData(this);
// }
// play(): void {
//   if (!this.hooksLoaded)
//     throw new Error("The object did not load the react hooks");
//   // this.connectionSystem.getConnectToClosestEdgeCallback();
// }
// import { IPlayable } from "./interfaces/IPlayable";
// import LocalStorageService from "./LocalStorageService";
