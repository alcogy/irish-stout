import Node from "./node";
import Edge from "./edge";
import { IO, Connecting } from "./io";

export interface Position {
  left: number;
  top: number;
}

export interface Point {
  x: number;
  y: number;
}

interface GlobalModel {
  container: HTMLElement | null;
  selectedNode: Node | null;
  holdingNode: Node | null;
  isHoldingContainer: boolean;
  selectedIO: {
    from: IO | null,
    to: IO | null,
  };
  connecting: Connecting | null;
  offset: Position,
  mouse: Point,
  nodes: Node[],
  edges: Edge[],
}

/**
 * State management in global.
 */
export const States: GlobalModel = {
  container: null,
  selectedNode: null,
  holdingNode: null,
  isHoldingContainer: false,
  selectedIO: {
    from: null,
    to: null,
  },
  connecting: null,
  offset: {
    left: 0,
    top: 0,
  },
  mouse: {
    x: 0,
    y: 0
  },
  nodes: [],
  edges: [],
}

/**
 * Make ID string with random and unique strings.
 * @returns ID string.
 */
export function makeId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  result += '-' + new Date().getTime().toString().substring(6);
  
  if (document.getElementById(result)) {
    return makeId();
  }

  return result;
}
