# Mobile Scope Research — backoffice ажилтнуудын хүсэлтийн судалгаа

> **Огноо:** 2026-09-18
> **Эх сурвалж:** `xmeta-admin` (React вэб админ) — `src/services/api/**`,
> `src/features/**`, `src/routes/**`. Зөвхөн уншиж шалгасан.
> **Зорилго:** ажилтнуудын нэрлэсэн үйлдэл бүрийг **одоо байгаа API-аар**
> mobile дээр хийж болох эсэхийг тогтоох. Backend шинээр хийхгүй
> (CLAUDE.md §1.7).

## Тэмдэглэгээ

| Тэмдэг | Утга                                                                    |
| ------ | ----------------------------------------------------------------------- |
| 🟢     | Endpoint бүрэн байна, mobile дээр шууд хийж болно                       |
| 🟡     | Endpoint байна, гэхдээ mobile-д дасгах ажил их / эрсдэлтэй / хэсэгчилсэн |
| 🔴     | Endpoint байхгүй, эсвэл mobile дээр хийхийг зөвлөхгүй                   |

---

## 1. Нэг харцаар — 18 хүсэлтийн дүгнэлт

| #   | Хүсэлт                                        | Дүгнэлт | Гол шалтгаан                                                       |
| --- | --------------------------------------------- | ------- | ------------------------------------------------------------------ |
| 1   | Чөлөө хүсэлт явуулах                          | 🟢      | `POST /admin/leave-requests`                                        |
| 2   | Чөлөө хүсэлт зөвшөөрөх / татгалзах            | 🟢      | `POST /admin/leave-requests/{id}/review`                            |
| 3   | Битүүмжтэй харилцагчийн бөглөсөн асуумж харах | 🟢      | `user-take-action/list` + `image-signed-url`                        |
| 4   | Шинэ ирсэн хүсэлт (ticket) харах              | 🟢      | `POST /support/tickets/list` (`status: 'new'`)                      |
| 5   | Ticket-д хариу бичих                          | 🟡      | WebSocket `conversation.send` + HTML контент                        |
| 6   | Macro сонгож хариу илгээх                     | 🟡      | `support/marcos/list` 🟢, гэхдээ macro-ийн body нь HTML             |
| 7   | Solved / Pending / Open ангилал               | 🟢      | `PUT /support/tickets/{id}` — статус 4 (`new` нэмэгдэнэ)            |
| 8   | Support chat                                  | 🟡      | Бие даасан chat API **байхгүй** — ticket conversation л бодит       |
| 9   | Хэрэглэгчдэд push notification илгээх         | 🟢      | `POST /push-notification` + `{pid}/status` батлах                   |
| 10  | USDT/MNT, MNT/USDT order харах, шалгах        | 🟢      | `order-usdt/list`, `order-mnt/list`, `/{orderId}`                   |
| 11  | Convert, Crypto deposit/withdraw харах, шүүх  | 🟢      | 8 ширхэг `list` endpoint                                            |
| 11b | Тэдгээрийг "дарах" (retry/action)             | 🟡      | `convert/retry`, `crypto-withdraw/action`, `failed-withdraw/manual` |
| 12  | Crypto Depo Users / Operations / Transfers    | 🟢      | 3 тусдаа `list` endpoint                                            |
| 13  | User Information бүгдийг харах                | 🟡      | 5 таб + 20 дэд хэсэг — хамрах хүрээ маш өргөн                       |
| 14  | Хамгаалалт reset (MFA), ban toggle            | 🟢      | `security/reset-mfa`, `withdraw/trade/futures-ban`                  |
| 14b | Freeze / Unfreeze                             | 🟡🔴    | **Unfreeze** `account-enable` 🟢, **freeze** endpoint олдсонгүй 🔴  |
| 15  | Bank Withdraw / Deposit / Exch Txn шүүх       | 🟢      | `banks/*/list` бүлэг                                                |
| 15b | Exch Txn solve / refund / mark-transferred    | 🟡      | Мөнгө хөдөлгөнө — ConfirmSheet + шалтгаан заавал                    |
| 16  | BuyNow error order дарах                      | 🟢      | `POST /buynow/retry`                                                |
| 17  | Compliance case + асуумж + битүүмж гаргах     | 🟡      | Case CRUD 🟢, гүйлгээ гаргах нь 3 өөр endpoint — тодруулга хэрэгтэй |
| 18  | Futures risk control                          | 🟡🔴    | REST хэсэг 🟢, Binance live socket mobile-д тохиромжгүй 🔴          |
| 19  | Balance transfer                              | 🟡      | Endpoint 🟢, гэхдээ step-up MFA + хамгийн өндөр эрсдэл              |

