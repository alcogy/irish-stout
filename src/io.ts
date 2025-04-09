import { makeId, States, Position } from './utils.js';

export class Connecting {
  io: IO;
  from: Position;
  path: SVGPathElement;

  constructor(io: IO, from: Position) {
    this.io = io;
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

    if (States.container !== null) {
      States.container.appendChild(svg);
    }
  }

  move(x: number, y: number) {
    const end = {
      top: y - States.offset.top  + window.scrollY,
      left: x - States.offset.left + window.scrollX,
    }
    const path = this.#calcWirePath(this.from, end);
    this.path.setAttribute('d', path);
  }

  #calcWirePath(start: Position, end: Position): string {
    const center = {
      left: (end.left + start.left) / 2,
      top: (end.top + start.top) / 2,
    }
    return `M ${start.left} ${start.top} Q ${(center.left + start.left) / 2} ${start.top}, ${center.left} ${center.top} T ${end.left} ${end.top}`;
  }

}
export class IO {
  id: string;
  nodeId: string;
  body: HTMLElement;
  type: 'input' | 'output';
  value: any;
  gate: HTMLButtonElement | null;  
  notice?: (v: any) => any;
  connectTo: IO | null;

  constructor(nodeId: string, body: HTMLElement, value: any, type: 'input' | 'output') {
    this.id = makeId();
    this.nodeId = nodeId;
    this.body = body;
    this.type = type;
    this.value = value;
    this.gate = null;
    this.connectTo = null;
  }

  render(): HTMLDivElement {
    // io wrap
    const io = document.createElement('div');
    io.classList.add('io');
  
    // Gate
    const circle = document.createElement('button');
    circle.classList.add('circle');
    circle.id = this.id;
    circle.dataset.parentId = this.nodeId;
    circle.addEventListener('mousedown', (e: MouseEvent) => this.onMouseDownCircle(e, circle));
    circle.addEventListener('mouseenter', (e: MouseEvent) => this.onMouseEnterCircle(e));
    circle.addEventListener('mouseleave', this.onMouseLeaveCircle);
    this.gate = circle;

    if (this.type === 'input') {
      io.appendChild(circle);
    }

    const wrap = document.createElement('div');
    wrap.classList.add('io-body');
    wrap.appendChild(this.body);
    io.appendChild(wrap);

    if (this.type === 'output') {
      io.appendChild(circle);
    }

    return io;
  }

  update(v: any) {
    this.value = v;
  }

  private onMouseDownCircle(e: MouseEvent, gate: HTMLElement) {
    e.stopPropagation();
    
    const rect = gate.getBoundingClientRect();
    const start = {
      top: rect.top - States.offset.top + window.scrollY + (rect.height / 2),
      left: rect.left - States.offset.left + window.scrollX - (rect.width / 2),
    }
    States.connecting = new Connecting(this, start);
    States.selectedIO.from = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  private onMouseEnterCircle(e: MouseEvent) {
    States.selectedIO.to = this;
  }
  
  private onMouseLeaveCircle(e: MouseEvent) {
    States.selectedIO.to = null
  }

}

export class Input extends IO {
  constructor(nodeId: string, body: HTMLElement, value: any, notice: (v: any) => any) {
    super(nodeId, body, value, 'input');
    this.notice = notice;
  }

  update(v: any) {
    super.update(v);
    this.notice && this.notice(this.value);
  }
}

export class Output extends IO {
  constructor(nodeId: string, body: HTMLElement, value: any) {
    super(nodeId, body, value, 'output');
    this.connectTo = null;
  }

  setConnect(io: IO | null) {
    this.connectTo = io;
  }

  update(v: any) {
    super.update(v);
    if (this.connectTo === null) return;
    this.connectTo.update(this.value);
    for (const edge of States.edges) {
      edge.move();
    }
  }
  
}

