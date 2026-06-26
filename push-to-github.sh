#!/bin/bash
# =====================================================
#  Push del Starter Kit a GitHub
# =====================================================
#  Uso:
#    1. Genera un PAT en https://github.com/settings/tokens
#       con scope "repo" + "workflow"
#    2. Ejecuta:  GH_TOKEN=tu_token_aqui ./push-to-github.sh
# =====================================================

set -euo pipefail

REPO_NAME="nextjs-supabase-starter-kit"
REPO_DESC="Next.js + Supabase Starter Kit — Auth, RBAC, Stripe, emails, i18n, teams, admin panel. Lanza tu SaaS en días."

if [ -z "${GH_TOKEN:-}" ]; then
  echo "❌ Falta GH_TOKEN"
  echo "   Genera un PAT en: https://github.com/settings/tokens"
  echo "   Scopes necesarios: repo, workflow"
  echo "   Ejecuta: GH_TOKEN=ghp_xxx ./push-to-github.sh"
  exit 1
fi

# Validar token
echo "🔐 Validando token..."
USER=$(curl -s -H "Authorization: token $GH_TOKEN" https://api.github.com/user | grep -oP '"login":\s*"\K[^"]+')
if [ -z "$USER" ]; then
  echo "❌ Token inválido"
  exit 1
fi
echo "✅ Autenticado como: $USER"

# Crear repo
echo "📦 Creando repositorio '$REPO_NAME'..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"$REPO_DESC\",\"private\":false,\"has_issues\":true,\"has_projects\":true,\"has_wiki\":true}")

REPO_URL=$(echo "$RESPONSE" | grep -oP '"html_url":\s*"\K[^"]+' | head -1)
CLONE_URL=$(echo "$RESPONSE" | grep -oP '"clone_url":\s*"\K[^"]+' | head -1)

if [ -z "$REPO_URL" ]; then
  echo "❌ Error creando repo:"
  echo "$RESPONSE" | head -20
  exit 1
fi
echo "✅ Repo creado: $REPO_URL"

# Configurar remote
cd "$(dirname "$0")"
git remote remove origin 2>/dev/null || true
# Usar token en la URL para push sin prompt
AUTH_URL="https://x-access-token:${GH_TOKEN}@github.com/${USER}/${REPO_NAME}.git"
git remote add origin "$AUTH_URL"

# Push
echo "🚀 Subiendo código (159 archivos)..."
git push -u origin main

# Limpiar token del remote (reemplazar con URL pública)
git remote set-url origin "https://github.com/${USER}/${REPO_NAME}.git"

echo ""
echo "🎉 ¡Listo!"
echo "   Tu repo: $REPO_URL"
echo "   Configura topics en: https://github.com/${USER}/${REPO_NAME}/settings"
echo ""
echo "   Topics sugeridos: nextjs, supabase, stripe, react, typescript,"
echo "   tailwindcss, shadcn, boilerplate, starter-kit, saas"
