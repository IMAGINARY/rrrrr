import type { DeepReadonly } from 'ts-essentials';
import type { Ref } from 'vue';

import { strict as assert } from 'assert';
import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';
import { reactiveComputed } from '@vueuse/core';

import type { ParameterId, Parameters } from '../circular-economy-model';

import { CircularEconomyModel } from '../circular-economy-model';

import { useConfigStore } from './config';
import { useParameterTransformsStore } from './parameter-transforms';
import { useSlotGroupsStore } from './slot-groups';

export interface ParameterTransformStep {
  id: string | null;
  script: string | null;
  active: boolean;
  before: DeepReadonly<Parameters>;
  after: DeepReadonly<Parameters>;
  diff: Partial<DeepReadonly<Parameters>>;
}

export interface SlotGroupParameterTransformsState {
  id: string;
  steps: ParameterTransformStep[];
}

const useTransformedParameters = (initialParameters: Ref<Parameters>) => {
  const slotGroupsStore = useSlotGroupsStore();
  const parameterTransformStore = useParameterTransformsStore();

  const { slotGroups } = slotGroupsStore;
  const { parameterTransforms: transforms } = parameterTransformStore;

  const transformedParametersExt = reactiveComputed(
    (): SlotGroupParameterTransformsState[] => {
      let before = { ...initialParameters.value };
      const stepGroups = slotGroups.map(({ id: sId, parameterTransforms }) => {
        const steps = parameterTransforms.map(({ id: pId, active }) => {
          const transformObject = transforms.find((t) => t.id === pId);
          assert(transformObject, `No transform found for id ${pId}`);
          const { script, transform } = transformObject;

          const after = active ? transform({ ...before }) : { ...before };
          const diff = Object.fromEntries(
            (Object.entries(after) as Array<[ParameterId, number]>).filter(
              ([key, value]) => value !== before[key],
            ),
          );
          const result = { id: pId, script, active, before, after, diff };
          before = { ...after };
          return result;
        });
        return { id: sId, steps };
      });

      return stepGroups;
    },
  );

  const transformedParameters = reactiveComputed(() => {
    const lastWithDefault = <T>(a: Array<T>, defaultValue: T) =>
      a.length > 0 ? a[a.length - 1] : defaultValue;

    const lastStepResult = lastWithDefault(
      transformedParametersExt.map(({ steps }) =>
        lastWithDefault(
          steps.map(({ after }) => after),
          initialParameters.value,
        ),
      ),
      initialParameters.value,
    );

    return lastStepResult;
  });

  return { transformedParametersExt, transformedParameters };
};

export const useModelStore = defineStore('model', () => {
  const {
    config: { model: modelConfig },
  } = useConfigStore();

  const initialRecord = new CircularEconomyModel().evaluate(
    toRaw(modelConfig.initialStocks),
    toRaw(modelConfig.initialParameters),
    0,
  );
  console.log(initialRecord);

  const record = ref(structuredClone(initialRecord));

  const initialParameters = ref({ ...modelConfig.initialParameters });

  const { transformedParameters, transformedParametersExt } =
    useTransformedParameters(initialParameters);

  const reset = () => {
    record.value = structuredClone(initialRecord);
  };

  return {
    record,
    initialParameters,
    transformedParameters,
    transformedParametersExt,
    reset,
  };
});
