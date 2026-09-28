/**
 * Тохиргоо зөвхөн эндээс. Кодод URL, pool ID hardcode хийхгүй (§1.1).
 *
 * Metro нь `process.env.EXPO_PUBLIC_*`-ийг build үед орлуулдаг тул түлхүүрийг
 * бүтнээр нь бичих ёстой — `process.env[name]` гэж динамикаар уншиж болохгүй.
 * Тиймээс доор гараар нэг бүрчлэн жагсаав.
 *
 * ⚠️ Эдгээр утга bundle дотор ил байна. Cognito pool/client ID нь нийтийн
 * танигч тул асуудалгүй, харин нууц түлхүүр энд хэзээ ч орохгүй.
 */
const raw = {
  cognitoUserPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
  cognitoClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID,
  awsRegion: process.env.EXPO_PUBLIC_AWS_REGION,
  xmetaApiUrl: process.env.EXPO_PUBLIC_XMETA_API_URL,
  backofficeApiUrl: process.env.EXPO_PUBLIC_BACKOFFICE_API_URL,
  supportWsUrl: process.env.EXPO_PUBLIC_SUPPORT_WS_URL,
}

/**
 * App Store review-ийн демо нэвтрэлт (FLOWS.md "Демо горим"). Заавал биш —
 * хоёулаа байхгүй бол демо горим бүрмөсөн унтарна. Bundle-д ил байна: энэ
 * нууц үг зөвхөн зохиомол өгөгдөл нээнэ, бодит API-д хүрэхгүй.
 */
const demoRaw = {
  email: process.env.EXPO_PUBLIC_DEMO_EMAIL,
  password: process.env.EXPO_PUBLIC_DEMO_PASSWORD,
}

/**
 * Дутуу тохиргоотой апп асахгүй байх нь дээр: 401 эсвэл "network error"
 * гэж будилахаас илүү, юу дутсаныг нэрээр нь хэлнэ.
 */
function required(key: keyof typeof raw): string {
  const value = raw[key]
  if (!value) {
    throw new Error(
      `Тохиргоо дутуу: EXPO_PUBLIC_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}. .env.local файлаа шалгана уу (.env.example-ийг хар).`,
    )
  }
  return value
}

export const env = {
  get cognitoUserPoolId() {
    return required('cognitoUserPoolId')
  },
  get cognitoClientId() {
    return required('cognitoClientId')
  },
  get awsRegion() {
    return required('awsRegion')
  },
  get xmetaApiUrl() {
    return required('xmetaApiUrl')
  },
  get backofficeApiUrl() {
    return required('backofficeApiUrl')
  },
  get supportWsUrl() {
    return required('supportWsUrl')
  },
  get demoLogin(): { email: string; password: string } | null {
    const { email, password } = demoRaw
    return email && password ? { email, password } : null
  },
}

/** Апп асахад дуудагдана — дутууг нэг дор илрүүлж, шалтгаанаа нэрлэнэ. */
export function assertEnvReady(): void {
  for (const key of Object.keys(raw) as (keyof typeof raw)[]) required(key)
}
