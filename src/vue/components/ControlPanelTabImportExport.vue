<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import yaml from 'js-yaml';

import type { Config } from '../../ts/config/config-schema';

import { useParameterTransformsStore } from '../../ts/stores/parameter-transforms';
import { useSlotGroupsStore } from '../../ts/stores/slot-groups';
import { useConfigStore } from '../../ts/stores/config';
import { useModelStore } from '../../ts/stores/model';
import { validateConfig } from '../../ts/config/config-schema';
import { ConfigLoader } from '../../ts/config/config-loader';

const { config } = useConfigStore();

const parameterTransformsStore = useParameterTransformsStore();
const { parameterTransforms } = parameterTransformsStore;
const { rebuildInternalSlotGroup } = useSlotGroupsStore();
const { initialParameters, transformedParametersExt } = useModelStore();

const OState = {
  SUCCESS: 0,
  UNPROCESSED: 1,
  UNKNOWN: 2,
  ERROR: 3,
} as const;
type State = (typeof OState)[keyof typeof OState];

const stateTooltips = {
  [OState.SUCCESS]: 'Successfully imported.',
  [OState.UNPROCESSED]: '',
  [OState.UNKNOWN]: 'Unknown import state. Please check the developer console.',
  [OState.ERROR]: 'Failed to import. Please check the developer console.',
} as const;

const parameterTransformsYamlText = ref('');
const parameterTransformImportState = ref<State>(OState.UNPROCESSED);
const initialParametersYamlText = ref('');
const initialParametersImportState = ref<State>(OState.UNPROCESSED);

function deriveConfig(partialConfigText: string): Config | null {
  try {
    const unvalidatedPartialConfig = (yaml.load(partialConfigText) ??
      {}) as object;
    const newConfig = ConfigLoader.merge(
      structuredClone(toRaw(config)),
      unvalidatedPartialConfig,
    );
    const validationResult = validateConfig(newConfig);

    if (!validationResult.ok) {
      /* eslint-disable no-console */
      const {
        error: { errors, explanation },
      } = validationResult;
      console.error('Invalid configuration:', newConfig);
      console.error(explanation);
      console.error(
        'Issues reported by the configuration validator:',
        ...(errors ?? []),
      );
      return null;
    }

    return validationResult.data;
  } catch (error) {
    console.error('Failed to parse YAML:', error);
    return null;
  }
}

function importInitialParameters() {
  const newConfig = deriveConfig(initialParametersYamlText.value);
  initialParametersImportState.value =
    newConfig === null ? OState.ERROR : OState.UNKNOWN;
  if (!newConfig) return;

  const {
    model: { initialParameters: validatedInitialParameters },
  } = newConfig;

  Object.assign(initialParameters, validatedInitialParameters);

  initialParametersImportState.value = OState.SUCCESS;
}

async function importParameterTransforms() {
  const newConfig = deriveConfig(parameterTransformsYamlText.value);
  parameterTransformImportState.value =
    newConfig === null ? OState.ERROR : OState.UNKNOWN;
  if (!newConfig) return;

  const { parameterTransforms: validatedParameterTransforms } = newConfig;

  const transformParametersPromise = new Promise((resolve) => {
    watch(transformedParametersExt, resolve, { deep: true, once: true });
  });

  parameterTransformsStore.replaceAll(validatedParameterTransforms);
  rebuildInternalSlotGroup();

  await transformParametersPromise;
  parameterTransformImportState.value = OState.SUCCESS;
}

function exportInitialParameters() {
  initialParametersImportState.value = OState.UNPROCESSED;
  const exportObj = {
    model: { initialParameters },
  };
  initialParametersYamlText.value = yaml.dump(exportObj);
  console.log(initialParametersYamlText.value);
}

function exportParameterTransforms() {
  parameterTransformImportState.value = OState.UNPROCESSED;
  const exportObj = {
    parameterTransforms: parameterTransforms.map(({ id, script }) => ({
      id,
      script,
    })),
  };
  parameterTransformsYamlText.value = yaml.dump(exportObj);
  console.log(parameterTransformsYamlText.value);
}
</script>

<template>
  Initial parameters:<br />
  <textarea
    name="initialParametersYamlText"
    v-model="initialParametersYamlText"
    rows="15"
    cols="80"
    :class="{
      success: initialParametersImportState === OState.SUCCESS,
      error: initialParametersImportState === OState.ERROR,
    }"
    :title="stateTooltips[initialParametersImportState]"
    @input="initialParametersImportState = OState.UNPROCESSED"
  ></textarea>
  <div>
    <input type="button" value="Import" @click="importInitialParameters()" />
    <input type="button" value="Export" @click="exportInitialParameters()" />
  </div>
  <br />
  Parameter transforms:<br />
  <textarea
    name="parameterTransformYamlText"
    v-model="parameterTransformsYamlText"
    rows="15"
    cols="80"
    :class="{
      success: parameterTransformImportState === OState.SUCCESS,
      unknown: parameterTransformImportState === OState.UNKNOWN,
      error: parameterTransformImportState === OState.ERROR,
    }"
    :title="stateTooltips[parameterTransformImportState]"
    @input="parameterTransformImportState = OState.UNPROCESSED"
  ></textarea>
  <div>
    <input type="button" value="Import" @click="importParameterTransforms()" />
    <input type="button" value="Export" @click="exportParameterTransforms()" />
  </div>
</template>

<style lang="scss" scoped>
.success {
  background-color: lightgreen;
}

.unknown {
  background-color: lightyellow;
}

.error {
  background-color: lightcoral;
}
</style>
