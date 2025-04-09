export const styling = `
.irish-stout,
.irish-stout * {
  box-sizing: border-box;
  outline: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/********************
*       base 
*********************/
.irish-stout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #383838;
  position: relative;
  user-select: none;
}

/********************
*       node 
*********************/
.irish-stout div.node {
  background-color: #151515;
  width: 200px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.irish-stout div.node-header {
  padding: 0px 16px;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid #555;
}
.irish-stout h3.node-title {
  margin: 0;
  padding: 0;
  font-weight: normal;
  font-size: 0.8rem;
}
.irish-stout input.node-title-input {
  background-color: transparent;
  border: 0;
  color: #eee;
  width: 100%;
  outline: none;
}
.irish-stout div.node-inputs .item {
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.irish-stout div.node-textbox {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}
.irish-stout div.node-textbox input {
  border: 1px solid #555;
  background-color: #222;
  padding: 4px 8px;
  height: 100%;
  color: #ddd;
  border-radius: 4px;
}
.irish-stout div.node .node-ios .textbox {
  border: 1px solid #555;
  background-color: #222;
  padding: 4px 8px;
  height: 100%;
  color: #ddd;
  border-radius: 4px;
}

/********************
*       IO 
*********************/
.irish-stout div.node-ios {
  padding: 0 2px;
}
.irish-stout div.io {
  display: flex;
  align-items: center;
  padding: 8px 2px;
  gap: 4px;
}
.irish-stout div.io .io-body {
  flex: 1;
  padding: 0 4px;
  word-break: break-all;
}
.irish-stout div.io .io-body .right {
  text-align: right;
}
.irish-stout div.io .io-body input {
  border: 1px solid #555;
  background-color: #222;
  padding: 4px 8px;
  height: 100%;
  width: 100%;
  color: #ddd;
  border-radius: 4px;
}
.irish-stout div.io .io-body input[type=number]::-webkit-inner-spin-button {
  appearance: none; 
}
.irish-stout div.node.selected {
  outline: 2px solid #139a3a;
  z-index: 100 !important;
}
.irish-stout div.node .circle {
  border: 0;
  background-color: var(--accent-color);
  width: 14px;
  height: 14px;
  padding: 0;
  border-radius: 9999px;
}
.irish-stout div.node .circle:hover,
.irish-stout div.node .circle.active {
  background-color: var(--accent-color);
  opacity: 0.8;
}
.irish-stout div.node .circle.connected {
  background-color: var(--main-color);
}


/********************
*       Edge 
*********************/
.irish-stout svg {
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}
`;