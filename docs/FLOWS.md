# FLOWS.md — кодын газрын зураг

> Энэ файл нь **код хаана юу хийдгийг** харуулна. Дүрэм биш — дүрэм нь
> [CLEAN_CODE_PROMPT.md](CLEAN_CODE_PROMPT.md)-д.
>
> Зорилго: нэг үйлдлийг мөрдөхийн тулд 13 файл нээж хайх шаардлагагүй болгох.
>
> **Мөрийн дугаар зориуд бичээгүй** — хуучирдаг. Файл + функцийн нэрээр хай.

---

## 1. `src/` — юу хаана байна

| Хавтас        | Юу байна                                                   | Хэнийг мэддэг вэ          |
| ------------- | ---------------------------------------------------------- | ------------------------- |
| `app/`        | expo-router route + layout. Route файл нэг мөр re-export   | screens                |
| `screens/`    | бүх дэлгэц + тухайн дэлгэцийн жижиг компонент              | components, hooks, core   |
| `screens/shell/` | drawer (вэбийн sidebar) — дэлгэц биш, бүрхүүл           | components, hooks, core   |
| `data/`       | repository + dto хөрвүүлэг (домэйн тус бүр нэг хавтас)     | core/network              |
| `hooks/`      | `useQuery` / `useMutation` — дэлгэц ба repository-г холбоно | data, core                |
| `core/`       | config, network, money, errors, session, query, result     | бүгдийг                   |
| `components/` | олон дэлгэцэд хэрэглэгддэг компонент + barrel              | theme, lib                |
| `services/`   | Cognito, биометрик, socket — гадаад ертөнц                 | core/errors               |
| `theme/`      | token, global.css, useAppColors                            | юуг ч                     |
| `lib/`        | logger, date, cn, `messages/` = хэрэглэгчид харагдах текст | core/errors               |

---

## 2. Давхарга — хэн хэнийг дуудаж болох вэ

```
Screen  ──►  Hook (useQuery/useMutation)  ──►  Repository  ──►  Service  ──►  сүлжээ
   │                    │                          │
   └─ components        └─ model                   └─ dto  (JSON ↔ model)
```

🔴 **Дээш дуудлага байхгүй.** Repository нь hook-ыг мэдэхгүй, service нь
repository-г мэдэхгүй.
🔴 **Дэлгэц repository/service-ыг шууд дуудахгүй** — зөвхөн hook-оор.
🔴 **JSON зөвхөн repository-ийн dto хөрвүүлэгт.** Компонент дотор
`response.data.body.items` байхгүй.
🔴 **Хэрэглэгчид харагдах текст `lib/messages/`-д.** Hook нь `AppException` →
текст хөрвүүлэхдээ `translateError` ашиглана.

### GetX → RN зураглал (Flutter загвараас ирсэн ойлголтууд)

| Flutter (`exchange_tether_mobile`) | Энд                                                       |
| ---------------------------------- | --------------------------------------------------------- |
| GetX `Controller`                  | `useQuery` / `useMutation` hook + Zustand store           |
| `AppBindings` (session насны DI)   | `core/query/query-client.ts` + Zustand store-ууд          |
| `Dio` instance бүр                 | `core/network/clients.ts` — service бүрт нэг axios        |
| `ApiEnvelope`                      | `core/network/envelope.ts` — 4 хэлбэрийг нэгтгэнэ         |
| `Result<T>` sealed class           | `core/result.ts` — discriminated union                    |
| `AppException` sealed class        | `core/errors/app-exception.ts` — `kind`-аар ялгасан union |
| `Money` (int minor units)          | `core/money/money.ts` — **bigint** minor units            |
| `app_pages.dart` route             | `src/app/` файлын бүтэц (expo-router)                     |

---

## 3. Апп асах дараалал

| #   | Файл                                 | Юу болно                                                |
| --- | ------------------------------------ | ------------------------------------------------------- |
| 1   | `src/app/_layout.tsx` — `RootLayout` | `assertEnvReady()` — дутуу тохиргоотой бол улаан дэлгэц |
| 2   | ↑                                    | `configureAmplify()` — Cognito pool тохируулна          |
| 3   | ↑                                    | `cognitoAuth.isAuthenticated()` → нэвтрээгүй бол `signedOut` |
| 3a  | ↑                                    | `adminRepository.profile()` — **түгжээнээс өмнө** татна |
| 3b  | ↑                                    | `restore(profile, locked)` — профайл ба түгжээг нэг дор |
| 4   | `core/session/use-app-lock.ts`       | AppState сонсож эхэлнэ (60 сек дүрэм)                   |
| 5   | статус `locked`                      | `screens/lock-screen.tsx` — биометрик асууна            |
| 6   | статус `signedIn`                    | `<Stack />` — route-ууд ажиллана                        |
| 7   | `app/(drawer)/_layout.tsx`           | Drawer = вэбийн sidebar                                 |
| 8   | `app/(drawer)/(tabs)/_layout.tsx`    | Доод 4 таб                                              |

🔴 Статус `locked` эсвэл `signedOut` үед `<Stack />` **огт render хийгддэггүй**.
Тиймээс түгжээтэй үед ямар ч route хүрэхгүй — deep link ч мөн.

---

## 4. Урсгалууд

### 4.1 API дуудлага (ерөнхий хэв маяг)

| Алхам | Файл                      | Юу болно                                               |
| ----- | ------------------------- | ------------------------------------------------------ |
| 1     | `core/network/clients.ts` | `clients.finance` — base URL бүхий axios               |
| 2     | request interceptor       | `Authorization: Bearer <idToken>` тавина               |
| 3     | сервер                    |                                                        |
| 4     | response interceptor      | 401 → `sessionActions.signOut()` (skip list-ээс бусад) |
| 5     | ↑                         | алдааг `toAppException()`-оор `AppException` болгоно   |
| 6     | repository                | `unwrap()` / `unwrapList()` — дугтуй задлана           |
| 7     | hook                      | `useQuery` — cache, retry, loading/error төлөв         |
| 8     | дэлгэц                    | `<StateView>` — loading / empty / error                |
| 9     | татаж шинэчлэх            | `usePullRefresh()` — `isRefetching`-ийг шууд холбохгүй |

🔴 Нэг query key-г хэд хэдэн дэлгэц хуваалцдаг (Нүүр ба Ажил таб хоёулаа
`PENDING` жагсаалтыг уншина). `refreshing={query.isRefetching}` гэвэл нөгөө
дэлгэц дээр татахад энэ дэлгэцийн `UIRefreshControl` далд байхдаа асч,
iOS `offscreen beginRefreshing` гэж хаяна. `usePullRefresh()` нь тухайн
дэлгэц дээр **өөрөө эхлүүлсэн** татах үйлдлийг л тоолно.

### 4.2 Нэвтрэлт (Үе шат 1-д хийгдэнэ)

`cognito-auth-service.ts`-ийн `SignInStep` union нь Cognito-ийн бүх салааг
илэрхийлнэ:

| `step`        | Дараагийн дэлгэц                  |
| ------------- | --------------------------------- |
| `totpCode`    | 6 оронтой код                     |
| `newPassword` | Шинэ нууц үг                      |
| `totpSetup`   | `setupUri`-г QR болгож харуулах   |
| `done`        | `/auth/info` → `AdminUser` → Home |

### 4.3 Биометрик түгжээ

| Алхам | Файл                               | Тэмдэглэл                                      |
| ----- | ---------------------------------- | ---------------------------------------------- |
| 1     | `hooks/use-biometric-lock.ts`      | Профайл дээрх унтраалга — асаахын өмнө нэг удаа баталгаажуулна |
| 2     | `use-app-lock.ts` — `useAppLock()` | AppState `background` үед цагийг тэмдэглэнэ    |
| 3     | ↑ `active` болоход                 | 60 сек+ **ба** унтраалга асаалттай бол `lock()`, эс бөгөөс token refresh |
| 4     | `screens/lock-screen.tsx`          | Гарангуут өөрөө `tryUnlock()` дуудна           |
| 5     | `tryUnlock()`                      | Биометрик унтраалттай/боломжгүй бол шууд нээнэ |

