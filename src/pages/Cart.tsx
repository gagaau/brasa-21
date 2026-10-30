import type { Unit } from "../types/Unit";
import type { CartItem } from "../types/CartItem";

type CartProps = {
  unit: Unit;
  carrinho: CartItem[];
  atualizarCarrinho: (novoCarrinho: CartItem[]) => void;
  voltarMenu: () => void;
  finalizarPedido: () => void;
};

export function Cart({ unit, carrinho, atualizarCarrinho, voltarMenu, finalizarPedido }: CartProps) {
  const subtotal = carrinho.reduce((total, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;
    return total + preco * item.quantity;
  }, 0);

  const quantidadeTotal = carrinho.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const taxaEmbalagem = carrinho.length > 0 ? 2 : 0;
  const total = subtotal + taxaEmbalagem;

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function alterarQuantidade(id: string, novaQuantidade: number) {
    if (novaQuantidade < 1) {
      return;
    }

    const resultado = carrinho.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: novaQuantidade };
      }

      return item;
    });

    atualizarCarrinho(resultado);
  }

  function alterarObservacao(id: string, novaObservacao: string) {
    const resultado = carrinho.map((item) => {
      if (item.id === id) {
        return { ...item, observation: novaObservacao };
      }

      return item;
    });

    atualizarCarrinho(resultado);
  }

  function removerItem(id: string) {
    const resultado = carrinho.filter((item) => item.id !== id);
    atualizarCarrinho(resultado);
  }

  return (
    <main className="paginaCarrinho brasaCarrinho">
      <div className="paginaHeading brasaCarrinhoCabecalho">
        <span className="brasaEtiqueta">BRASA 21 · SEU PEDIDO</span>
        <h1>SEU CARRINHO.</h1>
        <p>Confira os produtos antes de finalizar seu pedido.</p>

        <div className="brasaCarrinhoUnidade">
          <span aria-hidden="true">●</span>
          Retirada na unidade <strong>{unit.name}</strong> · {unit.city}
        </div>
      </div>

      <div className="carrinhoLayout">
        <section className="listaCarrinho" aria-labelledby="tituloItensCarrinho">
          <div className="brasaCarrinhoSecaoTopo">
            <h2 id="tituloItensCarrinho">ITENS DO PEDIDO</h2>
            <span>{quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"}</span>
          </div>

          {carrinho.length === 0 && (
            <div className="produtoCarrinho brasaCarrinhoVazio">
              <img src="/images/hero-brasa21.png" alt="Hambúrguer artesanal BRASA 21" />
              <h3>SEU CARRINHO ESTÁ VAZIO.</h3>
              <p>Tem muita coisa boa esperando por você no cardápio.</p>
              <button type="button" onClick={voltarMenu}>
                Explorar cardápio
              </button>
            </div>
          )}

          {carrinho.map((item) => {
            const preco = item.product.promotionalPrice ?? item.product.price;
            const precoTotal = preco * item.quantity;
            const emPromocao = item.product.promotionalPrice !== undefined;

            return (
              <article key={item.id} className="produtoCarrinho brasaCarrinhoItem">
                <div className="brasaCarrinhoItemTopo">
                  <img
                    className="brasaCarrinhoFoto"
                    src={`/images/produtos/${item.product.id}.png`}
                    alt={`Foto ilustrativa de ${item.product.name}`}
                  />

                  <div className="brasaCarrinhoInfo">
                    <span className="brasaCarrinhoCategoria">{item.product.category}</span>
                    <h3>{item.product.name}</h3>
                    <p className="brasaCarrinhoDescricao">{item.product.description}</p>

                    <div className="brasaCarrinhoPrecoUnitario">
                      {emPromocao && (
                        <s>{formatarPreco(item.product.price)}</s>
                      )}
                      <strong>{formatarPreco(preco)}</strong>
                      <span>/ unidade</span>
                    </div>
                  </div>
                </div>

                <div className="brasaCarrinhoControles">
                  <div className="brasaCarrinhoQuantidade">
                    <span>Quantidade</span>
                    <div className="botoesCarrinho">
                      <button
                        type="button"
                        aria-label={`Diminuir quantidade de ${item.product.name}`}
                        disabled={item.quantity === 1}
                        onClick={() => alterarQuantidade(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <strong aria-live="polite">{item.quantity}</strong>
                      <button
                        type="button"
                        aria-label={`Aumentar quantidade de ${item.product.name}`}
                        onClick={() => alterarQuantidade(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="brasaCarrinhoTotalItem">
                    <span>Total do item</span>
                    <strong>{formatarPreco(precoTotal)}</strong>
                  </div>
                </div>

                <label className="brasaCarrinhoObservacao" htmlFor={`observacao-${item.id}`}>
                  Observações do produto
                </label>
                <textarea
                  id={`observacao-${item.id}`}
                  value={item.observation}
                  onChange={(event) => alterarObservacao(item.id, event.target.value)}
                  placeholder="Ex.: sem cebola, molho à parte..."
                  maxLength={250}
                  rows={2}
                />

                <button
                  type="button"
                  className="brasaCarrinhoRemover"
                  onClick={() => removerItem(item.id)}
                >
                  Remover produto
                </button>
              </article>
            );
          })}

          {carrinho.length > 0 && (
            <button type="button" className="brasaCarrinhoVoltar" onClick={voltarMenu}>
              ← Adicionar mais produtos
            </button>
          )}
        </section>

        <aside className="resumoCarrinho brasaCarrinhoResumo" aria-label="Resumo do pedido">
          <span className="brasaEtiqueta">QUASE LÁ</span>
          <h2>RESUMO DO PEDIDO</h2>

          <div className="brasaCarrinhoResumoLinha">
            <span>Produtos ({quantidadeTotal})</span>
            <strong>{formatarPreco(subtotal)}</strong>
          </div>

          <div className="brasaCarrinhoResumoLinha">
            <span>Embalagem</span>
            <strong>{formatarPreco(taxaEmbalagem)}</strong>
          </div>

          <p className="brasaCarrinhoAviso">
            Taxa única de embalagem. Seu pedido será preparado para retirada na unidade {unit.name}.
          </p>

          <div className="brasaCarrinhoResumoTotal">
            <span>Total</span>
            <strong>{formatarPreco(total)}</strong>
          </div>

          <div className="acoesCarrinho brasaCarrinhoAcoes">
            <button
              type="button"
              onClick={finalizarPedido}
              disabled={carrinho.length === 0}
            >
              Continuar para pagamento →
            </button>
            <button type="button" onClick={voltarMenu}>
              Voltar ao cardápio
            </button>
          </div>

          <p className="brasaCarrinhoRodape">Pagamento simulado · Nenhuma cobrança real</p>
        </aside>
      </div>
    </main>
  );
}
