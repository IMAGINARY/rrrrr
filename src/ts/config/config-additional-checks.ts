import type { DeepReadonly } from 'ts-essentials';

import type {
  Config,
  SlotGroupConfig,
  BasicSlotGroupConfig,
  ActionCardSlotGroupConfig,
  EventCardSlotGroupConfig,
} from './config-schema-types';

export class DuplicateIdError extends Error {}

function checkIdUniquenessInArray<T extends { id: string }>(
  array: DeepReadonly<T[]>,
  name: string,
) {
  const ids = new Set<string>();
  array.forEach(({ id }, index) => {
    if (ids.has(id))
      throw new DuplicateIdError(
        `Duplicate ${name} ID '${id}' at index ${index}`,
      );
    ids.add(id);
  });
}

function checkParameterTransformIdUniqueness(config: DeepReadonly<Config>) {
  checkIdUniquenessInArray(config.parameterTransforms, 'parameter transform');
}

function checkSlotGroupIdUniqueness(config: DeepReadonly<Config>) {
  checkIdUniquenessInArray(config.interaction.slotGroups, 'slot group');
}

function isBasicSlotGroupConfig(
  slotGroup: DeepReadonly<SlotGroupConfig>,
): slotGroup is DeepReadonly<BasicSlotGroupConfig> {
  return slotGroup.type === 'basic';
}

function isActionCardSlotGroupConfig(
  slotGroup: DeepReadonly<SlotGroupConfig>,
): slotGroup is DeepReadonly<ActionCardSlotGroupConfig> {
  return slotGroup.type === 'action-card';
}

function isEventCardSlotGroupConfig(
  slotGroup: DeepReadonly<SlotGroupConfig>,
): slotGroup is DeepReadonly<EventCardSlotGroupConfig> {
  return slotGroup.type === 'event-card';
}

function checkMarkerSlotIdUniqueness(config: DeepReadonly<Config>) {
  const slotGroupsConfig: DeepReadonly<SlotGroupConfig[]> =
    config.interaction.slotGroups;

  const basicSlotGroups: DeepReadonly<BasicSlotGroupConfig[]> =
    slotGroupsConfig.filter(isBasicSlotGroupConfig);
  const actionCardSlotGroups: DeepReadonly<ActionCardSlotGroupConfig[]> =
    slotGroupsConfig.filter(isActionCardSlotGroupConfig);
  const eventCardSlotGroups: DeepReadonly<EventCardSlotGroupConfig[]> =
    slotGroupsConfig.filter(isEventCardSlotGroupConfig);

  const markerSlotConfigs = [
    ...basicSlotGroups.flatMap(({ markerSlots }) => markerSlots),
    ...actionCardSlotGroups.flatMap(({ slots }) =>
      slots.map(({ markerSlot }) => markerSlot),
    ),
    ...eventCardSlotGroups.map(({ markerSlot }) => markerSlot),
  ];

  checkIdUniquenessInArray(markerSlotConfigs, 'marker slot');
}

function checkCardSlotIdUniqueness(config: DeepReadonly<Config>) {
  const slotGroupsConfig: DeepReadonly<SlotGroupConfig[]> =
    config.interaction.slotGroups;

  const actionCardSlotGroups: DeepReadonly<ActionCardSlotGroupConfig[]> =
    slotGroupsConfig.filter(isActionCardSlotGroupConfig);
  const eventCardSlotGroups: DeepReadonly<EventCardSlotGroupConfig[]> =
    slotGroupsConfig.filter(isEventCardSlotGroupConfig);

  const cardSlotConfigs = [
    ...actionCardSlotGroups.flatMap(({ slots }) =>
      slots.map(({ cardSlot }) => cardSlot),
    ),
    ...eventCardSlotGroups.flatMap(({ cardSlots }) => cardSlots),
  ];

  checkIdUniquenessInArray(cardSlotConfigs, 'card slot');
}

export function checkIdUniqueness(config: DeepReadonly<Config>) {
  checkParameterTransformIdUniqueness(config);
  checkSlotGroupIdUniqueness(config);
  checkMarkerSlotIdUniqueness(config);
  checkCardSlotIdUniqueness(config);
}
