import type { Unit } from "../types/Unit";
import type { CartItem } from "../types/CartItem";

type CartProps = {
  unit: Unit;
  carrinho: CartItem[];
  atualizarCarrinho: (novoCarrinho: CartItem[]) => void;
  voltarMenu: () => void;
  finalizarPedido: () => void;
};


export function Cart({unit, carrinho, atualizarCarrinho, voltarMenu, finalizarPedido}: CartProps) {
  const subtotal = carrinho.reduce((acumulador, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;
    const resultado = acumulador + (preco * item.quantity);
    return resultado;
  }, 0);

  const taxaEmbalagem = carrinho.length > 0 ? 2 : 0;

  const total = subtotal + taxaEmbalagem;

  function alterarQuantidade(id: string, novaQuantidade: number) {
    if (novaQuantidade < 1) {
      return;
    }

    const resultado = carrinho.map((item) => {
      if (item.id === id) {
        return {...item, quantity: novaQuantidade};
      }
      return item;
    });

    atualizarCarrinho(resultado);
  }

  function alterarObservacao(id: string, novaObservacao: string) {
    const resultado = carrinho.map((item) => {
      if (item.id === id) {
        return {...item, observation: novaObservacao};
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
  <div className="paginaCarrinho">

    <div className="paginaHeading">
      <h1>Meu carrinho</h1>
      <p>Unidade de retirada: {unit.name}</p>
    </div>

    <div className="carrinhoLayout">

      <div className="listaCarrinho">

        {carrinho.length === 0 && (
          <div className="produtoCarrinho">
            <p>Seu carrinho está vazio.</p>
          </div>
        )}

        {carrinho.map((item) => {
          return (
            <div key={item.id} className="produtoCarrinho">

              <h2>{item.product.name}</h2>

              <p>Preço unitário: {(item.product.promotionalPrice ?? item.product.price).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
              })}</p>

              <p>Quantidade: {item.quantity}</p>

              <div className="botoesCarrinho">
                <button
                  onClick={() => alterarQuantidade(item.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >-</button>

                <button onClick={() => alterarQuantidade(item.id, item.quantity + 1)}>+</button>
              </div>

              <p>Observação:</p>

              <textarea
                value={item.observation}
                onChange={(event) => alterarObservacao(item.id, event.target.value)}
                placeholder="Observações do produto..."
              />

              <p className="produtoPreco">
                Total do produto: {((item.product.promotionalPrice ?? item.product.price) * item.quantity).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>

              <button onClick={() => removerItem(item.id)}>
                Remover
              </button>

            </div>
          )
        })}

      </div>

      <div className="resumoCarrinho">

        <h2>Resumo do pedido</h2>

        <p>Subtotal: {subtotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })}</p>

        <p>Taxa de embalagem: {taxaEmbalagem.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })}</p>

        <h2>Total: {total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })}</h2>

        <div className="acoesCarrinho">
          <button onClick={voltarMenu}>
            Adicionar mais itens
          </button>

          <button onClick={finalizarPedido} disabled={carrinho.length === 0}>
            Finalizar compra
          </button>
        </div>

      </div>

    </div>
  </div>
)
}
