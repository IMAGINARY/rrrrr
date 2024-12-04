const POSITIONAL_ASSET_REGEX = /_x[+-]?[0-9]+_y[+-]?[0-9]+\.[a-zA-Z0-9]+$/g;

const BUILTIN_LAYER_NAMES = {
  modelVisualization: 'modelVisualization',
  scores: 'scores',
  slots: 'slots',
} as const;

export { POSITIONAL_ASSET_REGEX, BUILTIN_LAYER_NAMES };