---

## 2. Дэлгэрэнгүй — бүлэг тус бүрээр

### 2.1 Office — Чөлөө хүсэлт 🟢 (хамгийн бэлэн, MVP-д тохирно)

`src/services/api/office/leave-request.service.ts`

| Үйлдэл              | Endpoint                                              |
| ------------------- | ----------------------------------------------------- |
| Жагсаалт + шүүлт    | `POST {backoffice}/admin/leave-requests/list`         |
| Дэлгэрэнгүй         | `GET  {backoffice}/admin/leave-requests/{id}`         |
| Шинээр илгээх       | `POST {backoffice}/admin/leave-requests`              |
| Зөвшөөрөх/татгалзах | `POST {backoffice}/admin/leave-requests/{id}/review`  |

- Статус: `PENDING | APPROVED | REJECTED`, төрөл: `ANNUAL | SICK | PERSONAL | OTHER`
- `requestType: 'day' | 'hour'` — цагаар авах үед `startTime/endTime` нэмэгдэнэ
- Монгол шошго нь **type файлд аль хэдийн байна** (`LEAVE_TYPE_LABELS`)
- Мөнгө хөдөлгөхгүй, файл хавсаргахгүй, socket хэрэггүй → **mobile-д 1:1 буух цорын ганц бүлэг**

⚠️ `review` нь эрхээс хамаарна — вэб дээр ямар admin group эрхтэйг
`/admin/admin-menus/my`-аас уншина (§3.4).

### 2.2 Support — ticket, macro, chat 🟡

**Жагсаалт ба статус 🟢**

| Үйлдэл          | Endpoint                                        |
| --------------- | ----------------------------------------------- |
| Ticket жагсаалт | `POST {backoffice}/support/tickets/list`        |
| Дэлгэрэнгүй     | `GET  {backoffice}/support/tickets/{id}`        |
| Статус/тэмдэглэл| `PUT  {backoffice}/support/tickets/{id}`        |
| Ярианы түүх     | `POST {support}/admin/tickets/conversation`     |
| Macro жагсаалт  | `POST {backoffice}/support/marcos/list` (`marcos` — backend-ийн үсгийн алдаа, засахгүй) |
| Хавсралт        | `POST {support}/admin/tickets/upload-url`       |

Статус нь **4** байна: `new | open | pending | solved`. Ажилтнууд "Solved /
Pending / Open" гэж 3-ыг нэрлэсэн ч `new` (шинэ ирсэн) нь тусдаа — mobile-ийн
шүүлтүүрт 4-ийг бүгдийг тавина.

**Хариу илгээх 🟡 — REST биш, WebSocket**

`ticket-reply-content.tsx` дээрх бодит урсгал:

1. `POST {socket}/ws/token` → түр token
2. `wss://…` холбогдож 25 сек тутам `ping`
3. `socket.send({ method: 'conversation.send', params: { ticketId, message, senderId, senderType: 'support', attachments, uid } })`
4. Статус солих нь **тусдаа** `PUT /support/tickets/{id}` дуудлага

Mobile-д анхаарах:

- `message` нь **HTML** (`<p>…</p>`). RN дээр HTML render хийхэд нэмэлт сан
  (`react-native-render-html`) эсвэл WebView шаардана. Хамгийн бага
  хувилбар: илгээхдээ `<p>текст</p>` болгож ороож, уншихдаа tag-ийг цэвэрлэх.
