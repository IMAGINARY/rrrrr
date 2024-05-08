<script setup lang="ts">
import type { ElementOf } from 'ts-essentials';

import { strict as assert } from 'assert';
import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import clamp from 'lodash/clamp';
import { onMounted, ref, computed } from 'vue';
import { toReactive } from '@vueuse/core';
import { v4 as uuid4 } from 'uuid';
import { storeToRefs } from 'pinia';

import type { ModelElementObject } from '../../ts/model';
import { type Record, type StockId } from '../../ts/circular-economy-model';

import { BOARD_WIDTH, BOARD_HEIGHT } from '../../ts/builtin-config';
import { useAppStore } from '../../ts/stores/app';
import { useModelStore } from '../../ts/stores/model';
import { useVisualizationStore } from '../../ts/stores/visualization';
import { stockIds } from '../../ts/circular-economy-model';
import { loadSvg } from '../../ts/util/load-svg';
import { getCircleCenter } from '../../ts/util/geometry/svg';
import { guardedQuerySelector } from '../../ts/util/guarded-query-selectors';

const svgUrl = new URL('../../svg/model.svg', import.meta.url);
const uuid = uuid4();

const mainFlowIds = [
  'abandon',
  'acquireNewlyProduced',
  'acquireRefurbished',
  'acquireRepaired',
  'acquireUsed',
  'disposeBroken',
  'disposeHibernating',
  'goBroken',
  'landfill',
  'produceFromNaturalResources',
  'produceFromRecycledMaterials',
  'recycle',
  'refurbish',
  'repair',
] as const;

const mainCapacityIds = [
  'recycledMaterials',
  'repairedPhones',
  'refurbishedPhones',
  'newlyProducedPhones',
  'phonesInUse',
] as const;

const mainSupplyIds = [
  'recycledMaterials',
  'hibernatingPhones',
  'disposedPhones',
  'brokenPhones',
  'repairedPhones',
  'refurbishedPhones',
  'newlyProducedPhones',
] as const;

const additionalVerbatimSupplyIds = ['phonesInUse'] as const;

const stockIdsMap = {
  capacity: mainCapacityIds,
  supply: mainSupplyIds,
  verbatim: additionalVerbatimSupplyIds,
} as const;

type MainFlowIds = typeof mainFlowIds;
type MainFlowId = ElementOf<MainFlowIds>;

const flowVizSigns: ModelElementObject<MainFlowIds> = {
  abandon: +1,
  acquireNewlyProduced: -1,
  acquireRefurbished: -1,
  acquireRepaired: -1,
  acquireUsed: -1,
  disposeBroken: -1,
  disposeHibernating: -1,
  goBroken: -1,
  landfill: -1,
  produceFromNaturalResources: -1,
  produceFromRecycledMaterials: -1,
  recycle: -1,
  refurbish: -1,
  repair: -1,
} as const;

const svgPromise = loadSvg(svgUrl);

const appStore = useAppStore();

const modelStore = useModelStore();

const visualizationStore = useVisualizationStore();
const { scaleFactors } = storeToRefs(visualizationStore);

const updateInfo = ref({
  deltaMs: 0,
  stepSize: 0,
  flowVizScale: 1,
  stockVizScale: 1,
  record: modelStore.record,
});

interface StockDescription {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  radius: number;
  highlight: number;
}

interface FlowDescription {
  readonly id: string;
  readonly svgPath: string;
  dashOffset: number;
  highlight: number;
}

const useStockToRadius = (stockId: StockId) => {
  const radius = computed(() => {
    const { record } = updateInfo.value;
    const { stocks } = record;
    const stock = stocks[stockId];
    const { stockVizScale } = updateInfo.value;
    return Math.sqrt((stock * stockVizScale) / Math.PI);
  });
  return { radius };
};

