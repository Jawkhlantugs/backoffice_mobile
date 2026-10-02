import { AppText, StateView, SummaryScreen } from '@/components'
import { useFooterContact } from '@/hooks/use-site-content'
import { messages } from '@/lib/messages'

import { InfoSection } from './info-section'

const text = messages.siteContent
const f = text.fields

/** Вэб дээр форм — энд уншина; засах нь вэб админаас. */
export function FooterContactScreen() {
  const query = useFooterContact()
  const contact = query.data

  return (
    <SummaryScreen
      title={text.contact.title}
      subtitle={text.contact.subtitle}
      onRefresh={() => query.refetch()}
    >
      <StateView
        loading={query.isPending}
        error={query.error}
        onRetry={() => void query.refetch()}
      >
        {contact ? (
          <>
            <InfoSection
              title={text.sections.contact}
              rows={[
                { label: f.phone, value: contact.phone },
                { label: f.mail, value: contact.mail },
                { label: f.locationMn, value: contact.locationMn },
                { label: f.locationEn, value: contact.locationEn },
              ]}
            />
            <InfoSection
              title={text.sections.social}
              rows={[
                { label: 'Facebook', value: contact.facebook },
                { label: 'Instagram', value: contact.instagram },
                { label: 'X / Twitter', value: contact.twitter },
                { label: 'YouTube', value: contact.youtube },
                { label: 'LinkedIn', value: contact.linkedIn },
                { label: 'Telegram', value: contact.telegram },
              ]}
            />
            <InfoSection
              title={text.sections.alert}
              rows={[
                { label: f.alertMn, value: contact.alertMn },
                { label: f.alertEn, value: contact.alertEn },
              ]}
            />
          </>
        ) : null}
        <AppText variant="caption">{text.webOnlyHint}</AppText>
      </StateView>
    </SummaryScreen>
  )
}
