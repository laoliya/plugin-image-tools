
import { getCacheKey } from './cache'
import { existsSync, readdirSync, readFileSync, statSync, writeFile } from 'fs'
export async function processImage(filePath: string) {
    console.log('filePath',readFileSync(filePath))
    const file = readFileSync(filePath) //获取文件内容
    
}