import { AppErrors } from '@/core/errors/app-exception'
import { messages } from '@/lib/messages'

/** Сонгосон зураг — multipart upload-д хэрэгтэй гурван утга. */
export type PickedImage = { uri: string; name: string; mimeType: string }

/** Banner-ын зураг хэт том байвал upload удаан — чанарыг бага зэрэг бууруулна. */
const QUALITY = 0.85

/**
 * Native модулийг дарах үед л ачаална. Top-level import хийвэл хуучин build
 * дээр (модуль суугаагүй) banner-ын route файлууд бүхэлдээ унаж, дэлгэц
 * алга болдог — одоо зөвхөн зураг сонгох үйлдэл л алдаа өгнө.
 */
async function loadPicker() {
  try {
    return await import('expo-image-picker')
  } catch {
    throw AppErrors.api(
      0,
      'ExponentImagePicker native модуль алга — апп-ыг дахин build хий',
      {
        message: messages.form.imagePickerMissing,
      },
    )
  }
}

/**
 * Зургийн сангаас нэг зураг. Цуцалбал эсвэл эрх өгөөгүй бол `null`.
 * Камер ашиглахгүй — banner нь бэлэн зураг.
 */
export async function pickImage(): Promise<PickedImage | null> {
  const ImagePicker = await loadPicker()

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
  if (!permission.granted) return null

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: QUALITY,
  })
  const asset = result.canceled ? undefined : result.assets[0]
  if (!asset) return null

  const name = asset.fileName ?? `banner-${Date.now()}.jpg`
  return { uri: asset.uri, name, mimeType: asset.mimeType ?? 'image/jpeg' }
}
