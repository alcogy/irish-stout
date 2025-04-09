import { makeId, States } from './utils.js';
import { Output } from './io.js';
export default class Node {
  id: string;
  left: number;
  top: number;
  element: HTMLElement | null;
  props: any;

  constructor() {
    this.id = makeId();
    this.left = 30;
    this.top = 30;
    this.element = null;

    // ...add your props.
    this.props = {
      label: 'node',
    };
  }

  // abstruct for render body(io).
  makeIOs(): any[] {
    const body = document.createElement('div');
    body.innerText = 'Hello Guinness!';
    const io = new Output(this.id, body, 'output');

    // return must array for up to down.
    return [io];
  }

  // abstruct for update node params.
  update(props: any) {
    this.props = {...props};
    const title = this.element?.getElementsByClassName('node-title')[0] as HTMLElement;
    if (title !== null) {
      title.innerText = this.props.label;
    }
  }

  move(difX: number, difY: number) {
    this.left += difX;
    this.top += difY;
    if (this.element === null) return;
    this.element.style.left = this.left + 'px';
    this.element.style.top = this.top + 'px';
  }

  remove() {
    if (this.element === null) return;
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
    node.addEventListener('mousedown', (e: MouseEvent) => this.#onMouseDown(e));

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

  #onMouseDown(e: MouseEvent) {
    e.stopPropagation();
    States.holdingNode = this;
    States.selectedNode = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
    const selected = document.querySelectorAll('div.node.selected');
    for (const sel of selected) {
      sel.classList.remove('selected');
    }
    if (this.element === null) return;
    this.element.classList.add('selected');
  }

}
