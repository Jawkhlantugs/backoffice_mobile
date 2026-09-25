import { tryParseMoney } from '@/core/money/money'

import type { TransferAsset } from './transfer-model'

type AssetDto = { asset?: string; free?: string | number }
type RelevantBalanceDto = { asset?: string; balance?: string | number }

/** `POST {finance}/operation-account/balance`-ийн `data`. */
export type OperationBalanceDto = {
  userAsset?: AssetDto[]
  relevantBalances?: RelevantBalanceDto[]
}

/**
 * Эерэг, `CURRENCIES`-д бүртгэлтэй хөрөнгө л. Танихгүй coin-ы нарийвчлалыг
 * таамаглаж мөнгө хөдөлгөхгүй (§10) — тийм coin-ыг вэбээр шилжүүлнэ.
 */
export function toTransferAsset(
  asset: string | undefined,
  raw: string | number | undefined,
): TransferAsset | null {
  if (!asset || raw === undefined) return null
  const available = tryParseMoney(raw, asset)
  if (!available || available.minorUnits <= 0n) return null
  return { asset: available.currency.code, available }
}

/** Вэбийн `mergeOperationCryptoAssets` — MNT-гүй, asset-аар давхардалгүй. */
export function operationCryptoAssets(
  dto: OperationBalanceDto | undefined,
): TransferAsset[] {
  const merged = new Map<string, TransferAsset>()
  for (const item of dto?.userAsset ?? []) {
    if (item.asset === 'MNT') continue
    const asset = toTransferAsset(item.asset, item.free)
    if (asset) merged.set(asset.asset, asset)
  }
  for (const item of dto?.relevantBalances ?? []) {
    if (item.asset === 'MNT') continue
    const asset = toTransferAsset(item.asset, item.balance)
    if (asset && !merged.has(asset.asset)) merged.set(asset.asset, asset)
  }
  return [...merged.values()]
}

export function operationMntAsset(
  dto: OperationBalanceDto | undefined,
): TransferAsset[] {
  const mnt = dto?.relevantBalances?.find((item) => item.asset === 'MNT')
  const asset = toTransferAsset('MNT', mnt?.balance)
  return asset ? [asset] : []
}

const POSITIVE_DECIMAL = /^\+?\d*\.?\d*[1-9]/

/**
 * Үлдэгдэлтэй мөртлөө `CURRENCIES`-д бүртгэлгүй coin-ууд — дэлгэц "вэбээр
 * шилжүүлнэ" гэж нэрлэж харуулна. Тоог `number` болгохгүй, зөвхөн тэмдэгт.
 */
export function unsupportedAssets(
  items: { asset?: string; raw?: string | number }[],
): string[] {
  const names = new Set<string>()
  for (const item of items) {
    if (!item.asset || item.asset === 'MNT' || item.raw === undefined) continue
    if (!POSITIVE_DECIMAL.test(String(item.raw).trim())) continue
    if (toTransferAsset(item.asset, item.raw) === null) names.add(item.asset)
  }
  return [...names]
}

export function operationUnsupportedAssets(
  dto: OperationBalanceDto | undefined,
): string[] {
  return unsupportedAssets([
    ...(dto?.userAsset ?? []).map((item) => ({
      asset: item.asset,
      raw: item.free,
    })),
    ...(dto?.relevantBalances ?? []).map((item) => ({
      asset: item.asset,
      raw: item.balance,
    })),
  ])
}