🔴 **Түгжээ нь `user` ачаалагдсаны дараа л утгатай.** `unlock()` нь `user`
хоосон үед юу ч хийдэггүй тул session сэргээхдээ профайлыг **эхлээд** татна
(§3 алхам 3a). Эс бөгөөс "Апп түгжигдсэн" дэлгэц дээр мөнхөд гацна.

🔴 **Биометрик анхдагчаар унтраалттай.** `biometric.enabled` туг нь зөвхөн
Профайл дээрх унтраалгаар асдаг — асаагаагүй админ огт түгжигдэхгүй.

⚠️ `disableDeviceFallback: false` — биометрик таарахгүй болсон админ нууц
үгээрээ орно. Аппаасаа бүрмөсөн түгжигдэх эрсдэлээс сэргийлсэн.

### 4.4 Навигаци — drawer + tab

```
app/_layout.tsx                 session gate (Stack)
└── app/(drawer)/_layout.tsx    Drawer  ← screens/shell/drawer-content.tsx
    └── (tabs)/_layout.tsx      Нүүр · Цэс · Ажил · Профайл
        ├── index.tsx           screens/home/home-screen.tsx
        ├── menu.tsx            screens/menu/menu-screen.tsx
        ├── leave.tsx           screens/leave/leave-list-screen.tsx
        └── profile.tsx         screens/profile/profile-screen.tsx
app/leave/new.tsx · app/leave/[id].tsx   таб дээр биш, Stack дээр нээгдэнэ
```

| Юу                | Хаана                                    |
| ----------------- | ---------------------------------------- |
| Таб bar           | `components/app-tab-bar.tsx` (`TAB_ITEMS`) |
| Drawer агуулга    | `screens/shell/drawer-content.tsx`       |
| Цэс товч (толгой) | `core/navigation/use-drawer-toggle.ts`   |
| Дэлгэцийн толгой  | `components/app-header.tsx`              |

- 🔴 **Таб bar ба layout хоёулаа `TAB_ITEMS`-ээс уншина** — route-ийн нэр
  хоёр газар бичигдэхгүй.
- `useDrawerToggle()` нь Drawer доор биш дэлгэцээс `null` буцаана. Тиймээс
  `/leave/new` дээр цэс товч огт харагдахгүй, оронд нь буцах товч.

### 4.5 Мөнгө харуулах

```
API (string эсвэл number)
  → parseMoney(raw, 'USDT')      core/money/money.ts    bigint minor units
  → formatMoney(money, {...})    core/money/format.ts   дэлгэцийн бичиг
```

Сүлжээнд буцаах: `moneyToApiString()` (бүтэн нарийвчлал) эсвэл
`moneyToApiNumber()` (endpoint тоо шаардвал).

---

## 5. Backend-ийн жигд бус байдал

### 5.1 Хариуны 4 хэлбэр

| Хэлбэр                    | Хаана                                              |
| ------------------------- | -------------------------------------------------- |
| `{ message, body }`       | backoffice (`BaseResponse<T>`)                     |
| `{ code, message, data }` | finance action-ууд (retry, crypto-withdraw action) |
| `{ msg, data }`           | futures transfer, ws token                         |
| дугтуйгүй                 | зарим GET                                          |

`unwrap()` бүгдийг нэг болгоно. 🔴 `code` байгаад 0 биш бол **HTTP 200 байсан ч
алдаа** — вэб админ яг ийм шалгалт хийдэг.

### 5.2 Жагсаалт

`body.items` · `body.list` · `data.list` · шууд массив — дөрвүүлээ
тааралддаг. `unwrapList()` бүгдийг `ListPage<T>` болгоно.

### 5.3 Pagination хоёр янз

| Төрөл  | Талбар                                        | Хаана                                             |
| ------ | --------------------------------------------- | ------------------------------------------------- |
| Offset | `page` + `pageSize` / `limit`, хариуд `total` | backoffice жагсаалтууд                            |
| Cursor | `limit` + `lastEvaluatedKey`                  | DynamoDB (futures transfer, support conversation) |

Жагсаалт бүрт аль нь болохыг **вэб админы TS type-аас** харна.
`useInfiniteQuery`-ийн `getNextPageParam` тэр дагуу бичигдэнэ.

---

## 5.4 Эрхийн шалгалт

`GET {backoffice}/admin/admin-menus/my` нь тухайн админд зөвшөөрөгдсөн цэсийг
буцаана: `body.menus[]` (`name`, `path`, `team`, `groupId`, `order`,
`children`) ба `body.groups[]`. Вэб админы sidebar яг үүнийг уншдаг.

| Алхам | Файл                             | Юу болно                                  |
| ----- | -------------------------------- | ----------------------------------------- |
| 1     | `data/auth/admin-repository.ts`  | нэвтрэх үед татна                         |
| 2     | `data/auth/admin-menu-dto.ts`    | `toMenuTree()` — массив ба `{menus,groups}` хоёуланг барина |
| 3     | `session-store`                  | `AdminUser.menu` (санах ойд)              |
| 4     | `core/navigation/menu-view.ts`   | `buildMenu()` — баг → бүлэг → мөр (вэбийн дараалал) |
| 5     | `core/navigation/menu-items.ts`  | `MOBILE_ROUTES` — вэбийн `path` → mobile route |
| 6     | `core/navigation/menu-icons.ts`  | вэбийн lucide дүрсний нэр → mobile дүрс, өнгө |
| 7     | `hooks/use-admin-menu.ts`        | drawer ба Цэс таб хоёрын нэг эх сурвалж |

- 🔴 **Баг дөрвүүлээ үргэлж жагсана** (`TEAMS` тогтмол), вэб яг ийм.
  `/admin/admin-menus/my`-аас цэс ирээгүй баг нь нуугдахгүй, "Эрх байхгүй"
  гэж харагдана (`countByTeam`). Цэсний өгөгдлөөс баг гаргаж авбал эрхгүй
  ажилтанд 4-ийн оронд 1-2 баг харагдаж, вэбтэй зөрнө.
- Идэвхтэй баг нь `core/navigation/team-store.ts`-д (санах ойд) — drawer ба
  Цэс таб хоёулаа ижил багийг харна. Сонгоогүй үед **цэстэй эхний баг**
  нээгдэнэ.
- Баг сонгогч нь `screens/shell/team-switcher.tsx` — вэбийн
  `components/layout/team-switcher.tsx`-ийн mobile хувилбар.
- Mobile-д хийгдээгүй мөр **нуугдахгүй**, идэвхгүй болж "Вэб дээр" шошготой
  харагдана — ажилтан вэбтэй ижил жагсаалт хардаг, аль нь утсанд бэлэн болох
  нь ойлгомжтой (§1.7).
- 🔴 Цэс хоосон бол юу ч харагдахгүй — "Эрх байхгүй". Эрхийг клиент талд
  таамаглахгүй.

### Route guard — deep link-ээр ч тойрохгүй

Вэб route-ийн хамгаалалтгүй (зөвхөн sidebar шүүдэг). Mobile-д `xmetaadmin://`
scheme байгаа тул route бүрийг navigator түвшинд хаана.

| Алхам | Файл | Юу болно |
| --- | --- | --- |
| 1 | `app/_layout.tsx`, `(tabs)/_layout.tsx` | `screenLayout` → `RouteGuard` (дэлгэц бүрийг ороох) |
| 2 | `screens/shell/route-guard.tsx` | эрхгүй бол дэлгэцийг **mount хийхгүй** (query ч явахгүй), "Эрх байхгүй" + Нүүр рүү |
| 3 | `core/navigation/route-access.ts` | `canOpenRoute` — route нэр → зам → `MOBILE_ROUTES`-ийн урвуу → `hasMenuPath` |

- Хамгийн урт таарсан route ялна: `/futures/users` нь `/futures`-ийн биш өөрийн
  цэсийг шаардана. Дэд route (`/leave/[id]`, `/users/[id]`) эх route-ынхоо
  эрхийг өвлөнө. `/transfer` ба `/admin/accounts` хоёр цэсийн аль нэгээр нээгдэнэ.
- Нийтийн: Нүүр, Цэс, Профайл. `gallery`, `_sitemap` зөвхөн `__DEV__`-д.
  Зураглалд байхгүй route **анхдагчаар хаалттай**.
- 🔴 Шинэ route нэмбэл `MOBILE_ROUTES`-д цэсний замтай нь бүртгэ —
  `route-access.test.ts` `src/app`-ийг бүхэлд нь уншиж, бүртгэлгүй route-д унана.
