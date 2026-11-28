import type {Metadata} from 'next'
import {localizedAlternates, text} from '@/lib/locale'
import type {LocaleParams} from '@/lib/locale'
import PolicyPage from '@/components/PolicyPage'

export function generateMetadata({params: {locale}}: LocaleParams): Metadata {
  const t = text.bind(null, locale)
  return {
    title: t('使用条款 - 智效动力计算器', "Terms of Use | ProEngineerCalc"),
    description: t('智效动力计算器使用条款 - 专业工程师计算工具箱', "Terms of use for the ProEngineerCalc engineering calculator site."),
    alternates: localizedAlternates(locale, '/terms'),
  }
}

export default function Terms({params: {locale}}: LocaleParams) {
  const t = text.bind(null, locale)
  return (
    <PolicyPage locale={locale} title={t("使用条款", "Terms of Use")}>
      <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
        {t("最后更新：2026年3月14日", "Last updated March 14, 2026")}
      </p>

      <h2>{t("1. 条款接受", "1. Acceptance of Terms")}</h2>
      <p>{t("访问和使用智效动力计算器，即表示您同意并接受本协议的所有条款和规定。", "By accessing or using ProEngineerCalc, you accept these terms.")}</p>

      <h2>{t("2. 使用许可", "2. License")}</h2>
      <p>{t("本网站的许可是临时性的，仅供个人、非商业性浏览使用。这是对许可的授予，而非所有权的转移。", "The site grants temporary permission for personal, noncommercial browsing. Ownership of the site and its contents is retained by their respective owners.")}</p>

      <h2>{t("3. 免责声明", "3. Disclaimer")}</h2>
      <p>{t("本网站按\"原样\"提供，不提供任何明示或暗示的陈述或担保。智效动力计算器对本网站上的信息、材料及相关内容不作任何陈述或担保。", "This site is provided as is, without express or implied representations or warranties about its information, materials, or related content.")}</p>

      <h2>{t("4. 责任限制", "4. Limitation of Liability")}</h2>
      <p>{t("对于以下情况，智效动力计算器不承担任何责任：", "ProEngineerCalc is not liable for the following losses or damages.")}</p>
      <ul>
        <li>{t("任何间接、特殊或后果性的损失", "Indirect, special, or consequential loss")}</li>
        <li>{t("任何业务损失、收入损失、利润损失或预期储蓄损失", "Loss of business, revenue, profit, or anticipated savings")}</li>
        <li>{t("任何数据或数据库丢失", "Loss of data or databases")}</li>
        <li>{t("任何其他类型的损失或损害", "Other losses or damages")}</li>
      </ul>

      <h2>{t("5. 计算结果", "5. Calculation Results")}</h2>
      <p>{t("本网站提供的所有计算结果仅供参照之用。请勿将计算结果作为工程设计或施工的最终依据。如需进行实际工程项目，请咨询有执照的专业工程师。", "Use results for reference. Consult a licensed engineer for final engineering and construction decisions.")}</p>

      <h2>{t("6. 知识产权", "6. Intellectual Property")}</h2>
      <p>{t("本网站上的所有内容，包括计算器、公式和文档，均为智效动力计算器的知识产权，除非另有说明。", "Unless otherwise stated, the calculators, formulas, documentation, and other site content are the intellectual property of ProEngineerCalc.")}</p>

      <h2>{t("7. 第三方链接", "7. Third-Party Links")}</h2>
      <p>{t("本网站可能包含指向第三方网站的链接。我们不对这些网站的内容或隐私实践负责。", "The site may link to third-party websites. We are not responsible for their content or privacy practices.")}</p>

      <h2>{t("8. 条款变更", "8. Changes to These Terms")}</h2>
      <p>{t("我们可能不时更新这些条款。更新内容将发布在本页面。", "We may update these terms from time to time. Updates will appear on this page.")}</p>

      <h2>{t("9. 联系我们", "9. Contact Us")}</h2>
      <p>{t("如果您对使用条款有任何疑问，请与我们联系。", "Contact us with any questions about these terms.")}</p>
      <div className="disclaimer">
        <strong>{t("免责声明：", "Disclaimer")}</strong>{' '}{t("所有计算结果仅供参照之用。 请勿将计算结果作为工程设计或施工的最终依据。 如需进行实际工程项目，请咨询有执照的专业工程师。", "Use calculation results for reference. Consult a licensed engineer for final engineering and construction decisions.")}
      </div>
    </PolicyPage>
  )
}
