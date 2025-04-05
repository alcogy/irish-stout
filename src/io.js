import { makeId, States } from './utils.js';
import { Connecting } from './edge.js';

export default class IO {
  
  constructor(nodeId, type, body, fn) {
    this.id = makeId();
    this.nodeId = nodeId;
    this.type = type;
    this.body = body;
    this.gate = null;
    this.fn = fn;
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
    circle.addEventListener('mouseenter', this.#onMouseEnterCircle);
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

    return io
  }

  update(v) {
    this.fn && this.fn(v);
  }

  #onMouseDownCircle(e, circle) {
    e.stopPropagation();
    
    const rect = circle.getBoundingClientRect();
    const start = {
      top: rect.top - States.offset.top + (rect.height / 2),
      left: rect.left - States.offset.left - (rect.width / 2),
    }
    States.connecting = new Connecting(start);
    States.selectedIO.from = circle;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  #onMouseEnterCircle(e) {
    States.selectedIO.to = e.target;  
  }
  
  #onMouseLeaveCircle(e) {
    States.selectedIO.to = null
  }

}