- "Ажил" таб чөлөөний цэсгүй бол таб bar-аас нуугдана (`AppTabBar hidden`).
- Цэс апп идэвхжих / түгжээ тайлагдах үед 5 минутаас хуучирсан бол дахин
  татагдана (`hooks/use-menu-refresh.ts`, вэбийн `staleTime`-тай ижил). Эрх
  хасагдвал нээлттэй дэлгэц шууд "Эрх байхгүй" болно.

### Дэлгэц доторх эрх (groupId / цэсний зам)

| Юу | Дүрэм | Вэбийн эх |
| --- | --- | --- |
| Чөлөө батлах, "Батлах" таб, нүүрний батлах хэсэг | `isOfficePrivileged` | leave `canViewAll` |
| Task "Бүгд", weekly report хэлтсээр | `isOfficePrivileged` | `isTaskAdmin`, `isPrivilegedWeeklyReportViewer` |
| Админы нууц үг сэргээх, хандалт хаах | `isSuperAdmin` | `admin-users` toolbar |
| Transfer-ийн MNT сонголт | `mnt-transfer` цэс | SubAccount Transfer-т `showTransferType` байхгүй |

---

## 5.5 Хийгдсэн урсгалууд

### Нэвтрэлт

| Алхам | Файл                            | Юу болно                                    |
| ----- | ------------------------------- | ------------------------------------------- |
| 1     | `_layout.tsx` статус `signedOut`| `screens/sign-in-screen.tsx` (route биш)    |
| 2     | `hooks/use-sign-in.ts`          | Cognito-ийн алхмуудыг нэг төлөв болгоно     |
| 3     | `services/auth/cognito-error.ts`| Amplify-ийн алдааг `AppException` болгоно   |
| 4     | `data/auth/admin-repository.ts` | `/auth/info` + `/admin/admin-menus/my`      |
| 5     | `session-store`                 | `setUser` → статус `signedIn` → route ажиллана |

### Нүүр, Цэс, Профайл (сүлжээгүй эсвэл цэсэн дээр суурилсан)

| Дэлгэц   | Route                        | Юу харуулдаг                                   |
| -------- | ---------------------------- | ---------------------------------------------- |
| Нүүр     | `(drawer)/(tabs)/index.tsx`  | мэндчилгээ, чөлөөний тоон хайрцаг, түргэн үйлдэл |
| Цэс      | `(drawer)/(tabs)/menu.tsx`   | бүх модулийн хайлттай жагсаалт (баг тус бүрээр) |
| Профайл  | `(drawer)/(tabs)/profile.tsx`| бүртгэл, theme, аюулгүй байдал, гарах           |

- Нүүр нь чөлөөний хүсэлтийг **зөвхөн** `/office/leave-request` цэс эрхтэй
  админд татна (`hasMenuPath`) — эрхгүй бол хүсэлт огт явуулахгүй (§11.9).

### Чөлөө хүсэлт

| Дэлгэц      | Route                        | Дэлгэц (screens/)             | Endpoint                          |
| ----------- | ---------------------------- | ----------------------------- | --------------------------------- |
| Жагсаалт    | `(drawer)/(tabs)/leave.tsx`  | `leave/leave-list-screen.tsx` | `POST /admin/leave-requests/list`  |
| Шинэ хүсэлт | `app/leave/new.tsx`  | `leave/new-leave-screen.tsx`          | `POST /admin/leave-requests`       |
| Дэлгэрэнгүй | `app/leave/[id].tsx` | `leave/leave-detail-screen.tsx`       | `GET /admin/leave-requests/{id}`   |
| Зөвшөөрөх   | ↑ ConfirmSheet       | ↑                                     | `POST /admin/leave-requests/{id}/review` |

- "Миний хүсэлт" таб нь `adminUserId`-аар шүүнэ, "Батлах" нь бүгдийг.
- "Батлах" таб, Зөвшөөрөх/Татгалзах товч зөвхөн `isOfficePrivileged`-д (вэбийн
  `canViewAll`). Бусад ажилтан зөвхөн өөрийн хүсэлтийг харна.
- Татгалзах үед `ConfirmSheet`-ийн шалтгаан **заавал**, зөвшөөрөхөд заавал биш.
- Шийдвэрлэгдсэн хүсэлтэд товч харагдахгүй — API дахин шийдвэрлэхгүй.

### Support ticket (зөвхөн унших — Phase 1)

| Дэлгэц      | Route            | Дэлгэц (screens/)                  | Endpoint                          |
| ----------- | ----------------- | ----------------------------------- | ---------------------------------- |
| Жагсаалт    | `app/support/index.tsx`  | `support/ticket-list-screen.tsx`    | `POST {backoffice}/support/tickets/list` |
| Дэлгэрэнгүй | `app/support/[id].tsx`   | `support/ticket-detail-screen.tsx`  | `GET {backoffice}/support/tickets/{id}`  |

- Цэсний зам: `SUPPORT_TICKETS_MENU_PATH = '/portal/support/tickets'` →
  `MOBILE_ROUTES`-д `/support`.
- Энэ шатанд зөвхөн унших — хариу бичих (WebSocket), macro, статус солих нь
  2-р шат (`docs/MOBILE_SCOPE_RESEARCH.md` §2.2).

### Take-action (compliance асуумж — зөвхөн унших, Phase 1)

| Дэлгэц                    | Route                          | Дэлгэц (screens/)                        | Endpoint |
| -------------------------- | ------------------------------- | ------------------------------------------ | -------- |
| Асуумжийн жагсаалт         | `app/take-action/index.tsx`     | `take-action/take-action-list-screen.tsx`  | `POST {takeAction}/take-action/list` |
| Нэг асуумжийн хариултууд   | `app/take-action/[id].tsx`      | `take-action/take-action-responses-screen.tsx` | `POST {takeAction}/user-take-action/list` |
| Бүх хэрэглэгчийн хариу     | `app/take-action/responses.tsx` | `take-action/take-action-all-responses-screen.tsx` | ↑ (takeActionId-гүй) |

- `clients.takeAction` шинээр нэмэгдсэн (`core/network/clients.ts`) —
  base URL `account/v3/admin/accounts`.
- Cursor pagination (`lastEvaluatedKey`) — `unwrapList` аль хэдийн дэмждэг.
- Зураг: `image-signed-url`-ээр л нээнэ, `Image`-д шууд ачаална, диск дээр
  хадгалахгүй (аюулгүй байдал §4).
- Цэсний зам: `TAKE_ACTION_LIST_MENU_PATH = '/portal/take-action/take-action-list'`
  → `/take-action`, `USER_TAKE_ACTION_LIST_MENU_PATH =
  '/portal/take-action/user-take-action-list'` → `/take-action/responses`.

### Жагсаалтын хэв маяг (бүх finance + зөвхөн харах дэлгэц)

| Давхарга | Файл | Юу хийдэг |
| --- | --- | --- |
| Repository | `data/shared/fetch-list.ts` | POST → дугтуй → model, хоосон шүүлтүүр явуулахгүй |
| Hook | `hooks/use-paged-list.ts` | `current/pageSize/query`, хайлт 400ms debounce, доош гүйлгэхэд дараагийн хуудас (`total` эсвэл дүүрэн хуудсаар) |
| Дэлгэц | `components/paged-list-screen.tsx` | drawer/буцах, шинэчлэх, хайлт, "N бичлэг", карт ⇄ хүснэгт, хуудас ачаалах loader |
| Хуудасгүй | `components/query-list-screen.tsx` | `useQuery`-ийн бүх мөр нэг дор (тохиргоо, эрх, ангилал); хайлт ачаалсан мөрөн дотор (`searchText`) |
| Мөр | `components/record-view.ts` | `RecordView` — нэг бичлэгийн дэлгэцийн хэлбэр; карт ч, хүснэгтийн мөр ч үүнээс |
| Карт | `components/record-card.tsx` | гарчиг + статус + том дүн + 2 баганат 4 талбар; дарахад `RecordDetailSheet` — бүх талбар (удаан дарж хуулна) + `RecordActions` |
| Статистик | `components/summary-screen.tsx` | жагсаалт биш дэлгэц (dashboard, тохиргооны утга) — толгой + татаж шинэчлэх scroll |

