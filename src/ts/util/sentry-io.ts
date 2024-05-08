import * as Sentry from '@sentry/browser';
import * as SentryIntegrations from '@sentry/integrations';

import { GIT_VERSION_INFO } from '../builtin-config';

export function initSentry(sentryDSN: string) {
  Sentry.init({
    dsn: sentryDSN,
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),
    transportOptions: {},
    release: GIT_VERSION_INFO.tag ?? GIT_VERSION_INFO.hash ?? 'unknown',
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    integrations: [
      SentryIntegrations.captureConsoleIntegration({
        // array of methods that should be captured
        // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
        levels: ['error'],
      }),
    ],
  });
}