- `senderId` нь вэб дээр `localStorage.user_info.id`-аас ирдэг. Mobile дээр
  `/auth/info`-оос авсан админы id-г session store-д хадгална.
- RN-ийн WebSocket нь background-д тасардаг. Foreground/AppState сэргэх бүрт
  дахин холбогдох + `conversation`-ийг refetch хийх логик заавал хэрэгтэй.
- Хавсралт: presigned URL руу шууд `PUT`. Вэб нь CORS-оос болж proxy
  ашигладаг — **RN дээр CORS байхгүй тул proxy хэрэггүй**, энэ нь илүү хялбар.

**"Support chat" 🟡 — ойлголтыг тодруулах шаардлагатай**

`portal/chats` маршрут нь **`convo.json` fake data** дээр ажилладаг template
дэлгэц. Бодит харилцагчтай чатлах суваг нь **ticket conversation** (дээрх WS).
Тиймээс mobile дээр "chat" гэдгийг ticket ярианы дэлгэц хэлбэрээр хийнэ —
тусдаа chat backend байхгүй.

### 2.3 Push notification 🟢 (+ нэг цоорхой 🔴)

| Үйлдэл   | Endpoint                                     |
| -------- | -------------------------------------------- |
| Жагсаалт | `POST {finance}/push-notification/list`      |
| Үүсгэх   | `POST {finance}/push-notification`           |
| Батлах   | `PUT  {finance}/push-notification/{pid}/status` (`PROCESSING` = зөвшөөрөх, `REJECTED` = татгалзах) |

- Body: `{ title, message, isBroadcast, notifications: [{ email }] }`
- Үүсгэсэн кампанит ажил `PENDING` статустай гарч, **өөр админ батлах** ёстой
  → mobile дээр "үүсгэх" ба "батлах" гэсэн хоёр өөр эрхийн дэлгэц болно.
  Утсан дээр батлах нь хамгийн ашигтай хэрэглээ (хаана ч байсан батална).
- Broadcast биш тохиолдолд имэйлээр жагсаана — mobile дээр CSV оруулах
  боломжгүй тул **broadcast + гараар 1–20 имэйл** хүртэл гэж хязгаарлахыг
  зөвлөж байна.

🔴 **Цоорхой:** энэ бол *харилцагчийн* аппад мэдэгдэл явуулах API. **Админы
аппад** мэдэгдэл (шинэ ticket, шинэ transfer request) ирүүлэх device token
бүртгэх endpoint `xmeta-admin`-д **байхгүй**. Тиймээс эхний хувилбарт
mobile нь "татаж шинэчлэх" (polling) л байна. Push авах бол backend-ийн
шинэ ажил.

### 2.4 Compliance + битүүмжтэй харилцагчийн асуумж 🟡

**Асуумж харах 🟢** — `take-action` модуль:

| Үйлдэл                  | Endpoint                                                     |
| ----------------------- | ------------------------------------------------------------ |
| Илгээсэн асуумжийн жагсаалт | `POST {takeAction}/take-action/list`                     |
| Хэрэглэгчийн хариу      | `POST {takeAction}/user-take-action/list`                     |
| Нэг action-ны бүх хариу | `POST {takeAction}/user-take-action/list-all`                 |
| Хэрэглэгчийн мэдээлэл   | `POST {takeAction}/user-take-action/user-info-by-id/{uid}`    |
| Хавсаргасан зураг       | `POST {takeAction}/user-take-action/image-signed-url`         |

Хариултын бүтэц: `content[].sub_content[] = { title, desc, sub_type, value }`
— `value` нь харилцагчийн бөглөсөн хариу, зураг бол signed URL-аар нээнэ.
`status: 'waiting' | 'success'` (бөглөсөн эсэх).

→ **Уншиж харах дэлгэц тул mobile-д хамгийн тохиромжтой compliance ажил.**