- Шинэ жагсаалт = model/dto/repository + `usePagedList` нэг мөр + дэлгэц
  (`PagedListScreen` + `record={(item) => RecordView}`). Дэлгэц карт
  компонент бичихгүй — `RecordView` буцаах функц л. Хүснэгт автоматаар
  үүнээс гарна (доорх "Хүснэгт").
- Mutation-тай карт (retry, батлах) → `screens/<домэйн>/use-<нэр>-record.ts`
  hook: mutation-ыг нэг удаа үүсгээд `(item) => RecordView` буцаана.
- Статусын өнгө `lib/status-tone.ts` — үгээр таана, утгыг өөрчлөхгүй.
- `ExpandableRecordCard` устсан — бүгд `RecordCard` болсон.

| Домэйн | Route | Data (`src/data/`) | Endpoint |
| --- | --- | --- | --- |
| Order USDT | `app/finance/order-usdt` | `finance-order/` (`market:'usdt'`) | `POST {finance}/order-usdt/list` |
| Order MNT | `app/finance/order-mnt` | `finance-order/` (`market:'mnt'`) | `POST {finance}/order-mnt/list` |
| Convert | `app/finance/convert` | `convert/` | `POST {backoffice}/convert/list` |
| Crypto орлого (хэрэглэгч) | `app/finance/crypto-deposit-users` | `crypto-deposit/` (`isOperation:false`) | `POST {backoffice}/crypto/deposit-history/users/list` |
| Crypto орлого (үйл ажиллагаа) | `app/finance/crypto-deposit-operations` | `crypto-deposit/` (`isOperation:true`) | `.../operations/list` |
| Crypto зарлага | `app/finance/crypto-withdrawal` | `crypto-withdrawal/` | `POST {backoffice}/crypto/withdrawal-history/list` |
| Crypto шилжүүлэг | `app/finance/crypto-withdraw-transfers` | `crypto-withdraw-transfer/` | `POST {backoffice}/crypto/withdraw-transfers/list` |
| Амжилтгүй зарлага | `app/finance/crypto-failed-withdrawals` | `crypto-failed-withdrawal/` | `POST {backoffice}/crypto/failed-withdrawals/list` |
| Блоклогдсон хаяг | `app/finance/crypto-blocked-wallets` | `crypto-blocked-wallet/` | `POST {backoffice}/crypto/blocked-wallets/list` |
| Банкны орлого | `app/finance/bank-deposits` | `bank-deposit/` | `POST {backoffice}/banks/deposits/list` |
| Банкны зарлага | `app/finance/bank-withdrawals` | `bank-withdrawal/` | `POST {backoffice}/banks/withdrawals/list` |
| Гүйлгээний даалгавар | `app/finance/bank-exchange-txn-task` | `bank-exchange-txn-task/` | `POST {backoffice}/banks/exchange-txn-task/list` |
| Банкны гүйлгээ | `app/finance/bank-exchange-bank-txn` | `bank-exchange-bank-txn/` | `POST {backoffice}/banks/exchange-bank-txn/list` |
| BuyNow захиалга | `app/finance/buynow-orders` | `buy-now-order/` | `POST {backoffice}/buynow/orders/list` |

⚠️ **`Money` биш `AmountField`.** `core/money/format.ts`-ийн `AmountField =
{raw, currency}` + `formatAmountSafe()` — crypto coin `CURRENCIES`-д
бүртгэгдээгүй байж болох тул (жиш: SOL, DOGE) `parseMoney`-ийг шууд
дуудахгүй, `tryParseMoney` амжилтгүй бол түүхий дүнг харуулна (§10-ийг
зөрчихгүйгээр — тооцоо хийхгүй, зөвхөн дэлгэц). `AmountText` компонент үүнийг
render хийдэг.

⚠️ `tryParseMoney` урьд нь танихгүй валют дээр **шидэж** байсан (баримт
бичигт "шидэлтгүй хувилбар" гэж бичсэн ч зөрчиж байсан алдаа) — энэ ажлын
явцад `core/money/currency.ts`-д `tryCurrencyOf()` нэмж засав.

⚠️ `bank-exchange-bank-txn`-ийн цэсний зам (`/portal/bank/exchange-txn`)
нэрээр таарсан цорын ганц сонголт, баталгаажаагүй. Order MNT нь
`/portal/order-mnt/ihc-mnt` (вэбийн тэр хуудас `orderMntService.list`-ийг
дууддаг — 2026-10-01-нд баталсан).

### Хүснэгт (DataTable) — карт ⇄ хүснэгт (2026-10-01)

Бүх жагсаалт (`PagedListScreen`, `QueryListScreen`, `RecordListScreen`)
нэг `RecordView`-ээс карт эсвэл хүснэгт зурна. Сонголт нь бүх жагсаалтад
нэг, AsyncStorage-д (`list-view-mode`, хувийн мэдээлэл биш).

| Юу | Файл |
| --- | --- |
| Горим + нуусан багана | `core/ui/list-view-store.ts` — `mode` дискэнд, `hidden` санах ойд |
| Карт/хүснэгт сонгогч, багана товч | `components/list-view-toolbar.tsx` |
| Багана, мөр гаргах, эрэмбэ, өргөн | `components/record-table.ts` (цэвэр функц, тесттэй) |
| Хүснэгт | `components/data-table.tsx` (+ `-header`, `-row`, `-cell`, `-sticky-cell`) |
| Багана нуух хавтан | `components/column-picker-sheet.tsx` |
| Дүн харьцуулах | `lib/compare-decimal.ts` — `number`-гүй (§10) |

- Багана = гарчиг (sticky) → статус → дүн → `fields` → `details`; ачаалсан
  мөрүүдийн талбарын нэгдэл. Өргөнийг эхний 60 мөрийн текстийн уртаар
  тооцоод дэлгэцээс нарийн бол илүү зайг хуваана (`fitColumns`).
- Хэвтээ гүйлгэлт нь `Animated.ScrollView` → дотор нь босоо `FlatList`.
  Гарчгийн нүд scroll-ын зайгаар буцаж шилждэг (native driver) тул зүүн
  талд наалдана; толгой нь `stickyHeaderIndices`.
- Эрэмбэ нь ачаалсан мөрөн дээр (вэб ч одоогийн хуудсаа л эрэмбэлдэг):
  эрэмбэгүй → өсөх → буурах. Хоосон нүд үргэлж сүүлд.
- Мөр дарахад картынхтай ижил `RecordDetailSheet` (үйлдэлтэй); `onPress`
  өгсөн бол түүнийг (засах дэлгэц). Сонгосон мөрийг түлхүүрээр санадаг тул
  үйлдлийн дараа хавтан шинэ өгөгдлөө харуулна.
- `tableLabels` — гарчиг/дүнгийн баганы нэр (анхдагч "Бичлэг", "Дүн").
- `tableId` = дэлгэцийн гарчиг: хэл солиход баганын нэр ч солигддог тул
  нуусан багана хамт шинэчлэгдэнэ.

### Зөвхөн харах жагсаалтууд (2026-09-25) — 19 дэлгэц

| Домэйн | Route | Data | Endpoint |
| --- | --- | --- | --- |
| Spot захиалга / биелэлт / арилжаа / шимтгэл / хос | `app/spot/{orders,history,trade-history,commissions,symbols}` | `spot/` | `POST {backoffice}/spot/{orders,history,trade-history,commissions,symbols}/list` |
| Дотоод гүйлгээ / бүртгэл / үлдэгдэл | `app/internal/{transactions,records,balances}` | `internal-transaction/` | `POST {backoffice}/internal/{transactions,transaction-records,balances}/list` |
| Futures хэрэглэгч / хаагдсан позиц | `app/futures/{users,closed-positions}` | `futures-account/` | `POST {backoffice}/futures/{users,closed-positions}/list` |
| Хэрэглэгчийн данс / биржийн данс / дансны хөдөлгөөн | `app/finance/bank-{wallets,exchange-wallets,balance-transactions}` | `bank-account/` | `POST {backoffice}/banks/{user-bank-account-wallets,exchange-bank-wallets,balance-transactions}/list` |
| Coin / deposit хаяг / татах хориг / delist | `app/finance/crypto-{coins,wallet-addresses,withdraw-bans,delisted-transfers}` | `crypto-registry/` | `POST {backoffice}/crypto/{coins,wallet-addresses,withdraw-bans,delisted-transfers}/list` |
| Админы үйлдэл / operation данс | `app/admin/{activity-log,operation-accounts}` | `admin-activity/` | `POST {backoffice}/admin/activity-logs/list`, `/users/operation-accounts/list` |

