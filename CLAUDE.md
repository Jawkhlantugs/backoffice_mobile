# xmeta-admin-mobile

X-Meta crypto exchange-ийн **админ ажилтнуудад** зориулсан mobile апп —
React Native (Expo SDK 57), expo-router, NativeWind, TanStack Query + Zustand.

Backend шинээр хийхгүй. Вэб админ (`xmeta-admin`) одоо дуудаж байгаа API-г л
ашиглана.

---

## Аль баримтыг хэзээ унших вэ

| Хэзээ                         | Файл                                                           |
| ----------------------------- | -------------------------------------------------------------- |
| **Код бичихийн өмнө бүрд**    | [docs/CLEAN_CODE_PROMPT.md](docs/CLEAN_CODE_PROMPT.md) — дүрэм |
| **"Энэ юу хаана байдаг вэ?"** | [docs/FLOWS.md](docs/FLOWS.md) — газрын зураг                  |
| Өнгө/зай/фонт нэмэх           | [docs/design-tokens.md](docs/design-tokens.md)                 |
| Ажлаа дуусгахад               | CLEAN_CODE_PROMPT §17 checklist + §18 Definition of Done       |
| **Ямар дэлгэц хийх вэ?**      | [docs/MOBILE_SCOPE_RESEARCH.md](docs/MOBILE_SCOPE_RESEARCH.md) — хамрах хүрээ |

## Гадаад эх сурвалж — API-н гэрээ

🔴 `/Users/developer/Desktop/project/x-meta/xmeta-admin/` (React вэб админ) бол
endpoint, талбарын нэр, статусын утгын **source of truth**. **Зөвхөн уншина,
нэг ч файлыг засахгүй.**

Model бичихээсээ өмнө `src/services/types/**`-ийн TS type болон түүнийг ашиглаж
буй `src/features/**` кодыг заавал унш. **Талбарын нэр, статусын утгыг
таамаглахгүй.**

🔴 `/Users/developer/Desktop/project/exchange_tether_mobile/` бол энэ аппын
архитектурын **Flutter загвар**. Давхаргын зохион байгуулалт, `Result`, `Money`,
envelope-ийн санаа түүнээс ирсэн. Мөн зөвхөн уншина.

---

## Хамгийн чухал 7 дүрэм

1. **§10 Мөнгө** — мөнгөний дүнд `number` хориотой. `Money` (bigint minor units)
   ашиглана. `parseMoney` нь string ба number хоёуланг задална.
2. **§2 Архитектур** — Screen → Hook → Repository → Service. Компонент дотор
   бизнес логик, HTTP, JSON байхгүй.
3. **§15 Design system** — өнгө, зай, радиус, фонт бүгд Tailwind token-оос
   (`bg-card`, `text-muted-foreground`, `rounded-lg`, `text-body`).
   Hex код, magic number хориотой.
4. **§19 Тайлбар** — тайлбар нь кодыг давтахгүй. Монголоор, ≤3 мөр. "Юуг"
   биш "яагаад"-ыг бичнэ. Архитектурын тайлбар кодод биш, FLOWS.md-д.
5. **Нэг файл = нэг компонент.** Файлын нэр kebab-case = дотор нь байгаа
   компонентын нэр.
6. **Гурвын дүрэм** — 3 дахь хэрэглэгч гартал `components/` руу зөөхгүй,
   2 дахь implementation гартал interface үүсгэхгүй.
7. **§1.7 Байхгүй API-г зохиохгүй.** Endpoint вэб админд олдохгүй бол товчийг
   харуулахгүй, эсвэл disable болгоод шалтгааныг бич. Хэрэглэгчид жагсаалтаар
   мэдэгд.

---

## Аюулгүй байдал — энэ бол мөнгө хөдөлгөдөг админ апп

1. **Cognito pool бол АДМИНЫ pool.** `exchange_tether_mobile` хэрэглэгчийн pool
   ашигладаг — түүнийг **бүү** хуул. Утгууд `.env.local`-оос (`env.ts`),
   кодод hardcode хийхгүй.
2. **Bearer token = `idToken`** (accessToken биш). Step-up MFA verify нь body
   дотор `accessToken`-ийг шаарддаг — хоёрыг бүү андуур.
   `cognito-auth-service.ts`-ийг хар.
3. **Биометрик түгжээ.** Background-аас 60 секундээс удаан буцаж ирвэл
   Face ID / хурууны хээ асууна (`use-app-lock.ts`).
4. **Хувийн мэдээллийг диск дээр хадгалахгүй.** Хэрэглэгчийн мэдээлэл, ticket,
   захиалга зөвхөн санах ойд (Zustand + Query cache, persister байхгүй).
   `AsyncStorage`-д зөвхөн хэл, биометрикийн туг, theme, жагсаалтын
   харагдац (карт/хүснэгт).
