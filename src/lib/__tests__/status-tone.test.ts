import { formatDuration } from '../date'
import { useLanguageStore } from '../messages'
import { statusTone } from '../status-tone'

describe('statusTone', () => {
  it('backend-ийн олон янзын үгийг өнгө болгоно', () => {
    expect(statusTone('FILLED')).toBe('success')
    expect(statusTone('completed')).toBe('success')
    expect(statusTone('PENDING')).toBe('warning')
    expect(statusTone('CANCELED')).toBe('danger')
    expect(statusTone('disabled')).toBe('danger')
    expect(statusTone('SOMETHING')).toBe('neutral')
    expect(statusTone(undefined)).toBe('neutral')
  })
})

describe('formatDuration', () => {
  afterEach(() => useLanguageStore.setState({ language: 'en' }))

  it('англиар (анхдагч)', () => {
    expect(formatDuration(45 * 60_000)).toBe('45m')
    expect(formatDuration((2 * 60 + 5) * 60_000)).toBe('2h 5m')
    expect(formatDuration(26 * 60 * 60_000)).toBe('1d 2h')
  })

  it('монголоор — өдөр, цаг, минутаар', () => {
    useLanguageStore.setState({ language: 'mn' })
    expect(formatDuration(45 * 60_000)).toBe('45м')
    expect(formatDuration((2 * 60 + 5) * 60_000)).toBe('2ц 5м')
    expect(formatDuration(26 * 60 * 60_000)).toBe('1ө 2ц')
  })
})
