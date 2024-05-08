<script setup lang="ts">
import type { ElementOf } from 'ts-essentials';

import { strict as assert } from 'assert';
import { onMounted, ref } from 'vue';
import Sortable from 'sortablejs';

import type { Parameters } from '../../ts/circular-economy-model';

import { useModelStore } from '../../ts/stores/model';
import { useParameterTransformsStore } from '../../ts/stores/parameter-transforms';
import {
  type ParameterTransformState,
  useParameterTransformId,
  useSlotGroupsStore,
} from '../../ts/stores/slot-groups';

const { transformedParametersExt } = useModelStore();
const parameterTransformsStore = useParameterTransformsStore();
const { slotGroups, nonInternalSlotGroups, internalSlotGroup } =
  useSlotGroupsStore();

const newId = ref('');
const newScript = ref('');

function select({ id }: ParameterTransformState) {
  newId.value = id;
  newScript.value =
    parameterTransformsStore.parameterTransforms.find((pt) => pt.id === id)
      ?.script ?? '';
}

function addOrModify(id: string, script: string) {
  parameterTransformsStore.addOrModify(id, script);

  const internalIndex = internalSlotGroup.parameterTransforms.findIndex(
    (pt) => pt.id === id,
  );
  if (internalIndex === -1) {
    // The parameter transform is not yet in the internal slot group, so we add it
    const newParameterTransformState: ParameterTransformState =
      useParameterTransformId(id);
    internalSlotGroup.parameterTransforms.push(newParameterTransformState);
  }
}

function remove(id: string) {
  const usedNonInternally =
    nonInternalSlotGroups
      .flatMap(({ parameterTransforms }) => parameterTransforms)
      .findIndex((pt) => pt.id === id) !== -1;

  if (usedNonInternally) {
    const msg =
      'Cannot remove parameter transform that is still used in a non-internal slot group';
    // eslint-disable-next-line no-alert
    alert(msg);
    return;
  }

  const nextInternalIndex = () =>
    internalSlotGroup.parameterTransforms.findIndex((pt) => pt.id === id);

  for (
    let internalIndex = nextInternalIndex();
    internalIndex !== -1;
    internalIndex = nextInternalIndex()
  ) {
    internalSlotGroup.parameterTransforms.splice(internalIndex, 1);
  }
  parameterTransformsStore.remove(id);
}

function move(from: number, to: number) {
  parameterTransformsStore.move(from, to);
}

function deactivateAllInternal() {
  internalSlotGroup.parameterTransforms.forEach((pt) => {
    // eslint-disable-next-line no-param-reassign
    pt.active = false;
  });
}

const createTooltip = (
  slotGroup: ElementOf<typeof slotGroups>,
  parameterTransformState: ParameterTransformState,
): string => {
  const slotGroupIndex = slotGroups.findIndex((sg) => sg === slotGroup);
  assert(slotGroupIndex !== -1);
  const slotGroupTransformedParametersExt =
    transformedParametersExt[slotGroupIndex];

  const parameterTransformIndex = slotGroup.parameterTransforms.findIndex(
    (pts) => pts === parameterTransformState,
  );
  assert(parameterTransformIndex !== -1);

  const step = slotGroupTransformedParametersExt.steps[parameterTransformIndex];
  const { active, script, diff } = step;

  const pToS = (p: Partial<Parameters>) => JSON.stringify(p, null, 2);

  return active
    ? `Diff: ${pToS(diff)}\n\nScript:\n${script}`
    : `Script:\n${script}`;
};

const availableContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  assert(availableContainer.value);

  Sortable.create(availableContainer.value, {
    onEnd: (event) => {
      const { newDraggableIndex, oldDraggableIndex } = event;
      assert(typeof newDraggableIndex !== 'undefined');
      assert(typeof oldDraggableIndex !== 'undefined');
      move(oldDraggableIndex, newDraggableIndex);
    },
  });
});
</script>

<template>
  <div id="parameter-transforms" class="parameter-transforms">
    <div>
      Internal (applied first):
      <div ref="availableContainer" class="available">
        <div
          class="parameter-transform"
          v-for="pt in internalSlotGroup.parameterTransforms"
          :key="pt.uuid"
          :id="pt.uuid"
          :data-id="pt.id"
          :title="createTooltip(internalSlotGroup, pt)"
        >
          <label class="draggable">
            <input
              type="checkbox"
              :name="pt.id"
              :value="pt.id"
              v-model="pt.active"
            /><span class="draggable">{{ pt.id }}</span></label
          >
          <span class="edit" @click="select(pt)">✎</span>
        </div>
      </div>
      <br />
      <input
        type="button"
        value="Deactivate active internal transforms"
        @click="deactivateAllInternal()"
      />
    </div>
    <div>
      <div>
        Id:<br />
        <input
          type="text"
          v-model="newId"
          name="parameter-transform-id"
        /><br />
        Script:<br />
        <textarea
          v-model="newScript"
          rows="5"
          cols="10"
          name="parameter-transform-script"
        ></textarea
        ><br />
        <input
          type="button"
          value="Add/Modify"
          @click="addOrModify(newId, newScript)"
        />
        <input type="button" value="Delete" @click="remove(newId)" />
      </div>
      <div class="slot-group-transforms">
        <div
          v-for="slotGroup in nonInternalSlotGroups"
          :key="slotGroup.id"
          :data-id="slotGroup.id"
        >
          <br />
          Slot group '{{ slotGroup.id }}':
          <div class="available">
            <div
              v-for="pt in slotGroup.parameterTransforms"
              :key="pt.uuid"
              :data-id="pt.id"
              :title="createTooltip(slotGroup, pt)"
            >
              <label>
                <input
                  type="checkbox"
                  :name="pt.id"
                  :value="pt.id"
                  v-model="pt.active"
                  disabled
                />{{ pt.id }}</label
              >
              <span class="edit" @click="select(pt)">✎</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.parameter-transforms {
  display: flex;
  gap: 2em;

  & > *:first-child {
    flex-grow: 0;
  }

  & > *:last-child {
    flex-grow: 3;

    & input[type='text'],
    & textarea {
      width: 100%;
    }
  }

  & .available {
    overflow: scroll;
    max-height: 900px;

    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    min-width: 300px;
    max-width: 300px;
    min-height: 20px;
    border: solid 1px;

    & > div {
      outline: solid 1px;
      padding: 0.2ex;
      display: flex;
      flex-wrap: nowrap;

      & label {
        flex-grow: 1;
      }

      & label.draggable {
        cursor: grab;
      }

      & > * {
        white-space: nowrap;
      }

      & input[type='checkbox'],
      & .edit {
        margin-left: 0.5ex;
        margin-right: 0.5ex;
      }

      & input[type='checkbox']:not(:disabled),
      & .edit {
        cursor: pointer;
      }
    }
  }
}

.slot-group-transforms {
  height: 700px;
  overflow: scroll;
}
</style>
