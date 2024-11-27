import { v, suretype } from 'suretype';
import { stockIds, parameterIds } from '../circular-economy-model';

const POSITIONAL_ASSET_REGEX = /_x[+-]?[0-9]+_y[+-]?[0-9]+\.[a-zA-Z0-9]+$/g;
const AssetUrlSchema = v.string().matches(POSITIONAL_ASSET_REGEX);
const AssetUrlObjectSchema = suretype(
  { name: 'AssetUrlObjectConfig', title: 'Asset URL object' },
  v.object({ url: AssetUrlSchema.required() }).additional(false),
);

const I18nSchema = suretype(
  { name: 'I18nConfig', title: 'Internationalized text' },
  v.object({}).additional(v.string()),
);

const ParameterTransformSchema = suretype(
  { name: 'ParameterTransformConfig', title: 'Parameter transformation' },
  v
    .object({ id: v.string().required(), script: v.string().required() })
    .additional(false)
    .required(),
);

const ParameterTransformsSchema = v.array(ParameterTransformSchema);

const InitialParametersSchema = suretype(
  { name: 'InitialParametersConfig', title: 'Initial parameter values' },
  v
    .object(
      Object.fromEntries(parameterIds.map((p) => [p, v.number().required()])),
    )
    .additional(false),
);

const InitialStocksSchema = suretype(
  { name: 'InitialStocksConfig', title: 'Initial stock values' },
  v
    .object(Object.fromEntries(stockIds.map((p) => [p, v.number().required()])))
    .additional(false),
);

const MarkerSlotSchema = suretype(
  { name: 'MarkerSlotConfig', title: 'Marker slot' },
  v
    .object({
      id: v.string().required(),
      x: v.number().required(),
      y: v.number().required(),
      angle: v.number().required(),
    })
    .additional(false),
);

const CardSlotSchema = suretype(
  { name: 'CardSlotConfig', title: 'Card slot' },
  v
    .object({
      id: v.string().required(),
      x: v.number().required(),
      y: v.number().required(),
      angle: v.number().required(),
    })
    .additional(false),
);

const CardSchema = suretype(
  { name: 'CardConfig', title: 'Card' },
  v
    .object({
      parameterTransformId: v.string().required(),
      url: v.string().required(),
    })
    .additional(false),
);

const SlotGroupIdSchema = v.string().matches(/^((?!internal).)*$/g);

const SlotGroupAssetSchema = suretype(
  { name: 'SlotGroupAssetConfig', title: 'Slot group assets' },
  v
    .object({
      markerSlotActive: AssetUrlObjectSchema.required(),
      markerSlotInactive: AssetUrlObjectSchema.required(),
    })
    .additional(false),
);

const BasicSlotGroupSchema = suretype(
  { name: 'BasicSlotGroupConfig', title: 'Basic slot group' },
  v
    .object({
      id: SlotGroupIdSchema.required(),
      type: v.string().enum('basic').required(),
      label: I18nSchema.required(),
      assets: SlotGroupAssetSchema.required(),
      markerSlots: v.array(MarkerSlotSchema).required(),
      parameterTransformIds: v.array(v.string()).required(),
    })
    .additional(false),
);

const ActionCardSlotGroupSlotSchema = suretype(
  {
    name: 'ActionCardSlotGroupSlotConfig',
    title: 'Action card slot group slot',
  },
  v
    .object({
      markerSlot: MarkerSlotSchema.required(),
      cardSlot: CardSlotSchema.required(),
    })
    .additional(false),
);

const ActionCardSlotGroupSchema = suretype(
  { name: 'ActionCardSlotGroupConfig', title: 'Action card slot group' },
  v
    .object({
      id: SlotGroupIdSchema.required(),
      type: v.string().enum('action-card').required(),
      label: I18nSchema.required(),
      assets: SlotGroupAssetSchema.required(),
      slots: v.array(ActionCardSlotGroupSlotSchema).required(),
      cards: v.array(CardSchema).required(),
    })
    .additional(false),
);

