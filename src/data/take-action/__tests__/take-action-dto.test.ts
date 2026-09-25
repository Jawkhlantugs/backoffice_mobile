import { toTakeAction, toUserTakeAction } from '../take-action-dto'

describe('toTakeAction', () => {
  it('танихгүй статусыг inactive болгоно', () => {
    expect(toTakeAction({ status: 'draft' }).status).toBe('inactive')
  })

  it('required нь string "true" эсвэл boolean байж болно', () => {
    expect(toTakeAction({ required: 'true' }).required).toBe(true)
    expect(toTakeAction({ required: true }).required).toBe(true)
    expect(toTakeAction({ required: 'false' }).required).toBe(false)
    expect(toTakeAction({}).required).toBe(false)
  })

  it('вэб админы бүтэн хариуг задална', () => {
    const action = toTakeAction({
      actionId: 'ta-1',
      title: 'Орлогын эх үүсвэр',
      status: 'active',
      type: 'EMAIL',
      required: 'true',
    })

    expect(action).toMatchObject({
      actionId: 'ta-1',
      title: 'Орлогын эх үүсвэр',
      status: 'active',
      type: 'EMAIL',
      required: true,
    })
  })
})

describe('toUserTakeAction', () => {
  it('танихгүй статусыг waiting болгоно', () => {
    expect(toUserTakeAction({ status: 'unknown' }).status).toBe('waiting')
  })

  it('sub_content-ийн snake_case талбаруудыг camelCase болгоно', () => {
    const response = toUserTakeAction({
      uid: 'u-1',
      takeActionId: 'ta-1',
      status: 'success',
      content: [
        {
          mainTitle: 'Хувийн мэдээлэл',
          mainDesc: '',
          sub_content: [
            { title: 'Утас', desc: '', sub_type: 'text', value: '99001122' },
          ],
        },
      ],
    })

    expect(response.content[0]?.subContent[0]).toMatchObject({
      title: 'Утас',
      subType: 'text',
      value: '99001122',
    })
  })

  it('content байхгүй бол хоосон массив буцаана', () => {
    expect(toUserTakeAction({ uid: 'u-2' }).content).toEqual([])
  })
})