5. **Мөнгө хөдөлгөх, эрх өөрчлөх үйлдэл бүр:**
   - `ConfirmSheet` — юу хийх гэж байгаа, хэний, ямар дүн
   - Буцаах боломжгүй үйлдэлд шалтгааны талбар (`reason.required`)
   - `AppButton` нь Promise дуустал өөрөө түгжигдэнэ — давхар илгээлтээс хамгаална
   - Вэб админ `x-idempotency-key` явуулдаг газар mobile ч бас (`idempotency.ts`)
6. **401 ирэхэд** session цэвэрлээд login руу. Гэхдээ `/auth/login`,
   `/auth/mfa-challenge`, `/auth/action-mfa/verify`-д биш
   (`clients.ts`-ийн `AUTH_URL_SKIP_LOGOUT`).
7. **Эрхгүй админд цэс харагдахгүй.** Deep link-ээр орж ирсэн ч "Эрх байхгүй"
   (`screens/shell/route-guard.tsx`). Шинэ route-ийг `MOBILE_ROUTES`-д
   бүртгээгүй бол хаалттай — FLOWS §5.4 "Route guard".

---

## Хавтасны бүтэц

Давхаргаар ялгасан — feature-first **биш**:

```
src/
  app/          expo-router route + layout. Route файл нэг мөр re-export
  screens/      бүх дэлгэц + тухайн дэлгэцийн жижиг компонент
  screens/shell/  drawer (вэбийн sidebar) — дэлгэц биш, аппын бүрхүүл
  data/         repository + dto (домэйн тус бүр нэг хавтас)
  hooks/        useQuery / useMutation — дэлгэц ↔ repository
  core/         config/ network/ errors/ money/ session/ query/ navigation/
  components/   олон дэлгэцийн компонент + index.ts barrel
  services/     Cognito, биометрик, socket — гадаад ертөнц
  theme/        tokens.ts, global.css, use-theme.ts
  lib/          logger, date, cn, messages/ (UI текст)
```

- Дэлгэцийн жижиг компонент → `screens/<домэйн>/`-д дэлгэцийн хажууд. Хоёр
  дэлгэцэд ашиглагдвал `components/` руу (гурвын дүрэм).
- Route файл нь ганцхан мөр:
  `export { LeaveListScreen as default } from '@/screens/leave/leave-list-screen'`
- `_layout.tsx` нь навигацийн тохиргоо л агуулна — UI нь `screens/shell/`-д.
- Import бүгд `@/...` alias-аар — relative `../../` хориотой.
- Дэлгэц `@/components` barrel-ыг импортлоно.

⚠️ **`src/app/` дотор default export-гүй файл бүү тавь** — expo-router түүнийг
route болгож, түгжээ/эрхийн шалгалтыг тойрох зам нээгдэнэ.

---

## Команд

```bash
npm run typecheck && npm run lint && npm test
```

Design system gallery: `src/app/gallery.tsx` — компонент бүрийг хоёр theme
дээр нэг дор шалгана.

Навигаци: Drawer (вэбийн sidebar) → доод 4 таб (Нүүр · Цэс · Ажил · Профайл).
Дүрс нь `lucide-react-native` (вэбтэй ижил) — **зөвхөн цагаан/саарал**, статусын
өнгөгүй (`components/app-icon.tsx`). Өөр дүрсний сан нэмэхгүй.

Жагсаалт → `PagedListScreen` (хуудасгүй бол `QueryListScreen`) + `usePagedList`/`useCursorList`
+ `record={(item) => RecordView}` — карт ба хүснэгт (`DataTable`) хоёулаа үүнээс (FLOWS §5.5 "Хүснэгт").
Статистик/тохиргооны утга → `SummaryScreen`.
Форм → `FormScreen` + `FormSection` + `AppInput`/`ChoiceField`/`SelectField`/`ImageField`.
Мөнгө/эрхийн үйлдлийн товч → `RecordActions` (товч + ConfirmSheet + toast).
Liquid Glass нь `GlassSurface`-ээр л (design-tokens §3.2). Raw `Pressable`/`Switch`
бичихийн өмнө `AppButton`, `IconButton`, `TextButton`, `AppCard onPress`,
`AppSwitch`-ийг шалга.
Mutation-ы алдааг `query-client.ts`-ийн `MutationCache` нэг газраас toast-лоно.

---

## Баримтыг шинэчлэх

🔴 Convention өөрчлөгдвөл **тэр өөрчлөлт дотроо** баримтыг шинэчил. Хуучирсан
баримт нь баримтгүйгээс дор — Claude түүнийг үнэн гэж уншина.

- Шинэ урсгал / дэлгэц → `docs/FLOWS.md`
- Шинэ дүрэм → `docs/CLEAN_CODE_PROMPT.md` (§ дугаарыг **бүү** дахин дугаарла —
  кодын тайлбарууд `§10`, `§15` гэж зааж байгаа)
- Шинэ token → `docs/design-tokens.md`
