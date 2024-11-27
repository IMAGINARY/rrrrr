<script setup lang="ts">
import type { DeepReadonly } from 'ts-essentials';
import type { Ref } from 'vue';

import { computed } from 'vue';

import type { ConditionalLayerConfig } from '../../ts/config/config-schema-types';
import type { Condition } from '../../ts/util/record-condition';

import { useConfigStore } from '../../ts/stores/config';
import { useModelStore } from '../../ts/stores/model';
import { compile } from '../../ts/util/record-condition';

const props = defineProps<{
  readonly layerConfig: DeepReadonly<ConditionalLayerConfig>;
}>();

const { extractAssetPosition, toAssetUrl } = useConfigStore();
const modelStore = useModelStore();

function compileLayer({ condition, url, reset }: ConditionalLayerConfig): {
  checkCondition: Condition<typeof modelStore.record>;
  condition: string;
  active: Ref<boolean>;
  url: URL;
  x: number;
  y: number;
  reset: boolean;
} {
  const resolvedUrl = toAssetUrl(url);
  const { x, y } = extractAssetPosition(resolvedUrl);
  const checkCondition = compile(condition);
  const active = computed(() => {
    // If the condition does not depend on the record (e.g. it only depends on some global state like the date),
    // the reactive elements of modelStore.record will not be accessed and the condition will never be re-evaluated
    // after the first run. Querying the timestamp of the record object ensures that the condition is re-evaluated
    // whenever the simulation progresses.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = modelStore.record;
    return checkCondition(modelStore.record);
  });
  return {
    checkCondition,
    condition,
    active,
    url: resolvedUrl,
    x,
    y,
    reset: reset ?? false, // FIXME: apply the default during config parsing
  };
}

const compiledLayer = compileLayer(props.layerConfig);
</script>

<template>
  <img
    v-if="!compiledLayer.reset || compiledLayer.active.value"
    :src="compiledLayer.url.href"
    class="positioned-layer"
    :class="{ inactive: !compiledLayer.active.value }"
    :style="{
      '--layer-x': compiledLayer.x,
      '--layer-y': compiledLayer.y,
    }"
    :alt="`${compiledLayer.condition} -> ${compiledLayer.url}`"
  />
</template>

<style scoped lang="scss">
.positioned-layer {
  position: absolute;
  top: calc(1px * var(--layer-y));
  left: calc(1px * var(--layer-x));
}

.inactive {
  display: none;
}
</style>
