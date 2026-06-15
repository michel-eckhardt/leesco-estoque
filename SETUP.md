# 🚀 Leesco Estoque - Guia de Setup

## Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 13+ rodando localmente (ou use Neon)
- npm ou yarn

## Passo 1: Configurar Banco de Dados

### Opção A: PostgreSQL Local
```bash
# Crie um banco de dados PostgreSQL
createdb leesco

# Atualize o .env com sua DATABASE_URL
DATABASE_URL="postgresql://postgres:root@localhost:5432/leesco"
```

### Opção B: Neon (Recomendado para Produção)
1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta e um novo projeto PostgreSQL
3. Copie a connection string
4. Coloque em `.env`:
```bash
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname"
```

## Passo 2: Configurar NextAuth Secret

Gere um secret seguro:
```bash
# No PowerShell (Windows)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

# No Unix/Mac/Linux
openssl rand -base64 32
```

Copie o resultado para `.env`:
```bash
NEXTAUTH_SECRET="seu-secret-aqui"
```

## Passo 3: Executar Migrações

```bash
# Criar as tabelas no banco
npm run prisma:migrate -- --name init

# Popular com dados iniciais (usuário admin)
npm run prisma:seed
```

## Passo 4: Iniciar o Servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Credenciais Padrão

```
Email: admin@leesco.com
Senha: admin123
```

## Variáveis de Ambiente

### Obrigatórias
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret para JWT (execute comando acima)
- `NEXTAUTH_URL` - URL da aplicação (http://localhost:3000 para dev)

### Para Upload de Fotos (Cloudinary)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

[Criar conta grátis no Cloudinary](https://cloudinary.com)

## Comandos Disponíveis

```bash
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Executar versão de produção
npm run prisma:migrate   # Criar/atualizar migrations
npm run prisma:seed      # Executar arquivo seed
npm run prisma:studio    # Abrir Prisma Studio (GUI)
```

## Estrutura de Usuários

### Admin
- Acesso total a tudo
- Gerencia: Estoques, Produtos, Usuários
- Vê todas as retiradas

### User
- Vê apenas seu(s) estoque(s)
- Pode criar retiradas de produtos
- Vê histórico de suas retiradas

## Deploy no Vercel

1. Push para GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente
4. Vercel fará deploy automático

## Troubleshooting

### "Database connection refused"
- Verifique se PostgreSQL está rodando
- Confirme DATABASE_URL está correta

### "Module not found: PrismaClient"
```bash
npm run prisma:generate
```

### Porta 3000 em uso
```bash
# Mude a porta
npm run dev -- -p 3001
```

---

**Próximas fases:** CRUD de Estoques, Produtos, Usuários e Dashboard
