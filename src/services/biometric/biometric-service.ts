import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Face ID / хурууны хээ. §1.3 — админ апп background-аас удаан буцаж ирвэл
 * түгжигдэнэ.
 *
 * `AsyncStorage`-д зөвхөн "асаалттай эсэх" тугийг л хадгална — хувийн
 * мэдээлэл биш (§1.4).
 */
const ENABLED_KEY = 'biometric.enabled'

export const biometricService = {
  /** Төхөөрөмж дэмждэг ба хэрэглэгч бүртгэсэн эсэх. */
  async isAvailable(): Promise<boolean> {
    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ])
    return hasHardware && isEnrolled
  },

  async isEnabled(): Promise<boolean> {
    return (await AsyncStorage.getItem(ENABLED_KEY)) === 'true'
  },

  async setEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(ENABLED_KEY, String(enabled))
  },

  /**
   * Түгжээг тайлуулна. `false` буцаах нь "оруулсангүй" гэсэн үг — дуудагч
   * дэлгэцийг түгжээтэй хэвээр үлдээнэ.
   */
  async authenticate(reason: string, cancelLabel: string): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      cancelLabel,
      // Нууц үгээр орох замыг нээлттэй үлдээнэ: биометрик таарахгүй болсон
      // админ аппаасаа бүрмөсөн түгжигдэх учиргүй.
      disableDeviceFallback: false,
    })
    return result.success
  },
}
