import { toComplianceCase } from '../compliance-case-dto'

describe('toComplianceCase', () => {
  it('танихгүй severity/status-ыг хамгийн хязгаарлагдмал утга руу буулгана', () => {
    const item = toComplianceCase({ severity: 'EXTREME', status: 'ARCHIVED' })
    expect(item.severity).toBe('LOW')
    expect(item.status).toBe('OPEN')
  })

  it('танихгүй resolution-ыг undefined болгоно', () => {
    expect(toComplianceCase({ resolution: 'MAYBE' }).resolution).toBeUndefined()
  })

  it('вэб админы бүтэн хариуг задална', () => {
    const item = toComplianceCase({
      uid: 'u-1',
      caseId: 'c-1',
      caseType: 'STRUCTURING',
      severity: 'HIGH',
      status: 'UNDER_REVIEW',
      assignedAnalyst: 'a@xmeta.mn',
    })

    expect(item).toMatchObject({
      uid: 'u-1',
      caseId: 'c-1',
      severity: 'HIGH',
      status: 'UNDER_REVIEW',
      assignedAnalyst: 'a@xmeta.mn',
    })
  })
})
