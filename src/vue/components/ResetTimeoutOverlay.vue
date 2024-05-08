<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';

import { useConfigStore } from '../../ts/stores/config';
import { useModelStore } from '../../ts/stores/model';
import { compile } from '../../ts/util/record-condition';

const { config, getPrimary, getSecondary } = useConfigStore();
const { autoReset: autoResetConfig } = config.general;
const modelStore = useModelStore();

const remainingSeconds = ref(-1);

const resetCondition = compile(autoResetConfig.condition);

let unwatch = () => {};
let stopCountdown = () => {};

function watchModel() {
  unwatch = watch(modelStore.record, (record) => {
    if (resetCondition(record)) {
      unwatch();
      remainingSeconds.value = Math.round(autoResetConfig.timeoutSeconds);
      stopCountdown = useIntervalFn(() => {
        remainingSeconds.value -= 1;
        switch (remainingSeconds.value) {
          case 0:
            modelStore.reset();
            break;
          case -1:
            stopCountdown();
            watchModel();
            break;
          default:
            // do nothing
            break;
        }
      }).pause;
    }
  });
}

onMounted(watchModel);

onUnmounted(() => {
  unwatch();
  stopCountdown();
  remainingSeconds.value = -1;
});
</script>

<template>
  <div
    v-if="remainingSeconds > -1"
    class="reset-timeout-panel"
    :class="{
      'fade-in': remainingSeconds > 0,
      'fade-out': remainingSeconds <= 0,
    }"
  >
    <div class="title">
      <div class="primary-text">
        {{ getPrimary(autoResetConfig.title).value }}
      </div>
      <div class="secondary-text">
        {{ getSecondary(autoResetConfig.title).value }}
      </div>
    </div>
    <div class="countdown">{{ Math.max(0, remainingSeconds) }}</div>
    <div class="description">
      <div class="primary-text">
        {{ getPrimary(autoResetConfig.description).value }}
      </div>
      <div class="secondary-text">
        {{ getSecondary(autoResetConfig.description).value }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.fade-in {
  opacity: 1;
  animation: fadeIn 1s linear forwards;
}

.fade-out {
  opacity: 1;
  animation: fadeOut 1s linear forwards;
}

.reset-timeout-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fffc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
}

.title {
  font-size: 128px;
  text-align: center;
}

.description {
  font-size: 64px;
  text-align: center;
}

.countdown {
  font-size: 256px;
  text-align: center;
}
</style>
