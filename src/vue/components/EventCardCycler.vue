<script setup lang="ts">
import type { DeepReadonly } from 'ts-essentials';

import { strict as assert } from 'assert';
import { reactive, watch } from 'vue';
import { useTimeoutFn } from '@vueuse/core';

import type {
  CardSlotConfig,
  CardConfig,
  EventCardSlotGroupConfig,
} from '../../ts/config/config-schema';

import { useConfigStore } from '../../ts/stores/config';
import { useSlotGroupsStore } from '../../ts/stores/slot-groups';
import CardSlot from './CardSlot.vue';

const props = defineProps<{
  slotGroupConfig: DeepReadonly<EventCardSlotGroupConfig>;
  enabled: boolean;
}>();

const {
  config: {
    interaction: {
      eventCardMinDelayMs,
      eventCardMaxDelayMs,
      eventCardMinDurationMs,
      eventCardMaxDurationMs,
    },
  },
} = useConfigStore();

const { slotGroups } = useSlotGroupsStore();
const slotGroup = slotGroups.find(({ id }) => id === props.slotGroupConfig.id);
assert(typeof slotGroup !== 'undefined');

const getRandomDelayMs = (minDelayMultiplier: number = 1) =>
  minDelayMultiplier * eventCardMinDelayMs +
  Math.random() * Math.abs(eventCardMaxDelayMs - eventCardMinDelayMs);
const getRandomDurationMs = () =>
  eventCardMinDurationMs +
  Math.random() * Math.abs(eventCardMaxDurationMs - eventCardMinDurationMs);

// TODO: Avoid csa parameter reassign
interface CardSlotAssignment {
  cardSlotConfig: DeepReadonly<CardSlotConfig>;
  cardConfig: DeepReadonly<CardConfig> | null;
  deactivateCard: () => void;
  stopFilling: () => void;
}

const cardSlotAssignments = reactive(
  props.slotGroupConfig.cardSlots.map(
    (csc): CardSlotAssignment => ({
      cardSlotConfig: csc,
      cardConfig: null,
      deactivateCard: () => {},
      stopFilling: () => {},
    }),
  ),
);

assert(cardSlotAssignments.length > 0);
assert(props.slotGroupConfig.cards.length > 0);
assert(cardSlotAssignments.length <= props.slotGroupConfig.cards.length);

const eventCardPriorityQueue = props.slotGroupConfig.cards.map((cardConfig) => {
  const parameterTransform = slotGroup.parameterTransforms.find(
    (pt) => pt.id === cardConfig.parameterTransformId,
  );
  assert(parameterTransform !== undefined);
  return { cardConfig, parameterTransform };
});
const getNextEventCard = () => {
  const nextEventCard = eventCardPriorityQueue.shift();
  assert(typeof nextEventCard !== 'undefined');
  eventCardPriorityQueue.push(nextEventCard);
  return nextEventCard;
};

const fillCardSlot = (csa: CardSlotAssignment) => {
  /* eslint-disable no-param-reassign */
  csa.deactivateCard();
  csa.stopFilling();
  const { cardConfig, parameterTransform } = getNextEventCard();
  // eslint-disable-next-line no-param-reassign
  csa.cardConfig = cardConfig;
  parameterTransform.active = true;
  const durationMs = getRandomDurationMs();
  const delayMs = getRandomDelayMs();
  csa.stopFilling();
  csa.stopFilling = useTimeoutFn(
    () => fillCardSlot(csa),
    durationMs + delayMs,
  ).stop;
  const stopCardDeactivation = useTimeoutFn(
    () => csa.deactivateCard(),
    durationMs,
  ).stop;
  csa.deactivateCard = () => {
    stopCardDeactivation();
    csa.cardConfig = null;
    parameterTransform.active = false;
    csa.deactivateCard = () => {};
  };
};

const activateCardSlotAssignments = () => {
  /* eslint-disable no-param-reassign */
  let delayMultiplier = 0;
  cardSlotAssignments.forEach((csa) => {
    if (csa.cardConfig === null) {
      const delayMs =
        delayMultiplier === 0 ? 0 : getRandomDelayMs(delayMultiplier);
      csa.stopFilling();
      csa.stopFilling = useTimeoutFn(() => fillCardSlot(csa), delayMs).stop;
      delayMultiplier += 1;
    }
  });
};

const deactivateCardSlotAssignments = () => {
  cardSlotAssignments.forEach((csa) => {
    csa.deactivateCard();
    csa.stopFilling();
  });
};

watch(
  () => props.enabled,
  (newEnabled, prevEnabled) => {
    if (newEnabled === prevEnabled) return;

    if (newEnabled) {
      activateCardSlotAssignments();
    } else {
      deactivateCardSlotAssignments();
    }
  },
  { immediate: true },
);
</script>

<template>
  <CardSlot
    v-for="csa in cardSlotAssignments"
    :key="csa.cardSlotConfig.id"
    :card-slot-config="csa.cardSlotConfig"
    :card-config="csa.cardConfig"
    :active="true"
  />
</template>
