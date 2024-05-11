<script setup lang="ts">
import type { DeepReadonly } from 'ts-essentials';

import { strict as assert } from 'assert';
import { ref, watchEffect } from 'vue';

import type { BasicSlotGroupConfig } from '../../ts/config/config-schema';

import { useConfigStore } from '../../ts/stores/config';
import { useSlotGroupsStore } from '../../ts/stores/slot-groups';
import MarkerSlot from './MarkerSlot.vue';

const props = defineProps<{
  readonly slotGroupConfig: DeepReadonly<BasicSlotGroupConfig>;
}>();
const { slotGroupConfig } = props;

const { getPrimary, getSecondary } = useConfigStore();

const primaryLabel = getPrimary(slotGroupConfig.label);
const secondaryLabel = getSecondary(slotGroupConfig.label);

const { slotGroups } = useSlotGroupsStore();
const slotGroup = slotGroups.find(({ id }) => id === slotGroupConfig.id);
assert(typeof slotGroup !== 'undefined');

const numActive = ref(0);

watchEffect(() =>
  slotGroup.parameterTransforms.forEach((pt, index) =>
    pt.setActive(numActive.value > index),
  ),
);
</script>

<template>
  <div :data-slot-group-id="slotGroupConfig.id">
    <MarkerSlot
      v-for="slotConfig in slotGroupConfig.markerSlots"
      :key="slotConfig.id"
      :slot-group-id="slotGroupConfig.id"
      :primary-label="primaryLabel"
      :secondary-label="secondaryLabel"
      :active-url="slotGroupConfig.assets.markerSlotActive.url"
      :inactive-url="slotGroupConfig.assets.markerSlotInactive.url"
      :slot-config="slotConfig"
      @activate="numActive += 1"
      @deactivate="numActive -= 1"
    />
  </div>
</template>

<style scoped lang="scss"></style>