const useFlowToDashoffset = (flowId: MainFlowId) => {
  let lastDashOffset = 0;
  const dashoffset = computed(() => {
    const { deltaMs, flowVizScale, record } = updateInfo.value;
    const { flows } = record;
    const flow = flows[flowId];
    const flowVizSign = flowVizSigns[flowId];

    // The dash offset step must not be small compared to the dash gap.
    // Otherwise, the flow animation may appear to move backwards.
    const maxStep = 10; // TODO: Make this configurable
    const dashOffsetStep =
      flowVizSign * Math.min(deltaMs * flowVizScale * flow, maxStep);
    const dashOffset =
      (Number.isNaN(lastDashOffset) ? 0 : lastDashOffset) + dashOffsetStep;
    lastDashOffset = dashOffset;
    return dashOffset;
  });
  return { dashoffset };
};

const useFlowToHighlight = (flowId: MainFlowId) => {
  let previousFlow = updateInfo.value.record.flows[flowId];
  const highlight = computed(() => {
    // TODO: fine-tune formula
    const { flowVizScale, record, stepSize } = updateInfo.value;
    const flow = record.flows[flowId];
    const flowDerivative = (flow - previousFlow) / stepSize;
    const scaledFlowDerivative =
      scaleFactors.value.flowHighlight * flowVizScale * flowDerivative;
    const mappedFlowDerivative =
      Math.sign(scaledFlowDerivative) *
      Math.sqrt(Math.abs(scaledFlowDerivative));
    const result = clamp((1 + mappedFlowDerivative) / 2, 0, 1);
    previousFlow = flow;
    return appStore.highlightDerivatives && !Number.isNaN(result)
      ? result
      : 0.5;
  });
  return { highlight };
};

const extractFlowDescriptions = (svgElement: SVGElement): FlowDescription[] =>
  mainFlowIds.map((id) => {
    const flowElement = guardedQuerySelector(
      SVGGeometryElement,
      `#${kebabCase(id)}`,
      svgElement,
    );
    const svgPath = flowElement.getAttribute('d');
    assert(svgPath !== null, `SVG path for flow ${id} not found.`);
    const flowDescription: FlowDescription = toReactive({
      id,
      svgPath,
      dashOffset: useFlowToDashoffset(id).dashoffset,
      highlight: useFlowToHighlight(id).highlight,
    });
    return flowDescription;
  });

const extractStockDescriptions = (
  svgElement: SVGElement,
  type: keyof typeof stockIdsMap,
): StockDescription[] => {
  const mainStockIds = stockIdsMap[type];
  return mainStockIds.map((mainId) => {
    const stockElement = guardedQuerySelector(
      SVGGeometryElement,
      `#${kebabCase(mainId)}`,
      svgElement,
    );
    assert(stockElement.tagName === 'circle');
    const { x, y } = getCircleCenter(stockElement as SVGCircleElement);
    const id = (
      type === 'verbatim'
        ? mainId
        : camelCase(`${type}-of-${kebabCase(mainId)}`)
    ) as StockId;
    assert(
      stockIds.includes(id),
      `${id} is no valid stockId (${stockIds.join(', ')})`,
    );
    const stockDescription: StockDescription = toReactive({
      id,
      x,
      y,
      radius: useStockToRadius(id).radius,
      highlight: 0,
    });
    return stockDescription;
  });
};

const capacityDescriptions = ref<StockDescription[]>([]);
const supplyDescriptions = ref<StockDescription[]>([]);
const flowDescriptions = ref<FlowDescription[]>([]);

const flowElements = ref<SVGPathElement[]>([]);
const supplyElements = ref<SVGCircleElement[]>([]);

onMounted(() => {
  void svgPromise.then((svg) => {
    flowDescriptions.value.push(...extractFlowDescriptions(svg));
    capacityDescriptions.value.push(
      ...extractStockDescriptions(svg, 'capacity'),
    );
    supplyDescriptions.value.push(
      ...extractStockDescriptions(svg, 'supply'),
      ...extractStockDescriptions(svg, 'verbatim'),
    );
  });
});

const update = (
  deltaMs: DOMHighResTimeStamp,
  stepSize: number,
  record: Record,
) => {
  const flowVizScale =
    scaleFactors.value.flow / record.parameters.numberOfUsers;
  const stockVizScale =
    scaleFactors.value.stock / record.parameters.numberOfUsers;
  updateInfo.value = { deltaMs, stepSize, flowVizScale, stockVizScale, record };
};

