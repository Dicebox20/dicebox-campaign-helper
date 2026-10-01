export function findRegionControlGroup(controls) {
  return Array.isArray(controls)
    ? controls.find(entry => ["region", "regions"].includes(entry?.name))
    : controls?.regions ?? controls?.region;
}

export function addRegionControlTool(regionControls, tool) {
  const tools = regionControls?.tools;
  if (!tools || typeof tool?.name !== "string") return false;
  const exists = Array.isArray(tools)
    ? tools.some(entry => entry?.name === tool.name)
    : Boolean(tools[tool.name]);
  if (exists) return false;
  const orderedTool = { ...tool, order: Array.isArray(tools) ? tools.length : Object.keys(tools).length };
  if (Array.isArray(tools)) tools.push(orderedTool);
  else tools[tool.name] = orderedTool;
  return true;
}

export function registerRegionControlTools(controls, tools) {
  const regionControls = findRegionControlGroup(controls);
  if (!regionControls?.tools || !Array.isArray(tools)) return false;
  tools.forEach(tool => addRegionControlTool(regionControls, tool));
  return true;
}
