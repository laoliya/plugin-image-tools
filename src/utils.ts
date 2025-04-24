import { parse } from "path";
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
