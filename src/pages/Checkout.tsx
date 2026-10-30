import { useState } from "react";
import type { Unit } from "../types/Unit";
import type { User } from "../types/User";
import type { CartItem } from "../types/CartItem";
import { units } from "../data/units";
import { products } from "../data/products";


type CheckoutProps = {
  unit: Unit;
  usuario: User;
  carrinho: CartItem[];
  confirmarPedido: (formaPagamento: string, total: number, usarPontos: boolean) => void;
  voltarCarrinho: () => void;
};

export function Checkout({unit, usuario, carrinho, confirmarPedido, voltarCarrinho}: CheckoutProps) {

  const [formaPagamento, setFormaPagamento] = useState<string>("");
  const [resultadoSimulado, setResultadoSimulado] = useState<string>("aprovado");
  const [mensagem, setMensagem] = useState<string>("");
  const [usarPontos, setUsarPontos] = useState<boolean>(false);

  const subtotal = carrinho.reduce((acumulador, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;

    const resultado = acumulador + (preco * item.quantity);

    return resultado;
  }, 0);

  const taxaEmbalagem = carrinho.length > 0 ? 2 : 0;

  const desconto = usarPontos && usuario.points >= 100 ? 5 : 0;

  const total = Math.max(0, subtotal + taxaEmbalagem - desconto);

  
function pagarPedido() {
    if (carrinho.length === 0) {
      setMensagem("Seu carrinho está vazio.");
      return;
    }

    const unidadeAtual = units.find((unidade) => {
      return unidade.id === unit.id;
    });

    if (unidadeAtual === undefined || !unidadeAtual.isOpen) {
      setMensagem("Esta unidade não está disponível para receber pedidos.");
      return;
    }

    const mesAtual = new Date().getMonth() + 1;

    const produtoIndisponivel = carrinho.find((item) => {

      const produtoAtual = products.find((produto) => {
        return produto.id === item.product.id;
      });

      if (produtoAtual === undefined) {
        return true;
      }

      if (!unidadeAtual.availableProductIds.includes(item.product.id)) {
        return true;
      }

      if (produtoAtual.seasonalMonths !== undefined && !produtoAtual.seasonalMonths.includes(mesAtual)) {
        return true;
      }

      return false;
    });

    if (produtoIndisponivel !== undefined) {
      setMensagem(`O produto ${produtoIndisponivel.product.name} não está mais disponível nesta unidade. Volte ao carrinho e remova o produto.`);
      return;
    }

    if (!formaPagamento) {
      setMensagem("Escolha uma forma de pagamento.");
      return;
    }

    if (usarPontos && usuario.points < 100) {
      setMensagem("Você não possui pontos suficientes.");
      return;
    }

    if (resultadoSimulado === "negado") {
      setMensagem("Pagamento negado. Tente novamente.");
      return;
    }

    if (resultadoSimulado === "erro") {
      setMensagem("Erro no serviço de pagamento. Tente novamente.");
      return;
    }

    setMensagem("");
    confirmarPedido(formaPagamento, total, usarPontos);
  }

  
  return (
    <div className="paginaFinalizacao">

      <div className="paginaHeading">
        <h1>Finalizar pedido</h1>
        <p>Confira os produtos antes de confirmar o pagamento.</p>
      </div>

      <div className="finalizacaoLayout">

        <div className="finalizacaoPrincipal">

          <div className="finalizacaoCard">

            <h2>Unidade de retirada</h2>

            <p>Unidade {unit.name}</p>
            <p>{unit.address} - {unit.city}</p>

            <h2>Resumo dos produtos</h2>

            {carrinho.map((item) => {
              return (
                <div key={item.id} className="itemFinalizacao">

                  <h3>{item.product.name}</h3>

                  <p>Quantidade: {item.quantity}</p>

                  <p>Observação: {item.observation || "Nenhuma"}</p>

                  <p>{((item.product.promotionalPrice ?? item.product.price) * item.quantity).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}</p>

                </div>
              )
            })}

          </div>

          <div className="finalizacaoCard">

            <h2>Fidelidade</h2>

            <p>Seus pontos: {usuario.points}</p>

            {usuario.points >= 100 ? (
              <label>
                <input
                  type="checkbox"
                  checked={usarPontos}
                  onChange={(event) => setUsarPontos(event.target.checked)}
                />
                Utilizar 100 pontos para receber R$ 5,00 de desconto.
              </label>
            ) : (
              <p>Você precisa de 100 pontos para utilizar o desconto.</p>
            )}

          </div>

        </div>

        <div className="resumoFinalizacao">

          <h2>Pagamento</h2>

          <p>Forma de pagamento:</p>

          <select
            value={formaPagamento}
            onChange={(event) => setFormaPagamento(event.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Pix">Pix</option>
            <option value="Cartão">Cartão</option>
          </select>

          <p>Resultado do pagamento (simulação):</p>

          <select
            value={resultadoSimulado}
            onChange={(event) => {
              setResultadoSimulado(event.target.value);
              setMensagem("");
            }}
          >
            <option value="aprovado">Aprovado</option>
            <option value="negado">Negado</option>
            <option value="erro">Erro no serviço</option>
          </select>

          <p>Os pagamentos são simulados. Nenhuma cobrança será realizada.</p>

          <h2>Valores</h2>

          <p>Subtotal: {subtotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}</p>

          <p>Taxa de embalagem: {taxaEmbalagem.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}</p>

          {desconto > 0 && (
            <p>Desconto de fidelidade: -{desconto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}</p>
          )}

          <h2>Total: {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })}</h2>

          {mensagem !== "" && (
            <p role="alert">{mensagem}</p>
          )}

          <div className="acoesFinalizacao">
            <button onClick={pagarPedido}>
              Pagar e confirmar pedido
            </button>

            <button onClick={voltarCarrinho}>
              Voltar ao carrinho
            </button>
          </div>

        </div>

      </div>
    </div>
  )

}
