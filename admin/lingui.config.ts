import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
  locales: ['fr', 'en'],
  sourceLocale: 'fr',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'json',
  runtimeConfigModule: {
    i18n: ['@lingui/core', 'i18n'],
    Trans: ['@lingui/react', 'Trans'],
  },
}

export default config 