const EventCardSlotGroupSchema = suretype(
  { name: 'EventCardSlotGroupConfig', title: 'Event card slot group' },
  v
    .object({
      id: SlotGroupIdSchema.required(),
      type: v.string().enum('event-card').required(),
      label: I18nSchema.required(),
      assets: SlotGroupAssetSchema.required(),
      markerSlot: MarkerSlotSchema.required(),
      cardSlots: v.array(CardSlotSchema).required(),
      cards: v.array(CardSchema).required(),
    })
    .additional(false),
);

const SlotGroupSchema = suretype(
  { name: 'SlotGroupConfig', title: 'Slot group' },
  v.anyOf([
    BasicSlotGroupSchema,
    ActionCardSlotGroupSchema,
    EventCardSlotGroupSchema,
  ]),
);

const ModelVisualizationLayerSchema = suretype(
  { name: 'ModelVisualizationLayerConfig', title: 'Model visualization layer' },
  v.string().enum('modelVisualization'),
);

const ConditionalLayerSchema = suretype(
  {
    name: 'ConditionalLayerConfig',
    title: 'Conditionally shown illustration layer',
  },
  v
    .object({
      url: AssetUrlSchema.required(),
      condition: v.string().required(),
      reset: v.boolean().default(false), // FIXME: Apply the default during config parsing
    })
    .additional(false)
    .required(),
);

const LayerSchema = suretype(
  { name: 'LayerConfig', title: 'Illustration or visualization layer' },
  v.anyOf([ModelVisualizationLayerSchema, ConditionalLayerSchema]),
);

const LayersSchema = suretype(
  { name: 'LayersConfig', title: 'Layers of illustrations and visualizations' },
  v.array(LayerSchema),
);

const ScoreLabelsSchema = suretype(
  { name: 'ScoreLabelsConfig', title: 'Score labels' },
  v
    .object({
      circularity: I18nSchema.required(),
      coverage: I18nSchema.required(),
    })
    .additional(false),
);

const AutoResetSchema = suretype(
  { name: 'AutoResetConfig', title: 'Auto reset' },
  v
    .object({
      timeoutSeconds: v.number().gte(0).required(),
      condition: v.string().required(),
      title: I18nSchema.required(),
      description: I18nSchema.required(),
    })
    .additional(false),
);

const GeneralSchema = suretype(
  { name: 'GeneralConfig', title: 'General configuration' },
  v
    .object({
      assetBaseDir: v.string().required(),
      primaryLanguage: v.string().required(),
      secondaryLanguage: v.string().required(),
      description: I18nSchema.required(),
      scoreLabels: ScoreLabelsSchema.required(),
      autoReset: AutoResetSchema.required(),
    })
    .additional(false),
);

const InteractionSchema = suretype(
  { name: 'InteractionConfig', title: 'Interactive elements' },
  v
    .object({
      actionCardDelayMs: v.number().gte(0).required(),
      eventCardMinDelayMs: v.number().gte(0).required(),
      eventCardMaxDelayMs: v.number().gte(0).required(),
      eventCardMinDurationMs: v.number().gte(0).required(),
      eventCardMaxDurationMs: v.number().gte(0).required(),
      slotGroups: v.array(SlotGroupSchema).required(),
    })
    .additional(false),
);

const ModelConfigSchema = suretype(
  { name: 'ModelConfig', title: 'Model configuration' },
  v
    .object({
      initialParameters: InitialParametersSchema.required(),
      initialStocks: InitialStocksSchema.required(),
    })
    .additional(false),
);

const SimulationConfigSchema = suretype(
  { name: 'SimulationConfig', title: 'Simulation configuration' },
  v
    .object({
      deltaPerSecond: v.number().required(),
      maxStepSize: v.number().required(),
    })
    .additional(false),
);

const CONFIG_SCHEMA_NAME = 'Config';

const ConfigSchema = suretype(
  { name: CONFIG_SCHEMA_NAME, title: 'Schema of the app configuration' },
  v
    .object({
      general: GeneralSchema.required(),
      model: ModelConfigSchema.required(),
      simulation: SimulationConfigSchema.required(),
      parameterTransforms: ParameterTransformsSchema.required(),
      interaction: InteractionSchema.required(),
      layers: LayersSchema.required(),
    })
    .additional(false)
    .required(),
);

export { ConfigSchema as SuretypeConfigSchema, CONFIG_SCHEMA_NAME };