- Цэсний зам нь вэбийн route файлын замаар (`menu-items.ts`).
- Futures PnL, үнийн валютыг type заагаагүй тул түүхий тоогоор (§10).
- Admin log-ийн `requestBody`, operation дансны `apiKey/secretKey`-г model-д
  уншдаггүй — нууц утга дэлгэцэд гарахгүй.
| Хэрэглэгчийн stake / хөрөнгө / гэрээ | `app/stake/{users,assets,contracts}` | `stake/` | `POST {staking}/admin/stake/{users,assets,contracts}/list` (cursor) |
| Үлдэгдлийн зураг | `app/users/balance-snapshots` | `balance-snapshot/` | `POST {finance}/user/balance-snapshot` (cursor, давхар `data`) |
| KYC мэдээлэл | `app/users/kyc-info` | `kyc-info/` | `POST {backoffice}/users/kyc-info/list` |

- **Cursor жагсаалт** (DynamoDB): `useCursorList` + `data/shared/fetch-cursor-list.ts`.
  `lastEvaluatedKey` объектыг JSON string болгож query key-д, буцааж объект
  болгож endpoint руу (`data/shared/cursor.ts`). `PagedListScreen` ялгааг мэдэхгүй.
- Stake: `*_manual` статустай мөрөнд "Хүсэлтийг батлах" →
  `POST {staking}/admin/stake/users/change-status` (вэбийн `customActions`).
- KYC-ийн `initiateResponse`-ийг уншихгүй; бүх утга санах ойд л.

### Вэбээс нэмэгдсэн дэлгэцүүд (2026-10-01) — 47 дэлгэц

Вэбийн route бүрийг `MOBILE_ROUTES`-тэй тулгаж дутууг нэмэв. Ихэнх нь
жагсаалт + хүснэгт; нэмэх/засах форм нь вэб дээр (тэмдэглэсэн).

| Домэйн | Route | Data | Endpoint | Үйлдэл |
| --- | --- | --- | --- | --- |
| Partner (7) | `app/partner/{index,applications,commissions,payouts,referrals,config,analytics}` | `partner/` | `{partner}/partners`, `/applications`, `/commissions`, `/payouts`, `/referrals` `/list`; `GET /config/tiers`; `/analytics/{summary,referral-funnel,top-partners}` | partner идэвхжүүлэх/түдгэлзүүлэх; хүсэлт, төлбөр зөвшөөрөх/татгалзах (шалтгаан заавал) |
| Support тохиргоо (5) | `app/support-admin/{macros,agents,roles,teams,categories}` | `support-admin/` | `{backoffice}/support/{marcos,agents,roles,teams}/list` (`page/search`), `/categories/data-list` (`parent: true`) | — |
| Сайтын агуулга (9) | `app/site/{footer-categories,footer-items,contact,withdrawal-limit,pages,page-categories,web-files,head-config,news}` | `site-content/` | `{content}/footer-menu/*`, `/pages/list`, `/page-categories/list`, `/web-files/list`, `/head-config/items/list`, `/withdraw-limit`; `{news}/news/list` | — (холбоо барих, хязгаар зөвхөн харна) |
| Админ (4) | `app/admin/{menu-groups,menus,roles,accounts}` | `admin-management/` | `GET /admin/admin-menu-groups/`, `/admin-menus/all`, `/admin-roles/{groups,permissions}`; `POST /users/admins/list` | нууц үг сэргээх, хандалт хаах/нээх — `isSuperAdmin` л, өөрийгөө хаахгүй |
| FRC тайлан (6) | `app/reports/frc-*` | `frc-report/` | `{backoffice}/admin/reports/frc-*` (`sortDate`) | — (Excel вэб дээр) |
| Reward hub (3) | `app/reward/{welcome-tasks,user-rewards,transactions}` | `reward-hub/` | `{rewardHub}/reward-hub/{rewards,user-rewards,transaction-tasks}/list` | — |
| Match engine (2) | `app/finance/match-{ihc,usdt}-mnt` | `match-engine/` | `{finance}/match-engine/{market}/list` (cursor, `pair`) | — |
| Convert limit | `app/finance/convert-limit` | `convert-limit/` | `GET {finance}/convert-limit/list` (`nextCursor`), `/{id}/{accept,reject,complete,reopen}` | вэбийн статусын дүрмээр; **x-idempotency-key** (вэб явуулдаг); эсрэг санал вэб дээр |
| Хөрөнгө сэргээлт | `app/finance/asset-recovery` | `asset-recovery/` | `{finance}/asset-recovery/list`, `PUT /{id}/approve` | зөвшөөрөх — `user_claimed` үед л |
| BuyNow хос | `app/finance/buynow-symbols` | `buy-now-symbol/` | `{finance}/buynow/symbol/list` | — |
| Monitor users | `app/compliance/monitor-users` | `compliance-monitor/` | `{compliance}/compliance-monitoring/user/list` | — |
| Crystal monitor | `app/compliance/crystal` | `crystal/` | `{backoffice}/crystal/monitor/{batch/txs,list}` (offset, USD цент ÷100 мөрөөр) | — |
| Stake статистик | `app/stake/statistics` | `stake/` | `GET {staking}/admin/stake/users/total-stakes-info` | — |
| Careers | `app/office/careers` | `career/` | `{content}/careers/{postings,applications}/list`, `/applications/update` | анкетын төлөв солих |
| Jumio нөөц | `app/users/jumio-backup` | `jumio-backup/` | `{backoffice}/users/jumio-backup/list` | — (зураг огт уншихгүй) |
| Operation данс | `app/admin/operation-accounts/[subAccountId]` | `operation-account/` | `GET /users/operation-accounts/detail/{id}`, `{finance}/operation-account/balance` | — (master данс вэб дээр) |
| Dashboard | `app/dashboard` | `dashboard/` | `{backoffice}/dashboard/overview/{summary,revenue-sources}` | — (бусад 6 таб вэб дээр) |

- Partner API тусдаа host: `EXPO_PUBLIC_PARTNER_API_URL` (заавал биш).
  Хоосон бол `menu-items.ts`-ийн `PARTNER_ROUTES` идэвхгүй ("Вэб дээр"),
  шууд холбоосоор орвол `clients.partner` validation алдаа өгнө.
- Шинэ client: `rewardHub`, `news`, `crystal`, `partner` (`core/config/api.ts`).
- Хуудасгүй жагсаалтын туслах: `QueryListScreen`; статистик: `SummaryScreen`;
  товч хугацаа (7 хоног / 1 сар / 3 сар): `lib/period-chips.ts` +
  `lib/date-range.ts`; хувь: `lib/format-ratio.ts` (`shift-decimal.ts`).
- Mutation-ын нийтлэг hook: `hooks/use-invalidating-mutation.ts`.

**Нэмээгүй (шалтгаантай):**

| Вэбийн хуудас | Шалтгаан |
| --- | --- |
| `portal/crypto/coins-rate` | Coin бүрт Binance-ийн нийтийн API-г шууд дууддаг (X-Meta backend биш) — утсанд олон хүсэлт |
| `portal/support/ai/*` | Тусдаа локал service + статик token (`VITE_AI_ADMIN_TOKEN`) — bundle-д нууц оруулахгүй |
| `portal/chats`, `portal/apps` | Вэб дээр ч зохиомол өгөгдөлтэй template |
| `portal/help-center` | Вэб дээр "Coming soon" |
| Partner commission import, tier/зар/мэдээ/хуудас/footer/macro засах | Excel, rich text, JSON config форм — вэб дээр |
| Convert limit "Counter" | Ханш, дүнгийн тусгай форм — вэб дээр |

### Mobile цэс — Banner, App version (нэмэх + засах)

Вэб дээр устгах товч байхгүй тул mobile-д ч үгүй.

