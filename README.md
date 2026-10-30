# BRASA 21 🍔

Aplicação demonstrativa de pedidos para uma hamburgueria, desenvolvida com **React, TypeScript e Vite**. O projeto reúne cardápio digital, carrinho, finalização de pedidos, programa de fidelidade, totem de autoatendimento e painel operacional de cozinha.

A proposta é simular diferentes etapas da experiência de um restaurante em uma interface responsiva, com identidade visual urbana e navegação adaptada ao cliente e à operação.

![Banner do BRASA 21](./public/images/hero-brasa21.png)

## Demonstração

[Acessar BRASA 21](https://brasa-21.vercel.app/)

## Funcionalidades

### Experiência do cliente

- Seleção de unidade e consulta à disponibilidade dos produtos.
- Cardápio com fotos, pesquisa, categorias, detalhes e ofertas.
- Carrinho com controle de quantidade, observações e cálculo dos valores.
- Checkout com simulação de pagamento via Pix ou cartão, incluindo cenários de aprovação, recusa e erro.
- Acompanhamento do pedido pelos status **Recebido**, **Em preparação**, **Pronto para retirada** e **Concluído**.
- Perfil demonstrativo com programa de fidelidade: acúmulo de pontos e troca de **100 pontos por R$ 5,00 de desconto**.

### Autoatendimento e operação

- **Totem:** fluxo de pedido adaptado para interação por toque, com carrinho e finalização.
- **Painel operacional:** visualização da comanda e avanço manual das etapas de preparo.
- Visualização das unidades e de seus produtos disponíveis.

### Persistência e interface

- Armazenamento local de carrinho, unidade selecionada, perfis demonstrativos, pontos e último pedido com `localStorage`.
- Opção para reiniciar os dados da demonstração.
- Layout responsivo e identidade visual própria.

## Tecnologias

- React 19
- TypeScript
- Vite
- CSS
- `localStorage`
- ESLint

## Como executar localmente

É necessário ter **Node.js e npm** instalados.

```bash
git clone https://github.com/gagaau/brasa-21.git
cd brasa-21
npm install
npm run dev
```

Abra no navegador o endereço local informado pelo Vite.

Para verificar a aplicação antes da publicação:

```bash
npm run lint
npm run build
npm run preview
```

## Como explorar a demonstração

1. Escolha uma unidade e adicione produtos ao carrinho.
2. Entre com um perfil demonstrativo ou crie um perfil local.
3. Finalize o pedido usando uma das opções de pagamento simulado.
4. Acesse o painel operacional e avance os status da comanda.
5. Consulte o acompanhamento do pedido e o saldo de pontos de fidelidade.

Você também pode experimentar o fluxo do **totem de autoatendimento** a partir da tela inicial.

## Sobre a simulação

Este é um projeto de portfólio, **não um serviço comercial ativo**.

- Os pagamentos são simulados; nenhuma cobrança é realizada.
- Os perfis são demonstrativos e não possuem autenticação real.
- Os dados ficam salvos apenas no navegador utilizado, por meio do `localStorage`; não existe sincronização entre dispositivos ou banco de dados remoto.
- O painel operacional controla um pedido ativo por vez e os status são atualizados manualmente.
- Não são enviados e-mails promocionais.

## Repositório

[GitHub — BRASA 21](https://github.com/gagaau/brasa-21)
