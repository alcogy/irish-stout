import { makeId, States } from './utils.js';
import { Connecting } from './edge.js';

class IO {
  
  constructor(nodeId, body, value, type) {
    this.id = makeId();
    this.nodeId = nodeId;
    this.body = body;
    this.type = type;
    this.value = value;
    this.gate = null;
  }

  render() {
    // io wrap
    const io = document.createElement('div');
    io.classList.add('io');
  
    // Gate
    const circle = document.createElement('button');
    circle.classList.add('circle');
    circle.id = this.id;
    circle.dataset.parentId = this.nodeId;
    circle.addEventListener('mousedown', (e) => this.#onMouseDownCircle(e, circle));
    circle.addEventListener('mouseenter', (e) => this.#onMouseEnterCircle(e));
    circle.addEventListener('mouseleave', this.#onMouseLeaveCircle);
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

  update(v) {
    this.value = v;
  }

  #onMouseDownCircle(e, circle) {
    e.stopPropagation();
    
    const rect = circle.getBoundingClientRect();
    const start = {
      top: rect.top - States.offset.top + (rect.height / 2),
      left: rect.left - States.offset.left - (rect.width / 2),
    }
    States.connecting = new Connecting(this, start);
    States.selectedIO.from = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  #onMouseEnterCircle(e) {
    States.selectedIO.to = this;
  }
  
  #onMouseLeaveCircle(e) {
    States.selectedIO.to = null
  }

}

export class Input extends IO {
  constructor(nodeId, body, value, notice) {
    super(nodeId, body, value, 'input');
    this.notice = notice;
  }

  update(v) {
    super.update(v);
    this.notice && this.notice(this.value);
  }
}

export class Output extends IO {
  constructor(nodeId, body, value, notice) {
    super(nodeId, body, value, 'output');
    this.connectTo = null;
    this.notice = notice;
  }

  setConnect(io) {
    this.connectTo = io;
  }

  update(v) {
    super.update(v);
    if (this.connectTo === null) return;
    this.connectTo.update(this.value);
    for (const edge of States.edges) {
      edge.move();
    }
  }
  
}

