class Node {
  constructor(id, top, left) {
    this.id = id;
    this.label = 'Label';
    this.top = top;
    this.left = left;
    this.inputs = ['Input1', 'Input2'];
    this.outputs = ['Output1', 'Output2'];
    this.element = this.create();
  }

  set setLabel(label) {
    this.label = label;
    this.update();
  }

  create() {
    // Node
    const node = document.createElement('div');
    node.id = this.id;
    node.style.top = this.top + 'px';
    node.style.left = this.left + 'px';
    node.classList.add('node');
    node.addEventListener('mousedown', (e) => onMouseDown(e, this.id));

    // Header
    // const title = document.createElement('h3');
    // title.classList.add('node-title');
    // title.innerText = this.label;
    const title = document.createElement('input');
    title.classList.add('node-title-input');
    title.value = this.label;

    const nodeHeader = document.createElement('div');
    nodeHeader.classList.add('node-header');
    nodeHeader.appendChild(title);

    // Input   
    const nodeInputs = document.createElement('div');
    nodeInputs.classList.add('node-inputs');
    for (let i = 0; i < this.inputs.length; i++) {
      nodeInputs.appendChild(this.#makeIO(this.id, this.inputs[i], i, 'input'));  
    }
    
    // Output
    const nodeOutputs = document.createElement('div');
    nodeOutputs.classList.add('node-outputs');
    for (let i = 0; i < this.outputs.length; i++) {
      nodeOutputs.appendChild(this.#makeIO(this.id, this.outputs[i], i, 'output'));  
    }

    node.appendChild(nodeHeader);
    node.appendChild(nodeInputs);
    node.appendChild(nodeOutputs);

    return node;
  }

  update() {
    this.element.style.top = this.top + 'px';
    this.element.style.left = this.left + 'px';
  }

  render() {
    const root = document.getElementById('f-root');
    root.appendChild(this.element);
  }

  wirePosition(index, io) {
    const isOutput = io === 'output';

    let height = this.top + nodeHeaderHeight + (nodeIOHeight * (Number(index) + 1)) - (nodeIOHeight / 2);
    if (isOutput) height += nodeIOHeight * this.inputs.length;
    
    return {
      x: isOutput ? this.left + this.element.offsetWidth : this.left,
      y: height,
    };
  }

  #makeIO(id, str, index, io) {
    // Label
    const label = document.createElement('span');
    label.classList.add('label');
    label.innerText = str;
  
    // Circle
    const circle = document.createElement('button');
    circle.classList.add('circle');
    circle.dataset.io = io;
    circle.dataset.index = index;
    circle.addEventListener('mousedown', (e) => onMouseDownCircle(e, id, index, io));
    circle.addEventListener('mouseenter', onMouseEnterCircle);
    circle.addEventListener('mouseleave', onMouseLeaveCircle);
    
    // Input
    const input = document.createElement('div');
    if (io === 'input') {
      input.classList.add('item');
      input.appendChild(circle);
      input.appendChild(label);
    } else {
      input.classList.add('node-output');
      input.appendChild(label);
      input.appendChild(circle);      
    }
  
    return input;
  }
  
}


function onMouseDownCircle(e, id, index, io) {
  e.stopPropagation();
  const wire = wires.find((v) => hasWire(v, id, io, index));
  console.log(wire, id, index, io);
  if (wire) {
    document.getElementById(wire.id)?.remove();
    wires = wires.filter((v) => !hasWire(v, id, io, index));
  }
  
  selectedIO = {
    id: id,
    index: index,
    io: io,
  }
  
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.id = 'drawing-path';
  path.setAttribute('stroke', 'lightgray');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-dasharray', '2');
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = 'drawing';
  svg.appendChild(path);
  document.getElementById('f-root').appendChild(svg);

  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function hasWire(v, id, io, index) {
  if (v.from.node.id === id
  && v.from.io == io
  && v.from.index == index) {
    return true;
  }
  
  if (v.to.node.id === id
  && v.to.io == io
  && v.to.index == index) {
    return true;
  }

  return false;
}

function onMouseEnterCircle(e) {
  if (!selectedIO) return;
  const nodeDom = e.target.parentElement.parentElement.parentElement;
  const node = nodes.find((v) => v.id === nodeDom.id);
  const selectNode = nodes.find((v) => v.id === selectedIO.id);
  if (!node || !selectNode) return;

  // TODO more validation.
  if (selectedIO.io !== e.target.dataset.io && nodeDom.id !== selectedIO.id) {
    connecting = {
      from: {
        node: selectNode,
        io: selectedIO.io,
        index: selectedIO.index,
      },
      to: {
        node: node,
        io: e.target.dataset.io,
        index: e.target.dataset.index,
      },
    }
  }
}

function onMouseLeaveCircle(e) {
  if (!selectedIO) return;
  connecting = null;
}

const nodeHeaderHeight = 40;
const nodeIOHeight = 36; 

const mouse = {
  x: 0,
  y: 0,
};

let selectedNode = '';
let selectedIO = null;
let index = 1;
let connecting = null;
let wires = [];

const headerHeight = 104;

const nodes = [];
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

const addButton = document.getElementById('add-node');
addButton.addEventListener('click', onClickAddNode);

function onClickAddNode() {
  const node = new Node('node-'+ index, 10, 20);
  nodes.push(node);
  node.render();
  index += 1;
}

function onMouseDown(e, id) {
  selectedNode = id;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onMouseMove(e) {
  
  if (selectedNode) {
    // Moving node
    const diff = {
      x: e.clientX - mouse.x,
      y: e.clientY - mouse.y,
    }
    const node = nodes.find((v) => v.id === selectedNode);
    node.left += diff.x;
    node.top += diff.y;
    node.update();

    // Moving wire
    const targets = wires.filter((v) => v.from.node.id === selectedNode || v.to.node.id === selectedNode);
    for (const target of targets) {
      const start = target.from.node.wirePosition(target.from.index, target.from.io);
      const end = target.to.node.wirePosition(target.to.index, target.to.io);
      target.path.setAttribute('d', calcWirePath(start, end));
    }

    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
  } else if (selectedIO !== null) {
    const node = nodes.find((v) => v.id === selectedIO.id);
    const start = node.wirePosition(selectedIO.index, selectedIO.io);
    // Wirering.
    const wire = document.getElementById('drawing-path');
    if (!wire) return;
    const end = {
      x: e.clientX,
      y: e.clientY - headerHeight,
    }
    wire.setAttribute('d', calcWirePath(start, end));
  }
}

function onMouseUp() {
  if (connecting) {
    drawWire(connecting);
  }
  // Reset
  selectedNode = '';
  selectedIO = null;
  connecting = null;
  document.getElementById('drawing')?.remove();
}

function drawWire(connecting) {
  const start = connecting.from.node.wirePosition(connecting.from.index, connecting.from.io);
  const end = connecting.to.node.wirePosition(connecting.to.index, connecting.to.io);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const id = makeId();
  path.id = id;
  path.setAttribute('stroke', 'gray');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('d', calcWirePath(start, end));
    
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.appendChild(path);
  document.getElementById('f-root').appendChild(svg);

  const wireset = { ...connecting };
  wireset.path = path;
  wireset.id = id;
  wires.push(wireset);
}

function calcWirePath(start, end) {
  const center = {
    x: (end.x + start.x) / 2,
    y: (end.y + start.y) / 2,
  }
  return `M ${start.x} ${start.y + 3} Q ${(center.x + start.x) / 2 + 20} ${start.y}, ${center.x} ${center.y} T${end.x} ${end.y}`;
}

function makeId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  result += '-'
  const characters2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 8; i++) {
    result += characters2.charAt(Math.floor(Math.random() * characters.length));
  }
  
  if (wires.includes(result)) return makeId();

  return result;
}