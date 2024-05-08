<script setup lang="ts">
import type { DeepReadonly, ElementOf } from 'ts-essentials';
import type { Ref } from 'vue';

import { strict as assert } from 'assert';
import { ref, watch } from 'vue';

import type {
  ActionCardSlotGroupConfig,
  CardConfig,
} from '../../ts/config/config-schema';
import type { ParameterTransformState } from '../../ts/stores/slot-groups';

import { useConfigStore } from '../../ts/stores/config';
import { useSlotGroupsStore } from '../../ts/stores/slot-groups';
import MarkerSlot from './MarkerSlot.vue';
import CardSlot from './CardSlot.vue';

interface CardAssigment {
  cardConfig: DeepReadonly<CardConfig>;
  state: ParameterTransformState;
}

interface ActionCardSlotAssignment {
  readonly slotConfig: DeepReadonly<
    ElementOf<ActionCardSlotGroupConfig['slots']>
  >;
  assignment: Ref<CardAssigment | null>;
  active: Ref<boolean>;
  timeout: ReturnType<typeof setTimeout> | null;
}

const props = defineProps<{
  slotGroupConfig: DeepReadonly<ActionCardSlotGroupConfig>;
}>();
const { slotGroupConfig } = props;

const configStore = useConfigStore();
const { actionCardDelayMs } = configStore.config.interaction;
const { getPrimary, getSecondary } = configStore;

const primaryLabel = getPrimary(slotGroupConfig.label);
const secondaryLabel = getSecondary(slotGroupConfig.label);

const { slotGroups } = useSlotGroupsStore();
const slotGroup = slotGroups.find(({ id }) => id === slotGroupConfig.id);
assert(typeof slotGroup !== 'undefined');

const slotsWithCard = slotGroupConfig.slots.map(
  (slotConfig): ActionCardSlotAssignment => ({
    slotConfig,
    assignment: ref<CardAssigment | null>(null),
    active: ref(false),
    timeout: null,
  }),
);

const availableCardAssignments = slotGroupConfig.cards.map((cardConfig) => {
  const state = slotGroup.parameterTransforms.find(
    (pt) => pt.id === cardConfig.parameterTransformId,
  );
  assert(typeof state !== 'undefined');
  return { cardConfig, state };
});

slotsWithCard.forEach((slotWithCard) => {
  watch(
    slotWithCard.active,
    (active) => {
      /* eslint-disable no-param-reassign */
      const { assignment } = slotWithCard;
      if (!active) {
        if (assignment.value !== null) {
          const assignmentValue = assignment.value;
          const { state } = assignmentValue;
          console.log(
            `Deactivating ${state.id} at action card slot ${slotWithCard.slotConfig.cardSlot.id}`,
          );
          assignmentValue.state.setActive(false);
          console.log(
            `Removing ${assignmentValue.state.id} from action card slot ${slotWithCard.slotConfig.cardSlot.id}`,
          );
          slotWithCard.assignment.value = null;
          availableCardAssignments.push(assignmentValue);
        }

        if (slotWithCard.timeout === null) {
          slotWithCard.timeout = setTimeout(() => {
            slotWithCard.timeout = null;
            const newAssignment = availableCardAssignments.shift();
            assert(typeof newAssignment !== 'undefined');
            console.log(
              `Assigning ${newAssignment.state.id} to action card slot ${slotWithCard.slotConfig.cardSlot.id}`,
            );
            assignment.value = newAssignment;
            assignment.value.state.setActive(slotWithCard.active.value);
          }, actionCardDelayMs);
        }
      } else if (assignment.value !== null) {
        const { state } = assignment.value;
        console.log(state);
        console.log(
          `Activating ${state.id} at action card slot ${slotWithCard.slotConfig.cardSlot.id}`,
        );
        state.setActive(true);
      }
    },
    { immediate: true },
  );
});
</script>

<template>
  <div :data-slot-group-id="slotGroupConfig.id">
    <CardSlot
      v-for="slotWithCard in slotsWithCard"
      :key="slotWithCard.slotConfig.cardSlot.id"
      :card-slot-config="slotWithCard.slotConfig.cardSlot"
      :card-config="slotWithCard.assignment.value?.cardConfig ?? null"
      :active="slotWithCard.assignment.value?.state?.active ?? false"
    />
    <MarkerSlot
      v-for="slotWithCard in slotsWithCard"
      :key="slotWithCard.slotConfig.markerSlot.id"
      :slot-group-id="slotGroupConfig.id"
      :primary-label="primaryLabel"
      :secondary-label="secondaryLabel"
      :active-url="slotGroupConfig.assets.markerSlotActive.url"
      :inactive-url="slotGroupConfig.assets.markerSlotInactive.url"
      :slot-config="slotWithCard.slotConfig.markerSlot"
      @activate="slotWithCard.active.value = true"
      @deactivate="slotWithCard.active.value = false"
    />
  </div>
</template>

<style scoped lang="scss"></style>
