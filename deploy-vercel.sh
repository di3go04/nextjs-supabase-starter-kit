#!/bin/bash
# =====================================================
#  Deploy a Vercel en 1 comando
# =====================================================
#  Uso:
#    1. Rellena .env.production con tus credenciales
#    2. ./deploy-vercel.sh
#
#  El script:
#    - Verifica que tengas Vercel CLI instalado
#    - Te autentica (abre navegador si es necesario)
#    - Importa el proyecto desde GitHub
#    - Sube todas las variables de entorno
#    - Hace el primer deploy
# =====================================================

set -euo pipefail

ENV_FILE=".env.production"
PROJECT_NAME="nextjs-supabase-starter-kit"

cd "$(dirname "$0")"

# 1. Verificar dependencias
echo "🔍 Verificando dependencias..."
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI no está instalado."
  echo "   Instala con:  npm install -g vercel"
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Falta $ENV_FILE"
  echo "   Copia .env.example a .env.production y rellena tus credenciales."
  exit 1
fi

# 2. Verificar autenticación
echo "🔐 Verificando autenticación con Vercel..."
if ! vercel whoami &> /dev/null; then
  echo "   No autenticado. Abriendo navegador..."
  vercel login
fi

echo "✅ Autenticado como: $(vercel whoami)"

# 3. Importar variables de entorno a Vercel
echo ""
echo "📤 Subiendo variables de entorno a Vercel..."

# Leer el .env.production y subir cada variable
while IFS='=' read -r key value; do
  # Skip comentarios y líneas vacías
  [[ "$key" =~ ^[[:space:]]*# ]] && continue
  [[ -z "$key" || -z "$value" ]] && continue
  # Skip placeholders sin rellenar
  [[ "$value" == *"YOUR_"* ]] && continue

  echo "   ↳ $key"
  vercel env add "$key" production <<< "$value" 2>/dev/null || \
    vercel env rm "$key" production --yes 2>/dev/null && \
    vercel env add "$key" production <<< "$value" 2>/dev/null || true
done < "$ENV_FILE"

# 4. Deploy
echo ""
echo "🚀 Haciendo deploy..."
vercel --prod --yes

echo ""
echo "🎉 ¡Deploy completo!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "   1. Obtén tu URL pública (vercel te la dio arriba)"
echo "   2. Actualiza NEXT_PUBLIC_APP_URL en Vercel → Settings → Env Vars"
echo "   3. Configura webhook de Stripe:"
echo "      URL: https://TU-DOMINIO.vercel.app/api/webhooks/stripe"
echo "      Eventos: checkout.session.completed, customer.subscription.updated,"
echo "               customer.subscription.deleted, invoice.payment_failed"
echo "   4. Copia el whsec_XXX y añádelo a STRIPE_WEBHOOK_SECRET en Vercel"
echo "   5. Actualiza URLs de redirección en Supabase → Auth → URL Configuration"
echo "   6. Redeploy: vercel --prod"
echo ""
echo "📖 Guía completa: docs/deploy.md"
