import { makeId, States } from './utils.js';
import { Output } from './io.js';
export default class Node {
  constructor() {
    this.id = makeId();
    this.left = 30;
    this.top = 30;
    this.element = null;
    this.ios = [];
    // ...add your props.
    this.output = null;
  }

  // abstruct for render body(io).
  makeIOs() {
    const body = document.createElement('div');
    body.value = 'Hello Guinness!';
    const io = new Output(this.id, 'output', body, 'Hello Guinness!');

    // return must array for up to down.
    return [io];
  }

  // abstruct for execute function.
  action() {
    // Do something.
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
    
    this.ios = this.makeIOs();
    for (const io of this.ios) {
      nodeIOs.appendChild(io.render());
    }
    node.appendChild(nodeIOs);

    this.element = node;
    return node;
  }

  #makeNodeBase() {
    // node base.
    const node = document.createElement('div');
    node.id = this.id;
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

