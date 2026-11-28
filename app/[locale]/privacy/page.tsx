import type {Metadata} from 'next'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'
import PolicyPage from '@/components/PolicyPage'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  const t = text.bind(null, locale)
  return {
    title: t('隐私政策 - 智效动力计算器', "Privacy Policy | ProEngineerCalc"),
    description: t('智效动力计算器隐私政策 - 专业工程师计算工具箱', "Privacy policy for the ProEngineerCalc engineering calculator site."),
    alternates: localizedAlternates(locale, '/privacy'),
  }
}

export default function Privacy({params: {locale}}: LocaleParams) {
  const t = text.bind(null, locale)
  return (
    <PolicyPage locale={locale} title={t("隐私政策", "Privacy Policy")}>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
        {t("最后更新：2026年3月14日", "Last updated March 14, 2026")}
      </p>

      <h2>{t("1. 我们收集的信息", "1. Information We Collect")}</h2>
      <p>{t("智效动力计算器是一个信息类网站。我们不会通过本网站收集您的个人信息。所有计算都在您的浏览器本地执行，不会传输到我们的服务器。", "ProEngineerCalc is an informational website. We do not collect your personal information through the website. All calculations run locally in your browser and their inputs are not sent to our servers.")}</p>

      <h2>{t("2. 本地存储", "2. Local Storage")}</h2>
      <p>{t("我们可能会使用本地存储来保存您的计算历史和偏好设置，以提供更好的用户体验。这些数据仅存储在您的设备上，不会传输给我们。", "We may use local storage to save calculation history and preferences. These data stay on your device.")}</p>

      <h2>{t('3. Cookie', '3. Cookies')}</h2>
      <p>{t("我们可能会使用必要的Cookie来改善您的浏览体验。您可以在浏览器设置中禁用Cookie。", "We may use essential cookies to improve your browsing experience. You can disable cookies in your browser settings.")}</p>

      <h2>{t("4. 第三方服务", "4. Third-Party Services")}</h2>
      <p>{t("我们使用以下第三方服务：", "We use the following third-party services.")}</p>
      <ul>
        <li><strong>{t('Vercel：', 'Vercel — ')}</strong>{' '}{t("用于托管和数据分析", "Hosting and analytics")}</li>
        <li><strong>{t('Google Analytics：', 'Google Analytics — ')}</strong>{' '}{t("用于网站流量分析（如已启用）", "Traffic analytics, where enabled")}</li>
        <li><strong>{t('Google AdSense：', 'Google AdSense — ')}</strong>{' '}{t("用于展示广告", "Advertising")}</li>
      </ul>

      <h2>{t("5. 儿童隐私", "5. Children's Privacy")}</h2>
      <p>{t("我们的网站不会故意收集13岁以下儿童的个人信息。", "We do not knowingly collect personal information from children under 13.")}</p>

      <h2>{t("6. 隐私政策变更", "6. Changes to This Policy")}</h2>
      <p>{t("我们可能会不时更新此隐私政策。更新内容将发布在本页面。", "We may update this policy from time to time. Updates will appear on this page.")}</p>

      <h2>{t("7. 联系我们", "7. Contact Us")}</h2>
      <p>{t("如果您对隐私政策有任何疑问，请与我们联系。", "Contact us with any questions about this privacy policy.")}</p>
      <div className="disclaimer">
        <strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参照之用。 请勿将计算结果作为工程设计或施工的最终依据。 如需进行实际工程项目，请咨询有执照的专业工程师。", "Use calculation results for reference. Consult a licensed engineer for final engineering and construction decisions.")}
      </div>
    </PolicyPage>
  )
}