defineExpose({ update });
</script>

<template>
  <div
    ref="container"
    class="model-viz-container"
    :style="{
      '--dev-mode-label-display': appStore.isDeveloperModeActive
        ? 'inline'
        : 'none',
    }"
  >
    <svg
      :width="BOARD_WIDTH"
      :height="BOARD_HEIGHT"
      :viewBox="`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`"
      xml:space="preserve"
      xmlns="http://www.w3.org/2000/svg"
      class="model-visualization"
    >
      <path
        v-for="flowDescription in flowDescriptions"
        :key="flowDescription.id"
        :id="`${flowDescription.id}-${uuid}`"
        ref="flowElements"
        :data-label="flowDescription.id"
        :d="flowDescription.svgPath"
        :stroke-dashoffset="flowDescription.dashOffset"
        class="flow anim-edge"
        :style="{
          '--highlight': flowDescription.highlight,
        }"
      />
      <circle
        v-for="stockDescription in capacityDescriptions"
        :key="stockDescription.id"
        :cx="stockDescription.x"
        :cy="stockDescription.y"
        :r="stockDescription.radius"
        class="stock capacity"
      />
      <circle
        v-for="stockDescription in supplyDescriptions"
        :key="stockDescription.id"
        :id="`${stockDescription.id}-${uuid}`"
        ref="supplyElements"
        :data-label="stockDescription.id"
        :cx="stockDescription.x"
        :cy="stockDescription.y"
        :r="stockDescription.radius"
        class="stock supply"
      />
      <template v-if="appStore.isDeveloperModeActive">
        <text v-for="flowElement in flowElements" :key="flowElement.id">
          <textPath
            :xlink:href="`#${flowElement.id}`"
            startOffset="50%"
            text-anchor="middle"
            dominant-baseline="middle"
            class="label"
          >
            {{ flowElement.dataset.label }}
          </textPath>
        </text>
        <text
          v-for="supplyElement in supplyElements"
          :key="supplyElement.id"
          :x="supplyElement.getAttribute('cx')"
          :y="supplyElement.getAttribute('cy')"
          class="label"
        >
          {{ supplyElement.dataset.label }}
        </text>
      </template>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.model-visualization {
  overflow: visible;

  .stock {
    stroke: none;
    opacity: 0.75;
  }

  .supply {
    fill: lightgray;
  }

  .capacity {
    fill: gray;
  }

  @keyframes highlight {
    0% {
      stroke: red;
    }

    50% {
      stroke: gray;
    }

    100% {
      stroke: blue;
    }
  }

  .flow {
    stroke-linecap: round;
    stroke-linejoin: round;
    animation: 100s linear calc(-100s * var(--highlight)) paused highlight;
    animation-fill-mode: both;

    fill: none;

    &.edge {
      stroke-width: 8;
      display: none;
    }

    &.anim-edge {
      stroke-width: 15;
      stroke-dasharray: 10 27;
      --max-dashoffset-step: 15; // string must be parseable by parseFloat()
    }

    &#recycle-flow,
    &#recycle-edge,
    &#produce-from-recycled-materials-flow,
    &#produce-from-recycled-materials-edge,
    &#repair-flow,
    &#repair-edge,
    &#acquire-repaired-flow,
    &#acquire-repaired-edge,
    &#refurbish-flow,
    &#refurbish-edge,
    &#acquire-refurbished-flow,
    &#acquire-refurbished-edge,
    &#acquire-used-flow,
    &#acquire-used-edge {
      stroke: gray;

      &.anim-edge {
        stroke-dasharray: 0 27;
        --max-dashoffset-step: 12.5; // string must be parseable by parseFloat()
      }
    }
  }

  foreignObject {
    overflow: visible;
  }

  .label {
    font-size: 48px;
    font-family: sans-serif;
    text-anchor: middle;
    dominant-baseline: middle;
  }
}
</style>
