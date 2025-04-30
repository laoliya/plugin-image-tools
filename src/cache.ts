import crypto from "crypto";
import type { PluginOptions } from "./types";
import { parse } from "path";
import { DEFAULT_CONFIG } from "./constants";
import { filterImage, replaceWebpExt } from "./utils";
const globalConfig: PluginOptions = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
const imgWebpMap: Record<string, string> = {};

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
    .createHash("md5")
    .update(content)
    .update(JSON.stringify(factor))
    .digest("hex");
  return `${name}_${hash.slice(0, 8)}.${type}`;
}

export function addImgWebpMap(name: string) {
  imgWebpMap[name] = replaceWebpExt(name);
}

export function getImgWebpMap() {
  return imgWebpMap
}

export function handleImgMap(bundle: any) {
  for (const key in bundle) {
    const chunk = bundle[key] as any;
    if (!filterImage(key)) {
      //不是图片的中止此次循环
      continue;
    }
   
    const { fileName } = chunk; //从chunk中那大文件名称

    const { base } = parse(fileName);
    addImgWebpMap(base);
  }
}

export function handleReplaceWebp(str: string) {
  
  const map = getImgWebpMap()
  let temp = str
  for (const key in map) {
    temp = temp.replace(new RegExp(key, 'g'), map[key]) //将xxx.jpg 替换为 .webp
  }
  return temp
}