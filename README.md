# X-Meta Admin Mobile

X-Meta crypto exchange-ийн админ ажилтнуудад зориулсан mobile апп.
React Native (Expo SDK 57) · expo-router · NativeWind · TanStack Query + Zustand.

> Дүрэм, архитектур, API гэрээ → [CLAUDE.md](CLAUDE.md) ба [docs/](docs/)

## Эхлүүлэх

```bash
npm install
cp .env.example .env.local   # утгыг xmeta-admin вэбийн .env-ээс аваад бөглө
npx expo run:ios             # эсвэл npx expo run:android
```

⚠️ `.env.local` бөглөөгүй бол апп "Тохиргооны алдаа" дэлгэц харуулаад
зогсоно — дутуу утгыг нэрээр нь хэлнэ.

Native модуль (Face ID, secure store, Amplify) ашигладаг тул **Expo Go
ажиллахгүй** — `expo run:*` -ээр dev build хийнэ.

## Команд

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npm test            # jest
npm run format      # prettier --write
```

## Бүтэц

```
src/app/        expo-router route (default export заавал)
src/screens/    route биш дэлгэц
src/core/       config network errors money session query
src/components/ дундын компонент + barrel
src/services/   Cognito биометрик socket
src/theme/      token
src/lib/        logger date cn messages
docs/           дүрэм, урсгал, token
```

## Design system gallery

Аппыг асаагаад нүүр хуудаснаас "Design system gallery" рүү ор — компонент
бүрийг хоёр theme дээр нэг дор харна.
