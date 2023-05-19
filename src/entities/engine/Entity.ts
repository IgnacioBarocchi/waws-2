import { CSSProperties } from "react";
import { CoordinateExtent, Node, Position, XYPosition } from "reactflow";

export default abstract class Entity implements Node {
  public id: string;
  public position: XYPosition;
  public data: any;
  public type?: string;
  public style?: CSSProperties;
  public className?: string;
  public sourcePosition?: Position;
  public targetPosition?: Position;
  public hidden?: boolean;
  public selected?: boolean;
  public dragging?: boolean;
  public draggable?: boolean;
  public selectable?: boolean;
  public connectable?: boolean;
  public deletable?: boolean;
  public dragHandle?: string;
  public width?: number | null;
  public height?: number | null;
  public parentNode?: string;
  public zIndex?: number;
  public extent?: "parent" | CoordinateExtent;
  public expandParent?: boolean;
  public positionAbsolute?: XYPosition;
  public ariaLabel?: string;
  public focusable?: boolean;
  public resizing?: boolean;
  public active: boolean;

  constructor(id: string, position: XYPosition) {
    this.id = id;
    this.position = position;
    this.active = true;
    this.data = {
      label: "",
    };
  }
}

/*
[internalsSymbol]?: {
  z?: number;
  handleBounds?: NodeHandleBounds;
  isParent?: boolean;
};
*/
