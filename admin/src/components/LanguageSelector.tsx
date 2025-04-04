import { Select } from '@mantine/core'
import { locales, defaultLocale } from '../i18n'
import { useTranslation } from '../hooks/useTranslation'

export const LanguageSelector = () => {
  const { i18n } = useTranslation()

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      i18n.activate(value)
    }
  }

  return (
    <Select
      data={Object.entries(locales).map(([code, label]) => ({
        value: code,
        label,
      }))}
      value={i18n.locale}
      onChange={handleLanguageChange}
      size="xs"
      style={{ width: 120 }}
    />
  )
} 