---
description: Agilis — Fluxo de Funcionário de Loja
---

1. Objetivo
O Agilis possui diferentes contextos de utilização:

Usuário/cliente;
Prestador;
Loja;
Funcionário de loja.
Este documento define o fluxo de funcionário de loja, desde o recebimento do convite até a utilização das funcionalidades da loja.

O funcionário possui uma conta normal no Agilis, mas pode ser vinculado a uma loja através de um link de convite.

Depois de entrar na loja, seu acesso será determinado pelo cargo atribuído a ele e pelas permissões desse cargo.

O sistema de cargos e permissões será semelhante ao conceito de cargos do Discord:

Loja
└── Cargos
    ├── Administrador
    ├── Gerente
    ├── Atendente
    └── Técnico

Funcionário
└── Cargo
    └── Permissões
Importante
A lógica definitiva de cargos e permissões já existe no backend, mas o backend ainda não está conectado ao frontend.

Neste momento:

não modificar o backend;
não criar uma nova arquitetura definitiva de permissões;
não inventar a estrutura da API;
não assumir nomes definitivos de permissões;
utilizar mocks apenas quando necessário para desenvolver as interfaces;
manter os mocks isolados e fáceis de substituir posteriormente.
2. Regra principal de desenvolvimento
O desenvolvimento deste fluxo deve acontecer uma etapa por vez.

O Antigravity NUNCA deve executar duas etapas consecutivas sem autorização explícita do usuário.

Ao finalizar uma etapa, deve:

concluir somente a etapa atual;
verificar a implementação;
testar o que foi desenvolvido;
informar resumidamente o que foi feito;
informar arquivos criados ou modificados;
apontar decisões importantes;
parar completamente;
perguntar:
"Etapa concluída. Posso seguir para a próxima etapa?"

Somente continuar após uma confirmação explícita.

Respostas como:

"sim";
"pode";
"continue";
"próxima";
"manda ver";
autorizam apenas a próxima etapa.

Depois dela, parar novamente.

3. O que NÃO fazer
Durante o desenvolvimento:

não desenvolver todas as telas de uma vez;
não antecipar etapas;
não criar arquivos de etapas futuras sem necessidade;
não modificar o backend;
não criar sistema de autenticação novo;
não criar sistema definitivo de permissões;
não inventar endpoints;
não inventar estruturas de resposta da API;
não instalar bibliotecas sem necessidade;
não refatorar partes não relacionadas;
não substituir componentes existentes sem necessidade;
não criar um novo design system;
não duplicar componentes já existentes;
não alterar regras de negócio sem autorização.
O objetivo é manter o desenvolvimento incremental, controlado e econômico em créditos.

4. Princípios de implementação
Antes de criar qualquer componente:

analisar a arquitetura atual do projeto;
reutilizar componentes existentes;
seguir o padrão visual atual do Agilis;
seguir o padrão de nomenclatura atual;
seguir o padrão Desktop/Mobile já utilizado;
evitar duplicação;
manter cada etapa pequena e independente.
Quando houver dúvida sobre uma decisão estrutural importante, parar e perguntar ao usuário antes de implementar.

5. Fluxo geral
O fluxo conceitual é:

Funcionário recebe link
        ↓
Abre o convite
        ↓
Visualiza informações da loja
        ↓
Login ou cadastro
        ↓
Confirma entrada
        ↓
Recebe o cargo
        ↓
Passa a fazer parte da equipe
        ↓
Entra na área da loja
        ↓
Visualiza funcionalidades de acordo com suas permissões
6. Estrutura conceitual
O usuário e o funcionário não são entidades completamente separadas.

Um usuário pode possuir diferentes vínculos.

Exemplo:

Usuário
├── Conta pessoal
├── Prestador
└── Funcionário
    └── Loja X
        └── Cargo: Atendente
Também deve ser considerado que futuramente um mesmo usuário poderá estar vinculado a mais de uma loja:

Usuário
├── Loja A
│   └── Cargo: Atendente
│
└── Loja B
    └── Cargo: Gerente
