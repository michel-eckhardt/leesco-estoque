# 🚀 Guia de Deployment - Leesco Estoque

Instruções passo a passo para fazer deploy da aplicação em produção.

## Opção 1: Vercel + Neon (Recomendado)

### Custo Estimado
- **Vercel:** Gratuito (até 100GB/mês bandwidth)
- **Neon PostgreSQL:** Gratuito (até 3 projetos, 0.5GB storage)
- **Total:** R$0/mês

### Pré-requisitos
1. Conta GitHub
2. Conta Vercel (gratuita)
3. Conta Neon (gratuita)

### Passo 1: Preparar Repositório GitHub

```bash
# No seu projeto local
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Passo 2: Criar Banco de Dados no Neon

1. Acesse https://neon.tech
2. Clique em "Sign up"
3. Crie um novo projeto (escolha **PostgreSQL 16**)
4. Após criado, copie a **Connection String**:
   ```
   postgresql://user:password@host/database?sslmode=require
   ```
5. **⚠️ Guarde em local seguro (será usada em breve)**

### Passo 3: Deploy no Vercel

1. Acesse https://vercel.com
2. Clique em "Add New..." → "Project"
3. Clique em "Import Git Repository"
4. Selecione seu repositório `leesco-estoque`
5. Selecione o framework: **Next.js**
6. Deixe a configuração padrão e clique em "Deploy"

### Passo 4: Configurar Variáveis de Ambiente

Antes que a build complete:

1. No painel do Vercel, vá para **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

```
DATABASE_URL
postgresql://seu:password@host/database?sslmode=require

NEXTAUTH_SECRET
(gere com: openssl rand -base64 32)

NEXTAUTH_URL
https://seu-projeto.vercel.app
```

**Obtenha a URL padrão:**
- Vercel pode sugerir um domínio (ex: seu-projeto.vercel.app)
- Ou registre seu próprio domínio e atualize aqui

3. Clique em "Save"

### Passo 5: Aguardar Build e Deploy

- Vercel iniciará automaticamente a build
- Migrations do Prisma rodarão automaticamente
- Após sucesso, seu site estará em produção

### Passo 6: Seed de Dados (Primeira Vez)

Para popular o banco com o usuário admin inicial:

**Opção A: Via CLI**
```bash
# Com DATABASE_URL de produção configurada localmente
DATABASE_URL="sua-neon-connection-string" npx prisma db seed
```

**Opção B: Manual**
1. Acesse [https://console.neon.tech](https://console.neon.tech)
2. Vá para seu projeto → "SQL Editor"
3. Execute o SQL de seed (arquivo `prisma/seed.ts` adaptado para SQL)

Ou adicione um user admin manualmente via Prisma Studio:
```bash
DATABASE_URL="sua-neon-connection-string" npx prisma studio
```

## Opção 2: Render + Neon

### Custo Estimado
- **Render:** Gratuito (com limitações) ou ~$7/mês
- **Neon:** Gratuito
- **Total:** R$0-30/mês

### Passos Similares:
1. Crie um banco Neon (igual ao Vercel)
2. Acesse https://render.com
3. Crie um novo "Web Service"
4. Conecte seu GitHub
5. Configure variáveis de ambiente
6. Deploy

## Opção 3: Fly.io (Alternativa Econômica)

### Custo Estimado
- **Fly.io:** Gratuito (3 shared-cpu-1x 256MB VMs)
- **PostgreSQL:** Precisa configurar separadamente

Veja documentação em https://fly.io/docs/getting-started/

## ✅ Checklist Pré-Deploy

- [ ] Todas as mudanças commiteadas e pushadas
- [ ] Variáveis de ambiente copiadas de `.env.example`
- [ ] DATABASE_URL validada e funcionando
- [ ] NEXTAUTH_SECRET gerada (novo valor em produção)
- [ ] NEXTAUTH_URL atualizada para domínio de produção
- [ ] Build local testa sem erros: `npm run build`
- [ ] Migrations prontas: `npx prisma migrate status`

## 🔒 Segurança em Produção

### NextAuth
```bash
# Gerar NEXTAUTH_SECRET seguro
openssl rand -base64 32
```

### Database
- ✅ Use DATABASE_URL com `sslmode=require`
- ✅ Nunca commite `.env` com valores reais
- ✅ Use apenas variáveis de ambiente no Vercel/Render

### Cloudinary (opcional)
Se quiser usar upload de fotos:
1. Crie conta em https://cloudinary.com (gratuita)
2. Obtenha Cloud Name, API Key, API Secret
3. Configure no Vercel Environment Variables

## 🚨 Troubleshooting

### Build falha com "DATABASE_URL não definida"
✅ Verifique se a variável foi adicionada **antes** do deploy

### Migrations falham em produção
```bash
# Rodar manualmente:
DATABASE_URL="seu-neon-url" npx prisma migrate deploy
```

### Conexão ao banco falha
- Verifique IP do Vercel está permitido em Neon:
  - Neon → Project → Settings → IP Whitelist
  - Adicione `0.0.0.0/0` para permitir qualquer IP

### Usuário admin não existe
```bash
# Via Prisma Studio
DATABASE_URL="seu-neon-url" npx prisma studio
```

Crie manualmente um usuário com:
- name: "Admin"
- email: "admin@leesco.com"
- password: bcrypt hash de "admin123"
- role: "ADMIN"

## 📊 Monitoramento

### Vercel
- Dashboard automático com logs
- Acesse seu projeto → "Deployments"

### Neon
- Acesse https://console.neon.tech
- Monitor: Query insights, Storage

### Alertas Recomendados
- Configurar notificações de erro em Vercel
- Backup automático do banco

## 🔄 Atualizar em Produção

1. Faça mudanças localmente
2. Teste com `npm run build`
3. Faça push para main:
   ```bash
   git push origin main
   ```
4. Vercel fará deploy automaticamente
5. Migrations rodam automaticamente se necessário

## 🆘 Rollback de Deploy

Se algo der errado:

1. Acesse Vercel → seu projeto → "Deployments"
2. Encontre o deployment anterior
3. Clique em "..." → "Promote to Production"

## 📈 Escala Futura

Se precisar escalar:

- **Database:** Upgrade Neon para plano pago
- **Hosting:** Vercel Pro ($20/mês) para mais recursos
- **CDN:** Vercel incluso
- **Backups:** Neon oferece backups automáticos

## 📞 Suporte

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs/deployment

---

**Desenvolvido com Next.js 16 + Prisma + PostgreSQL**
