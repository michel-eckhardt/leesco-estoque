# Leesco Estoque 📦

Sistema de gerenciamento de estoque multi-usuário com suporte a múltiplos almoxarifados, controle de retiradas e relatórios detalhados.

## ✨ Características

### 👨‍💼 Admin
- 📊 Dashboard com histórico de retiradas
- 🏢 CRUD de estoques (múltiplos almoxarifados)
- 📦 CRUD de produtos com upload de fotos (câmera/arquivo)
- 🏷️ Gerenciamento de categorias
- 👥 Gerenciamento de usuários com atribuição de estoques
- ⚠️ Alertas de estoque baixo e sem estoque
- 📈 Relatórios por usuário e categoria
- 📱 100% responsivo para mobile

### 👤 Usuário
- 👁️ Visualização do estoque designado
- 🔄 Registrar retiradas com motivo opcional
- 📷 Upload de foto pela câmera ou arquivo
- 📱 Interface otimizada para mobile

## 🛠️ Tech Stack

| Componente | Tecnologia |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Banco de Dados | PostgreSQL (Neon) |
| ORM | Prisma 5 |
| Auth | NextAuth.js v5 |
| UI | shadcn/ui + Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Tabelas | TanStack Table v8 |
| Notificações | Sonner |

## 🚀 Quick Start

### 1. Clonar e instalar
```bash
git clone https://github.com/michel-eckhardt/leesco-estoque.git
cd leesco-estoque
npm install
```

### 2. Configurar ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com:
- `DATABASE_URL` (PostgreSQL local ou Neon)
- `NEXTAUTH_SECRET` (gere com `openssl rand -base64 32`)

### 3. Setup banco de dados
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Iniciar desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 📝 Credenciais Demo
- **Email:** admin@leesco.com
- **Senha:** admin123

## 🌐 Deploy no Vercel

### Pré-requisitos
- Conta Vercel (gratuita em vercel.com)
- Repositório GitHub
- Banco de dados Neon (gratuito em neon.tech)

### Passo a Passo

1. **Criar banco em Neon**
   - Acesse https://neon.tech
   - Crie um novo projeto PostgreSQL
   - Copie a CONNECTION STRING

2. **Fazer push para GitHub**
   ```bash
   git add .
   git commit -m "Deploy ready"
   git push origin main
   ```

3. **Criar projeto no Vercel**
   - Acesse https://vercel.com
   - Clique em "Add New" → "Project"
   - Selecione seu repositório GitHub
   - Framework: Next.js

4. **Configurar variáveis de ambiente**
   - Em Settings → Environment Variables, adicione:
   ```
   DATABASE_URL=sua-neon-connection-string
   NEXTAUTH_SECRET=seu-secret-aleatorio
   NEXTAUTH_URL=https://seu-projeto.vercel.app
   ```

5. **Deploy**
   - Vercel fará deploy automaticamente
   - Na primeira vez, migrations rodam automatically

6. **Seed em produção (opcional)**
   ```bash
   npx prisma db seed --skip-generate
   ```

## 📱 Responsividade

- ✅ Mobile-first design
- ✅ Sidebar colapsável em mobile
- ✅ Tabelas otimizadas para pequenas telas
- ✅ Câmera e upload de arquivo
- ✅ Formulários com padding adaptativo

## 🔐 Segurança

- 🔒 Senhas com bcryptjs
- 🛡️ CSRF protection via NextAuth
- 🔑 JWT tokens
- 🚫 Route protection via middleware
- ✅ Server-side validation (Zod)

## 📂 Estrutura do Projeto

```
src/
├── app/                    # Pages e layouts
│   ├── (admin)/           # Rotas protegidas admin
│   ├── (usuario)/         # Rotas protegidas usuário
│   └── (auth)/            # Rotas públicas
├── actions/               # Server Actions
├── components/            # React components
│   ├── forms/            # Componentes de formulário
│   ├── tables/           # Componentes de tabela
│   ├── layout/           # Layouts
│   └── ui/               # shadcn/ui
├── lib/                   # Utilidades
│   ├── validations/      # Schemas Zod
│   ├── auth.ts           # NextAuth config
│   └── prisma.ts         # Prisma client
└── middleware.ts          # Route protection

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Dados iniciais
```

## 📊 Database Schema

```
User (admin/user)
  ↓
UserStock (N:N) ← Stock
                    ↓
              StockItem (quantidade atual)
                    ↓
              Product ← Category
                ↓
           Withdrawal (histórico retiradas)
```

## 🚀 Scripts Disponíveis

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check

# Prisma
npx prisma migrate dev --name descricao
npx prisma migrate deploy  # Em produção
npx prisma db seed        # Popular banco
npx prisma studio        # GUI do banco
```

## 🐛 Troubleshooting

### "Unauthorized"
Sessão expirou. Faça login novamente.

### "Connection refused" (Database)
- Verifique PostgreSQL está rodando
- Confirme DATABASE_URL está correto
- Para Neon, adicione seu IP à whitelist

### Fotos não aparecem
- Configure Cloudinary (opcional)
- Ou use fotos como Data URL (já implementado)

## 📝 Roadmap

- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Integração com Cloudinary
- [ ] Dark mode
- [ ] Configurações de estoque mínimo
- [ ] Backup automático
- [ ] API REST para integração

## 📄 Licença

MIT License

## 👤 Autor

Michel Eckhardt - [GitHub](https://github.com/michel-eckhardt)

---

**Desenvolvido com ❤️ usando Next.js + Prisma + PostgreSQL**
