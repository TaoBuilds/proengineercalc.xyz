export type Locale = 'zh-CN' | 'en'
export type Translator = (zh: string, en: string) => string

export const siteOrigin = 'https://www.proengineercalc.xyz'
export const defaultLocale: Locale = 'zh-CN'
export const locales: Locale[] = ['zh-CN', 'en']

export function isLocale(value: string): value is Locale {
  return value === 'zh-CN' || value === 'en'
}

export type LocaleParams = {params: {locale: Locale}}

export function text(locale: Locale, zh: string, en: string) {
  return locale === 'en' ? en : zh
}

export function localizedPath(locale: Locale, path: string) {
  if (locale === 'zh-CN') return path
  if (path === '/' || path.startsWith('/#') || path.startsWith('/?')) return '/en' + path.slice(1)
  return '/en' + path
}

export function stripLocale(path: string) {
  return path.replace(/^\/(en|zh-CN)(?=\/|$)/, '') || '/'
}

export function localizedAlternates(locale: Locale, path: string) {
  return {
    canonical: localizedPath(locale, path),
    languages: {'zh-CN': path, en: localizedPath('en', path), 'x-default': path},
  }
}
