#!/bin/bash

# Script de setup do Leesco Estoque

set -e

echo "🚀 Setup Leesco Estoque"
echo "======================"

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
  echo "📝 Criando .env.local a partir de .env.example..."
  cp .env.example .env.local
  echo "✅ .env.local criado. Edite com suas credenciais!"
  echo ""
  echo "⚠️  Você precisa editar .env.local com:"
  echo "   - DATABASE_URL (PostgreSQL local ou Neon)"
  echo "   - NEXTAUTH_SECRET (gere com: openssl rand -base64 32)"
  exit 1
fi

echo "📦 Instalando dependências..."
npm install

echo "🗄️  Rodando migrations..."
npx prisma migrate dev

echo "🌱 Populando banco com dados iniciais..."
npx prisma db seed

echo ""
echo "✅ Setup completo!"
echo ""
echo "Para iniciar o servidor:"
echo "  npm run dev"
echo ""
echo "Acesse: http://localhost:3000"
echo "Credenciais: admin@leesco.com / admin123"
