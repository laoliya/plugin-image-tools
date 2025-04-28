import path, { join, parse } from "path";
import { DEFAULT_CONFIG, IMG_FORMATS_ENUM } from "./constants";
import { existsSync, readdirSync, readFileSync, statSync, writeFile } from "fs";
import { handleReplaceWebp, getCacheKey, getGlobalConfig } from "./cache";

export async function processImage(filePath: string) {
  const { enableDevWebp, quality, enableWebp, cacheDir, sharpConfig } =
    getGlobalConfig();
  const { ext, name } = parse(filePath);
  const type = enableDevWebp ? IMG_FORMATS_ENUM.webp : ext.replace(".", "");
  const file = readFileSync(filePath); //获取文件内容
  const cacheKey = getCacheKey(
    {
      name,
      type,
      content: file,
    },
    { quality, enableWebp, sharpConfig, enableDevWebp, type }
  );
  console.log('77888',cacheKey)
}