| Юу | Route | Endpoint |
| --- | --- | --- |
| Banner жагсаалт (+ төрлөөр шүүх) | `app/mobile/banners` | `POST {content}/mobile/banner-list` (cursor) |
| Banner нэмэх / засах | `app/mobile/banners/new`, `[id]` | `POST /mobile/banner`, `GET`/`PUT /mobile/banner/{id}` |
| Зураг | — | `POST /mobile/banner/upload-image` multipart (`file`, `filename`) → `bannerImageUrl` |
| App version жагсаалт (+ OS-оор) | `app/mobile/versions` | `POST {content}/mobile/app-version/list` (cursor) |
| App version нэмэх / засах | `app/mobile/versions/new`, `[id]` | `POST /mobile/app-version`, `GET`/`PUT /mobile/app-version/{id}` |

- Зураг: `services/media/image-picker-service.ts` (`expo-image-picker`, зөвхөн
  сан, камергүй) → сонгонгуут upload → URL формд. Native модуль тул шинэ build.
- Анхны утга, заавал талбар вэбийн `banner-form.tsx` / `version-form.tsx`-тэй ижил.

### Office — Tasks (вэбийн kanban-ы утасны хэлбэр)

| Юу | Route | Endpoint (`{backoffice}/admin/company-tasks…`) |
| --- | --- | --- |
| Самбар: scope (Надад/Миний/Бүгд*) + статусын чип тоотой | `app/office/tasks` | `POST /list` `{current:1, pageSize:200, scope, search}` |
| Төлөв солих — карт удаан дарах эсвэл дэлгэрэнгүйн чип | — | `PUT /{id}/reorder` `{status, position: 0}` |
| Дэлгэрэнгүй: checklist, сэтгэгдэл, архив/устгах | `app/office/tasks/[id]` | `GET /{id}`, `/items…`, `/comments…`, `/archive`, `/unarchive`, `DELETE /{id}` |
| Шинэ / засах | `app/office/tasks/new`, `[id]/edit` | `POST /`, `PUT /{id}` (`assigneeId` = эхний, `assigneeIds`, `progress`) |
| Архив | `app/office/tasks/archive` | `POST /list` `{archivedOnly: true}` |
| Хавсралт нээх | — | `GET /comments/attachments/{id}/signed-url` → `expo-web-browser` |

- *"Бүгд" нь `isOfficePrivileged` (групп `4` эсвэл Super Admin/Directors) —
  вэбийн `isTaskAdmin`. Сервер өөрөө шалгана.
- Чирэх самбарын оронд: жагсаалт + статусын чип; төлөв солихыг нэг хүрэлтээр.
- Checklist-ийн мөрийг бүхэлд нь дарж тэмдэглэнэ (optimistic), удаан дарж нэр
  солих/устгах. Явц = дууссан/нийт (вэбтэй ижил).
- Үүсгэсний дараа шууд дэлгэрэнгүй рүү — checklist нэмэхэд бэлэн (вэбийн `onCreated`).
- Сэтгэгдэлд файл хавсаргах mobile-д **байхгүй** (харах нь бий).

### Office — Weekly reports

| Юу | Route | Endpoint (`{backoffice}/admin/weekly-reports…`) |
| --- | --- | --- |
| Жагсаалт (миний / хэлтэс*) | `app/office/weekly-reports` | `POST /list`, `GET /authors?department=` |
| Дэлгэрэнгүй, илгээх, төлөвлөгөө засах | `app/office/weekly-reports/[id]` | `GET /{id}`, `POST /{id}/submit`, `PUT /{id}/next-plan` |
| Бичих / засах (ноорог) | `new`, `[id]/edit` | `POST /`, `PUT /{id}` |

- Эзэн + ноорог → засах/илгээх; эзэн + илгээсэн → зөвхөн дараагийн төлөвлөгөө.
- Форм нь вэбийн `weekly-report-form.tsx`-тэй **яг ижил 4 хэсэг**: долоо хоног,
  гарчиг, хийсэн ажил (мөр мөрөөр + "Даалгавраас"), дараагийн төлөвлөгөө.
  🔴 API type-д `summary`, `blockers` байгаа ч вэб формд байхгүй — mobile-д ч
  нэмэхгүй. `summary`-г засахад хуучнаар нь буцааж явуулна, `blockers` огт явахгүй.
- "Даалгавраас" = `company-tasks/list` `scope: mine`, дууссан + хийгдэж буй,
  жагсаалтад байгаа гарчиг давхардахгүй (вэбийн `TaskPickerDialog`).
- Долоо хоног: өдөр сонгоход тухайн Даваа → Ням; "Энэ / Өмнөх долоо хоног" чип.
- API руу хийсэн ажил мөр бүр `- ` угтвартай. `.txt` татах нь mobile-д алга.

### Форм — бэлэн компонентууд

| Компонент | Юунд |
| --- | --- |
| `FormScreen` | буцах толгой + гарны ард нуугдахгүй scroll + доод хадгалах товч + засах үеийн ачаалалт |
| `FormSection` | "Монгол / English / Тохиргоо" гэх мэт бүлэг |
| `ChoiceField` | 2–4 сонголт (статус, OS) — segment |
| `SelectField` | олон сонголт — хайлттай хавтан |
| `ImageField` | зураг урьдчилан харах + солих |
| `DateField` | өнөөдөр/маргааш/7 хоног нэг хүрэлтээр + native календарь (`@expo/ui`) |
| `MultiSelectField` | олноор сонгох (хариуцагч) — чип дээр дарж хасна |
| `ProgressBar` | явц 0–100 |

Нэг форм компонент нэмэх ба засах хоёр дэлгэцэд (`mobile-banner-form.tsx`):
засах дэлгэц өгөгдөл ачаалж `initial` өгнө.

### Ticket-д хариу бичих (2-р шат)

`ticket-detail-screen.tsx` дотор нэмэгдсэн: статус чип (шууд солино),
харилцааны FlatList + доод reply мөр (macro товч + текст оролт + илгээх).

| Хэсэг | Файл | Юу болно |
| --- | --- | --- |
| Ярианы түүх (унших) | `data/support-ticket/ticket-conversation-*` | `POST {support}admin/tickets/conversation` |
| Илгээх (WS) | `services/support/ticket-socket-service.ts` | `POST {socket}/ws/token` → `wss://…?token=` → `conversation.send` |
| Холболтын амьдралын мөчлөг | `hooks/use-ticket-conversation.ts` | AppState идэвхжих бүрт дахин холбогдоно, 25 сек `ping` |
| Macro | `data/support-ticket/ticket-macro-*` | `POST {backoffice}/support/marcos/list` (backend-ийн алдаатай нэрийг **засаагүй**) |
| Статус солих | `useUpdateTicketStatus` | `PUT {backoffice}/support/tickets/{id}` |

- Илгээх зурвас `<p>…</p>`-ээр ороож явуулна (`lib/html.ts` `wrapAsHtmlParagraph`),
  уншихдаа `stripHtml` цэвэрлэнэ — бүрэн HTML renderer ашиглаагүй
  (`MOBILE_SCOPE_RESEARCH.md` §2.2-ийн зөвлөмж).
- `senderId` нь session-ий `user.id`.
- 🔴 React Compiler-ийн `set-state-in-effect` дүрэм: effect дотор `setState`
  хийдэг функцийг шууд дуудахгүй, `queueMicrotask`-аар хойшлуулна
  (`use-ticket-conversation.ts`).

### Push notification (2-р шат)

| Дэлгэц | Route | Endpoint |
| --- | --- | --- |
| Жагсаалт + батлах/татгалзах | `app/notifications/index.tsx` | `POST {finance}/push-notification/list`, `PUT /{pid}/status` |
| Шинэ | `app/notifications/new.tsx` | `POST {finance}/push-notification` |

- Зөвхөн broadcast эсвэл гараар 1-20 имэйл (CSV оруулах боломжгүй) —
  `MOBILE_SCOPE_RESEARCH.md` §2.3-ийн зөвлөмж.
- Цэсний зам: `/portal/mobile/push-notification` → `/notifications`.

### BuyNow / Convert retry (2-р шат)

1-р шатны `ConvertCard`/`BuyNowOrderCard` дотор нэмэгдсэн "Дахин оролдох"
товч (`ConfirmSheet`-тэй). `POST {finance}/convert/retry {id}`,
`POST {finance}/buynow/retry {orderId}`. Статусаар нөхцөлдүүлээгүй — аль ч
статустай бичлэг дээр товч гарна, буруу үед сервер өөрөө татгалздаг.

### Compliance case (2-р шат)