Não assumir que um funcionário pertence obrigatoriamente a apenas uma loja.

7. Etapas do desenvolvimento
Etapa 0 — Análise do projeto
Objetivo
Antes de alterar qualquer código, analisar a estrutura atual do Agilis.

Identificar:

estrutura de app/ ou equivalente;
rotas;
componentes;
layouts;
sidebar;
navbar;
autenticação;
páginas de loja;
páginas de usuário;
páginas de prestador;
componentes reutilizáveis;
sistema de estilos;
padrão Desktop/Mobile;
qualquer estrutura existente relacionada a permissões.
Regra
Não modificar arquivos nesta etapa.

Ao terminar
Apresentar:

estrutura relevante encontrada;
componentes reutilizáveis;
local recomendado para inserir o fluxo;
possíveis conflitos;
decisões necessárias.
Depois parar.

Pergunta obrigatória
Etapa 0 concluída. Posso seguir para a Etapa 1?

Etapa 1 — Tela de convite
Criar somente a tela inicial do convite.

Rota conceitual:

/invite/[inviteId]
A implementação deve respeitar a estrutura de rotas existente.

Informações
Mostrar:

logo da loja;
nome da loja;
imagem da loja, se disponível;
mensagem de convite;
pessoa que enviou o convite, se disponível;
cargo que será atribuído;
descrição do cargo, se disponível;
botão "Aceitar convite";
opção "Recusar convite".
Estados
Preparar visualmente:

convite válido;
convite expirado;
convite inválido;
convite já utilizado.
Utilizar dados mockados.

Não fazer ainda
login;
cadastro;
dashboard;
equipe;
gerenciamento de cargos;
integração com backend.
Finalização
Testar Desktop e Mobile.

Depois parar.

Etapa 1 concluída. Posso seguir para a Etapa 2?

Etapa 2 — Autenticação do convite
Conectar o botão "Aceitar convite" ao sistema de autenticação já existente.

Fluxo
Se o usuário estiver autenticado:

Convite
↓
Confirmação
Se não estiver autenticado:

Convite
↓
Login/Cadastro
↓
Retorno ao convite
↓
Confirmação
Regra
Não criar um sistema de autenticação novo.

Utilizar o sistema já existente no projeto.

Não implementar ainda o dashboard.

Finalização
Testar o fluxo.

Parar.

Etapa 2 concluída. Posso seguir para a Etapa 3?

Etapa 3 — Confirmação do convite
Criar a tela de confirmação.

Informações
Exibir:

loja;
cargo;
descrição;
principais permissões;
botão "Aceitar convite";
botão/opção "Recusar".
Exemplo:

Você foi convidado para fazer parte da equipe da Oficina X.

Cargo
ATENDENTE

Permissões
✓ Visualizar pedidos
✓ Gerenciar pedidos
✓ Visualizar clientes
Utilizar mocks.

Não definir ainda a estrutura definitiva das permissões.

Ao aceitar
Mostrar estado de sucesso.

Parar.

Etapa 3 concluída. Posso seguir para a Etapa 4?

Etapa 4 — Entrada na loja
Criar a tela/estado após a aceitação.

Exemplo:

Você agora faz parte da equipe da Oficina X.

Cargo
Atendente
Mostrar:

logo;
nome da loja;
cargo;
resumo das permissões.
Botão:

Entrar na loja

O botão deve direcionar para o contexto da loja.

Não criar ainda todos os módulos internos.

Parar.

Etapa 4 concluída. Posso seguir para a Etapa 5?

Etapa 5 — Dashboard do funcionário
Criar a primeira tela interna do funcionário.

Elementos
header;
identidade da loja;
nome da loja;
avatar do funcionário;
nome do funcionário;
cargo;
notificações;
conteúdo principal.
Cards possíveis
solicitações;
pedidos;
agenda;
mensagens;
serviços em andamento.
Os dados podem ser mockados.

Criar Desktop e Mobile seguindo o padrão do projeto.

