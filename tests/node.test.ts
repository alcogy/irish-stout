import { Input, Output } from "../src";

import Node from "../src/node";

test('constructor', () => {
  const node = new Node();
  expect(node.id).not.toBe('');
  expect(node.left).toBe(30);
  expect(node.top).toBe(30);
});

test('update', () => {
  const node = new Node();
  node.render();
  node.update({
    label: 'test label',
    ios: [
      { io: new Input('123456', ()=>console.log('test')), value: 'aaa', label: 'inputlabel' },
      { io: new Output('222333'), value: '123456', label: 'outputlabel' },
    ],
  })
  const title = node.element?.querySelector('.node-title') as HTMLElement;
  expect(title.innerText).toBe('test label');
  
  expect(node.props.ios[0].io.id).not.toBe('');
  expect(node.props.ios[0].io.nodeId).toBe('123456');
  expect(node.props.ios[0].label).toBe('inputlabel');
  expect(node.props.ios[0].value).toBe('aaa');

  expect(node.props.ios[1].io.id).not.toBe('');
  expect(node.props.ios[1].io.nodeId).toBe('222333');
  expect(node.props.ios[1].label).toBe('outputlabel');
  expect(node.props.ios[1].value).toBe('123456');
});

test('move', () => {
  const node = new Node();
  node.render();

  // Positive
  {
    const prevLeft = node.left;
    const prevTop = node.top;
    node.move(10, 14);
    expect(node.left).toBe(prevLeft + 10);
    expect(node.top).toBe(prevTop + 14);
  }

  // Negative
  {
    const prevLeft = node.left;
    const prevTop = node.top;
    node.move(-14, -3);
    expect(node.left).toBe(prevLeft - 14);
    expect(node.top).toBe(prevTop - 3);
  }
});

test('remove', () => {
  const node = new Node();
  node.render();
  node.remove();

  expect(node.element).toBeNull();
});

test('render', () => {
  const node = new Node();
  const result = node.render();

  expect(result).not.toBeNull();
});