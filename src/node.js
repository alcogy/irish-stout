import { makeId, States } from './utils.js';
import { Output } from './io.js';
export default class Node {
  constructor() {
    this.id = makeId();
    this.left = 30;
    this.top = 30;
    this.element = null;
    this.props = {
      label: 'node',
    };
    // ...add your props.
    this.output = null;
  }

  // abstruct for render body(io).
  makeIOs() {
    const body = document.createElement('div');
    body.value = 'Hello Guinness!';
    const io = new Output(this.id, body, 'output');

    // return must array for up to down.
    return [io];
  }

  // abstruct for update node params.
  update(props) {
    this.props = {...props};
    const title = this.element.getElementsByClassName('node-title')[0];
    title.innerText = this.props.label;
  }

  move(difX, difY) {
    this.left += difX;
    this.top += difY;
    this.element.style.left = this.left + 'px';
    this.element.style.top = this.top + 'px';
  }

  remove() {
    this.element.remove();
  }
  
  render() {
    // Node wrap
    const node = this.#makeNodeBase();
    const nodeIOs = this.#makeNodeIOConainer();
    
    const ios = this.makeIOs();
    for (const io of ios) {
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
    node.tabIndex = 1;
    node.addEventListener('mousedown', (e) => this.#onMouseDown(e));
    node.addEventListener('focus', (e) => this.#onFocus(e));
    node.addEventListener('blur', (e) => this.#onBlur(e));

    // Title
    const title = document.createElement('h3');
    title.classList.add('node-title');
    title.innerText = this.props.label;

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

  #onMouseDown(e) {
    e.stopPropagation();
    States.holdingNode = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
  }

  #onFocus(e) {
    States.selectedNode = this;
    const selected = document.querySelectorAll('div.node.selected');
    for (const sel of selected) {
      sel.classList.remove('selected');
    }
    this.element.classList.add('selected');
  }

  #onBlur(e) {
    States.selectedNode = null;
    this.element.classList.remove('selected');
  }
}