| Дэлгэц | Route | Endpoint |
| --- | --- | --- |
| Жагсаалт | `app/compliance/cases/index.tsx` | `POST {compliance}/cases/list` |
| Дэлгэрэнгүй + үйлдэл | `app/compliance/cases/[uid]/[caseId].tsx` | `GET /cases/{uid}/{caseId}`, `/notes`, `/assign`, `/close`, `/reopen`, `/events/list` |

- Тэмдэглэл нэмэх, хариуцуулах — ConfirmSheet-гүй (мөнгө/эрх өөрчлөхгүй,
  зөвхөн нэмэлт бичлэг). Хаах/дахин нээх — ConfirmSheet, шалтгаан заавал.
- Хаахад `resolution` (`FALSE_POSITIVE`/`CONFIRMED_MULE`) эхлээд
  SegmentedControl-оор сонгоод, дараа нь ConfirmSheet-ийн `reason`-ийг
  `notes` болгон дамжуулна.
- Event type-уудын (`FREEZE_EXECUTE` гэх мэт) ерөнхий "custom event" үүсгэх
  UI хийгээгүй — зөвхөн close/reopen/assign/note-оор автоматаар үүсэх
  event-үүдийг **уншиж** харуулна (`RecordListScreen`-ийн шинэ `S` generic
  parameter-ийг статус чипт ашигласан).
- Цэсний зам: `/portal/compliance/cases` → `/compliance/cases`.

### Хэрэглэгчийн мэдээлэл (3-р шат) — зөвхөн хайх + 3 таб

`data/exchange-user/` дор 3 дэд домэйн: `exchange-user-*` (үндсэн мэдээлэл,
`kyc.service.ts`-ийн `/users/list`, `/users/detail/{id}` — нэрнээс үл хамааран
энэ бол **харилцагчийн** мэдээлэл, `users.types.ts`-ийн admin staff төрөл
биш), `user-security-*` (`security.service.ts`), `user-balance-*`
(`users.service.ts`-ийн `{wallet}/user/balance`).

| Дэлгэц | Route | Юу |
| --- | --- | --- |
| Хайх | `app/users/index.tsx` | `POST {backoffice}/users/list` (`query`) |
| Дэлгэрэнгүй (3 таб) | `app/users/[id].tsx` | Үндсэн / Хөрөнгө / Аюулгүй байдал |

⚠️ **`{wallet}/user/balance` давхар `data` дугтуйтай** —
`response.data.data.data` (вэб код). `unwrap()` нэг л удаа задалдаг тул
`user-balance-repository.ts` гараар хоёр дахь давхаргыг шалгана.

Аюулгүй байдлын таб дахь бүх үйлдэл ConfirmSheet-тэй:
- MFA reset (sms/token) — шалтгаангүй
- Битүүмж гаргах (`account-enable`) — шалтгаангүй, **"битүүмжлэх" товч
  байхгүй** (endpoint олдоогүй, §1.7)
- Withdraw/Trade/Futures хориг унтраалга — шалтгаан **заавал**
  (`compliance.user.*-ban`)

- Цэсний зам: `/portal/user-information` → `/users`.

### Bank txn / crypto-withdraw үйлдэл (3-р шат)

1-р шатны карт дотор нэмэгдсэн товч, бүгд `RecordActions`-аар (товч +
`ConfirmSheet` + амжилтын toast; алдааны toast нь `MutationCache`-аас):

| Домэйн | Товч | Endpoint | Тэмдэглэл |
| --- | --- | --- | --- |
| `bank-exchange-bank-txn` | Шийдэх / Буцаах | `POST {finance}/bank-transaction/{txnId}/solve` `{message}`, `/refund` `{iban}` | `solveExchangeBankTnx`/`manualRefundExchangeBankTnx` — **exchange-txn-task биш, exchange-bank-txn**-д хамаарна |
| `crypto-withdrawal` | Зөвшөөрөх / Буцаах | `POST {finance}/crypto-withdraw/action` `{historyId, action:'APPROVE'|'REFUND'}` | |
| `crypto-failed-withdrawal` | Буцаах | `POST {finance}/failed-withdraw/manual` `{id}` | |
| `bank-withdrawal` | Шилжүүлсэн гэж тэмдэглэх | `PUT {bankV2}/user-bank-withdraw/{id}/mark-transferred` | body-гүй |

### Futures risk snapshot + transfer approve (3-р шат, сүүлчийн)

| Дэлгэц | Route | Endpoint |
| --- | --- | --- |
| Risk snapshot | `app/futures/index.tsx` | `GET {finance}/futures/master-risk`, `/open-orders` |
| Шилжүүлгийн хүсэлт | `app/futures/transfers.tsx` | `POST {finance}/futures/transfer-requests/list`, `/{txnId}/approve`, `/{txnId}/reject` |

- 🔴 **Live socket огт байхгүй** — `useFuturesMasterRisk`/`useFuturesOpenOrders`
  нь `refetchInterval: 8000` REST polling (§2.8-ийн зөвлөмж: батарей,
  тасалдлын хувьд Binance socket-той дэлгэц утсанд тохиромжгүй).
  `master-balances` endpoint-ийн response type нь `unknown` (вэб кодод ч
  бүтэцгүй) тул mobile дээр огт оруулаагүй.
  `futures/users/list`, `/closed-positions/list` (🟢 боловч цаг хугацааны
  хувьд орхигдсон) — дараагийн ажилд үлдсэн.
- ⚠️ **`approve`/`reject`-д `x-idempotency-key`** — вэб код
  (`futures-transfer.service.ts`-ийн `mutationConfig()`) яг үүнийг хийдэг тул
  mobile-ийн цорын ганц "вэбтэй яг адил idempotency ашигласан" mutation
  (`futures-transfer-repository.ts`). Бусад mutation (retry, push notification,
  ban) дээр ашиглаагүй — учир нь вэб код тэнд ашигладагийг батлаагүй (§1.7).
- `positionAmt === '0'` позицуудыг DTO-ийн түвшинд шүүдэг (хаагдсан позиц
  харуулахгүй).
- Цэсний зам: `/futures/master-risk` → `/futures`,
  `/futures/transfer-requests` → `/futures/transfers` (эдгээр нь `/portal`
  доор биш, тусдаа `futures` баг — `TEAMS`-д аль хэдийн байгаа).

---

### Хэтэвч блоклох (wallet withdraw-ban)

`Блоклогдсон хаяг` жагсаалтын толгойн `+` → `/finance/crypto-blocked-wallets/new`.

| Алхам | Файл | Endpoint |
| --- | --- | --- |
| Coin + сүлжээ | `data/crypto-coin/` · `use-crypto-coins` | `POST {backoffice}/crypto/coins/list` (`pageSize: 1000`, coin-оор давхардалгүй) |
| Блоклох | `crypto-blocked-wallet-repository.ban` | `POST {compliance}/wallet/withdraw-ban` `{coin, network, address, reason}` |

- Хаягийг сүлжээний `addressRegex`-ээр шалгана (`matchesAddressRule`). Regex
  байхгүй/эвдэрхий бол зөвшөөрнө — вэбтэй ижил, эцсийн шалгалт backend.
- Coin солиход сүлжээ цэвэрлэгдэнэ. Бүх талбар заавал → ConfirmSheet (улаан).

### Balance transfer (4-р шат)

Цэс: `/portal/exchange-management/mnt-transfer` ба `/sub-transfer` → хоёулаа
`/transfer`. MNT/Crypto сонголт зөвхөн `mnt-transfer` цэстэй админд — вэбийн
SubAccount Transfer нь crypto-г л шилжүүлдэг. Bulk/Promotion таб — CSV тул
mobile-д байхгүй.

| Юу | Файл | Endpoint |
| --- | --- | --- |
| Operation данс | `transfer-repository.operationAccounts` | `POST {backoffice}/users/operation-accounts/list` |
| Op эх үлдэгдэл | `.operationAssets` | `POST {finance}/operation-account/balance` `{subAccountId}` |
| User MNT үлдэгдэл | `.userMntAssets` | `POST {backoffice}/internal/balances/list` |
| User crypto үлдэгдэл | `userBalanceRepository.current` | `POST {wallet}/user/balance` (uid-г subAccountId-аас `users/list`-ээр) |
| 2FA | `action-mfa-repository.verifyTransfer` | `POST {backoffice}/auth/action-mfa/verify-transfer` `{code, accessToken}` |
| Илгээх | `.send` | MNT → `/transfer/mnt`, op→op → `/transfer/operation-sub-account`, бусад → `/transfer/sub-account` |