Não criar ainda todas as páginas operacionais.

Parar.

Etapa 5 concluída. Posso seguir para a Etapa 6?

Etapa 6 — Navegação baseada em permissões
Criar a estrutura de navegação da área da loja.

Possíveis áreas:

Início;
Pedidos/Solicitações;
Agenda;
Serviços;
Clientes;
Conversas;
Avaliações;
Equipe;
Configurações.
A navegação deve ser preparada para futuramente depender das permissões.

Conceito:

permission.orders.view
    ↓
mostrar "Pedidos"
permission.team.view
    ↓
mostrar "Equipe"
Importante
Os identificadores acima são apenas exemplos.

Não tratá-los como estrutura definitiva do backend.

Criar uma camada mock temporária e isolada.

Parar.

Etapa 6 concluída. Posso seguir para a Etapa 7?

Etapa 7 — Perfil do funcionário
Criar a página de perfil.

Mostrar:

foto;
nome;
e-mail;
loja;
cargo;
data de entrada;
permissões.
Exemplo:

SEU CARGO

ATENDENTE

PERMISSÕES

✓ Pedidos
✓ Clientes
✓ Agenda
O objetivo é permitir que o funcionário entenda claramente seu nível de acesso.

Parar.

Etapa 7 concluída. Posso seguir para a Etapa 8?

Etapa 8 — Equipe
Criar a página de equipe.

Mostrar:

avatar;
nome;
cargo;
status.
Exemplo:

João
Atendente
Online

Maria
Gerente
Online

Carlos
Técnico
Offline
Criar também uma tela de detalhes do funcionário.

O acesso à equipe deverá futuramente depender de uma permissão.

Utilizar mocks.

Parar.

Etapa 8 concluída. Posso seguir para a Etapa 9?

Etapa 9 — Convidar funcionário
Criar interface para administradores convidarem funcionários.

Fluxo:

Equipe
↓
Adicionar funcionário
↓
Selecionar cargo
↓
Gerar convite
↓
Copiar link
Exemplo:

Cargo

[ Atendente ▼ ]

[ Gerar link ]

Convite criado!

agilis.com/invite/abc123

[ Copiar link ]
O cargo selecionado deve estar visualmente associado ao convite.

Neste momento utilizar mocks.

Não implementar backend.

Parar.

Etapa 9 concluída. Posso seguir para a Etapa 10?


Parar.


Etapa 10 — Revisão responsiva
Depois que as telas estiverem desenvolvidas:

Verificar:

Desktop;
Tablet;
Mobile;
sidebar;
navbar;
menus;
modais;
cards;
espaçamento;
overflow;
consistência visual;
acessibilidade básica.
Corrigir apenas problemas relacionados ao fluxo desenvolvido.

Evitar refatorações desnecessárias.

Parar.

Revisão concluída.


8. Responsividade
O Agilis possui Desktop e Mobile.

Desktop
Preferir:

sidebar;
header;
conteúdo principal.
Mobile
Preferir:

navbar;
menu hamburger;
conteúdo adaptado;
cards reorganizados;
modais adaptados.
Não simplesmente reduzir o Desktop.

A experiência Mobile deve ser planejada de acordo com o padrão já existente no Agilis.

9. Identidade visual
Manter o design system atual do Agilis.

Reutilizar:

cores;
tipografia;
espaçamentos;
botões;
inputs;
cards;
modais;
sidebar;
navbar;
ícones;
componentes existentes.
Não criar um novo design system.

10. Arquitetura
Respeitar a arquitetura atual.

Antes de criar uma pasta ou rota:

verificar como funcionalidades semelhantes estão organizadas;
seguir o padrão existente;
evitar criar estruturas paralelas;
reutilizar componentes.
Se houver duas arquiteturas possíveis e a decisão puder afetar várias telas, parar e perguntar ao usuário.

11. Dados mockados
Enquanto o backend não estiver conectado, utilizar mocks.

Os mocks devem ser:

simples;
centraliza