<script setup lang="ts">
import type { DeepReadonly, Writable } from 'ts-essentials';

import { difference } from 'lodash';
import { ref, computed, watchEffect, watch } from 'vue';
import { useArrayFilter } from '@vueuse/core';

import type { Marker } from '../../ts/stores/marker';
import type { MarkerSlotConfig } from '../../ts/config/config-schema';

import { SLOT_CIRCLE_DIAMETER } from '../../ts/builtin-config';
import { useConfigStore } from '../../ts/stores/config';
import { useAppStore } from '../../ts/stores/app';
import { useMarkerStore } from '../../ts/stores/marker';
import { useSlotStore } from '../../ts/stores/slot';

import { Circle } from '../../ts/util/geometry/circle';

const props = defineProps<{
  readonly slotGroupId: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly activeUrl: string;
  readonly inactiveUrl: string;
  readonly slotConfig: DeepReadonly<MarkerSlotConfig>;
}>();

const { slotConfig } = props;

const slotGroupId = ref(props.slotGroupId);
const slotId = `${slotGroupId.value}-${slotConfig.id}`;

const { toAssetUrl, extractAssetPosition } = useConfigStore();
const markerSlotActiveUrl = toAssetUrl(props.activeUrl);
const markerSlotInactiveUrl = toAssetUrl(props.inactiveUrl);
const markerSlotActivePosition = extractAssetPosition(markerSlotActiveUrl);
const markerSlotInactivePosition = extractAssetPosition(markerSlotInactiveUrl);

const appStore = useAppStore();

const markerStore = useMarkerStore();
const { markerPositions } = markerStore;

const slotStore = useSlotStore();

const slotCircle = new Circle(
  slotConfig.x,
  slotConfig.y,
  SLOT_CIRCLE_DIAMETER / 2,
);

let previousContainedMarkers = new Array<Marker>();

const containedMarkers = useArrayFilter(
  markerPositions as Writable<typeof markerPositions>,
  (m) => slotCircle.containsPoint(m),
);

watchEffect(() => {
  const added = difference(containedMarkers.value, previousContainedMarkers);
  const removed = difference(previousContainedMarkers, containedMarkers.value);
  removed.forEach(({ id: markerId }) =>
    slotStore.addActivation({ slotId, markerId }),
  );
  added.forEach(({ id: markerId }) =>
    slotStore.addActivation({ slotId, markerId }),
  );
  previousContainedMarkers = containedMarkers.value;
});

const isActive = computed(() => containedMarkers.value.length > 0);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{
  activate: [ids: { slotId: string; slotGroupId: string }];
  deactivate: [ids: { slotId: string; slotGroupId: string }];
}>();

watch(
  () => isActive.value,
  (isActiveNow, isActivePrev) => {
    if (isActiveNow && !isActivePrev) {
      emit('activate', { slotId, slotGroupId: slotGroupId.value });
    } else {
      emit('deactivate', { slotId, slotGroupId: slotGroupId.value });
    }
  },
);
</script>

<template>
  <div
    :data-slot-id="slotConfig.id"
    class="slot"
    :style="{
      '--slot-x': slotConfig.x,
      '--slot-y': slotConfig.y,
      '--slot-angle': `${slotConfig.angle}deg`,
      '--slot-diameter': SLOT_CIRCLE_DIAMETER,
    }"
  >
    <div class="asset-container">
      <img
        v-show="isActive"
        :src="markerSlotActiveUrl.href"
        :alt="`${slotConfig.id}-active`"
        :style="{
          '--asset-x': markerSlotActivePosition.x,
          '--asset-y': markerSlotActivePosition.y,
        }"
      />
      <img
        v-show="!isActive"
        :src="markerSlotInactiveUrl.href"
        :alt="`${slotConfig.id}-inactive`"
        :style="{
          '--asset-x': markerSlotInactivePosition.x,
          '--asset-y': markerSlotInactivePosition.y,
        }"
      />
    </div>
    <div
      v-if="appStore.isDeveloperModeActive"
      class="circle"
      :class="{ active: isActive, inactive: !isActive }"
    ></div>
    <div v-if="appStore.showMarkerSlotLabels" class="label">
      <div class="primary-text">{{ props.primaryLabel }}</div>
      <div class="secondary-text">{{ props.secondaryLabel }}</div>
    </div>
    <div v-if="appStore.isDeveloperModeActive" class="dev-label">
      {{ slotGroupId }}<br />{{ slotConfig.id }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.slot {
  left: calc(1px * var(--slot-x));
  top: calc(1px * var(--slot-y));
  width: calc(1px * var(--slot-diameter));
  height: calc(1px * var(--slot-diameter));
  position: absolute;
  transform-origin: center;
  transform: translate(-50%, -50%) rotate(var(--slot-angle));

  & > .asset-container {
    position: absolute;
    transform: translate(0%, 50%);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    & > img {
      position: absolute;
      transform: translateX(calc(1px * var(--asset-x)))
        translateY(calc(1px * var(--asset-y)));
    }
  }

  & > .circle {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-sizing: content-box;
    outline: solid 2px;

    &.inactive {
      outline-color: darkgray;
    }

    &.active {
      outline-color: black;
    }
  }

  & .label {
    position: absolute;
    text-align: left;
    text-transform: uppercase;
    white-space: pre-line;
    font-size: 20px;
    color: black;
  }

  & .dev-label {
    position: absolute;
    background-color: #fffa;
  }

  * {
    pointer-events: none;
    user-select: none;
  }

  display: grid;
  place-items: center center;
  font-family: sans-serif;
  font-size: x-large;
  text-align: center;
}
</style>
