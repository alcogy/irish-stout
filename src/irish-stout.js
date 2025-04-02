const States = {
  container: null,
  selectedNode: null,
  holdingNode: null,
  selectedIO: {
    from: null,
    to: null,
  },
  connecting: null,
  offset: {
    left: 0,
    top: 0,
  },
  mouse: {
    x: 0,
    y: 0
  },
}

class IrishStout {
  constructor(container) {
    States.container = document.getElementById(container);
    States.container.classList.add('irish-stout');
    States.offset.top = States.container.getBoundingClientRect()['top'];
    States.offset.left = States.container.getBoundingClientRect()['left'];
    this.nodes = [];
    this.edges = [];
    
    
    window.addEventListener('mousemove', (e) => this.#onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.#onMouseUp(e));
  }

  addNode() {
    const node = new Node(makeId());
    this.nodes.push(node);
    this.mount(node.render());
  }

  removeNode(nodeId) {
    this.nodes = this.nodes.filter((v) => v.id !== nodeId);
  }

  mount(dom) {
    States.container.appendChild(dom);
  }

  #onMouseMove(e) {
    if (States.holdingNode) {
      // Moving node
      const diff = {
        x: e.clientX - States.mouse.x,
        y: e.clientY - States.mouse.y,
      }
      States.holdingNode.move(diff.x, diff.y);
      States.mouse.x = e.clientX;
      States.mouse.y = e.clientY;

      // Moving Edge
      for (const edge of this.edges) {
        if (edge.includeNode(States.holdingNode.id)) edge.move();
      }
      
    } else if (States.connecting) {
      States.connecting.move(e.clientX, e.clientY);
    }
  }

  #onMouseUp() {
    if (States.connecting) {
      if (States.selectedIO.from && States.selectedIO.to) {
        const edge = new Edge(States.selectedIO.from, States.selectedIO.to);
        this.edges.push(edge);
        const svg = edge.render();
        States.container.appendChild(svg);
      }
      document.getElementById('drawing')?.remove();
    }
    
    States.holdingNode = null;
    States.connecting = null;
    States.selectedIO = {
      from: null,
      to: null,
    }
  }
  
}

class Node {
  constructor(id) {
    this.id = id;
    this.label = 'Label';
    this.inputs = ['input1'];
    this.outputs = ['output1'];
    this.left = 30;
    this.top = 30;
    this.zIndex = 1;
    this.element = null;
    this.ios = [];
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
    const node = document.createElement('div');
    node.id = this.id;
    node.style.top = this.top + 'px';
    node.style.left = this.left + 'px';
    node.style.zIndex = this.zIndex;
    node.classList.add('node');
    node.addEventListener('mousedown', (e) => this.#onMouseDown(e));

    // Title
    const title = document.createElement('p');
    title.classList.add('node-title-input');
    title.innerText = this.label;

    // Header
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

    this.element = node;
    return node;
  }

  #makeIO(parentId, str, index, io) {
    // Label
    const label = document.createElement('p');
    label.classList.add('io-label');
    label.innerText = str;
  
    // Circle
    const circle = document.createElement('button');
    circle.classList.add('circle');
    circle.id = makeId();
    circle.dataset.parentId = parentId;
    circle.dataset.io = io;
    circle.dataset.index = index;
    circle.addEventListener('mousedown', (e) => this.#onMouseDownCircle(e, circle));
    circle.addEventListener('mouseenter', this.#onMouseEnterCircle);
    circle.addEventListener('mouseleave', this.#onMouseLeaveCircle);
    this.ios.push(circle);

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

  #onMouseDown(e) {
    States.holdingNode = this;
    States.selectNode = this;
    States.mouse.x = e.clientX;
    States.mouse.y = e.clientY;
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


class Connecting {
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


class Edge {
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

function makeId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  result += '-' + new Date().getTime().toString().substring(6);
  
  if (document.getElementById(result)) {
    return makeIO();
  }

  return result;
}