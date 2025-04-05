import { makeId, States } from './utils.js';
import IO from './io.js';
export default class Node {
  constructor(fn) {
    this.id = makeId();
    this.left = 30;
    this.top = 30;
    this.zIndex = 1;
    this.element = null;
    this.ios = [];
    this.fn = fn;
  }

  setLabel(v) {
    this.label = v;
  }

  move(difX, difY) {
    this.left += difX;
    this.top += difY;
    this.element.style.left = this.left + 'px';
    this.element.style.top = this.top + 'px';
  }

  render() {
    // Node wrap
    const node = this.#makeNodeBase();
    const nodeIOs = this.#makeNodeIOConainer();
    
    const ios = this.makeIOs();
    for (const io of ios) {
      this.ios.push(io.gate);
      nodeIOs.appendChild(io.render());
    }
    node.appendChild(nodeIOs);

    this.element = node;
    return node;
  }

  makeIOs() {
    const body = document.createElement('div');
    
    body.innerText = 'Hello Guinness!';
    const io = new IO(this.id, 'output', body, 'Hello Guinness!');
    return [io];
  }

  #makeNodeBase() {
    // node base.
    const node = document.createElement('div');
    node.id = this.id;
    node.style.top = this.top + 'px';
    node.style.left = this.left + 'px';
    node.style.zIndex = this.zIndex;
    node.classList.add('node');
    node.addEventListener('mousedown', (e) => this.onMouseDown(e));

    // Title
    const title = document.createElement('h3');
    title.classList.add('node-title');
    title.innerText = this.label;

    // Header
    const header = document.createElement('div');
    header.classList.add('node-header');
    
    // Append elements.
    header.appendChild(title);
    node.appendChild(header);

    return node;
  }

  #makeNodeIOConainer() {
    const nodeIOs = document.createElement('div');
    nodeIOs.classList.add('node-ios');
    return nodeIOs;
  }

  action(v) {
    return fn(v);
  }

  onMouseDown(e) {
    States.holdingNode = this;
    States.selectedNode = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
    const selected = document.querySelectorAll('div.node.selected');
    for (const sel of selected) {
      sel.classList.remove('selected');
    }
    this.element.classList.add('selected');
  }
  
  remove() {
    this.element.remove();
  }

}

