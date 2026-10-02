import { toAssetRecovery } from '../asset-recovery-dto'

describe('asset recovery dto', () => {
  it('дүнг мөрөөр нь asset-тай хадгална', () => {
    expect(
      toAssetRecovery({ bc_page_index: '7', amount: '0.0012', asset: 'BTC' })
        .amount,
    ).toEqual({ raw: '0.0012', currency: 'BTC' })
  })
})
