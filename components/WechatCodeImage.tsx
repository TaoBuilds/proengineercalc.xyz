export default function WechatCodeImage({source, alt}: {source: string; alt: string}) {
  return (
    <a className="wechat-code" href={source} target="_blank" rel="noopener noreferrer" aria-label={alt + '，查看大图'}>
      <img src={source} alt={alt} width="215" height="215" loading="lazy" />
    </a>
  )
}
