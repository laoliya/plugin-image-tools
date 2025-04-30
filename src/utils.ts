import { parse,extname } from "path";
import { IMG_FORMATS_ENUM } from "./constants";
import { getGlobalConfig } from "./cache";
export function filterImage(filePath: string) {
  const { ext } = parse(filePath);
  const format = ext.replace(".", "");
  const { include } = getGlobalConfig();
  if (!IMG_FORMATS_ENUM[format]) {
    return false;
  }

  return include.includes(format);
}

export function replaceWebpExt(url: string) {
  const [path, query] = url.split('?')
  const ext = extname(path)
  const newPath = url.replace(ext, '.webp') //将文件后缀名替换为.webp
  return query ? `${newPath}?${query}` : newPath   //拼接新名称
}
