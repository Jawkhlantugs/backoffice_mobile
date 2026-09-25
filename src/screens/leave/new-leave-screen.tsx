import { useState } from 'react'
import { useRouter } from 'expo-router'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import {
  AppButton,
  AppCard,
  AppHeader,
  AppInput,
  AppText,
  Screen,
  SegmentedControl,
} from '@/components'
import type {
  LeaveType,
  LeaveUnit,
} from '@/data/leave-request/leave-request-model'
import { useCreateLeaveRequest } from '@/hooks/use-leave-requests'
import { messages, translateUnknownError } from '@/lib/messages'

import { LeaveTypePicker } from './leave-type-picker'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

type FormErrors = { startDate?: string; endDate?: string; reason?: string }

/** Огноог сервер рүү илгээхийн өмнө шалгана — буруу форматыг backend авдаггүй. */
function validate(form: {
  startDate: string
  endDate: string
  reason: string
}): FormErrors {
  const errors: FormErrors = {}

  if (!DATE_PATTERN.test(form.startDate)) {
    errors.startDate = messages.leave.invalidDate
  }
  if (!DATE_PATTERN.test(form.endDate)) {
    errors.endDate = messages.leave.invalidDate
  } else if (form.endDate < form.startDate) {
    errors.endDate = messages.leave.endBeforeStart
  }
  if (form.reason.trim().length === 0) {
    errors.reason = messages.leave.reasonRequired
  }

  return errors
}

export function NewLeaveScreen() {
  const router = useRouter()
  const create = useCreateLeaveRequest()

  const [type, setType] = useState<LeaveType>('ANNUAL')
  const [unit, setUnit] = useState<LeaveUnit>('day')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  async function submit() {
    const found = validate({ startDate, endDate, reason })
    setErrors(found)
    if (Object.keys(found).length > 0) return

    await create.mutateAsync({
      type,
      unit,
      startDate,
      endDate,
      startTime: unit === 'hour' ? startTime : undefined,
      endTime: unit === 'hour' ? endTime : undefined,
      reason: reason.trim(),
    })
    router.back()
  }

  return (
    <Screen>
      <AppHeader
        title={messages.leave.newRequest}
        leading={{
          icon: 'back',
          label: messages.nav.back,
          onPress: () => router.back(),
        }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="gap-4 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <AppCard className="gap-4">
            <View className="gap-2">
              <AppText variant="label">{messages.leave.type}</AppText>
              <LeaveTypePicker value={type} onChange={setType} />
            </View>

            <View className="gap-2">
              <AppText variant="label">{messages.leave.unit}</AppText>
              <SegmentedControl<LeaveUnit>
                value={unit}
                onChange={setUnit}
                options={[
                  { value: 'day', label: messages.leave.byDay },
                  { value: 'hour', label: messages.leave.byHour },
                ]}
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <AppInput
                  label={messages.leave.startDate}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder={messages.leave.dateFormatHint}
                  error={errors.startDate}
                  autoCapitalize="none"
                />
              </View>
              <View className="flex-1">
                <AppInput
                  label={messages.leave.endDate}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder={messages.leave.dateFormatHint}
                  error={errors.endDate}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {unit === 'hour' ? (
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <AppInput
                    label={messages.leave.startTime}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="09:00"
                  />
                </View>
                <View className="flex-1">
                  <AppInput
                    label={messages.leave.endTime}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="18:00"
                  />
                </View>
              </View>
            ) : null}

            <AppInput
              label={messages.leave.reason}
              value={reason}
              onChangeText={setReason}
              placeholder={messages.leave.reasonPlaceholder}
              error={errors.reason}
              multiline
              maxLength={200}
            />
          </AppCard>

          {create.error ? (
            <AppText variant="body" className="text-center text-destructive">
              {translateUnknownError(create.error)}
            </AppText>
          ) : null}

          <View className="gap-2">
            <AppText variant="caption" className="text-center">
              {messages.leave.submitHint}
            </AppText>
            <AppButton
              label={messages.leave.submit}
              loading={create.isPending}
              onPress={submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}
