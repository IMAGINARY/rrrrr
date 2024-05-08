import { strict as assert } from 'assert';
import yaml from 'js-yaml';
import deepmerge from 'deepmerge';

import type { SafeResult } from '../util/type-helpers';

import {
  validateConfig,
  type ReadonlyConfig,
  type ValidationIssue,
} from './config-schema';
import {
  checkIdUniqueness,
  DuplicateIdError,
} from './config-additional-checks';

function overwriteMerge<T>(destination: unknown, source: T): T {
  return source;
}

export class ConfigLoader {
  protected static async fetch(url: string | URL): Promise<object> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to load config file '${url.toString()}': ${response.statusText}`,
      );
    }

    const text = await response.text();
    const json = yaml.load(text, { schema: yaml.JSON_SCHEMA });
    if (typeof json !== 'object' || json === null)
      throw new Error(
        `Failed to parse config file '${url.toString()}': ${JSON.stringify(json)}`,
      );
    return json;
  }

  static merge(...segments: object[]): object {
    return deepmerge.all(segments, { arrayMerge: overwriteMerge });
  }

  static async safeLoad(...urls: URL[]): Promise<
    SafeResult<
      ReadonlyConfig,
      {
        config: { merged: object; segments: [URL, object][] };
        error: ValidationIssue | DuplicateIdError;
      }
    >
  > {
    const segments = await Promise.all(
      urls.map(
        async (url): Promise<[URL, object]> => [
          url,
          await ConfigLoader.fetch(url),
        ],
      ),
    );
    const merged = ConfigLoader.merge(
      ...segments.map(([_, jsonSegment]) => jsonSegment),
    );
    const validationResult = validateConfig(merged);
    if (!validationResult.ok)
      return {
        ok: false,
        error: { config: { merged, segments }, error: validationResult.error },
      };

    try {
      checkIdUniqueness(validationResult.data);
      return { ok: true, data: validationResult.data as ReadonlyConfig };
    } catch (error) {
      assert(error instanceof DuplicateIdError);
      return { ok: false, error: { config: { merged, segments }, error } };
    }
  }

  static async load(...urls: URL[]): Promise<ReadonlyConfig> {
    const loadResult = await ConfigLoader.safeLoad(...urls);
    if (!loadResult.ok)
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw loadResult.error;

    return loadResult.data;
  }
}
