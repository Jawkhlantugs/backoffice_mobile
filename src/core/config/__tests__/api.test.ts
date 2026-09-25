import { api, joinUrl } from '../api'

describe('joinUrl', () => {
  it('давхар зураасыг цэгцэлнэ', () => {
    expect(joinUrl('https://a.com/api/', '/users/list')).toBe(
      'https://a.com/api/users/list',
    )
  })

  it('бүтэн URL өгвөл хэвээр нь үлдээнэ', () => {
    expect(joinUrl('https://a.com', 'https://b.com/x')).toBe('https://b.com/x')
  })
})

describe('api registry', () => {
  it('service бүрийн prefix-ийг base дээр угсарна', () => {
    expect(api.finance).toBe(
      'https://api.example.com/api/backoffice/finance/v3/admin',
    )
    expect(api.support).toBe(
      'https://api.example.com/api/support/support-ticket/',
    )
  })

  it('bankV2 нь base биш ORIGIN дээр суурилна', () => {
    // base нь /api-аар төгсдөг ч bankV2 нь host-ийн үндсэн дээр сууна.
    expect(api.bankV2).toBe('https://api.example.com/v2/withdraw')
  })
})
