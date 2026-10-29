#!/usr/bin/env bash
# X-Meta Admin — EAS production build, дараа нь store руу submit.
# `.env` нь gitignore-д байгаа тул cloud build руу очихгүй — утгууд EAS-ийн
# `production` environment-оос ирнэ. Тиймээс build-ийн өмнө түүнийг шалгана.
set -euo pipefail

cd "$(dirname "$0")"

# env.ts-ийн `required()` түлхүүрүүд — дутуу бол апп асахгүй.
REQUIRED_ENV="
EXPO_PUBLIC_COGNITO_USER_POOL_ID
EXPO_PUBLIC_COGNITO_CLIENT_ID
EXPO_PUBLIC_AWS_REGION
EXPO_PUBLIC_XMETA_API_URL
EXPO_PUBLIC_BACKOFFICE_API_URL
EXPO_PUBLIC_SUPPORT_WS_URL
"

PLATFORM="all"
SUBMIT=1
CHECKS=1
ASSUME_YES=0

usage() {
  cat <<'EOF'
Хэрэглээ: ./deploy.sh [ios|android|all] [сонголт]

  --no-submit     Зөвхөн build хийнэ, store руу илгээхгүй
  --skip-checks   typecheck / lint / test алгасна
  -y, --yes       Баталгаажуулах асуултгүй
  -h, --help      Энэ тусламж
EOF
}

step() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }
fail() {
  printf '\n\033[31m✖ %b\033[0m\n' "$1" >&2
  exit 1
}

for arg in "$@"; do
  case "$arg" in
    ios | android | all) PLATFORM="$arg" ;;
    --no-submit) SUBMIT=0 ;;
    --skip-checks) CHECKS=0 ;;
    -y | --yes) ASSUME_YES=1 ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      usage
      fail "Танигдаагүй аргумент: $arg"
      ;;
  esac
done

step "EAS бүртгэл"
command -v eas >/dev/null 2>&1 || fail "eas-cli алга: npm install -g eas-cli"
account=$(eas whoami 2>/dev/null | head -1) ||
  fail "EAS-д нэвтрээгүй байна: eas login"
echo "Нэвтэрсэн: $account"

step "EAS production environment"
if ! remote_env=$(eas env:list production 2>&1); then
  fail "EAS production env-ийг уншиж чадсангүй. \"$account\" бүртгэл x-meta
  төсөлд эрхтэй эсэхийг шалгаад (eas login), дахин оролдоно уу."
fi
missing=""
for key in $REQUIRED_ENV; do
  grep -q "$key" <<<"$remote_env" || missing="$missing $key"
done
if [ -n "$missing" ]; then
  fail "EAS production env-д дутуу:$missing
  Нэмэх: eas env:push production --path .env"
fi
echo "Шаардлагатай бүх хувьсагч байна."

if [ "$CHECKS" -eq 1 ]; then
  step "typecheck · lint · test"
  npm run typecheck
  npm run lint
  npm test -- --silent
fi

version=$(node -p "require('./app.json').expo.version")
dirty=$(git status --porcelain | wc -l | tr -d ' ')

step "Баталгаажуулалт"
echo "Хувилбар:   $version (build дугаар EAS дээр автоматаар нэмэгдэнэ)"
echo "Платформ:   $PLATFORM"
if [ "$SUBMIT" -eq 1 ]; then
  echo "Submit:     тийм (eas.json → submit.production)"
else
  echo "Submit:     үгүй"
fi
if [ "$dirty" -gt 0 ]; then
  echo "⚠ Commit хийгээгүй $dirty файл байна — EAS одоогийн working tree-г илгээнэ."
fi

if [ "$ASSUME_YES" -eq 0 ]; then
  read -r -p "Production build эхлүүлэх үү? [y/N] " answer
  case "$answer" in
    y | Y | yes) ;;
    *) fail "Цуцаллаа." ;;
  esac
fi

step "EAS build"
build_args=(build --profile production --platform "$PLATFORM")
if [ "$SUBMIT" -eq 1 ]; then
  build_args+=(--auto-submit)
fi
eas "${build_args[@]}"

printf '\n\033[32m✔ Дууслаа.\033[0m\n'
