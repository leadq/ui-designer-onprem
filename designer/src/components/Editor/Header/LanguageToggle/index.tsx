import { Button } from '@root/components/common'
import { Tooltip as EditorTooltip } from '@root/components/common/Tooltip'
import { useBuilderI18n } from '@root/hooks/useBuilderI18n'

import styles from './styles.module.scss'

export const LanguageToggle = () => {
  const { language, setLanguage, translate } = useBuilderI18n()
  const nextLanguage = language === 'tr' ? 'en' : 'tr'

  const handleLanguageChange = () => {
    setLanguage(nextLanguage)
  }

  const handleLanguageChangeClick = handleLanguageChange

  return (
    <EditorTooltip label={translate('language.switch')}>
      <Button
        aria-label={translate('language.switch')}
        className={styles.languageToggle}
        size='sm'

        variant='ghost'
        onClick={handleLanguageChangeClick}
      >
        {language.toLocaleUpperCase('tr-TR')}
      </Button>
    </EditorTooltip>
  )
}
