import crypto from 'crypto'
import type { PluginOptions } from "./types";
import { DEFAULT_CONFIG } from "./constants";
const globalConfig: PluginOptions = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

export function setGlobalConfig(config: Partial<PluginOptions>) {
  Object.assign(globalConfig, DEFAULT_CONFIG, config);
}

export function getGlobalConfig() {
  return globalConfig;
}

export function getCacheKey(
  { name, type, content }: any,
  factor: Record<string, any>
) {
  const hash = crypto
  .createHash('md5')
  .update(content)
  .update(JSON.stringify(factor))
  .digest('hex')
  return `${name}_${hash.slice(0, 8)}.${type}`
}
