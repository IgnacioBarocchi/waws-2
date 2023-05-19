import React from "react";
import ObjectManager from "./ObjectManager";
import { Connection, Edge, Node } from "reactflow";
import { IPlayable } from "./interfaces/IPlayable";
import LocalStorageService from "./LocalStorageService";
import ConnectionSystem from "./ConnectionSystem";
import { addEdge, useEdgesState, useNodesState } from "reactflow";
export default class GameEngine implements IPlayable {
  addEdge(arg0: Edge, eds: Edge<any>[]): Edge<any>[] {
    throw new Error("Method not implemented.");
  }
  public running: boolean;
  public objectManager: ObjectManager;
  public connectionSystem: ConnectionSystem;
  useEdgesState: any;
  useNodesState: any;

  constructor(objectManager: ObjectManager) {
    this.running = true;
    this.objectManager = objectManager;
    this.connectionSystem = new ConnectionSystem(this);
  }

  play(): void {
    // this.connectionSystem.getConnectToClosestEdgeCallback();
  }

  togglePause(): void {
    this.running = !this.running;
  }

  save(): void {
    LocalStorageService.getInstance().setData(this);
  }
}

/* V1
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
*/
