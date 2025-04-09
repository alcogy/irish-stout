import { makeId, Position, States } from './utils.js';
import { IO } from './io.js';

export default class Edge {
  id: string;
  from: IO;
  to: IO;
  path: SVGPathElement | null;
  element: SVGElement | null;

  constructor(from: IO, to: IO) {
    this.id = makeId();
    this.from = from;
    this.to = to;
    this.path = null;
    this.element = null;
  }

  render() {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.id = this.id;
    path.setAttribute('stroke', 'gray');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', this.calcWirePath());
    this.path = path;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(path);
    this.element = svg;

    return svg;
  }

  move() {
    if (this.path === null) return;
    this.path.setAttribute('d', this.calcWirePath());
  }

  remove() {
    if (this.element === null) return;
    this.element.remove();
  }

  includeNode(nodeId: string): boolean {
    return nodeId === this.from.nodeId || nodeId === this.to.nodeId;
  }

  private calcWirePath(): string {
    const [start, end] = this.getPoints();
    const center = {
      left: (end.left + start.left) / 2,
      top: (end.top + start.top) / 2,
    }
    return `M ${start.left} ${start.top} Q ${(center.left + start.left) / 2} ${start.top}, ${center.left} ${center.top} T ${end.left} ${end.top}`;
  }

  private getPoints(): [Position, Position] {
    if (this.from.gate === null || this.to.gate === null) {
      return [{left: 0, top: 0}, {left: 0, top: 0}];
    }
    
    const fromRect = this.from.gate.getBoundingClientRect();
    const start = {
      top: fromRect.top - States.offset.top + window.scrollY + (fromRect.height / 2),
      left: fromRect.left - States.offset.left + window.scrollX,
    }
    const endRect = this.to.gate.getBoundingClientRect();
    const end = {
      top: endRect.top - States.offset.top + window.scrollY + (endRect.height / 2),
      left: endRect.left - States.offset.left + window.scrollX,
    }
    return [start, end];
  }

}