**Compliance case 🟢 унших, 🟡 үйлдэл:**

`{compliance}/cases` — `list`, `{uid}/{caseId}` дэлгэрэнгүй, `close`,
`reopen`, `assign`, `note`, event `create/list`. Event төрөлд
`FREEZE_EXECUTE`, `UNFREEZE_EXECUTE`, `WITHDRAWAL_BLOCKED`, `REVERSAL` байна.

⚠️ **Чухал ялгаа:** case event үүсгэх нь **бүртгэл** — битүүмжийг бодитоор
гаргадаггүй. Бодит үйлдэл нь өөр service-д:

| Ажилтны хэлсэн үйлдэл           | Бодит endpoint                                                      | Тэмдэглэл |
| ------------------------------- | ------------------------------------------------------------------- | --------- |
| Битүүмжийг гаргах (unfreeze)    | `POST {security}/user/account-enable` `{uid}`                        | 🟢        |
| Битүүмжлэх (freeze)             | —                                                                    | 🔴 олдсонгүй |
| Хүсэлт татах хориг авах         | `POST {compliance}/user/withdraw-ban` `{uid, isWithdrawBan, reason}` | 🟢        |
| Арилжааны хориг                 | `POST {compliance}/user/trade-ban`                                   | 🟢        |
| Futures хориг                   | `POST {compliance}/user/futures-ban`                                 | 🟢        |
| Хэтэвчийн хориг                 | `POST {compliance}/wallet/withdraw-ban`                              | 🟢        |

🔴 **Freeze хийх endpoint вэб админд байхгүй** — зөвхөн `account-enable`
(гаргах) байна. Битүүмжлэх нь compliance engine-ээс автоматаар тавигддаг
бололтой. CLAUDE.md §1.7-оор: mobile дээр "битүүмжлэх" товч **огт
харуулахгүй**, зөвхөн "гаргах"-ыг харуулна.

**"Гацсан гүйлгээг гаргах зөвшөөрөл" — 3 өөр зүйл байж болно 🟡**

| Таамаг                        | Endpoint                                        |
| ----------------------------- | ----------------------------------------------- |
| Банкны гацсан гүйлгээ         | `POST {finance}/bank-transaction/{txnId}/solve` |
| Амжилтгүй crypto withdraw     | `POST {finance}/failed-withdraw/manual`         |
| Хөрөнгө сэргээх (asset recovery) | `POST {finance}/asset-recovery/{bcPageIndex}/approve` |

→ **Ажилтнуудаас аль нь болохыг тодруулах шаардлагатай** (§5 асуултууд).

### 2.5 Finance — order, convert, crypto, bank, buynow

**Зөвхөн харах/шүүх — бүгд 🟢** (mobile-д хийхэд хамгийн аюулгүй бүлэг):

| Дэлгэц                | Endpoint                                              |
| --------------------- | ----------------------------------------------------- |
| USDT/MNT order        | `POST {finance}/order-usdt/list`, `/{orderId}`         |
| MNT order             | `POST {finance}/order-mnt/list`, `/{orderId}`          |
| Convert               | `POST {backoffice}/convert/list`, `GET /convert/{id}`  |
| Crypto deposit (user) | `POST {backoffice}/crypto/deposit-history/users/list`  |
| Crypto deposit (ops)  | `POST {backoffice}/crypto/deposit-history/operations/list` |
| Crypto withdrawal     | `POST {backoffice}/crypto/withdrawal-history/list`     |
| Withdraw transfers    | `POST {backoffice}/crypto/withdraw-transfers/list`     |
| Failed withdrawals    | `POST {backoffice}/crypto/failed-withdrawals/list`     |
| Blocked wallets       | `POST {backoffice}/crypto/blocked-wallets/list`        |
| Bank deposit          | `POST {backoffice}/banks/deposits/list`                |
| Bank withdrawal       | `POST {backoffice}/banks/withdrawals/list`             |
| Exchange txn task     | `POST {backoffice}/banks/exchange-txn-task/list`, `/{id}` |
| Exchange bank txn     | `POST {backoffice}/banks/exchange-bank-txn/list`, `/{id}` |
| BuyNow order          | `POST {backoffice}/buynow/orders/list`, `/{id}`        |

