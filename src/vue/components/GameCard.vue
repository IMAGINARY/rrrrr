<script setup lang="ts">
import { computed } from 'vue';

import { useConfigStore } from '../../ts/stores/config';
import { useAppStore } from '../../ts/stores/app';

const props = defineProps<{
  readonly url: string;
  readonly label: string;
  active: boolean;
}>();

const { toAssetUrl } = useConfigStore();
const appStore = useAppStore();

const assetUrl = computed(() => toAssetUrl(props.url));

// const position = computed(() => extractAssetPosition(assetUrl.value));
// Keep the position fixed for now
const position = { x: 0, y: 0 };
</script>

<template>
  <div
    class="action-card"
    :class="{ active: props.active }"
    :style="{
      '--card-x': position.x,
      '--card-y': position.y,
    }"
  >
    <img :src="assetUrl.href" :alt="label" class="image" />
    <div class="label" v-if="appStore.isDeveloperModeActive">
      <span class="highlight">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.action-card {
  --inactive-card-filter: invert(1) brightness(0.4) invert(1);
  position: absolute;
  left: calc(1px * var(--card-x));
  top: calc(1px * var(--card-y));

  &:not(.active) {
    filter: var(--inactive-card-filter);
  }

  .image {
    position: relative;
  }

  .label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center center;
    font-family: sans-serif;
    font-size: x-large;
    text-align: center;
  }

  .highlight {
    background: #fff7;
  }
}
</style>
