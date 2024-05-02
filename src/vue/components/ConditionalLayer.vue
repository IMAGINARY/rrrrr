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

function compileLayer({ condition, url }: ConditionalLayerConfig): {
  checkCondition: Condition<typeof modelStore.record>;
  condition: string;
  active: Ref<boolean>;
  url: URL;
  x: number;
  y: number;
} {
  const resolvedUrl = toAssetUrl(url);
  const { x, y } = extractAssetPosition(resolvedUrl);
  const checkCondition = compile(condition);
  const active = computed(() => checkCondition(modelStore.record));
  return {
    checkCondition,
    condition,
    active,
    url: resolvedUrl,
    x,
    y,
  };
}

const compiledLayer = compileLayer(props.layerConfig);
</script>

<template>
  <img
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