**"Дарах" = засах үйлдлүүд 🟡** (мөнгө хөдөлгөнө → ConfirmSheet + шалтгаан +
idempotency заавал — CLAUDE.md "Аюулгүй байдал" §5):

| Үйлдэл                   | Endpoint                                              |
| ------------------------ | ----------------------------------------------------- |
| Convert дахин оролдох    | `POST {finance}/convert/retry` `{ id }`               |
| BuyNow дахин оролдох     | `POST {finance}/buynow/retry` `{ orderId }`           |
| Crypto withdraw action   | `POST {finance}/crypto-withdraw/action`               |
| Амжилтгүй withdraw буцаах| `POST {finance}/failed-withdraw/manual` `{ id }`      |
| Банкны гүйлгээ шийдэх    | `POST {finance}/bank-transaction/{txnId}/solve`       |
| Гараар буцаалт           | `POST {finance}/bank-transaction/{txnId}/refund`      |
| Шилжүүлсэн гэж тэмдэглэх | `POST {bankV2}/user-bank-withdraw/{id}/mark-transferred` |

⚠️ Order/convert/bank жагсаалт бүр **мөнгөн дүнтэй** → §10-ийн дагуу
`Money` (bigint minor units). `number` руу хөрвүүлэхгүй.

⚠️ Export (`{finance}/*/export`) нь step-up MFA шаарддаг ба файл татдаг.
Mobile-д эхний хувилбарт **оруулахгүй** гэж зөвлөж байна.

### 2.6 User Information 🟡 — хамрах хүрээ том

Ажилтнууд "бүгдийг нь харах" гэсэн. Вэб дээр энэ нь **5 таб + 20 дэд дэлгэц**:

- Табууд: Basic Information, Net Assets, Bank Information, Authentication, KYC
- Дэд контент: addresses, asset, auth-log, bank deposit/withdraw,
  changes-log, deposit, futures-transfer, internal deposit/withdraw,
  mnt deposit/withdraw/transactions, orders, p2p-orders, security,
  withdraw-ban, withdraw-transfer, operation-log

Endpoint: `{backoffice}/users/list`, `/users/detail/{id}`,
`{security}/user/security-info`, `{wallet}/user/balance`,
`{backoffice}/users/{userId}/bank-accounts/list`, `{compliance}/user/risk-score`,
`{finance}/user/operation-log` гэх мэт.

→ Бүгдийг нь буулгах нь **дангаараа хамгийн том ажил**. Утсан дээр
хэрэгцээтэй нь: хайх → нэг харилцагчийн үндсэн мэдээлэл, үлдэгдэл,
хамгаалалт, сүүлийн гүйлгээ. Бусдыг нь 2-3 дахь шатанд.

### 2.7 Хамгаалалт reset 🟢

`{security}/user/security/reset-mfa` `{ uid, mfaName: 'sms' | 'token' }`,
`{security}/user/change-email`, `{security}/user/security-info` (одоогийн
төлөв), `{compliance}/user/*-ban-log` (түүх).

→ Endpoint хялбар. Гэхдээ **эрх өөрчилдөг үйлдэл** тул ConfirmSheet +
шалтгаан + биометрик түгжээ заавал.

### 2.8 Futures risk control 🟡🔴

| Хэсэг              | Endpoint / эх сурвалж                            | Mobile |
| ------------------ | ------------------------------------------------ | ------ |
| Master risk        | `GET {finance}/futures/master-risk`              | 🟢     |
| Нээлттэй захиалга  | `GET {finance}/futures/open-orders`              | 🟢     |
| Master үлдэгдэл    | `GET {finance}/futures/transfer-requests/master-balances` | 🟢 |
| Futures хэрэглэгч  | `POST {finance}/futures/users/list`              | 🟢     |
| Хаагдсан позиц     | `POST {finance}/futures/closed-positions/list`   | 🟢     |
| **Live mark price**| Binance market WebSocket                         | 🔴     |
| **Live user data** | Binance user-data WS + `binance-listen-key` (30 мин тутам keepalive) | 🔴 |

