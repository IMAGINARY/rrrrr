import type { DeepReadonly } from 'ts-essentials';

import { strict as assert } from 'assert';
import { defineStore } from 'pinia';
import { computed, inject } from 'vue';

import type {
  ReadonlyConfig,
  I18nConfig,
  SlotGroupConfig,
  LayerConfig,
} from '../config/config-schema';

import { CONFIG_INJECTION_KEY } from '../builtin-config';
import { exhaustiveGuard } from '../util/type-helpers';

const getSlotGroupAssetUrls = (
  config: DeepReadonly<SlotGroupConfig>,
): string[] => {
  const assetUrls = new Array<string>();

  const mainSlotGroupAssetUrls = Object.values(config.assets).map(
    ({ url }) => url,
  );
  assetUrls.push(...mainSlotGroupAssetUrls);

  const { type } = config;
  switch (type) {
    case 'basic':
      // has no additional assets
      break;
    case 'action-card':
    case 'event-card': {
      const cardSlotAssetUrls = config.cards.map(({ url }) => url);
      assetUrls.push(...cardSlotAssetUrls);
      break;
    }
    default:
      return exhaustiveGuard(type);
  }

  return assetUrls;
};

const getLayerAssetUrl = (config: DeepReadonly<LayerConfig>): string[] => {
  if (config === 'modelVisualization') return new Array<string>();

  return [config.url];
};

const getAssetUrls = (config: ReadonlyConfig): string[] => {
  const slotGroupAssetUrls = config.interaction.slotGroups.flatMap(
    getSlotGroupAssetUrls,
  );
  const layerAssetUrls = config.layers.flatMap(getLayerAssetUrl);

  return [...slotGroupAssetUrls, ...layerAssetUrls];
};

const preloadAsset = async (url: URL) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onerror = () => {
      console.error(`Failed to load asset: ${url.href}`);
      reject();
    };
    img.onload = () => {
      resolve(img);
    };
    img.src = url.href;
  });
};

const preloadAssets = (urls: URL[]) => {
  Promise.all(urls.map(preloadAsset)).catch(() =>
    console.error('Some assets could not be loaded. See console for details.'),
  );
};

export const useConfigStore = defineStore('config', () => {
  const config = inject<ReadonlyConfig | null>(CONFIG_INJECTION_KEY, null);
  assert(config);

  const {
    general: { assetBaseDir },
  } = config;

  const assetBaseUrl = new URL(`${assetBaseDir}/`, window.location.href);

  const toAssetUrl = (path: string) => new URL(path, assetBaseUrl);

  const assetUrls = getAssetUrls(config).map(toAssetUrl);
  preloadAssets(assetUrls);

  const POSITIONAL_ASSET_REGEX =
    /_x([+-]?[0-9]+)_y([+-]?[0-9]+)\.[a-zA-Z0-9]+$/;
  const extractAssetPosition = (
    url: string | URL,
  ): { x: number; y: number } => {
    if (typeof url !== 'string') return extractAssetPosition(url.href);

    const matches = url.match(POSITIONAL_ASSET_REGEX);
    if (matches === null || matches.length !== 3) return { x: 0, y: 0 };

    const x = Number.parseInt(matches[1], 10);
    const y = Number.parseInt(matches[2], 10);

    return { x, y };
  };

  const translate = (i18nConfig: I18nConfig, languageCode: string) =>
    typeof i18nConfig[languageCode] === 'string'
      ? i18nConfig[languageCode]
      : '<undefined>';
  const getPrimary = (i18nConfig: I18nConfig) =>
    computed(() => translate(i18nConfig, config.general.primaryLanguage));
  const getSecondary = (i18nConfig: I18nConfig) =>
    computed(() => translate(i18nConfig, config.general.secondaryLanguage));

  return {
    config,
    assetBaseUrl,
    toAssetUrl,
    assetUrls,
    extractAssetPosition,
    getPrimary,
    getSecondary,
  };
});
