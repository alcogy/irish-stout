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
  background-color: #3a3a3a;
  position: relative;
  user-select: none;
}

/********************
*       node 
*********************/
.irish-stout div.node {
  background-color: #101010;
  width: 200px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
.irish-stout div.node-header {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  border-radius: 6px 6px 0 0;
  background-color: #505050;
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
  padding: 5px 2px;
  gap: 4px;
}
.irish-stout div.io p.io-label {
  flex: 1;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.irish-stout div.io p.io-label.right {
  text-align: right;
}
.irish-stout div.node.editing {
  outline: 2px solid #777;
}
.irish-stout div.node.selected {
  outline: 2px solid #139a3a !important;
  z-index: 100 !important;
}
.irish-stout div.node .circle {
  border: 0;
  background-color: var(--accent-color);
  width: 12px;
  height: 12px;
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


/********************
*       Panel 
*********************/
.irish-stout div.props-panel {
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: #000;
  width: 280px;
  max-height: 100%;
  padding: 16px 24px;
  border-radius: 6px;
  z-index: 9999;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
}
.irish-stout div.props-panel h3.title {
  margin: 0;
}
.irish-stout div.props-panel div.params-wrap {
  margin: 16px 0 24px 0;
}
.irish-stout div.props-panel ul.params-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.irish-stout div.props-panel ul.params-list label {
  color: #d0d0d0;
}
.irish-stout div.props-panel ul.params-list div {
  margin-top: 4px;
}
.irish-stout div.props-panel ul.params-list input {
  width: 100%;
  background-color: #383838;
  border: 0;
  padding: 8px;
  color: #eee;
  border-radius: 6px;
}
.irish-stout div.props-panel div.button-wrap button {
  border: 0;
  background-color: #444;
  color: #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.irish-stout div.props-panel div.button-wrap button:hover {
  opacity: 0.8;
}
`;