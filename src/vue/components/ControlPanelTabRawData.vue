<script setup lang="ts">
import { computed } from 'vue';

import { useModelStore } from '../../ts/stores/model';
import { Model } from '../../ts/model';
import { Scores } from '../../ts/scores';

const props = defineProps({ disabled: Boolean });

const modelStore = useModelStore();

const scores = computed(() => Scores.all(modelStore.record));

const createFormatter = (digits: number) => {
  const multiplier = 10 ** digits;
  return (_: string, value: unknown): unknown =>
    typeof value === 'number'
      ? Math.round(value * multiplier) / multiplier
      : value;
};

const format2 = createFormatter(2);
const format3 = createFormatter(3);
</script>

<template>
  <template v-if="!props.disabled">
    <div class="container">
      <template v-for="elementId in Model.elementIds" :key="elementId">
        <div class="preformatted">
          {{
            `${elementId}: ${JSON.stringify(modelStore.record[elementId], format2, 2)}`
          }}
        </div>
      </template>
      <div class="preformatted">
        {{ `scores: ${JSON.stringify(scores, format3, 2)}` }}
      </div>
    </div>
  </template>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  margin-left: 0;
  width: 800px;
  height: 800px;
}

.preformatted {
  width: 30%;
  font-family: monospace;
  font-size: x-small;
  white-space: pre;
  margin-bottom: 3em;
}
</style>
