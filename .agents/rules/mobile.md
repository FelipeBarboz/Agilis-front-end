---
trigger: always_on
---

# AGILIS — REGRAS DE DESENVOLVIMENTO RESPONSIVO E ESTRUTURA

> Este documento define o padrão oficial para criação e alteração das telas do Agilis. Antes de implementar uma tela, siga estas regras. O objetivo é evitar retrabalho, duplicação de código e inconsistência entre desktop e mobile.

## 1. Estrutura padrão de pastas

Cada tela deve seguir este padrão:

```text
app/
└── home/
    ├── page.tsx
    └── _components/
        ├── hero/
        │   ├── hero.tsx
        │   ├── hero-desktop.tsx
        │   └── hero-mobile.tsx
        └── body/
            ├── body.tsx
            ├── body-desktop.tsx
            └── body-mobile.tsx
```

Para novas seções, seguir o mesmo padrão:

```text
nome-do-componente/
├── nome-do-componente.tsx
├── nome-do-componente-desktop.tsx
└── nome-do-componente-mobile.tsx
```

### Responsabilidade de cada arquivo

**`page.tsx`**
- Responsável somente por montar a página.
- Não colocar grandes blocos de HTML, regras complexas ou lógica específica de responsividade.

**`componente.tsx`**
- É o componente controlador.
- Compartilha dados, estados e lógica quando necessário.
- Decide qual versão visual será exibida.

**`componente-desktop.tsx`**
- Responsável pela apresentação desktop.

**`componente-mobile.tsx`**
- Responsável pela apresentação mobile.

Exemplo:

```tsx
export function Hero() {
  return (
    <>
      <div className="hidden lg:block">
        <HeroDesktop />
      </div>

      <div className="lg:hidden">
        <HeroMobile />
      </div>
    </>
  );
}
```

## 2. Regra principal: lógica compartilhada

Desktop e mobile são duas apresentações da mesma funcionalidade.

NÃO duplicar entre desktop e mobile:
- regras de negócio;
- chamadas de API;
- dados;
- hooks;
- estados;
- funções;
- validações.

Preferir:

```text
componente.tsx
      ↓
dados + lógica compartilhados
      ↓
desktop / mobile
```

Exemplo:

```tsx
<HeroDesktop title={title} services={services} />
<HeroMobile title={title} services={services} />
```

Uma alteração na lógica deve ser feita uma única vez e refletir nas duas versões.

Se um componente possuir exatamente o mesmo layout e comportamento em desktop e mobile, NÃO criar arquivos separados. Usar somente `componente.tsx`.

## 3. Responsividade

Utilizar os breakpoints já existentes no projeto.

Padrão do Agilis:

```text
Desktop → lg e acima
Mobile  → abaixo de lg
```

Não criar breakpoints próprios para cada tela sem necessidade.

Não utilizar `window.innerWidth` para controlar o layout.

Preferir:
- classes responsivas;
- Tailwind;
- componentes Desktop/Mobile;
- CSS já utilizado pelo projeto.

Mobile não deve ser simplesmente uma versão "encolhida" do desktop. O conteúdo pode ser reorganizado para melhorar a experiência em telas pequenas, mantendo a mesma funcionalidade e identidade visual.

## 4. Sidebar x Navbar mobile

Esta é uma regra oficial do Agilis.

### Desktop

```text
┌──────────────┬──────────────────────┐
│              │                      │
│   SIDEBAR    │       CONTEÚDO       │
│              │                      │
└──────────────┴──────────────────────┘
```

### Mobile

```text
┌──────────────────────────┐
│ ☰        AGILIS          │
├──────────────────────────┤
│                          │
│        CONTEÚDO          │
│                          │
└──────────────────────────┘
```

No desktop, utilizar Sidebar.

No mobile, a Sidebar deve ser substituída por uma Navbar superior com menu hamburguer.

Isso NÃO significa criar uma navegação diferente. As opções e a lógica de navegação devem continuar sendo as mesmas; somente a apresentação muda.