Вэб дэлгэц нь хоёр Binance socket-той, тасралтгүй тооцоолол хийдэг.
Утсан дээр background-д socket амьд байлгах нь батарей/тасалдлын хувьд
найдваргүй. **Зөвлөмж:** mobile дээр REST-ээр 5–10 секунд тутам refetch
хийдэг "risk snapshot" дэлгэц хийх — live socket-гүй, гэхдээ маржин,
позиц, эрсдэлийн үзүүлэлтийг хараад мэдэх боломжтой.

Transfer request батлах/татгалзах нь тусдаа, боломжтой:
`POST {finance}/futures/transfer-requests/{txnId}/approve | /reject` 🟢

### 2.9 Balance transfer 🟡 — хамгийн эрсдэлтэй

| Үйлдэл                     | Endpoint                                   |
| -------------------------- | ------------------------------------------ |
| MNT шилжүүлэг              | `POST {finance}/transfer/mnt`              |
| Sub-account шилжүүлэг      | `POST {finance}/transfer/sub-account`      |
| Operation sub-account      | `POST {finance}/transfer/operation-sub-account` |
| Дансны үлдэгдэл            | `POST {finance}/operation-account/balance` |

Body: `{ fromAccount, toAccount, amount, asset, reason }` — `reason` заавал.
Вэб дээр илгээхийн өмнө `verifyTransferActionMfa()` →
`POST {backoffice}/auth/action-mfa/verify-transfer` `{ code, accessToken }`.

Mobile-д: TOTP код асуух дэлгэц + `accessToken` (idToken **биш**!) +
ConfirmSheet + `x-idempotency-key`. Техникийн хувьд бүрэн боломжтой,
гэхдээ **хамгийн сүүлд хийх** ажил.

---

## 3. Бүх бүлэгт хамаарах саад / бэлтгэл ажил

### 3.1 Step-up MFA (2 төрөл — андуурвал ажиллахгүй)

| Төрөл           | Endpoint                          | Хаана хэрэгтэй                    |
| --------------- | --------------------------------- | --------------------------------- |
| Scope-той token | `/auth/action-mfa/verify`         | Export (CSV/Excel)                |
| Transfer        | `/auth/action-mfa/verify-transfer`| Balance transfer, partner payout  |

Хоёулаа body-д **`accessToken`** авдаг, харин ердийн хүсэлтийн Bearer нь
**`idToken`** (CLAUDE.md §2). Scope-той token нь `X-Admin-Action-Mfa`
header-ээр буцаж явна.

### 3.2 WebSocket 2 өөр систем

| Систем         | Token авах                 | Хэрэглээ           | Mobile   |
| -------------- | -------------------------- | ------------------ | -------- |
| X-Meta support | `POST {socket}/ws/token`   | Ticket ярианы урсгал| 🟡 болно |
| Binance futures| `POST {finance}/futures/binance-listen-key` + 30 мин keepalive | Futures live risk | 🔴 зөвлөхгүй |

RN-д WebSocket байгаа. Гэхдээ AppState (background → foreground) бүрт
дахин холбогдох, түүхээ refetch хийх шаардлагатай. `use-app-lock.ts`-ийн
60 секундын дүрэмтэй уялдуулна.

### 3.3 Файл — зураг, хавсралт

- Ticket хавсралт: presigned `PUT`. RN дээр CORS байхгүй тул вэбийн proxy
  хэрэггүй; `expo-image-picker` + `fetch(PUT)` хангалттай.
- Асуумжийн зураг: `image-signed-url` → богино хугацааны URL.
  **Диск дээр кэшлэхгүй** (CLAUDE.md аюулгүй байдал §4).
