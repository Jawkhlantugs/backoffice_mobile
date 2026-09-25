import { formatAmountSafe, formatMoney, moneyToApiNumber, moneyToApiString } from '../format'
import {
  addMoney,
  parseMoney,
  scaleMoney,
  subtractMoney,
  tryParseMoney,
} from '../money'

describe('parseMoney', () => {
  it('string болон number хоёуланг задална — backend хоёуланг буцаадаг', () => {
    expect(parseMoney('12.34', 'MNT').minorUnits).toBe(1234n)
    expect(parseMoney(12.34, 'MNT').minorUnits).toBe(1234n)
  })

  it('USDT-г 8 оронтойгоор барина', () => {
    // Хуулганы endpoint яг ийм дүн илгээдэг. 6 оронтой байсан бол
    // татгалзаж, түүх бүхэлдээ уншигдахгүй болно.
    expect(parseMoney('9.02962042', 'USDT').minorUnits).toBe(902962042n)
  })

  it('валютаас илүү орон ирвэл татгалзана — чимээгүй тайрахгүй', () => {
    expect(tryParseMoney('12.345', 'MNT')).toBeNull()
    expect(tryParseMoney('1.123456789', 'USDT')).toBeNull()
  })

  it('CURRENCIES-д байхгүй ticker дээр шидэхгүй, null буцаана', () => {
    expect(tryParseMoney('1', 'SOL')).toBeNull()
  })

  it('сөрөг дүн, дутуу бутархайг зөв уншина', () => {
    expect(parseMoney('-4', 'MNT').minorUnits).toBe(-400n)
    expect(parseMoney('0.5', 'MNT').minorUnits).toBe(50n)
  })

  it('тодорхойгүй бичиглэлийг татгалзана', () => {
    for (const bad of ['', '1,000', '1e5', 'abc', '1.2.3']) {
      expect(tryParseMoney(bad, 'MNT')).toBeNull()
    }
  })
})

describe('арифметик', () => {
  it('double-ийн хазайлтгүй нэмнэ', () => {
    // 0.1 + 0.2 нь double дээр 0.30000000000000004 болдог.
    const sum = addMoney(parseMoney('0.1', 'MNT'), parseMoney('0.2', 'MNT'))
    expect(formatMoney(sum)).toBe('0.30')
  })

  it('MAX_SAFE_INTEGER-ээс дээш USDT баланс барина', () => {
    // 90 сая USDT-ээс дээш нь number дээр нарийвчлалаа алддаг.
    const big = parseMoney('123456789.12345678', 'USDT')
    expect(big.minorUnits).toBe(12345678912345678n)
    expect(moneyToApiString(big)).toBe('123456789.12345678')
  })

  it('өөр валют холихыг татгалзана', () => {
    expect(() =>
      addMoney(parseMoney('1', 'MNT'), parseMoney('1', 'USDT')),
    ).toThrow(/MNT.*USDT|USDT.*MNT/)
  })

  it('хасалт сөрөг үлдэгдэл гаргана', () => {
    const left = subtractMoney(parseMoney('1', 'MNT'), parseMoney('3', 'MNT'))
    expect(formatMoney(left)).toBe('-2.00')
  })
})

describe('scaleMoney', () => {
  it('шимтгэлийг дээш, төлбөрийг доош бөөрөнхийлнө', () => {
    const amount = parseMoney('100.01', 'MNT') // 10001 minor
    expect(scaleMoney(amount, 25n, 10000n, 'up').minorUnits).toBe(26n)
    expect(scaleMoney(amount, 25n, 10000n, 'down').minorUnits).toBe(25n)
    expect(scaleMoney(amount, 25n, 10000n, 'halfUp').minorUnits).toBe(25n)
  })

  it('сөрөг дүнг тэгээс хол бөөрөнхийлнө', () => {
    const amount = parseMoney('-100.01', 'MNT')
    expect(scaleMoney(amount, 25n, 10000n, 'up').minorUnits).toBe(-26n)
  })
})

describe('formatMoney', () => {
  it('мянгатыг тусгаарлаж, тэмдгийг тавина', () => {
    expect(
      formatMoney(parseMoney('310557.20', 'MNT'), { withSymbol: true }),
    ).toBe('₮310,557.20')
  })

  it('тэмдэггүй валютын код ард бичигдэнэ', () => {
    expect(formatMoney(parseMoney('1.5', 'USDT'), { withSymbol: true })).toBe(
      '1.500000 USDT',
    )
  })

  it('харуулах орон багасахад ДООШ тайрна — илүү тоо харуулахгүй', () => {
    // 0.999999 нь 1.00 болж бөөрөнхийлөгдвөл ажилтан дансанд байхгүй
    // мөнгө харна.
    expect(
      formatMoney(parseMoney('0.99999999', 'USDT'), { fractionDigits: 2 }),
    ).toBe('0.99')
  })

  it('trimTrailingZeros нь эгнүүлэх шаардлагагүй газарт', () => {
    expect(
      formatMoney(parseMoney('1.50', 'MNT'), { trimTrailingZeros: true }),
    ).toBe('1.5')
  })

  it('сөрөг дүнд тэмдэг нь хасахын дараа', () => {
    expect(formatMoney(parseMoney('-12.34', 'MNT'), { withSymbol: true })).toBe(
      '-₮12.34',
    )
  })
})

describe('API руу явах хэлбэр', () => {
  it('string нь бүтэн нарийвчлалтай, тусгаарлагчгүй', () => {
    expect(moneyToApiString(parseMoney('1234.5', 'MNT'))).toBe('1234.50')
  })

  it('number хэлбэр нь илүүц тэггүй', () => {
    expect(moneyToApiNumber(parseMoney('1234.50', 'MNT'))).toBe(1234.5)
    expect(moneyToApiNumber(parseMoney('100', 'MNT'))).toBe(100)
  })
})

describe('formatAmountSafe', () => {
  it('бүртгэлтэй валют дээр formatMoney-той ижил гарна', () => {
    expect(formatAmountSafe('12.34', 'MNT')).toBe('12.34')
    expect(formatAmountSafe(100, 'USDT')).toBe('100')
  })

  it('CURRENCIES-д байхгүй ticker дээр шидэлгүй, түүхий дүнг харуулна', () => {
    expect(formatAmountSafe(1.23456789, 'SOL')).toBe('1.23456789 SOL')
    expect(formatAmountSafe('42', 'DOGE')).toBe('42 DOGE')
  })
})
