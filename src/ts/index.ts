import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './side-effects';

import App from '../vue/components/App.vue';

import { ConfigLoader } from './config/config-loader';
import { documentReady } from './util/document-ready';
import { CONFIG_URLS, CONFIG_INJECTION_KEY } from './builtin-config';
import { DuplicateIdError } from './config/config-additional-checks';
import { initSentry } from './util/sentry-io';
import { sentryDsn } from './stores/options';

if (sentryDsn !== null) initSentry(sentryDsn);

// eslint-disable-next-line no-lone-blocks
{
  // This is for setting global Vue.js option that should actually be set by the bundler, but aren't.
  /* eslint-disable */
  // @ts-ignore
  globalThis.__VUE_OPTIONS_API__ = true;
  // @ts-ignore
  globalThis.__VUE_PROD_DEVTOOLS__ = true;
  // @ts-ignore
  globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;
}

type CircularEconomyApi = {
  app: InstanceType<typeof App>;
};

async function loadConfig() {
  const configLoaderResult = await ConfigLoader.safeLoad(...CONFIG_URLS);
  if (!configLoaderResult.ok) {
    const { config, error } = configLoaderResult.error;
    console.error('Invalid configuration:', config);
    if (error instanceof DuplicateIdError) {
      console.error(error.message);
    } else {
      const { errors, explanation } = error;
      console.error(explanation);
      console.error(
        'Issues reported by the configuration validator:',
        ...(errors ?? []),
      );
    }
    throw new Error('Error loading configuration. See console for details.');
  }
  return configLoaderResult.data;
}

async function init(): Promise<CircularEconomyApi> {
  const config = await loadConfig();
  console.log(config);

  const pinia = createPinia();

  const app = createApp(App);
  app.provide(CONFIG_INJECTION_KEY, config);
  app.use(pinia);
  const appComponent = app.mount(document.body) as InstanceType<typeof App>;

  const circularEconomyApi: CircularEconomyApi = {
    app: appComponent,
  };

  return circularEconomyApi;
}

declare global {
  interface Window {
    circularEconomy: Promise<CircularEconomyApi>;
  }
}

window.circularEconomy = documentReady().then(init);