- KYC зураг (`jumio-backup/images`): маш эмзэг — mobile дээр эхний
  хувилбарт оруулахгүйг зөвлөж байна.

### 3.4 Эрх ба цэс

`GET {backoffice}/admin/admin-menus/my` нь тухайн админд харагдах цэсийг
буцаана. Mobile-ийн tab/цэс үүнээс үүсэх ёстой — hardcode хийхгүй
(CLAUDE.md "Эрхгүй админд цэс харагдахгүй").

### 3.5 Мөнгө

Order, convert, bank, futures, balance — бүгд мөнгөн дүнтэй.
§10-ийн дагуу `parseMoney` → `Money` (bigint). `xmeta-admin` нь `number`
ашигладаг — **түүнийг хуулж болохгүй**.

### 3.6 Хүснэгтийн асуудал

Вэб админ бүхэлдээ өргөн хүснэгт (TanStack Table, 10-20 багана) дээр
суурилсан. Утсан дээр хүснэгт ажиллахгүй → **карт хэлбэрийн жагсаалт**
(гол 3-4 талбар харагдана, дарвал дэлгэрэнгүй) болгож дахин зохиомжлох
ёстой. Энэ нь дэлгэц бүрийн нэмэлт зардал.

---

## 4. Санал болгож буй дараалал

### 1-р шат — "Уншиж, батлах" (эрсдэл бага, ашиг өндөр)

1. Нэвтрэх + MFA + биометрик түгжээ (одоо байгаа суурь дээр)
2. Чөлөө хүсэлт — илгээх, жагсаалт, зөвшөөрөх/татгалзах 🟢
3. Ticket жагсаалт + статусаар шүүх + дэлгэрэнгүй (хариу бичихгүй) 🟢
4. Битүүмжтэй харилцагчийн бөглөсөн асуумж харах 🟢
5. Order (USDT/MNT), Convert, Crypto depo/withdraw, Bank — **харах + шүүх** 🟢

### 2-р шат — "Хариу ба энгийн үйлдэл"

6. Ticket-д хариу бичих (WS + macro + статус солих) 🟡
7. Push notification — жагсаалт, үүсгэх, батлах 🟢
8. BuyNow retry, Convert retry 🟡 (ConfirmSheet + шалтгаан)
9. Compliance case жагсаалт, дэлгэрэнгүй, тэмдэглэл, хаах 🟢

### 3-р шат — "Эрх ба мөнгө"

10. User Information — хайх + үндсэн таб (бүгдийг нь биш) 🟡
11. MFA reset, ban toggle, account-enable (битүүмж гаргах) 🟡
12. Bank txn solve/refund, crypto-withdraw action 🟡
13. Futures risk snapshot (REST polling) + transfer request батлах 🟡

### Одоохондоо оруулахгүй

- Balance transfer (эрсдэл хамгийн өндөр — 4-р шат)
- Binance live socket futures dashboard 🔴
- Export / CSV татах 🔴
- KYC зураг үзэх, Jumio backup 🔴
- Admin/menu/role удирдлага, footer menu, banner, news — вэб дээр илүү тохиромжтой

---

## 5. Ажилтнуудаас тодруулах асуултууд

1. **"Гацсан гүйлгээг гаргах"** гэдэг нь аль нь вэ? — банкны
   `bank-transaction/solve`, `failed-withdraw/manual`, эсвэл
   `asset-recovery/approve`?
2. **"Битүүмжлэх"** үйлдлийг вэб дээр хэн, хаанаас хийдэг вэ? Вэб админ
   кодод зөвхөн "гаргах" (`account-enable`) байна.
3. **"Support chat"** гэдэг нь ticket-ийн яриа мөн үү, эсвэл өөр систем
   (жишээ нь live chat widget) байдаг уу?
4. **Order "шалгах"** гэдэг нь зөвхөн харах уу, эсвэл ямар нэг баталгаажуулах
   үйлдэл байдаг уу? Вэб дээр `order-mnt/list` нь зөвхөн уншдаг.
