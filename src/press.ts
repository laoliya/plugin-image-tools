import path, { join, parse } from "path";
import { DEFAULT_CONFIG, IMG_FORMATS_ENUM } from "./constants";
import { existsSync, readdirSync, readFileSync, statSync, writeFile } from "fs";
import { handleReplaceWebp, getCacheKey, getGlobalConfig } from "./cache";
import sharp, { type FormatEnum } from 'sharp'
import { ImgFormatType, SharpOptionsType } from './types'

function checkJPGExt(type: string): ImgFormatType {
  const ext = type.includes('.') ? type.replace('.', '') : type
  return ext === IMG_FORMATS_ENUM.jpg || ext === IMG_FORMATS_ENUM.jpeg
    ? 'jpeg'
    : (ext as ImgFormatType)
}

export async function pressBufferToImage(
  buffer: Buffer,
  type: ImgFormatType,
  opt?: SharpOptionsType
) {
  const key = checkJPGExt(type) //
  const globalConfig = getGlobalConfig()
  const options = Object.assign({ quality: globalConfig.quality }, opt || {})
  const newBuffer = await sharp(buffer).toFormat(key, options).toBuffer() //使用sharp进行图片图片压缩、格式转换
  return newBuffer
}

export async function processImage(filePath: string) {
  const { enableDevWebp, quality, enableWebp, cacheDir, sharpConfig } =
    getGlobalConfig(); //获取配置
  const { ext, name } = parse(filePath); //读取文件信息
  const type = enableDevWebp ? IMG_FORMATS_ENUM.webp : (ext.replace('.', '') as ImgFormatType); //类型
  const file = readFileSync(filePath); //获取文件内容
  const cacheKey = getCacheKey(  //根据请求生成唯一hash
    {
      name,
      type,
      content: file,
    },
    { quality, enableWebp, sharpConfig, enableDevWebp, type }
  );
 
  const cachePath = join(cacheDir, cacheKey) //读取node_moudles中的路径
  // read cache
  if (existsSync(cachePath)) { //如果存在的话直接返回
    return readFileSync(cachePath)
  }

  const buffer = readFileSync(filePath)  //如果不存在
  const newBuffer = await pressBufferToImage(buffer, type, sharpConfig[type]) //拿到压缩转换后的图片
  if (!newBuffer) {
    return
  }
  writeFile(cachePath, newBuffer, (error) => {  //先写入到node_moudles
  })
  return newBuffer //返回文件
}
