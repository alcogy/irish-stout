import { States, NodeProps } from "./utils";
import Node from "./node";

export default class PropsPanel {
  props: NodeProps | null = null;
  element: HTMLElement | null = null;
  updateHandler: (props: NodeProps | null) => void;

  constructor(fn: (props: NodeProps | null) => void) {
    this.updateHandler = fn;
  }

  render() {
    return this.makeBase();
  }

  reset() {
    States.editingNode?.element?.classList.remove('editing');
    States.editingNode = null;
    this.element?.querySelector('.params-wrap')?.remove();
    this.element?.querySelector('.button-wrap')?.remove();
  }

  setNode(node: Node) {
    States.editingNode = node;
    node.element?.classList.add('editing');
    this.props = {...node.props};
    return this.makeBase();
  }

  private makeBase() {
    this.element?.remove();

    const panel = document.createElement('div');
    panel.classList.add('props-panel');
    panel.tabIndex = 1;
    
    const title = document.createElement('h3');
    title.classList.add('title');
    title.innerText = 'Properties';
    panel.appendChild(title);

    if (this.props === null) {
      this.element = panel;
      return panel;
    }

    const body = document.createElement('div');
    body.classList.add('params-wrap');

    const list = document.createElement('ul');
    list.classList.add('params-list');

    list.appendChild(this.makeListItemSet('Node name', this.props.label, (v) => { if (this.props) this.props.label = v; }));

    for (const io of this.props.ios) {
      list.appendChild(this.makeListItemSet('Label', io.label, (v) => { if (this.props) io.label = v; }));
      if (io.io.type === 'output') {
        list.appendChild(this.makeListItemSet('Value', io.value, (v) => { if (this.props) io.value = v; }));
      } 
    }

    const buttonWrap = document.createElement('div');
    buttonWrap.classList.add('button-wrap');
    const button = document.createElement('button');
    button.innerText = 'Update';
    button.onclick = () => this.updateHandler(this.props);

    buttonWrap.appendChild(button);

    body.appendChild(list);    
    panel.appendChild(body);
    panel.appendChild(buttonWrap);

    panel.addEventListener('mousedown', (e) => e.stopPropagation());
    
    this.element = panel;
    return panel;
  }
  
  private makeListItemSet(label: string, value: any, update: (v: string) => void) {
    const item = document.createElement('li');
    // Label
    const elLabel = document.createElement('label');
    elLabel.innerText = label;

    // Form for IO label.
    const wrap = document.createElement('div');
    
    // TODO: Auto generate component from props.
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.onchange = (e) => update((e.target as HTMLInputElement).value);
    wrap.appendChild(input);

    item.appendChild(elLabel);
    item.appendChild(wrap);

    return item;
  }

}