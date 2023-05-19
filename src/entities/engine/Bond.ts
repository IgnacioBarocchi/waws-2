import { MouseEvent as ReactMouseEvent } from "react";
import {
  BezierPathOptions,
  Edge,
  EdgeMouseHandler,
  EdgeUpdatable,
  HandleType,
  OnEdgeUpdateFunc,
  Position,
  SmoothStepPathOptions,
} from "reactflow";
import ObjectManager from "../../services/ObjectManager";

// @ts-ignore
export default class Bond implements Edge {
  public id: string;
  public target: string;
  public source: string;
  public label: string;

  public onClick?: EdgeMouseHandler;
  public onEdgeDoubleClick?: EdgeMouseHandler;
  public sourceHandleId?: string | null;
  public targetHandleId?: string | null;
  public sourceX: number;
  public sourceY: number;
  public targetX: number;
  public targetY: number;
  public sourcePosition: Position;
  public targetPosition: Position;
  public elementsSelectable?: boolean;
  public onEdgeUpdate?: OnEdgeUpdateFunc;
  public onContextMenu?: EdgeMouseHandler;
  public onMouseEnter?: EdgeMouseHandler;
  public onMouseMove?: EdgeMouseHandler;
  public onMouseLeave?: EdgeMouseHandler;
  public edgeUpdaterRadius?: number;
  public onEdgeUpdateStart?: (
    event: ReactMouseEvent,
    edge: Edge,
    handleType: HandleType
  ) => void;
  public onEdgeUpdateEnd?: (
    event: MouseEvent | TouchEvent,
    edge: Edge,
    handleType: HandleType
  ) => void;
  public rfId?: string;
  public isFocusable: boolean;
  public isUpdatable: EdgeUpdatable;
  public pathOptions?: BezierPathOptions | SmoothStepPathOptions;
  public active: boolean;
  private objectManager: ObjectManager;
  public type: string;

  constructor(source: string, target: string, objectManager: ObjectManager) {
    this.objectManager = objectManager;
    // identity
    this.source = source;
    this.target = target;
    this.sourceHandleId = source;
    this.targetHandleId = target;
    this.label = "pending";
    this.id = `bond-${target}__${source}`;

    // functional
    this.sourceX = 1; //find by id
    this.sourceY = 1; //find by id
    this.targetX = 1; //find by id
    this.targetY = 1; //find by id
    this.sourcePosition = Position.Left;
    this.targetPosition = Position.Left;
    // todo: cases
    this.isFocusable = true;
    this.isUpdatable = true;
    this.active = true;
    this.type = "Bond";
  }

  public getEdge(): Edge {
    if (!this.id || !this.source || !this.target) {
      throw new Error("Required properties are missing.");
    }

    return {
      id: this.id,
      target: this.target,
      source: this.source,
      label: this.label,
    };
  }

  deleteSelf(): void {
    this.active = false;
    this.isFocusable = false;
    this.isUpdatable = false;
    this.rfId = undefined;
    this.objectManager.bonds = [
      ...this.objectManager.bonds.filter((bond) => bond.id !== this.id),
    ];
  }
}
