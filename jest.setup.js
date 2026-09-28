// Тест нь цэвэр логик (мөнгө, envelope) дээр төвлөрнө — эдгээр модуль нь
// зөвхөн native хамаарлаа татахын тулд импортлогддог тул mock хийнэ.
process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID = 'ap-southeast-1_test'
process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID = 'testclientid'
process.env.EXPO_PUBLIC_AWS_REGION = 'ap-southeast-1'
process.env.EXPO_PUBLIC_XMETA_API_URL = 'https://api.example.com/api'
process.env.EXPO_PUBLIC_BACKOFFICE_API_URL =
  'https://backoffice.example.com/api/v1'
process.env.EXPO_PUBLIC_SUPPORT_WS_URL = 'wss://ws.example.com/ws'
process.env.EXPO_PUBLIC_DEMO_EMAIL = 'review@example.com'
process.env.EXPO_PUBLIC_DEMO_PASSWORD = 'demo-pass'

// Хэлний тохиргоо AsyncStorage-д хадгалагддаг — тест дээр native модуль алга.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)