A Navbar mobile deve:
- ficar no topo;
- possuir menu hamburguer;
- manter acesso às mesmas opções principais da Sidebar;
- não cobrir o conteúdo;
- funcionar em diferentes larguras;
- abrir/fechar corretamente;
- respeitar a identidade visual do Agilis.

Quando reutilizada em várias telas, preferir:

```text
_components/
└── navigation/
    ├── navigation.tsx
    ├── navigation-desktop.tsx
    └── navigation-mobile.tsx
```

Sidebar e Navbar devem utilizar, sempre que possível, uma fonte compartilhada de itens:

```tsx
const navigationItems = [...]
```

Assim, adicionar ou remover uma opção não exige alterar várias páginas.

## 5. Estrutura visual e design

Seguir o Figma e/ou referência visual fornecida pela equipe.

Não alterar sem necessidade:
- cores;
- tipografia;
- textos;
- hierarquia visual;
- proporções;
- bordas;
- espaçamentos;
- identidade visual;
- funcionalidades.

Ao adaptar para mobile, reorganizar apenas o necessário para caber e funcionar corretamente em telas pequenas.

A tela mobile fornecida pela equipe deve ser utilizada como referência visual para manter consistência nas próximas telas.

O mobile deve manter a identidade do desktop, mas não precisa manter exatamente a mesma disposição dos elementos.

## 6. Componentização

Não colocar toda a tela em um único arquivo.

Separar componentes quando eles:
- possuem função própria;
- possuem comportamento próprio;
- são reutilizados;
- possuem estrutura visual significativa;
- podem ser isolados sem criar dependências desnecessárias.

Exemplo:

```text
_components/
├── navigation/
├── hero/
├── popular-services/
├── provider-banner/
└── footer/
```

Não criar componentes ou arquivos apenas para aumentar a quantidade de arquivos.

Cada componente deve possuir uma responsabilidade clara.

## 7. Evitar código duplicado

Não copiar uma página inteira para criar sua versão mobile.

Errado:

```text
home-desktop.tsx → página inteira
home-mobile.tsx  → página inteira copiada
```

Correto:

```text
home/
├── page.tsx
└── _components/
    ├── navigation/
    ├── hero/
    ├── body/
    └── footer/
```

Cada componente deve controlar somente sua própria responsabilidade.

## 8. Estilos

Utilizar o padrão de estilização já adotado no projeto.

Preferir:
- classes existentes;
- tokens do projeto;
- componentes reutilizáveis;
- sistema responsivo do Tailwind;
- espaçamentos consistentes.

Evitar valores arbitrários e repetidos.

Não resolver problemas visuais criando excesso de `margin`, `padding`, `top`, `left`, `width` ou `height` fixos sem necessidade.

Antes de criar um valor novo, verificar se já existe um padrão equivalente no projeto.

## 9. Largura e altura

Nunca assumir que todos os celulares possuem a mesma largura.

Evitar larguras fixas quando o elemento deveria ocupar o espaço disponível.

Preferir:

```css
width: 100%;
max-width: ...;
```

ou as classes equivalentes do projeto.

A tela deve funcionar em celulares pequenos, médios e grandes.

Não criar elementos que dependam de uma resolução específica.

## 10. Imagens

Imagens devem ser responsivas.

Evitar:
- deformação;
- cortes inesperados;
- overflow;
- largura maior que a tela;
- altura incompatível com o design.

Quando necessário, verificar:

```text
object-fit
aspect-ratio
width
height
max-width
```

## 11. Textos

Textos não devem depender de uma largura fixa.

Verificar:
- quebra de linha;
- tamanho da fonte;
- line-height;
- overflow;
- palavras longas;
- alinhamento.

Nenhum texto importante deve ficar cortado em telas menores.

## 12. Botões e áreas de toque

Elementos clicáveis devem possuir uma área confortável para toque.

Evitar botões pequenos demais.

