import { makeId, States } from './utils.js';

export class Connecting {
  constructor(from) {
    this.from = from;
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.id = 'drawing-path';
    path.setAttribute('stroke', 'lightgray');
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '2');
    this.path = path;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = 'drawing';
    svg.appendChild(path);

    States.container.appendChild(svg);
  }

  move(x, y) {
    const end = {
      top: y - States.offset.top,
      left: x - States.offset.left,
    }
    const path = this.#calcWirePath(this.from, end);
    this.path.setAttribute('d', path);
  }

  #calcWirePath(start, end) {
    const center = {
      left: (end.left + start.left) / 2,
      top: (end.top + start.top) / 2,
    }
    return `M ${start.left} ${start.top} Q ${(center.left + start.left) / 2} ${start.top}, ${center.left} ${center.top} T ${end.left} ${end.top}`;
  }
}


export class Edge {
  constructor(from, to) {
    this.id = makeId();
    this.from = from;
    this.to = to;
    this.path = null;
  }

  render() {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.id = this.id;
    path.setAttribute('stroke', 'gray');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', this.#calcWirePath());
    this.path = path;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(path);

    return svg;
  }

  move() {
    this.path.setAttribute('d', this.#calcWirePath());
  }

  includeNode(nodeId) {
    return nodeId === this.from.dataset.parentId || nodeId === this.to.dataset.parentId;
  }

  #calcWirePath() {
    const [start, end] = this.#getPoints();
    const center = {
      left: (end.left + start.left) / 2,
      top: (end.top + start.top) / 2,
    }
    return `M ${start.left} ${start.top} Q ${(center.left + start.left) / 2} ${start.top}, ${center.left} ${center.top} T ${end.left} ${end.top}`;
  }

  #getPoints() {
    const fromRect = this.from.getBoundingClientRect();
    const start = {
      top: fromRect.top - States.offset.top + (fromRect.height / 2),
      left: fromRect.left - States.offset.left,
    }
    const endRect = this.to.getBoundingClientRect();
    const end = {
      top: endRect.top - States.offset.top + (endRect.height / 2),
      left: endRect.left - States.offset.left,
    }
    return [start, end];
  }

}

