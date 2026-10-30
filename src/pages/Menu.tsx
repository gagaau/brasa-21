import { products } from "../data/products";
import type { Unit } from "../types/Unit";
import { useState } from "react";
import type { Product } from "../types/Product";
import type { CartItem } from "../types/CartItem";

type MenuProps = {
  unit: Unit;
  carrinho: CartItem[];
  adicionarItem: (item: CartItem) => void;
  abrirCarrinho: () => void;
};

export function Menu({unit, carrinho, adicionarItem, abrirCarrinho}: MenuProps) {

  const [pesquisarProduto, setPesquisarProduto] = useState<string>("");
  const [selecionarCategoria, setSelecionarCategoria] = useState<string>("Todos");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [observacao, setObservacao] = useState<string>("");

  const mesAtual = new Date().getMonth() + 1;

  const produtosDisponiveis = products.filter((produto) => {

    const disponivelNaUnidade = unit.availableProductIds.includes(produto.id);

    const nomeCorresponde = produto.name.toLowerCase().includes(pesquisarProduto.trim().toLowerCase());

    const categoriaCorresponde = selecionarCategoria === "Todos" || produto.category === selecionarCategoria;

    const dentroDaTemporada = produto.seasonalMonths === undefined || produto.seasonalMonths.includes(mesAtual);

    return disponivelNaUnidade && nomeCorresponde && categoriaCorresponde && dentroDaTemporada;
  });


  const categorias = ["Todos", "Pratos", "Combos", "Bebidas", "Sobremesas"];

  const totalQuantidade = carrinho.reduce((acumulador, item) => {
    const resultado = acumulador + item.quantity;

    return resultado;
  }, 0);

  const subtotal = carrinho.reduce((acumulador, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;

    const resultado = acumulador + (preco * item.quantity);

    return resultado;
  }, 0);

  
  const promocaoDaUnidade = products.find((produto) => {

    const disponivelNaUnidade = unit.availableProductIds.includes(produto.id);

    const temPromocao = produto.promotionalPrice !== undefined;

    const dentroDaTemporada = produto.seasonalMonths === undefined || produto.seasonalMonths.includes(mesAtual);

    return disponivelNaUnidade && temPromocao && dentroDaTemporada;
  });


  
  return (
    <div className="paginaMenu">

      <div className="menuHeader">
        <div>
          <h1>Cardápio</h1>
          <p>Unidade {unit.name} - {unit.city}</p>
        </div>

        <button onClick={abrirCarrinho}>
          Carrinho ({totalQuantidade})
        </button>
      </div>

      <div className="bannerCampanha">
        <h2>Sabores do Nordeste</h2>
        <p>Conheça os pratos e bebidas típicos da nossa rede.</p>
        <p>Confira as opções disponíveis na sua unidade!</p>
      </div>

      {promocaoDaUnidade !== undefined && (
        <div className="bannerPromocao">
          <h2>Promoção da semana</h2>

          <p>{promocaoDaUnidade.name}</p>

          <p>
            De <s>{promocaoDaUnidade.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}</s>
            {" "}por{" "}
            <strong>{promocaoDaUnidade.promotionalPrice?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}</strong>
          </p>
        </div>
      )}

      <input
        placeholder="Pesquisar produto"
        value={pesquisarProduto}
        onChange={(event) => setPesquisarProduto(event.target.value)}
      />

      <div className="categorias">
        {categorias.map((categoria) => {
          return (
            <button
              key={categoria}
              className={selecionarCategoria === categoria ? "selected" : ""}
              onClick={() => setSelecionarCategoria(categoria)}
            >
              {categoria}
            </button>
          )
        })}
      </div>

      {produtosDisponiveis.length === 0 && (
        <p>Nenhum produto encontrado.</p>
      )}

      <div className="produtoGrid">
        {produtosDisponiveis.map((produtoDisponivel) => {
          return (
            <div key={produtoDisponivel.id} className="produtoCard">
              <h2>{produtoDisponivel.name}</h2>

              <p>{produtoDisponivel.description}</p>

              {produtoDisponivel.promotionalPrice !== undefined && (
                <p className="promocaoLabel">Em promoção!</p>
              )}

              {produtoDisponivel.promotionalPrice !== undefined && (
                <s className="precoAntigo">
                  {produtoDisponivel.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </s>
              )}

              <p className="produtoPreco">
                {(produtoDisponivel.promotionalPrice ?? produtoDisponivel.price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>

              <button onClick={() => {
                setProdutoSelecionado(produtoDisponivel);
                setQuantidade(1);
                setObservacao("");
              }}>
                Ver detalhes
              </button>
            </div>
          )
        })}
      </div>

      <div className="menuSumario">
        <h2>Resumo do carrinho</h2>

        <p>Itens no carrinho: {carrinho.length}</p>
        <p>Quantidade total: {totalQuantidade}</p>

        <p>
          Subtotal: {subtotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}
        </p>

        <button onClick={abrirCarrinho}>
          Ver carrinho
        </button>
      </div>

      {produtoSelecionado !== null && (
        <div className="modalBackground">
          <div className="modalConteudo" role="dialog" aria-modal="true" aria-label="Detalhes do produto">

            <h2>{produtoSelecionado.name}</h2>

            <p>{produtoSelecionado.description}</p>

            <p className="produtoPreco">
              {(produtoSelecionado.promotionalPrice ?? produtoSelecionado.price).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}
            </p>

            <div className="botoesQuantidade">
              <button onClick={() => {
                if (quantidade === 1) {
                  return;
                }

                setQuantidade(q => q - 1);
              }}>
                -
              </button>

              <p>Quantidade: {quantidade}</p>

              <button onClick={() => setQuantidade(q => q + 1)}>
                +
              </button>
            </div>

            <textarea
              placeholder="Observações do produto..."
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
            />

            <div className="modalActions">
              <button onClick={() => {
                const novoItem: CartItem = {
                  id: crypto.randomUUID(),
                  product: produtoSelecionado,
                  quantity: quantidade,
                  observation: observacao
                };

                adicionarItem(novoItem);
                setProdutoSelecionado(null);
              }}>
                Adicionar ao carrinho
              </button>

              <button onClick={() => setProdutoSelecionado(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
