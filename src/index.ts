import type { Plugin, UserConfig, ViteDevServer } from "vite";
import type {PluginOptions} from './types'
import * as http from "node:http";
import path, { join, parse } from "path";
import { filterImage } from "./utils.ts";
import { getGlobalConfig, setGlobalConfig } from "./cache";
import { IMG_FORMATS_ENUM } from "./constants";
import { processImage } from './press'
export default function ImageTools(options:  Partial<PluginOptions> = {}): Plugin {
  setGlobalConfig(options);
  const { enableDevWebp } = getGlobalConfig();
  let isBuild = false;
  return {
    name: "vite-plugin-image-tools",
    config(config: UserConfig, env: { command: string }) {
      //config 获取vite配置项
      isBuild = env.command === "build"; //确定环境
      //   console.log(9999, config);
      //   console.log(10000, env);
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        (
          req: http.IncomingMessage,
          res: http.ServerResponse,
          next: Function
        ) => {
          // console.log("req", req.url);
          if (!filterImage(req.url || "")) {
            //如果不是图片类型的则直接返回
            return next();
          }
          // console.log("req.url",req.url);
          try {
            const filePath = decodeURIComponent(
              path.resolve(process.cwd(), req.url?.split("?")[0].slice(1) || "")
            ); //获取到绝对路径地址
            const { ext } = parse(filePath);
            const type = enableDevWebp
              ? IMG_FORMATS_ENUM.webp
              : ext.replace(".", "");
            processImage(filePath)
          } catch (error) {
            return next();
          }
        }
      );
    },
  };
}
