# 💬 DB Messages

> Sistema de gerenciamento e visualização de mensagens integrado com Blip, construído com Next.js 16, React 19 e React Compiler.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Funcionalidades](#-funcionalidades) •
[Tecnologias](#-stack-tecnológica) •
[Instalação](#-instalação) •
[Estrutura](#-estrutura-do-projeto) •
[Desenvolvimento](#-desenvolvimento) •
[Deploy](#-deploy)

</div>

---

## 📋 Sobre o Projeto

**DB Messages** é uma aplicação moderna de gerenciamento de mensagens que se integra com a plataforma Blip para gerenciar:

- 💬 **Conversas** - Visualização completa de histórico de mensagens
- 👥 **Contatos** - Gerenciamento de contatos e clientes
- 🎫 **Tickets** - Sistema de atendimento e suporte
- 👨‍💼 **Atendentes** - Gerenciamento de equipe de suporte
- 📊 **Importações** - Jobs assíncronos de importação de dados

### 🎯 Diferencial

Construído com as **mais recentes tecnologias** do ecossistema React:
- ⚡ **React Compiler** habilitado - otimizações automáticas
- 🚀 **Next.js 16** - App Router e Server Actions
- 🎨 **Radix UI** - Componentes acessíveis e customizáveis
- 🔐 **Better Auth** - Autenticação moderna e segura
- 📱 **Responsive** - Funciona perfeitamente em mobile e desktop

---

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Login com email e senha
- [x] Cadastro de novos usuários
- [x] Sessões persistentes
- [x] Proteção de rotas privadas

### 💬 Mensagens
- [x] Visualização de conversas em tempo real
- [x] Suporte a múltiplos tipos de mensagens:
  - 📝 Mensagens de texto
  - 🎵 Mensagens de áudio
  - 😊 Emojis e reações
  - 🔘 Botões interativos
  - 📋 Listas interativas
  - ⭐ Avaliações e feedback
- [x] Divisores de data automáticos
- [x] Auto-scroll para mensagens recentes
- [x] Estados de loading e erro

### 👥 Contatos
- [x] Lista de contatos com busca
- [x] Detalhes do contato (nome, telefone)
- [x] Histórico completo de conversas
- [x] Integração com Blip

### 🎫 Tickets
- [x] Sistema de tickets de atendimento
- [x] Visualização por atendente
- [x] Status de tickets
- [x] Histórico de interações

### 👨‍💼 Atendentes
- [x] Gerenciamento de atendentes
- [x] Importação em massa
- [x] Jobs assíncronos com progresso
- [x] Upload de arquivos

### ⚙️ Configurações
- [x] Perfil do usuário
- [x] Preferências do sistema
- [x] Temas (Light/Dark/System)

---

## 🛠 Stack Tecnológica

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 16.1.1 | Framework React com SSR e App Router |
| **React** | 19.2.3 | Biblioteca para interfaces |
| **TypeScript** | 5.x | Superset tipado do JavaScript |
| **Tailwind CSS** | 4.x | Framework CSS utility-first |
| **Radix UI** | Latest | Componentes acessíveis headless |
| **TanStack Query** | 5.90.20 | Data fetching e cache |
| **React Hook Form** | 7.71.1 | Gerenciamento de formulários |
| **Zod** | 4.3.6 | Validação de schemas |
| **Framer Motion** | 12.29.0 | Animações |
| **date-fns** | 4.1.0 | Manipulação de datas |
| **Lucide React** | Latest | Ícones |

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Prisma** | 7.3.0 | ORM para PostgreSQL |
| **PostgreSQL** | Latest | Banco de dados relacional |
| **Better Auth** | 1.4.18 | Sistema de autenticação |
| **Axios** | 1.13.2 | Cliente HTTP |
| **Supabase** | 2.91.1 | Storage e realtime |

### DevOps

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Biome** | 2.2.0 | Linter e formatter |
| **Babel React Compiler** | 1.0.0 | Compilador React |

---

## 📁 Estrutura do Projeto

```
db-messages/
├── 📄 Configuration Files
│   ├── .env                          # Variáveis de ambiente
│   ├── package.json                  # Dependências
│   ├── tsconfig.json                 # Config TypeScript
│   ├── next.config.ts                # Config Next.js
│   └── biome.json                    # Config Biome
│
├── 🗄️ prisma/
│   ├── schema.prisma                 # Schema do banco
│   └── migrations/                   # Migrações
│
├── 🎨 public/
│   └── ui-*.png                      # Assets estáticos
│
└── 📦 src/
    ├── 🎯 app/                       # App Router (Next.js 16)
    │   ├── layout.tsx                # Layout raiz
    │   ├── error.tsx                 # Error boundary
    │   ├── globals.css               # Estilos globais
    │   ├── api/                      # API Routes
    │   │   └── auth/[...all]/        # Better Auth
    │   └── (pages)/
    │       ├── (public)/             # Rotas públicas
    │       │   ├── sign-in/          # Login
    │       │   └── sign-up/          # Cadastro
    │       └── (private)/            # Rotas protegidas
    │           ├── attendants/       # Atendentes
    │           ├── contacts/         # Contatos
    │           ├── settings/         # Configurações
    │           └── tickets/          # Tickets
    │
    ├── ⚡ actions/                   # Server Actions
    │   ├── upload-files.ts
    │   ├── attendants/
    │   ├── better-auth/
    │   ├── blip/                     # Integração Blip
    │   ├── jobs/
    │   └── users/
    │
    ├── 🎨 components/
    │   ├── ui/                       # Componentes base (shadcn)
    │   ├── forms/                    # Formulários
    │   ├── sidebar/                  # Menu lateral
    │   ├── aside/                    # Painel lateral
    │   ├── ticket/                   # Componentes de tickets
    │   └── contacts/                 # Componentes de contatos
    │
    ├── 🔧 functions/                 # Utilitários puros
    │   ├── format-chat-date.ts
    │   ├── get-initials.ts
    │   ├── message-type-guards.ts    # Type guards
    │   └── ...
    │
    ├── 🪝 hooks/                     # Custom Hooks
    │   ├── use-messages.ts
    │   ├── use-auto-scroll.ts
    │   ├── use-file-upload.ts
    │   └── use-mobile.ts
    │
    ├── 📚 lib/                       # Configurações
    │   ├── auth.ts                   # Better Auth (server)
    │   ├── auth-client.ts            # Better Auth (client)
    │   ├── prisma.ts
    │   ├── supabase.ts
    │   ├── axios.ts
    │   └── utils.ts
    │
    ├── 🎭 providers/                 # Context Providers
    │   ├── react-query-dev-tools.tsx
    │   └── theme-provider.tsx
    │
    ├── ✅ schemas/                   # Validações Zod
    │   ├── sign-in-schema.ts
    │   ├── sign-up-schema.ts
    │   ├── update-user-schema.ts
    │   └── import-attendants-schema.ts
    │
    ├── 📝 types/                     # TypeScript Types
    │   ├── index.types.ts
    │   ├── message.types.ts
    │   ├── blip-account-response.types.ts
    │   ├── blip-attendants-response.types.ts
    │   ├── lime-collection-response.types.ts
    │   ├── lime-thread-messages-response.types.ts
    │   └── lime-ticket-response.types.ts
    │
    ├── 🔢 constants/                 # Constantes
    │   └── contacts.constants.ts
    │
    └── env.ts                        # Tipagem de env vars
```

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 20+ 
- **npm** ou **pnpm** ou **yarn**
- **PostgreSQL** 14+
- **Conta Blip** (para integração)
- **Conta Supabase** (opcional, para storage)

### Passo a Passo

1️⃣ **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/db-messages.git
cd db-messages
```

2️⃣ **Instale as dependências**

```bash
npm install
# ou
pnpm install
# ou
yarn install
```

3️⃣ **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db_messages"

# Better Auth
BETTER_AUTH_SECRET="seu-secret-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# Blip Integration
BLIP_API_KEY="sua-api-key-do-blip"
BLIP_AUTHORIZATION="sua-authorization-do-blip"

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL="sua-url-do-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key"
```

4️⃣ **Configure o banco de dados**

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# (Opcional) Seed inicial
npx prisma db seed
```

5️⃣ **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev           # Inicia servidor de desenvolvimento

# Build
npm run build         # Build para produção
npm run start         # Inicia servidor de produção

# Code Quality
npm run lint          # Executa Biome linter
npm run format        # Formata código com Biome

# Database
npx prisma studio     # Abre Prisma Studio (GUI)
npx prisma migrate    # Gerencia migrações
npx prisma generate   # Gera Prisma Client
```

---

## 💻 Desenvolvimento

### Criando um novo componente

```bash
# Componente UI (shadcn)
npx shadcn-ui@latest add button

# Componente customizado
src/components/meu-componente/
├── meu-componente.tsx
├── meu-componente.types.ts
└── meu-componente.test.tsx
```

### Adicionando uma nova rota

```bash
src/app/(pages)/(private)/nova-rota/
├── page.tsx              # Página principal
├── layout.tsx            # Layout (opcional)
└── loading.tsx           # Loading state (opcional)
```

### Criando um Server Action

```typescript
// src/actions/minhas-actions/minha-action.ts
"use server"

import { prisma } from "@/lib/prisma"

export async function minhaAction(data: MyData) {
  const result = await prisma.myModel.create({
    data
  })
  return result
}
```

### Usando TanStack Query

```typescript
"use client"

import { useQuery } from "@tanstack/react-query"
import { minhaAction } from "@/actions/minhas-actions/minha-action"

export function MeuComponente() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["minha-query"],
    queryFn: () => minhaAction(),
  })

  // React Compiler otimiza automaticamente!
  if (isLoading) return <Loading />
  if (error) return <Error error={error} />
  
  return <div>{data}</div>
}
```

---

## 🎨 Temas e Estilos

O projeto usa **Tailwind CSS 4** com suporte a temas:

```typescript
// Trocar tema programaticamente
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  )
}
```

### Customizando cores

Edite `src/app/globals.css`:

```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... */
  }
}
```

---

## 🔐 Autenticação

O projeto usa **Better Auth** com suporte a:

- ✅ Email/Password
- ✅ Session Management
- ✅ Protected Routes
- ✅ Server-side Auth

### Exemplo de uso

```typescript
// Client-side
import { useSession } from "@/lib/auth-client"

function MyComponent() {
  const { data: session } = useSession()
  
  if (!session) return <Login />
  
  return <div>Olá, {session.user.name}!</div>
}
```

```typescript
// Server-side (Server Actions)
import { auth } from "@/lib/auth"

export async function myServerAction() {
  const session = await auth()
  
  if (!session) {
    throw new Error("Unauthorized")
  }
  
  // Ação protegida
}
```

---

### TanStack Query DevTools

Já incluído no projeto! Acesse no modo desenvolvimento.

---

## 📚 Recursos e Documentação

### Documentação Oficial

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Radix UI Docs](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Guias do Projeto

- 📖 [README.md](./README.md) - Este arquivo
- 📖 [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) - Guia de refatoração
- 📖 [REACT_COMPILER_GUIDE.md](./REACT_COMPILER_GUIDE.md) - Guia do React Compiler

---

### Padrões de Código

- ✅ Use **TypeScript** em todos os arquivos
- ✅ Siga o **Biome** config (lint + format)
- ✅ Escreva testes para novas features
- ✅ Documente mudanças significativas
- ✅ Use **Conventional Commits**

---

## 🐛 Problemas Conhecidos

### Issue #1: Auto-scroll não funciona em Safari
**Status:** Em investigação  
**Workaround:** Usar Chrome ou Firefox

### Issue #2: Upload de arquivos grandes (>10MB)
**Status:** Planejado  
**Workaround:** Dividir em múltiplos uploads

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

Desenvolvido com ❤️ por:

- **Nathan Ferreira** - [@N7thz](https://github.com/N7thz)

---

## ⭐ Mostre seu apoio

Se este projeto foi útil, dê uma ⭐ no GitHub!

---

<div align="center">

**[⬆ Voltar ao topo](#-db-messages)**

Made with ❤️ using React 19, Next.js 16, and React Compiler

</div>

