import type { Plugin, UserConfig, ViteDevServer } from "vite";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import type { PluginOptions } from "./types";
import * as http from "node:http";
import path, { join, parse } from "path";
import { filterImage } from "./utils.ts";
import {
  getGlobalConfig,
  setGlobalConfig,
  handleImgMap,
  handleReplaceWebp,
} from "./cache";
import { IMG_FORMATS_ENUM } from "./constants";
import { processImage, handleImgBundle } from "./press";
export default function ImageTools(
  options: Partial<PluginOptions> = {}
): Plugin {
  setGlobalConfig(options);
  const { enableDevWebp, cacheDir, enableDev } = getGlobalConfig();
  let isBuild = false;
  const cachePath = path.resolve(process.cwd(), cacheDir);
  if (!existsSync(cachePath)) {
    //创建写入路径
    mkdirSync(cachePath, { recursive: true });
  }
  return {
    name: "vite-plugin-image-tools",
    config(config: UserConfig, env: { command: string }) {
      //config 获取vite配置项
      isBuild = env.command === "build"; //确定环境
    },
    configureServer(server: ViteDevServer) {
      //vite开发服务器触发
      if (!enableDev) return;
      server.middlewares.use(
        async (
          req: http.IncomingMessage,
          res: http.ServerResponse,
          next: Function
        ) => {
          if (!filterImage(req.url || "")) {
            //如果不是图片类型的则直接返回
            return next();
          }
          try {
            const filePath = decodeURIComponent(
              path.resolve(process.cwd(), req.url?.split("?")[0].slice(1) || "")
            ); //获取到绝对路径地址
            if (!filterImage(filePath)) {
              //如果不是图片类型的则直接返回
              return next();
            }
            const { ext } = parse(filePath);
            const type = enableDevWebp
              ? IMG_FORMATS_ENUM.webp
              : ext.replace(".", "");
            const buffer = await processImage(filePath); //读取文件
            if (!buffer) {
              next();
            }
            res.setHeader("Content-Type", `image/${type}`); //设置请求标头，返回图片
            res.end(buffer);
          } catch (error) {
            return next();
          }
        }
      );
    },
    async generateBundle(_options, bundle) {
      if (!isBuild) return;
      handleImgMap(bundle);
      await handleImgBundle(bundle);
    },
    async writeBundle(opt, bundle) {
      const { enableWebp } = getGlobalConfig();
      if (!enableWebp) {
        return;
      }
      for (const key in bundle) {
        const chunk = bundle[key] as any;
        if (/(html)$/.test(key)) {
          const htmlCode = handleReplaceWebp(chunk.source) //替换代码中的文件名
          writeFileSync(join(opt.dir!, chunk.fileName), htmlCode) //写入文件
        }
      }
    },
  };
}
