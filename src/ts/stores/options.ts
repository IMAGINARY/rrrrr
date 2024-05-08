import type { DeepReadonly } from 'ts-essentials';

import { defineStore } from 'pinia';

import { NUM_POINTER_MARKERS } from '../builtin-config';

const searchParams = new URLSearchParams(window.location.search);

const useTuioMarkers = (searchParams.get('tuio') ?? 'true') === 'true';
const usePointerMarkers = (searchParams.get('pointer') ?? 'false') === 'true';

const numPointerMarkers = Number.parseInt(
  searchParams.get('numPointerMarkers') ?? `${NUM_POINTER_MARKERS}`,
  10,
);
const tuioUrl = searchParams.get('tuioUrl') ?? 'ws://localhost:3339';

const tuioReconnectionDelayMs =
  Number.parseInt(searchParams.get('tuioReconnectionDelay') ?? '10', 10) * 1000;

const autoStart = (searchParams.get('autoStart') ?? 'true') === 'true';

const developerMode = (searchParams.get('devMode') ?? 'false') === 'true';

const highlightDerivatives =
  (searchParams.get('highlightDerivatives') ?? 'true') === 'true';

const markerSlotLabels =
  (searchParams.get('markerSlotLabels') ?? 'true') === 'true';

const autoReset = (searchParams.get('autoReset') ?? 'true') === 'true';

export const sentryDsn = searchParams.get('sentryDsn');

export const useOptionStore = defineStore('options', () => {
  const result = {
    useTuioMarkers,
    usePointerMarkers,
    numPointerMarkers,
    tuioUrl,
    tuioReconnectionDelayMs,
    autoStart,
    developerMode,
    highlightDerivatives,
    markerSlotLabels,
    autoReset,
    sentryDsn,
  };

  return result as DeepReadonly<typeof result>;
});
