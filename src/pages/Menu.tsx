import { useEffect, useState } from "react";
import { products } from "../data/products";
import type { Unit } from "../types/Unit";
import type { Product } from "../types/Product";
import type { CartItem } from "../types/CartItem";

type MenuProps = {
  unit: Unit;
  carrinho: CartItem[];
  adicionarItem: (item: CartItem) => void;
  abrirCarrinho: () => void;
};

export function Menu({ unit, carrinho, adicionarItem, abrirCarrinho }: MenuProps) {
  const [pesquisarProduto, setPesquisarProduto] = useState<string>("");
  const [selecionarCategoria, setSelecionarCategoria] = useState<string>("Todos");
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [observacao, setObservacao] = useState<string>("");

  const mesAtual = new Date().getMonth() + 1;

  const produtosDaUnidade = products.filter((produto) => {
    const disponivelNaUnidade = unit.availableProductIds.includes(produto.id);
    const dentroDaTemporada = produto.seasonalMonths === undefined || produto.seasonalMonths.includes(mesAtual);

    return disponivelNaUnidade && dentroDaTemporada;
  });

  const categorias = ["Todos", ...new Set(produtosDaUnidade.map((produto) => produto.category))];

  const produtosDisponiveis = produtosDaUnidade.filter((produto) => {
    const pesquisa = pesquisarProduto.trim().toLowerCase();
    const nomeCorresponde = `${produto.name} ${produto.description}`.toLowerCase().includes(pesquisa);
    const categoriaCorresponde = selecionarCategoria === "Todos" || produto.category === selecionarCategoria;

    return nomeCorresponde && categoriaCorresponde;
  });

  const promocaoDaUnidade = produtosDaUnidade.find((produto) => produto.promotionalPrice !== undefined);

  const totalQuantidade = carrinho.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const subtotal = carrinho.reduce((total, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;
    return total + preco * item.quantity;
  }, 0);

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function abrirDetalhes(produto: Product) {
    setProdutoSelecionado(produto);
    setQuantidade(1);
    setObservacao("");
  }

  function fecharDetalhes() {
    setProdutoSelecionado(null);
  }

  function adicionarAoCarrinho() {
    if (produtoSelecionado === null) {
      return;
    }

    const novoItem: CartItem = {
      id: crypto.randomUUID(),
      product: produtoSelecionado,
      quantity: quantidade,
      observation: observacao.trim()
    };

    adicionarItem(novoItem);
    fecharDetalhes();
  }

  useEffect(() => {
    if (produtoSelecionado === null) {
      return;
    }

    function fecharComEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProdutoSelecionado(null);
      }
    }

    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [produtoSelecionado]);

  return (
    <main className="paginaMenu">
      <div className="menuHeader">
        <div>
          <span className="brasaEtiqueta">BRASA 21 · CARDÁPIO</span>
          <h1>ESCOLHA SEU FAVORITO.</h1>
          <p>Unidade {unit.name} · {unit.city}</p>
        </div>

        <button onClick={abrirCarrinho} aria-label={`Abrir carrinho com ${totalQuantidade} produtos`}>
          Ver carrinho ({totalQuantidade})
        </button>
      </div>

      <section
        className="bannerCampanha brasaMenuCampanha"
        aria-label="Conheça o cardápio BRASA 21"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(15, 15, 17, 0.96), rgba(15, 15, 17, 0.74) 45%, rgba(15, 15, 17, 0.12)), url('/images/hero-brasa21.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "230px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div>
          <span className="brasaEtiqueta">A FOME NOS MOVE</span>
          <h2>MAIS QUE BURGERS. É ATITUDE.</h2>
          <p>Escolha seus favoritos, personalize seu pedido e deixe o resto com a gente.</p>
        </div>
      </section>

      {promocaoDaUnidade !== undefined && (
        <section className="bannerPromocao" aria-label="Oferta em destaque">
          <div>
            <span className="promocaoLabel">OFERTA EM DESTAQUE</span>
            <h2>{promocaoDaUnidade.name}</h2>
            <p>{promocaoDaUnidade.description}</p>
            <p>
              De <s>{formatarPreco(promocaoDaUnidade.price)}</s>{" "}
              por <strong>{formatarPreco(promocaoDaUnidade.promotionalPrice ?? promocaoDaUnidade.price)}</strong>
            </p>
          </div>

          <img
            className="brasaOfertaImagem"
            src={`/images/produtos/${promocaoDaUnidade.id}.png`}
            alt={`Foto ilustrativa de ${promocaoDaUnidade.name}`}
            loading="lazy"
          />

          <button onClick={() => abrirDetalhes(promocaoDaUnidade)}>
            Aproveitar oferta
          </button>
        </section>
      )}

      <section className="brasaCatalogo" aria-labelledby="tituloCardapio">
        <div className="brasaSecaoTitulo">
          <div>
            <span className="brasaEtiqueta">DIRETO DA NOSSA CHAPA</span>
            <h2 id="tituloCardapio">NOSSO CARDÁPIO</h2>
            <p>Encontre o que combina com sua fome.</p>
          </div>
        </div>

        <label className="brasaCampoPesquisa">
          <span>Buscar no cardápio</span>
          <input
            type="search"
            placeholder="Buscar produtos ou ingredientes"
            value={pesquisarProduto}
            onChange={(event) => setPesquisarProduto(event.target.value)}
          />
        </label>

        <div className="categorias" role="group" aria-label="Filtrar produtos por categoria">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={selecionarCategoria === categoria ? "selected" : ""}
              aria-pressed={selecionarCategoria === categoria}
              onClick={() => setSelecionarCategoria(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        <p className="brasaResultadoBusca" role="status">
          {produtosDisponiveis.length} {produtosDisponiveis.length === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>

        {produtosDisponiveis.length === 0 && (
          <div className="menuSumario">
            <h3>Nenhum produto encontrado.</h3>
            <p>Tente buscar outro nome ou selecione uma categoria diferente.</p>
            <button onClick={() => {
              setPesquisarProduto("");
              setSelecionarCategoria("Todos");
            }}>
              Limpar filtros
            </button>
          </div>
        )}

        <div className="produtoGrid">
          {produtosDisponiveis.map((produto) => (
            <article key={produto.id} className="produtoCard">
              <div className="brasaProdutoImagem">
                <img
                  src={`/images/produtos/${produto.id}.png`}
                  alt={`Foto ilustrativa de ${produto.name}`}
                  loading="lazy"
                />
              </div>

              <div>
                {produto.promotionalPrice !== undefined && (
                  <span className="promocaoLabel">EM OFERTA</span>
                )}

                <h2>{produto.name}</h2>
                <p>{produto.description}</p>
              </div>

              <div>
                {produto.promotionalPrice !== undefined && (
                  <s className="precoAntigo">{formatarPreco(produto.price)}</s>
                )}
                <p className="produtoPreco">{formatarPreco(produto.promotionalPrice ?? produto.price)}</p>
              </div>

              <button onClick={() => abrirDetalhes(produto)}>
                Escolher produto
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="menuSumario" aria-label="Resumo do carrinho">
        <h2>SEU PEDIDO</h2>
        <p>Produtos adicionados: {totalQuantidade}</p>
        <p>Subtotal: <strong>{formatarPreco(subtotal)}</strong></p>
        <button onClick={abrirCarrinho}>Revisar carrinho</button>
      </aside>

      {produtoSelecionado !== null && (
        <div
          className="modalBackground"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharDetalhes();
            }
          }}
        >
          <div
            className="modalConteudo"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nomeProdutoModal"
            aria-describedby="descricaoProdutoModal"
          >
            <img
              className="brasaModalImagem"
              src={`/images/produtos/${produtoSelecionado.id}.png`}
              alt={`Foto ilustrativa de ${produtoSelecionado.name}`}
            />
            <span className="brasaEtiqueta">PERSONALIZE SEU PEDIDO</span>
            <h2 id="nomeProdutoModal">{produtoSelecionado.name}</h2>
            <p id="descricaoProdutoModal">{produtoSelecionado.description}</p>
            <p className="produtoPreco">
              {formatarPreco(produtoSelecionado.promotionalPrice ?? produtoSelecionado.price)}
            </p>

            <div className="botoesQuantidade">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                disabled={quantidade === 1}
                onClick={() => setQuantidade((atual) => Math.max(1, atual - 1))}
              >
                −
              </button>

              <p>Quantidade: <strong>{quantidade}</strong></p>

              <button
                type="button"
                aria-label="Aumentar quantidade"
                onClick={() => setQuantidade((atual) => atual + 1)}
              >
                +
              </button>
            </div>

            <label htmlFor="observacaoProduto">Alguma observação?</label>
            <textarea
              id="observacaoProduto"
              placeholder="Ex.: sem cebola, molho à parte..."
              value={observacao}
              maxLength={250}
              onChange={(event) => setObservacao(event.target.value)}
            />

            <p className="produtoPreco">
              Total: {formatarPreco((produtoSelecionado.promotionalPrice ?? produtoSelecionado.price) * quantidade)}
            </p>

            <div className="modalActions">
              <button onClick={adicionarAoCarrinho}>
                Adicionar ao carrinho
              </button>
              <button onClick={fecharDetalhes}>Voltar ao cardápio</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
