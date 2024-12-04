<script setup lang="ts">
import type { Ref } from 'vue';

import { computed } from 'vue';

import { useConfigStore } from '../../ts/stores/config';
import { useModelStore } from '../../ts/stores/model';
import { Scores } from '../../ts/scores';

const {
  config: { general },
  getPrimary,
  getSecondary,
} = useConfigStore();
const { scoreLabels } = general;

const modelStore = useModelStore();

interface ScoreInfo {
  id: string;
  score: Ref<number>;
  primaryLabel: Ref<string>;
  secondaryLabel: Ref<string>;
}

const scoreExtraProps = {
  circularity: {
    cssClasses: ['score', 'score-bottom-right'],
    boundaries: {
      min: { value: 0, string: '<0%' },
      max: { value: 1, string: '>100%' },
    },
  },
  coverage: {
    cssClasses: ['score', 'score-top-left'],
    boundaries: {
      min: { value: 0, string: '< 0%' },
      max: { value: 9.99999999999999, string: '> 999%' },
    },
  },
} as const;

type ScoreId = keyof typeof scoreExtraProps;
type BoundariesType = {
  min: { value: number; string: string };
  max: { value: number; string: string };
};

function createScoreInfo(id: ScoreId): ScoreInfo {
  return {
    id,
    score: computed(() => Scores[id](modelStore.record)),
    primaryLabel: getPrimary(scoreLabels[id]),
    secondaryLabel: getSecondary(scoreLabels[id]),
    cssClasses: scoreExtraProps[id].cssClasses,
    boundaries: scoreExtraProps[id].boundaries,
  };
}

const scores = Object.keys(scoreExtraProps).map(createScoreInfo);

const fractionDigits = 1;
const nanScoreText = `–.${''.padEnd(fractionDigits, '–')}`;
const format = (score: number, boundaries: BoundariesType) => {
  if (Number.isFinite(score)) {
    if (score < boundaries.min.value) return boundaries.min.string;
    if (score > boundaries.max.value) return boundaries.max.string;
    return `${(score * 100).toFixed(fractionDigits)}%`;
  }

  if (score === Number.POSITIVE_INFINITY) return `∞%`;

  if (score === Number.NEGATIVE_INFINITY) return `−∞%`;

  return `${nanScoreText}%`;
};
</script>

<template>
  <template
    v-for="{
      id,
      score,
      primaryLabel,
      secondaryLabel,
      cssClasses,
      boundaries,
    } in scores"
    :key="id"
  >
    <div :class="cssClasses">
      <div class="score-content">
        <div class="score-labels">
          <div class="primary-text">{{ primaryLabel.value }}</div>
          <div class="secondary-text">{{ secondaryLabel.value }}</div>
        </div>
        <div class="primary-text score-value" :data-raw-score="score.value">
          {{ format(score.value, boundaries) }}
        </div>
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.score {
  position: absolute;
  width: 990px;
  height: 990px;
  background-color: #e10984;
  border-radius: 50%;
  color: white;
  font-size: 30px;
}

.score-top-left {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%) rotate(135deg);
}

.score-bottom-right {
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%) rotate(-45deg);
}

.score-content {
  position: absolute;
  top: 143px;
  left: 452px;
  text-align: left;
  text-transform: uppercase;
}

.score-labels {
  font-size: 21pt;
}

.score-value {
  font-size: 43pt;
  line-height: 1.74;
  position: relative;
  left: -9px;
}
</style>
