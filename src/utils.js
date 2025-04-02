export const States = {
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

export function makeId() {
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