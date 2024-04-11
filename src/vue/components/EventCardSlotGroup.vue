<script setup lang="ts">
import type { DeepReadonly } from 'ts-essentials';

import { strict as assert } from 'assert';
import { ref } from 'vue';

import type { EventCardSlotGroupConfig } from '../../ts/config/config-schema';

import { useSlotGroupsStore } from '../../ts/stores/slot-groups';
import MarkerSlot from './MarkerSlot.vue';
import EventCardCycler from './EventCardCycler.vue';

const props = defineProps<{
  slotGroupConfig: DeepReadonly<EventCardSlotGroupConfig>;
}>();
const { slotGroupConfig } = props;
const { markerSlot: markerSlotConfig } = slotGroupConfig;

const { slotGroups } = useSlotGroupsStore();
const slotGroup = slotGroups.find(({ id }) => id === slotGroupConfig.id);
assert(typeof slotGroup !== 'undefined');

const isMarkerSlotActive = ref(false);
</script>

<template>
  <div :data-slot-group-id="slotGroupConfig.id">
    <MarkerSlot
      :slot-group-id="slotGroupConfig.id"
      :slot-config="markerSlotConfig"
      @activate="isMarkerSlotActive = true"
      @deactivate="isMarkerSlotActive = false"
    />
    <EventCardCycler
      :slot-group-config="slotGroupConfig"
      :enabled="isMarkerSlotActive"
    />
  </div>
</template>

<style scoped lang="scss"></style>