import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {miniProgramName} from '@/lib/miniprogram-catalog'
import {text} from '@/lib/locale'
import type {Locale} from '@/lib/locale'
import CopyMiniProgramName from './CopyMiniProgramName'

const sourceDirectory = join(process.cwd(), 'public')
const miniCode = ['wechat-miniprogram.png', 'wechat-miniprogram.jpg'].find(file => existsSync(join(sourceDirectory, file)))

function CodeImage({source, alt, locale}: {source: string; alt: string; locale: Locale}) {
  return (
    <a className="wechat-code" href={source} target="_blank" rel="noopener noreferrer" aria-label={alt + text(locale, '，查看大图', ' — view full size')}>
      <img src={source} alt={alt} width="215" height="215" loading="lazy" />
    </a>
  )
}

export default function WechatEntries({locale}: {locale: Locale}) {
  return (
    <section className="wechat-entries" aria-label={text(locale, '微信入口', 'WeChat links')}>
      <article className="wechat-entry" id="mini-program">
        <div>
          <h2>{text(locale, '微信小程序', 'WeChat Mini Program')}</h2>
          <p className="wechat-entry-name" lang="zh-CN">{miniProgramName}</p>
          <p>{miniCode
            ? text(locale, '打开微信扫一扫，或在微信里搜索小程序名称。', 'Scan the code in WeChat or search for the name above.')
            : text(locale, '打开微信，搜索「智效动力计算器」，进入小程序使用完整工具箱。', 'Copy the Chinese name above and search for it in WeChat to open the full toolbox.')}</p>
          <CopyMiniProgramName />
        </div>
        {miniCode && <CodeImage source={'/' + miniCode} alt={text(locale, '智效动力计算器微信小程序码', 'Zhixiao calculator WeChat Mini Program code')} locale={locale} />}
      </article>
      <article className="wechat-entry" id="official-account">
        <div>
          <h2>{text(locale, '微信公众号', 'WeChat Official Account')}</h2>
          <p className="wechat-entry-name" lang="zh-CN">智效厂务</p>
          <p>{text(locale, '微信扫码关注，阅读厂务工程案例和节能技术文章。', 'Scan in WeChat to follow facilities engineering case studies and energy-saving articles in Chinese.')}</p>
        </div>
        <CodeImage source="/wechat-qr.jpg" alt={text(locale, '智效厂务微信公众号二维码', 'Zhixiao Facilities WeChat Official Account QR code')} locale={locale} />
      </article>
    </section>
  )
}
