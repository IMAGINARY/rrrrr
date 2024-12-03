<script setup lang="ts">
import { strict as assert } from 'assert';
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ targetSize: { width: number; height: number } }>();
const emit = defineEmits<{
  resize: [scale: number];
}>();

const outerElement = ref<HTMLDivElement | null>(null);
const innerElement = ref<HTMLDivElement | null>(null);

const transformInfo = ref({ translateX: 0, translateY: 0, scale: 1 });

onMounted(() => {
  assert(outerElement.value !== null);
  const outerElementValue = outerElement.value;

  const handleResize = () => {
    const rect = outerElementValue.getBoundingClientRect();
    const scale = Math.min(
      rect.width / props.targetSize.width,
      rect.height / props.targetSize.height,
    );
    transformInfo.value = {
      translateX: rect.width / 2,
      translateY: rect.height / 2,
      scale,
    };
    emit('resize', scale);
  };
  const observer = new ResizeObserver(handleResize);
  observer.observe(outerElementValue);
  handleResize();
  onUnmounted(() => observer.disconnect());
});
</script>

<template>
  <div ref="outerElement" class="outer">
    <div
      ref="innerElement"
      class="inner"
      :style="{
        '--target-width': props.targetSize.width,
        '--target-height': props.targetSize.height,
        '--translate-x': transformInfo.translateX,
        '--translate-y': transformInfo.translateY,
        '--scale': transformInfo.scale,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.outer {
  position: relative;
  width: 100%;
  height: 100%;
}

.inner {
  position: absolute;
  top: 0;
  left: 0;
  width: calc(1px * var(--target-width));
  height: calc(1px * var(--target-height));
  transform-origin: top left;
  transform: translateX(calc(1px * var(--translate-x)))
    translateY(calc(1px * var(--translate-y))) scale(var(--scale))
    translate(-50%, -50%);
  overflow: hidden;
}
</style>
