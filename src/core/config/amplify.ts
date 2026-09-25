// RN дээр Amplify-ийн шаарддаг polyfill — Amplify-г импортлохоос ӨМНӨ ачаалагдана.
import 'react-native-get-random-values'
import '@aws-amplify/react-native'

import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { defaultStorage } from 'aws-amplify/utils'

import { env } from './env'

/**
 * Cognito pool нь **АДМИНЫ** pool. Хэрэглэгчийн аппын pool-той андуурч
 * болохгүй — утгууд нь `.env.local`-оос ирнэ, кодод hardcode байхгүй (§1.1).
 *
 * Token хадгалалт: `defaultStorage` нь AsyncStorage. Token нь хувийн
 * мэдээлэл биш бөгөөд Amplify өөрөө хугацаа дуусахад нь цэвэрлэдэг; §1.4-ийн
 * "дискэнд хадгалахгүй" дүрэм нь хэрэглэгчийн мэдээлэл, ticket, захиалгад
 * хамаарна — тэдгээр зөвхөн санах ойд байна.
 */
export function configureAmplify(): void {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: env.cognitoUserPoolId,
        userPoolClientId: env.cognitoClientId,
        // Вэб админтай ижил (`xmeta-admin/src/lib/amplify.ts`) — имэйлээр
        // нэвтэрнэ.
        loginWith: { email: true },
      },
    },
  })

  cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage)
}