Manter consistência de:
- altura;
- borda;
- border-radius;
- tipografia;
- espaçamento interno.

Botões não podem sair da tela ou causar scroll horizontal.

## 13. Scroll

Nenhuma tela mobile deve gerar rolagem horizontal.

Antes de finalizar, verificar:

```text
[ ] Não existe scroll horizontal
[ ] Nenhum componente ultrapassa a largura da tela
[ ] Imagens estão responsivas
[ ] Textos não estão cortados
[ ] Botões estão dentro da tela
[ ] A rolagem vertical funciona normalmente
```

A rolagem vertical deve acontecer normalmente quando o conteúdo ultrapassar a altura da tela.

## 14. Estado e Hooks

Estado deve ficar no componente responsável pela funcionalidade.

Evitar criar estados duplicados apenas porque existem versões desktop e mobile.

Hooks relacionados à regra de negócio devem ser independentes do layout.

Exemplo:

```text
hooks/
└── useServices.ts
```

O hook fornece os dados. Desktop e mobile decidem como apresentar esses dados.

Não criar um hook separado apenas para desktop e outro para mobile se a lógica for a mesma.

## 15. Ordem de desenvolvimento

Ao criar uma nova tela:

1. Criar `page.tsx`.
2. Identificar as principais seções.
3. Criar os componentes em `_components`.
4. Definir quais componentes realmente precisam de Desktop/Mobile.
5. Criar primeiro a estrutura compartilhada.
6. Implementar a lógica e os dados compartilhados.
7. Implementar o desktop conforme o design.
8. Implementar o mobile conforme a referência.
9. Testar diferentes larguras.
10. Revisar overflow, espaçamentos, textos e navegação.
11. Fazer o checklist final.

## 16. Checklist obrigatório

### Estrutura
- [ ] `page.tsx` apenas monta a página.
- [ ] Componentes estão dentro de `_components`.
- [ ] Cada componente possui responsabilidade clara.
- [ ] Não existem arquivos duplicados sem necessidade.

### Responsividade
- [ ] Desktop e mobile usam a mesma lógica.
- [ ] Mobile não é apenas desktop reduzido.
- [ ] Sidebar foi substituída pela Navbar mobile quando aplicável.
- [ ] Menu hamburguer funciona.
- [ ] Não existe scroll horizontal.
- [ ] A tela funciona em diferentes larguras.

### Código
- [ ] Não existem dados/API duplicados.
- [ ] Não existe lógica duplicada.
- [ ] Não foi utilizado `window.innerWidth` para controlar layout.
- [ ] Hooks são reutilizados.
- [ ] Componentes reutilizáveis foram extraídos quando necessário.

### Design
- [ ] A tela segue o Figma/referência.
- [ ] Cores estão consistentes.
- [ ] Tipografia está consistente.
- [ ] Espaçamentos estão consistentes.
- [ ] Imagens não estão deformadas.
- [ ] Textos não estão cortados.
- [ ] Botões possuem tamanho adequado para toque.

## 17. Regra final para o Antigravity

Ao receber uma solicitação para criar ou alterar uma tela do Agilis, seguir este documento antes de implementar.

Não alterar a arquitetura existente para resolver rapidamente um problema visual.

Se uma solução exigir duplicação de lógica, dados ou estrutura, procurar primeiro uma solução reutilizável e consistente com estas regras.

### Padrão oficial

```text
PAGE
 ↓
COMPONENTES
 ↓
LÓGICA + DADOS COMPARTILHADOS
 ↓
DESKTOP / MOBILE
```

```text
DESKTOP → Sidebar + conteúdo
MOBILE  → Navbar + hamburger + conteúdo
```

O objetivo é que alterações futuras de lógica, dados ou funcionalidades sejam feitas uma única vez e funcionem corretamente em todas as versões da tela.

Este padrão deve ser seguido em todas as novas telas do Agilis, salvo decisão arquitetural explícita da equipe.