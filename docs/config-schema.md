# Objects

- [`Asset URL object`](#reference-asseturlobjectconfig)
- [`Card`](#reference-cardconfig)
- [`Card slot`](#reference-cardslotconfig)
- [`General configuration`](#reference-generalconfig)
  - [`Auto reset`](#reference-autoresetconfig)
  - [`Score labels`](#reference-scorelabelsconfig)
- [`Interactive elements`](#reference-interactionconfig)
  - [`Slot group`](#reference-slotgroupconfig)
    - [`Action card slot group`](#reference-actioncardslotgroupconfig)
      - [`slot`](#reference-actioncardslotgroupslotconfig)
    - [`Basic slot group`](#reference-basicslotgroupconfig)
    - [`Event card slot group`](#reference-eventcardslotgroupconfig)
- [`Internationalized text`](#reference-i18nconfig)
- [`Layers of illustrations and visualizations`](#reference-layersconfig)
  - [`Illustration or visualization layer`](#reference-layerconfig)
    - [`Conditionally shown illustration layer`](#reference-conditionallayerconfig)
    - [`Model visualization layer`](#reference-modelvisualizationlayerconfig)
- [`Marker slot`](#reference-markerslotconfig)
- [`Model configuration`](#reference-modelconfig)
  - [`Initial parameter values`](#reference-initialparametersconfig)
  - [`Initial stock values`](#reference-initialstocksconfig)
- [`Parameter transformation`](#reference-parametertransformconfig)
- [`Schema of the app configuration`](#reference-schema-of-the-app-configuration)
  (root object)
- [`Simulation configuration`](#reference-simulationconfig)
- [`Slot group assets`](#reference-slotgroupassetconfig)

---

<a name="reference-actioncardslotgroupconfig"></a>

## Action card slot group

**`Action card slot group` Properties**

|            | Type                                 | Description | Required     |
| ---------- | ------------------------------------ | ----------- | ------------ |
| **id**     | `string`                             |             | &#10003; Yes |
| **type**   | `string`                             |             | &#10003; Yes |
| **label**  | `I18nConfig`                         |             | &#10003; Yes |
| **assets** | `SlotGroupAssetConfig`               |             | &#10003; Yes |
| **slots**  | `ActionCardSlotGroupSlotConfig` `[]` |             | &#10003; Yes |
| **cards**  | `CardConfig` `[]`                    |             | &#10003; Yes |

Additional properties are not allowed.

### ActionCardSlotGroupConfig.id

- **Type**: `string`
- **Required**: &#10003; Yes
- **Pattern**: `^((?!internal).)*$`

### ActionCardSlotGroupConfig.type

- **Type**: `string`
- **Required**: &#10003; Yes
- **Allowed values**:
  - `"action-card"`

### ActionCardSlotGroupConfig.label

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

### ActionCardSlotGroupConfig.assets

- **Type**: `SlotGroupAssetConfig`
- **Required**: &#10003; Yes

### ActionCardSlotGroupConfig.slots

- **Type**: `ActionCardSlotGroupSlotConfig` `[]`
- **Required**: &#10003; Yes

### ActionCardSlotGroupConfig.cards

- **Type**: `CardConfig` `[]`
- **Required**: &#10003; Yes

---

<a name="reference-actioncardslotgroupslotconfig"></a>

## Action card slot group slot

**`Action card slot group slot` Properties**

|                | Type               | Description | Required     |
| -------------- | ------------------ | ----------- | ------------ |
| **markerSlot** | `MarkerSlotConfig` |             | &#10003; Yes |
| **cardSlot**   | `CardSlotConfig`   |             | &#10003; Yes |

Additional properties are not allowed.

### ActionCardSlotGroupSlotConfig.markerSlot

- **Type**: `MarkerSlotConfig`
- **Required**: &#10003; Yes

### ActionCardSlotGroupSlotConfig.cardSlot

- **Type**: `CardSlotConfig`
- **Required**: &#10003; Yes

---

<a name="reference-asseturlobjectconfig"></a>

## Asset URL object

**`Asset URL object` Properties**

|         | Type     | Description | Required     |
| ------- | -------- | ----------- | ------------ |
| **url** | `string` |             | &#10003; Yes |

Additional properties are not allowed.

### AssetUrlObjectConfig.url

- **Type**: `string`
- **Required**: &#10003; Yes
- **Pattern**: `_x[+-]?[0-9]+_y[+-]?[0-9]+\.[a-zA-Z0-9]+$`

---

<a name="reference-autoresetconfig"></a>

## Auto reset

**`Auto reset` Properties**

|                    | Type         | Description | Required     |
| ------------------ | ------------ | ----------- | ------------ |
| **timeoutSeconds** | `number`     |             | &#10003; Yes |
| **condition**      | `string`     |             | &#10003; Yes |
| **title**          | `I18nConfig` |             | &#10003; Yes |
| **description**    | `I18nConfig` |             | &#10003; Yes |

Additional properties are not allowed.

### AutoResetConfig.timeoutSeconds

- **Type**: `number`
- **Required**: &#10003; Yes
- **Minimum**: ` >= 0`

### AutoResetConfig.condition

- **Type**: `string`
- **Required**: &#10003; Yes

### AutoResetConfig.title

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

### AutoResetConfig.description

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

---

<a name="reference-basicslotgroupconfig"></a>

## Basic slot group

**`Basic slot group` Properties**

|                           | Type                    | Description | Required     |
| ------------------------- | ----------------------- | ----------- | ------------ |
| **id**                    | `string`                |             | &#10003; Yes |
| **type**                  | `string`                |             | &#10003; Yes |
| **label**                 | `I18nConfig`            |             | &#10003; Yes |
| **assets**                | `SlotGroupAssetConfig`  |             | &#10003; Yes |
| **markerSlots**           | `MarkerSlotConfig` `[]` |             | &#10003; Yes |
| **parameterTransformIds** | `string` `[]`           |             | &#10003; Yes |

Additional properties are not allowed.

### BasicSlotGroupConfig.id

- **Type**: `string`
- **Required**: &#10003; Yes
- **Pattern**: `^((?!internal).)*$`

### BasicSlotGroupConfig.type

- **Type**: `string`
- **Required**: &#10003; Yes
- **Allowed values**:
  - `"basic"`

### BasicSlotGroupConfig.label

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

### BasicSlotGroupConfig.assets

- **Type**: `SlotGroupAssetConfig`
- **Required**: &#10003; Yes

### BasicSlotGroupConfig.markerSlots

- **Type**: `MarkerSlotConfig` `[]`
- **Required**: &#10003; Yes

### BasicSlotGroupConfig.parameterTransformIds

- **Type**: `string` `[]`
- **Required**: &#10003; Yes

---

<a name="reference-cardconfig"></a>

## Card

**`Card` Properties**

|                          | Type     | Description | Required     |
| ------------------------ | -------- | ----------- | ------------ |
| **parameterTransformId** | `string` |             | &#10003; Yes |
| **url**                  | `string` |             | &#10003; Yes |

Additional properties are not allowed.

### CardConfig.parameterTransformId

- **Type**: `string`
- **Required**: &#10003; Yes

### CardConfig.url

- **Type**: `string`
- **Required**: &#10003; Yes

---

<a name="reference-cardslotconfig"></a>

## Card slot

**`Card slot` Properties**

|           | Type     | Description | Required     |
| --------- | -------- | ----------- | ------------ |
| **id**    | `string` |             | &#10003; Yes |
| **x**     | `number` |             | &#10003; Yes |
| **y**     | `number` |             | &#10003; Yes |
| **angle** | `number` |             | &#10003; Yes |

Additional properties are not allowed.

### CardSlotConfig.id

- **Type**: `string`
- **Required**: &#10003; Yes

### CardSlotConfig.x

- **Type**: `number`
- **Required**: &#10003; Yes

### CardSlotConfig.y

- **Type**: `number`
- **Required**: &#10003; Yes

### CardSlotConfig.angle

- **Type**: `number`
- **Required**: &#10003; Yes

---

<a name="reference-conditionallayerconfig"></a>

## Conditionally shown illustration layer

**`Conditionally shown illustration layer` Properties**

|               | Type     | Description | Required     |
| ------------- | -------- | ----------- | ------------ |
| **url**       | `string` |             | &#10003; Yes |
| **condition** | `string` |             | &#10003; Yes |

Additional properties are not allowed.

### ConditionalLayerConfig.url

- **Type**: `string`
- **Required**: &#10003; Yes
- **Pattern**: `_x[+-]?[0-9]+_y[+-]?[0-9]+\.[a-zA-Z0-9]+$`

### ConditionalLayerConfig.condition

- **Type**: `string`
- **Required**: &#10003; Yes

---

<a name="reference-eventcardslotgroupconfig"></a>

## Event card slot group

**`Event card slot group` Properties**

|                | Type                   | Description | Required     |
| -------------- | ---------------------- | ----------- | ------------ |
| **id**         | `string`               |             | &#10003; Yes |
| **type**       | `string`               |             | &#10003; Yes |
| **label**      | `I18nConfig`           |             | &#10003; Yes |
| **assets**     | `SlotGroupAssetConfig` |             | &#10003; Yes |
| **markerSlot** | `MarkerSlotConfig`     |             | &#10003; Yes |
| **cardSlots**  | `CardSlotConfig` `[]`  |             | &#10003; Yes |
| **cards**      | `CardConfig` `[]`      |             | &#10003; Yes |

Additional properties are not allowed.

### EventCardSlotGroupConfig.id

- **Type**: `string`
- **Required**: &#10003; Yes
- **Pattern**: `^((?!internal).)*$`

### EventCardSlotGroupConfig.type

- **Type**: `string`
- **Required**: &#10003; Yes
- **Allowed values**:
  - `"event-card"`

### EventCardSlotGroupConfig.label

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

### EventCardSlotGroupConfig.assets

- **Type**: `SlotGroupAssetConfig`
- **Required**: &#10003; Yes

### EventCardSlotGroupConfig.markerSlot

- **Type**: `MarkerSlotConfig`
- **Required**: &#10003; Yes

### EventCardSlotGroupConfig.cardSlots

- **Type**: `CardSlotConfig` `[]`
- **Required**: &#10003; Yes

### EventCardSlotGroupConfig.cards

- **Type**: `CardConfig` `[]`
- **Required**: &#10003; Yes

---

<a name="reference-generalconfig"></a>

## General configuration

**`General configuration` Properties**

|                       | Type                | Description | Required     |
| --------------------- | ------------------- | ----------- | ------------ |
| **assetBaseDir**      | `string`            |             | &#10003; Yes |
| **primaryLanguage**   | `string`            |             | &#10003; Yes |
| **secondaryLanguage** | `string`            |             | &#10003; Yes |
| **description**       | `I18nConfig`        |             | &#10003; Yes |
| **scoreLabels**       | `ScoreLabelsConfig` |             | &#10003; Yes |
| **autoReset**         | `AutoResetConfig`   |             | &#10003; Yes |

Additional properties are not allowed.

### GeneralConfig.assetBaseDir

- **Type**: `string`
- **Required**: &#10003; Yes

### GeneralConfig.primaryLanguage

- **Type**: `string`
- **Required**: &#10003; Yes

### GeneralConfig.secondaryLanguage

- **Type**: `string`
- **Required**: &#10003; Yes

### GeneralConfig.description

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

### GeneralConfig.scoreLabels

- **Type**: `ScoreLabelsConfig`
- **Required**: &#10003; Yes

### GeneralConfig.autoReset

- **Type**: `AutoResetConfig`
- **Required**: &#10003; Yes

---

<a name="reference-layerconfig"></a>

## Illustration or visualization layer

---

<a name="reference-initialparametersconfig"></a>

## Initial parameter values

**`Initial parameter values` Properties**

|                                 | Type     | Description | Required     |
| ------------------------------- | -------- | ----------- | ------------ |
| **abandonExcessRate**           | `number` |             | &#10003; Yes |
| **abandonRate**                 | `number` |             | &#10003; Yes |
| **acquireRate**                 | `number` |             | &#10003; Yes |
| **breakRate**                   | `number` |             | &#10003; Yes |
| **capacityAdjustmentRate**      | `number` |             | &#10003; Yes |
| **disposeIncentive**            | `number` |             | &#10003; Yes |
| **disposeRate**                 | `number` |             | &#10003; Yes |
| **landfillIncentive**           | `number` |             | &#10003; Yes |
| **landfillRate**                | `number` |             | &#10003; Yes |
| **naturalResourceMiningRate**   | `number` |             | &#10003; Yes |
| **naturalResourcesIncentive**   | `number` |             | &#10003; Yes |
| **newPhoneProductionRate**      | `number` |             | &#10003; Yes |
| **newlyProducedPhoneIncentive** | `number` |             | &#10003; Yes |
| **numberOfUsers**               | `number` |             | &#10003; Yes |
| **phonesPerUserGoal**           | `number` |             | &#10003; Yes |
| **recycleRate**                 | `number` |             | &#10003; Yes |
| **recyclingIncentive**          | `number` |             | &#10003; Yes |
| **refurbishmentIncentive**      | `number` |             | &#10003; Yes |
| **refurbishmentRate**           | `number` |             | &#10003; Yes |
| **repairIncentive**             | `number` |             | &#10003; Yes |
| **repairRate**                  | `number` |             | &#10003; Yes |
| **reuseIncentive**              | `number` |             | &#10003; Yes |
| **userdata**                    | `number` |             | &#10003; Yes |

Additional properties are not allowed.

### InitialParametersConfig.abandonExcessRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.abandonRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.acquireRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.breakRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.capacityAdjustmentRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.disposeIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.disposeRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.landfillIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.landfillRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.naturalResourceMiningRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.naturalResourcesIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.newPhoneProductionRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.newlyProducedPhoneIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.numberOfUsers

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.phonesPerUserGoal

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.recycleRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.recyclingIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.refurbishmentIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.refurbishmentRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.repairIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.repairRate

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.reuseIncentive

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialParametersConfig.userdata

- **Type**: `number`
- **Required**: &#10003; Yes

---

<a name="reference-initialstocksconfig"></a>

## Initial stock values

**`Initial stock values` Properties**

|                                   | Type     | Description | Required     |
| --------------------------------- | -------- | ----------- | ------------ |
| **capacityOfNaturalResources**    | `number` |             | &#10003; Yes |
| **capacityOfNewlyProducedPhones** | `number` |             | &#10003; Yes |
| **capacityOfPhonesInUse**         | `number` |             | &#10003; Yes |
| **capacityOfRecycledMaterials**   | `number` |             | &#10003; Yes |
| **capacityOfRefurbishedPhones**   | `number` |             | &#10003; Yes |
| **capacityOfRepairedPhones**      | `number` |             | &#10003; Yes |
| **phonesInUse**                   | `number` |             | &#10003; Yes |
| **supplyOfBrokenPhones**          | `number` |             | &#10003; Yes |
| **supplyOfDisposedPhones**        | `number` |             | &#10003; Yes |
| **supplyOfHibernatingPhones**     | `number` |             | &#10003; Yes |
| **supplyOfNaturalResources**      | `number` |             | &#10003; Yes |
| **supplyOfNewlyProducedPhones**   | `number` |             | &#10003; Yes |
| **supplyOfRecycledMaterials**     | `number` |             | &#10003; Yes |
| **supplyOfRefurbishedPhones**     | `number` |             | &#10003; Yes |
| **supplyOfRepairedPhones**        | `number` |             | &#10003; Yes |

Additional properties are not allowed.

### InitialStocksConfig.capacityOfNaturalResources

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.capacityOfNewlyProducedPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.capacityOfPhonesInUse

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.capacityOfRecycledMaterials

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.capacityOfRefurbishedPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.capacityOfRepairedPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.phonesInUse

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfBrokenPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfDisposedPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfHibernatingPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfNaturalResources

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfNewlyProducedPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfRecycledMaterials

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfRefurbishedPhones

- **Type**: `number`
- **Required**: &#10003; Yes

### InitialStocksConfig.supplyOfRepairedPhones

- **Type**: `number`
- **Required**: &#10003; Yes

---

<a name="reference-interactionconfig"></a>

## Interactive elements

**`Interactive elements` Properties**

|                            | Type      | Description | Required     |
| -------------------------- | --------- | ----------- | ------------ |
| **actionCardDelayMs**      | `number`  |             | &#10003; Yes |
| **eventCardMinDelayMs**    | `number`  |             | &#10003; Yes |
| **eventCardMaxDelayMs**    | `number`  |             | &#10003; Yes |
| **eventCardMinDurationMs** | `number`  |             | &#10003; Yes |
| **eventCardMaxDurationMs** | `number`  |             | &#10003; Yes |
| **slotGroups**             | `array[]` |             | &#10003; Yes |

Additional properties are not allowed.

### InteractionConfig.actionCardDelayMs

- **Type**: `number`
- **Required**: &#10003; Yes
- **Minimum**: ` >= 0`

### InteractionConfig.eventCardMinDelayMs

- **Type**: `number`
- **Required**: &#10003; Yes
- **Minimum**: ` >= 0`

### InteractionConfig.eventCardMaxDelayMs

- **Type**: `number`
- **Required**: &#10003; Yes
- **Minimum**: ` >= 0`

### InteractionConfig.eventCardMinDurationMs

- **Type**: `number`
- **Required**: &#10003; Yes
- **Minimum**: ` >= 0`

### InteractionConfig.eventCardMaxDurationMs

- **Type**: `number`
- **Required**: &#10003; Yes
- **Minimum**: ` >= 0`

### InteractionConfig.slotGroups

- **Type**: `array[]`
  - Each element in the array must be one of the following values:
- **Required**: &#10003; Yes

---

<a name="reference-i18nconfig"></a>

## Internationalized text

Additional properties are allowed.

---

<a name="reference-layersconfig"></a>

## Layers of illustrations and visualizations

---

<a name="reference-markerslotconfig"></a>

## Marker slot

**`Marker slot` Properties**

|           | Type     | Description | Required     |
| --------- | -------- | ----------- | ------------ |
| **id**    | `string` |             | &#10003; Yes |
| **x**     | `number` |             | &#10003; Yes |
| **y**     | `number` |             | &#10003; Yes |
| **angle** | `number` |             | &#10003; Yes |

Additional properties are not allowed.

### MarkerSlotConfig.id

- **Type**: `string`
- **Required**: &#10003; Yes

### MarkerSlotConfig.x

- **Type**: `number`
- **Required**: &#10003; Yes

### MarkerSlotConfig.y

- **Type**: `number`
- **Required**: &#10003; Yes

### MarkerSlotConfig.angle

- **Type**: `number`
- **Required**: &#10003; Yes

---

<a name="reference-modelconfig"></a>

## Model configuration

**`Model configuration` Properties**

|                       | Type                      | Description | Required     |
| --------------------- | ------------------------- | ----------- | ------------ |
| **initialParameters** | `InitialParametersConfig` |             | &#10003; Yes |
| **initialStocks**     | `InitialStocksConfig`     |             | &#10003; Yes |

Additional properties are not allowed.

### ModelConfig.initialParameters

- **Type**: `InitialParametersConfig`
- **Required**: &#10003; Yes

### ModelConfig.initialStocks

- **Type**: `InitialStocksConfig`
- **Required**: &#10003; Yes

---

<a name="reference-modelvisualizationlayerconfig"></a>

## Model visualization layer

---

<a name="reference-parametertransformconfig"></a>

## Parameter transformation

**`Parameter transformation` Properties**

|            | Type     | Description | Required     |
| ---------- | -------- | ----------- | ------------ |
| **id**     | `string` |             | &#10003; Yes |
| **script** | `string` |             | &#10003; Yes |

Additional properties are not allowed.

### ParameterTransformConfig.id

- **Type**: `string`
- **Required**: &#10003; Yes

### ParameterTransformConfig.script

- **Type**: `string`
- **Required**: &#10003; Yes

---

<a name="reference-schema-of-the-app-configuration"></a>

## Schema of the app configuration

**`Schema of the app configuration` Properties**

|                         | Type                            | Description | Required     |
| ----------------------- | ------------------------------- | ----------- | ------------ |
| **general**             | `GeneralConfig`                 |             | &#10003; Yes |
| **model**               | `ModelConfig`                   |             | &#10003; Yes |
| **simulation**          | `SimulationConfig`              |             | &#10003; Yes |
| **parameterTransforms** | `ParameterTransformConfig` `[]` |             | &#10003; Yes |
| **interaction**         | `InteractionConfig`             |             | &#10003; Yes |
| **layers**              | `LayersConfig`                  |             | &#10003; Yes |

Additional properties are not allowed.

### Schema of the app configuration.general

- **Type**: `GeneralConfig`
- **Required**: &#10003; Yes

### Schema of the app configuration.model

- **Type**: `ModelConfig`
- **Required**: &#10003; Yes

### Schema of the app configuration.simulation

- **Type**: `SimulationConfig`
- **Required**: &#10003; Yes

### Schema of the app configuration.parameterTransforms

- **Type**: `ParameterTransformConfig` `[]`
- **Required**: &#10003; Yes

### Schema of the app configuration.interaction

- **Type**: `InteractionConfig`
- **Required**: &#10003; Yes

### Schema of the app configuration.layers

- **Type**: `LayersConfig`
  - Each element in the array must be one of the following values:
    - `modelVisualization`
- **Required**: &#10003; Yes

---

<a name="reference-scorelabelsconfig"></a>

## Score labels

**`Score labels` Properties**

|                 | Type         | Description | Required     |
| --------------- | ------------ | ----------- | ------------ |
| **circularity** | `I18nConfig` |             | &#10003; Yes |
| **coverage**    | `I18nConfig` |             | &#10003; Yes |

Additional properties are not allowed.

### ScoreLabelsConfig.circularity

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

### ScoreLabelsConfig.coverage

- **Type**: `I18nConfig`
- **Required**: &#10003; Yes
- **Type of each property**: `string`

---

<a name="reference-simulationconfig"></a>

## Simulation configuration

**`Simulation configuration` Properties**

|                    | Type     | Description | Required     |
| ------------------ | -------- | ----------- | ------------ |
| **deltaPerSecond** | `number` |             | &#10003; Yes |
| **maxStepSize**    | `number` |             | &#10003; Yes |

Additional properties are not allowed.

### SimulationConfig.deltaPerSecond

- **Type**: `number`
- **Required**: &#10003; Yes

### SimulationConfig.maxStepSize

- **Type**: `number`
- **Required**: &#10003; Yes

---

<a name="reference-slotgroupconfig"></a>

## Slot group

---

<a name="reference-slotgroupassetconfig"></a>

## Slot group assets

**`Slot group assets` Properties**

|                        | Type                   | Description | Required     |
| ---------------------- | ---------------------- | ----------- | ------------ |
| **markerSlotActive**   | `AssetUrlObjectConfig` |             | &#10003; Yes |
| **markerSlotInactive** | `AssetUrlObjectConfig` |             | &#10003; Yes |

Additional properties are not allowed.

### SlotGroupAssetConfig.markerSlotActive

- **Type**: `AssetUrlObjectConfig`
- **Required**: &#10003; Yes

### SlotGroupAssetConfig.markerSlotInactive

- **Type**: `AssetUrlObjectConfig`
- **Required**: &#10003; Yes