- Чиглэл 3: Op→User, User→Op, Op→Op (User→User вэб ч санал болгодоггүй).
- Хэрэглэгч талд subAccountId **яг таарах** ёстой, имэйл оруулбал татгалзана.
- Дүн `Money`-гээр: үлдэгдлээс хэтрэхгүй, валютын орноос илүү бутархайгүй
  (`transfer-validation.ts`). `CURRENCIES`-д бүртгэлгүй coin-ыг шилжүүлэхгүй,
  нэрийг нь "вэбээр" гэж харуулна (§10). API нь `amount`-ийг JSON тоо
  шаарддаг → `moneyToApiNumber`.
- Батлах хавтан: дүнг дахин бичих + 6 оронтой 2FA код → verify → send.
- `787107359` (master) нь `fromAccount: ''` болж явна — вэбийн хуулбар.
- Вэб `x-idempotency-key` явуулдаггүй тул mobile ч явуулахгүй; давхар дарахаас
  `AppButton`-ы түгжээ хамгаална.

### Хэл (англи / монгол)

Анхдагч хэл **англи** (вэб админ англи, App Store reviewer англиар уншина).
Профайл → "Language" хэсгээс монгол руу солино, сонголт AsyncStorage-д.

| Юу | Файл |
| --- | --- |
| Текст | `lib/messages/mn.ts` (`Messages` төрлийн эх), `lib/messages/en.ts` |
| Идэвхтэй хэл | `lib/messages/language-store.ts` — `useLanguageStore` (`restore`, `set`) |
| `messages` | `lib/messages/index.ts` — зам барьдаг Proxy, уншигдах мөчид идэвхтэй хэлээр |
| Апп асахад | `_layout.tsx` `boot()` — theme-тэй зэрэг `restoreLanguage()` |
| Солиход | `_layout.tsx` `<Fragment key={language}>` — бүх дэлгэц дахин mount |

- Дахин mount хийх шалтгаан: React Compiler текстийг memo хийдэг тул state
  өөрчлөгдөөгүй компонент шинэ хэлийг харахгүй. Навигацийн төлөв expo-router-т
  (Stack-ээс дээш) хадгалагддаг тул одоогийн дэлгэц хэвээр үлдэнэ.
- 🔴 Модулийн түвшинд string барихгүй (`CLEAN_CODE_PROMPT.md` §15). Tab-ын
  шошго (`TAB_ITEMS`), багийн тайлбар (`TEAMS`) нь getter.
- Backend-ээс ирэх текст (цэсний нэр, серверийн алдааны `message`)
  орчуулагдахгүй — сервер өгсөн хэлээрээ.
- Тест: `lib/messages/__tests__/messages.test.ts` — хоёр толь бичиг ижил
  түлхүүртэй, хэл солиход барьсан объект ч шинэчлэгдэнэ.

### Демо горим (App Store review)

Apple-ийн reviewer бодит өгөгдөл харахгүйгээр аппыг бүрэн туршина
(Guideline 2.1(a) "built-in demo mode"). `EXPO_PUBLIC_DEMO_EMAIL` +
`EXPO_PUBLIC_DEMO_PASSWORD`-оор нэвтрэхэд апп Cognito, backend руу **огт**
хандахгүй. Хоёр env хоосон бол демо горим бүрмөсөн унтарна.

| Алхам | Файл | Юу болно |
| --- | --- | --- |
| 1 | `hooks/use-sign-in.ts` | `demoMode.matches()` → Cognito-г алгасаж `demoMode.enter()` |
| 2 | `core/network/clients.ts` request interceptor | демо идэвхтэй бол `config.adapter = demoAdapter`, token хавсрахгүй |
| 3 | `core/demo/demo-adapter.ts` | `baseURL` → `api` түлхүүр, body-г задлаад backend руу |
| 4 | `core/demo/demo-backend.ts` | route хүснэгт + санах ойн төлөв (батлах, төлөв солих нь жагсаалтад харагдана) |
| 5 | `core/demo/demo-fixtures.ts` | зохиомол өгөгдөл (`example.com`) — бодит DTO төрлөөр бичигдсэн |
| 6 | `session-store` `signOut` | `demoMode.exit()` + `queryClient.clear()` |

- Демо өгөгдөлтэй хэсэг: Чөлөө, Даалгавар, Долоо хоногийн тайлан, Support
  ticket (хариу бичих орно), Crypto зарлага, Банкны орлого/зарлага, Convert.
  Цэс (`demo-fixtures.ts` `menus()`) зөвхөн эдгээрийг харуулна.
- 🔴 **Бүртгэлгүй хүсэлт сүлжээ рүү унахгүй.** `POST …/list` → хоосон
  жагсаалт, бусад нь `501` + `messages.demo.unsupported`. Тест:
  `core/demo/__tests__/demo-mode.test.ts`.
- Ticket чат: демо горимд WebSocket нээхгүй, `appendDemoTicketMessage`-ээр
  дуурайна (`use-ticket-conversation.ts`).
- Нүүр дээр `DemoNotice` (`screens/home/demo-notice.tsx`) — ажилтан андуурахгүй.
- Төлөв санах ойд л — апп дахин асахад демо үргэлж унтраалттай.
- ⚠️ Демо нууц үг bundle-д ил. Энэ нь зөвхөн зохиомол өгөгдөл нээдэг тул
  зөвшөөрөгдсөн эрсдэл; бодит эрх, token олгохгүй.
- Шинэ endpoint-ийг демод нэмэх: `demo-backend.ts`-д `route(...)`, өгөгдлийг
  `demo-fixtures.ts`-д тухайн DTO төрлөөр.

## 6. Шинэ дэлгэц нэмэх алхам

1. **Гэрээг унш** — `xmeta-admin/src/services/types/**` доторх TS type + түүнийг
   хэрэглэж буй `src/features/**`. Талбар, статусын утгыг таамаглахгүй.
2. **Route үүсгэ** — файл нь ганцхан мөр:
   `export { XScreen as default } from '@/screens/<домэйн>/x-screen'`.
   Хаана байрлуулах вэ:

   | Дэлгэц              | Байрлал                           |
   | ------------------- | --------------------------------- |
   | Таб болох гол дэлгэц| `app/(drawer)/(tabs)/<нэр>.tsx` + `TAB_ITEMS`-д нэм |
   | Цэснээс нээгдэх     | `app/<домэйн>/index.tsx` + `MOBILE_ROUTES`-д зам нэм |
   | Дэлгэрэнгүй, форм   | `app/<домэйн>/[id].tsx`, `app/<домэйн>/new.tsx`     |

   Дэлгэцийн бодит код `src/screens/`-д — ингэснээр дэлгэцийн жижиг
   компонентууд `app/` дотор route болж хувирахгүй.
3. **Repository** — endpoint дуудаж, `unwrap*` хийж, model буцаана.
4. **Hook** — `useQuery` / `useInfiniteQuery` / `useMutation`.
5. **Дэлгэц** — жагсаалт бол `PagedListScreen` / `QueryListScreen` +
   `record={(item) => RecordView}` (карт ⇄ хүснэгт автоматаар), бусад нь
   `<Screen>` + `<AppHeader>` + `<StateView>` эсвэл `SummaryScreen`.
   Таб доторх дэлгэц `edges={['top']}` — доод захыг таб bar эзэлнэ.
6. **Текст** — `lib/messages/mn.ts` ба `en.ts` хоёуланд нэм. Дэлгэцэнд өгүүлбэр шууд бичихгүй.
7. **Мөнгө** — `parseMoney` / `formatMoney`. `number` хэзээ ч биш.
8. **Буцаах боломжгүй үйлдэл** — `RecordView.actions` (`confirm.reason` +
   idempotency key) — карт ба хүснэгтийн дэлгэрэнгүйд хоёуланд гарна.
   Формд сонголт → `<SelectField>`, жагсаалтаас сонгох хавтан →
   `<SelectSheet>`, бусад хавтан → `<BottomSheet>`.
9. **Энэ файлд урсгалаа нэм.**
10. `npm run typecheck && npm run lint && npm test`
