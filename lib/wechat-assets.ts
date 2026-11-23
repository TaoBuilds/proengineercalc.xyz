import {existsSync} from 'node:fs'
import {join} from 'node:path'

const publicDirectory = join(process.cwd(), 'public')
const miniProgramImage = ['wechat-miniprogram.png', 'wechat-miniprogram.jpg']
  .find(name => existsSync(join(publicDirectory, name)))

export const miniProgramCodeSource = miniProgramImage ? '/' + miniProgramImage : null
