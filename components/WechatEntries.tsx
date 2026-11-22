import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {miniProgramName} from '../lib/miniprogram-catalog'
import CopyMiniProgramName from './CopyMiniProgramName'

const sourceDirectory = join(process.cwd(), 'public')
const miniCode = ['wechat-miniprogram.png', 'wechat-miniprogram.jpg'].find(file => existsSync(join(sourceDirectory, file)))

function CodeImage({source, alt}: {source: string; alt: string}) {
  return (
    <a className="wechat-code" href={source} target="_blank" rel="noopener noreferrer" aria-label={alt + '，查看大图'}>
      <img src={source} alt={alt} width="215" height="215" loading="lazy" />
    </a>
  )
}

export default function WechatEntries() {
  return (
    <section className="wechat-entries" aria-label="微信入口">
      <article className="wechat-entry" id="mini-program">
        <div>
          <h2>微信小程序</h2>
          <p className="wechat-entry-name">{miniProgramName}</p>
          <p>{miniCode ? '打开微信扫一扫，或在微信里搜索小程序名称。' : '打开微信，搜索「智效动力计算器」，进入小程序使用完整工具箱。'}</p>
          <CopyMiniProgramName />
        </div>
        {miniCode && <CodeImage source={'/' + miniCode} alt="智效动力计算器微信小程序码" />}
      </article>
      <article className="wechat-entry" id="official-account">
        <div>
          <h2>微信公众号</h2>
          <p className="wechat-entry-name">智效厂务</p>
          <p>微信扫码关注，阅读厂务工程案例和节能技术文章。</p>
        </div>
        <CodeImage source="/wechat-qr.jpg" alt="智效厂务微信公众号二维码" />
      </article>
    </section>
  )
}