5. Админы утсанд **мэдэгдэл (push)** ирүүлэх шаардлагатай юу? Тийм бол
   backend-д device token бүртгэх шинэ endpoint хэрэгтэй.
6. Хамгийн олон давтагддаг 3 үйлдэл юу вэ? (MVP-г түүгээр эхлүүлнэ)

---

## 5.1 Вэб ↔ Mobile — юу нь ижил, юу нь өөр вэ

**Ижил (зориудаар):**

| Юу                | Хэрхэн                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| Цэсний бүтэц      | `GET /admin/admin-menus/my` — вэбийн sidebar-тай **нэг эх сурвалж**. Баг (Portal/Office/Partner/Futures) → бүлэг → мөр, нэр ба дараалал нь ижил |
| Эрх               | Мөн тэр endpoint. Вэбэд харагдахгүй мөр mobile-д ч харагдахгүй         |
| Өнгө, фонт        | `theme.css`-ийн slate токенууд hex болж хөрвөсөн                        |
| Статусын утга     | `new/open/pending/solved`, `PENDING/APPROVED/REJECTED` — ижил string    |
| Нэвтрэлт          | Ижил Cognito pool, ижил `idToken`, ижил step-up MFA endpoint            |

**Өөр (утасны шаардлагаас):**

| Юу               | Вэб                                   | Mobile                                                |
| ---------------- | ------------------------------------- | ----------------------------------------------------- |
| Навигаци         | Зүүн sidebar байнга нээлттэй          | Нүүр дэлгэц = sidebar-ийн хуулбар + доод таб          |
| Жагсаалт         | 10–20 баганатай хүснэгт, багана нуух  | Карт (3–4 талбар) → дарвал дэлгэрэнгүй                |
| Шүүлтүүр         | Toolbar дээрх олон dropdown           | Чип мөр + шүүлтүүрийн bottom sheet                    |
| Баталгаажуулалт  | Modal dialog                          | Bottom sheet (`ConfirmSheet`) + шалтгааны талбар      |
| Ticket хариу     | HTML rich text editor                 | Энгийн текст (HTML болгож ороож илгээнэ)              |
| Futures risk     | Binance live socket                   | REST polling snapshot                                  |
| Export (CSV)     | Бий (step-up MFA-тай)                 | Байхгүй                                                |
| Олон мөр сонгох  | Бий                                   | Байхгүй — нэг нэгээр                                   |
| Session          | `localStorage`-д хэрэглэгч, багийн сонголт | Зөвхөн санах ойд — апп хаагдвал алга                |
| Түгжээ           | Байхгүй                               | 60 секунд background → Face ID                         |
| Анхны theme      | Гэрэл                                 | **Харанхуй** (Профайл → Харагдац-аас солино)          |

🔴 Хамгийн чухал дүрэм: **mobile дээр хараахан хийгдээгүй цэсний мөрийг
нуухгүй** — идэвхгүй болгож "Вэб дээр" гэж тэмдэглэнэ. Ингэснээр ажилтан
вэбтэй ижил жагсаалт хараад, аль нь утсанд бэлэн болохыг шууд мэднэ.

---

## 6. Дүгнэлт

- Нэрлэсэн 18 үйлдлийн **11 нь одоо байгаа API-аар шууд хийж болно** (🟢).
- 5 нь боломжтой ч mobile-д дасгах ажил шаардана (🟡) — гол шалтгаан:
  WebSocket, HTML контент, өргөн хүснэгт, step-up MFA.
- 2 нь одоогоор хийх боломжгүй (🔴): **битүүмжлэх** (endpoint байхгүй),
  **Binance live futures dashboard** (mobile-д тохиромжгүй архитектур).
- Backend-д шаардлагатай шинэ ажил нь зөвхөн: админы push device token
  (хэрэв мэдэгдэл авах шаардлагатай бол) ба freeze endpoint (хэрэв
  ажилтнууд үнэхээр битүүмжлэх шаардлагатай бол).
