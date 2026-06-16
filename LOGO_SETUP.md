# Configuração da Logo OceanPact

## Status Atual

✅ Logo SVG padrão (3 ondas azuis) está implementada e funcionando.

## Para Usar a Logo PNG/Real

Se você deseja usar a imagem PNG/real do OceanPact em vez do SVG padrão:

### Passo 1: Copiar imagem
1. Salve a imagem do logo como `logo.png` 
2. Coloque em: `public/logo.png`

### Passo 2: Atualizar componente
Edite `src/components/logo.tsx` e altere para:

```tsx
export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="OceanPact"
        className="h-8 w-auto"
      />
      <span className="text-lg font-bold text-blue-600 hidden sm:inline">
        OceanPact
      </span>
    </div>
  );
}
```

### Passo 3: Testar
```bash
npm run dev
```

Acesse http://localhost:3000 e verifique a logo na sidebar e login page.

## Locais Onde a Logo Aparece

1. **Sidebar Admin** (`src/components/layout/admin-sidebar.tsx`)
   - Topo da barra lateral
   - Visível em desktop e mobile

2. **Página de Login** (`src/app/(auth)/login/page.tsx`)
   - Topo centralizado
   - Com nome "OceanPact" ao lado

## Customizações Opcionais

### Alterar tamanho do SVG padrão
No arquivo `src/components/logo.tsx`, altere:
```tsx
className="h-8 w-8"  // Altere 8 para outro valor (ex: 10, 12, 16)
```

### Alterar cor do SVG
Na seção stroke, altere de `#0369a1` para sua cor desejada:
```tsx
stroke="#0369a1"  // Código hexadecimal da cor
```

### Adicionar nome/texto ao lado
Já está implementado! O texto "OceanPact" aparece ao lado da logo em telas maiores (hidden em mobile).

---

**Nota:** O logo SVG está funcionando perfeitamente. Use-o enquanto não tiver a imagem PNG oficial, ou substitua conforme instruções acima.
