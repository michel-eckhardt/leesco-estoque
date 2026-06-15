#!/bin/bash

echo "🚀 Configurando banco de dados Leesco..."

# Generate NEXTAUTH_SECRET if not set
if [ -z "$NEXTAUTH_SECRET" ]; then
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env
  echo "✅ NEXTAUTH_SECRET gerado e salvo"
fi

# Run Prisma migrations
echo "📦 Executando migrações Prisma..."
npm run prisma:migrate -- --name init

# Seed the database
echo "🌱 Populando banco com dados iniciais..."
npm run prisma:seed

echo "✅ Banco de dados configurado com sucesso!"
echo ""
echo "🔐 Credenciais admin:"
echo "   Email: admin@leesco.com"
echo "   Senha: admin123"
echo ""
echo "Para iniciar o servidor, execute:"
echo "   npm run dev"
