// ⚠️ NativeWind-ийн JSX interop LogBox-ийн `Pressable`-ийн функц style-ыг алддаг —
// dev анхааруулга цагаан дээр цагаан текст болно. Бүх react-native-ийг хасаж
// болохгүй: `FlatList contentContainerClassName` дотоод ScrollView-ийн interop-оор ажилладаг.
const LOGBOX = /node_modules[\\/]react-native[\\/]Libraries[\\/]LogBox[\\/]/

// RegExp биш функц: Metro transformer-ийг filename-гүй ачаалдаг.
const isLogBox = (filename) => Boolean(filename) && LOGBOX.test(filename)

module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    overrides: [
      { exclude: isLogBox, presets: ['nativewind/babel'] },
      {
        test: isLogBox,
        presets: [['babel-preset-expo', { jsxImportSource: 'react' }]],
      },
    ],
  }
}
