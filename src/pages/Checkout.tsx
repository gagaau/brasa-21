import { useState } from "react";
import { units } from "../data/units";
import { products } from "../data/products";
import type { Unit } from "../types/Unit";
import type { User } from "../types/User";
import type { CartItem } from "../types/CartItem";

type CheckoutProps = {
  unit: Unit;
  usuario: User;
  carrinho: CartItem[];
  confirmarPedido: (formaPagamento: string, total: number, usarPontos: boolean) => void;
  voltarCarrinho: () => void;
};

export function Checkout({ unit, usuario, carrinho, confirmarPedido, voltarCarrinho }: CheckoutProps) {
  const [formaPagamento, setFormaPagamento] = useState<string>("");
  const [resultadoSimulado, setResultadoSimulado] = useState<string>("aprovado");
  const [mensagem, setMensagem] = useState<string>("");
  const [usarPontos, setUsarPontos] = useState<boolean>(false);

  const subtotal = carrinho.reduce((acumulador, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;
    return acumulador + preco * item.quantity;
  }, 0);

  const quantidadeProdutos = carrinho.reduce((acumulador, item) => {
    return acumulador + item.quantity;
  }, 0);

  const taxaEmbalagem = carrinho.length > 0 ? 2 : 0;
  const desconto = usarPontos && usuario.points >= 100 ? 5 : 0;
  const total = Math.max(0, subtotal + taxaEmbalagem - desconto);
  const pontosGanhos = Math.floor(total);

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

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

    if (formaPagamento === "") {
      setMensagem("Escolha uma forma de pagamento para continuar.");
      return;
    }

    if (usarPontos && usuario.points < 100) {
      setMensagem("Você não possui pontos suficientes para utilizar o desconto.");
      return;
    }

    if (resultadoSimulado === "negado") {
      setMensagem("Pagamento recusado na simulação. Escolha outro resultado e tente novamente.");
      return;
    }

    if (resultadoSimulado === "erro") {
      setMensagem("Falha simulada no serviço de pagamento. Tente novamente.");
      return;
    }

    setMensagem("");
    confirmarPedido(formaPagamento, total, usarPontos);
  }

  return (
    <main className="paginaFinalizacao brasaCheckout">
      <div className="paginaHeading brasaCheckoutCabecalho">
        <span className="brasaEtiqueta">BRASA 21 · CHECKOUT</span>
        <h1>FINALIZE SEU PEDIDO.</h1>
        <p>Mais um passo e a cozinha começa a preparar seu pedido.</p>

        <div className="brasaCheckoutEtapas" aria-label="Etapas da compra">
          <span className="concluida">✓ Carrinho</span>
          <span aria-hidden="true">/</span>
          <span className="atual" aria-current="step">02 Pagamento</span>
          <span aria-hidden="true">/</span>
          <span>03 Acompanhar pedido</span>
        </div>
      </div>

      <form className="finalizacaoLayout brasaCheckoutLayout" onSubmit={(event) => {
        event.preventDefault();
        pagarPedido();
      }}>
        <div className="finalizacaoPrincipal">
          <section className="finalizacaoCard brasaCheckoutCard" aria-labelledby="checkoutRetirada">
            <div className="brasaCheckoutCardTopo">
              <div>
                <span className="brasaCheckoutNumero">01 / RETIRADA</span>
                <h2 id="checkoutRetirada">ONDE RETIRAR</h2>
              </div>
              <span className="brasaCheckoutTag">Retirada no balcão</span>
            </div>

            <div className="brasaCheckoutUnidade">
              <span className="brasaCheckoutUnidadeIcone" aria-hidden="true">⌖</span>
              <div>
                <strong>BRASA 21 — {unit.name}</strong>
                <p>{unit.address} · {unit.city}</p>
              </div>
            </div>
          </section>

          <section className="finalizacaoCard brasaCheckoutCard" aria-labelledby="checkoutProdutos">
            <div className="brasaCheckoutCardTopo">
              <div>
                <span className="brasaCheckoutNumero">02 / SEU PEDIDO</span>
                <h2 id="checkoutProdutos">CONFIRA OS PRODUTOS</h2>
              </div>
              <span className="brasaCheckoutContador">{quantidadeProdutos} {quantidadeProdutos === 1 ? "item" : "itens"}</span>
            </div>

            <div className="brasaCheckoutLista">
              {carrinho.map((item) => {
                const preco = item.product.promotionalPrice ?? item.product.price;

                return (
                  <div key={item.id} className="itemFinalizacao brasaCheckoutProduto">
                    <img
                      src={`/images/produtos/${item.product.id}.png`}
                      alt={`Imagem ilustrativa de ${item.product.name}`}
                    />
                    <div className="brasaCheckoutProdutoInfo">
                      <span>{item.product.category}</span>
                      <h3>{item.product.name}</h3>
                      <p>{item.quantity} × {formatarPreco(preco)}</p>
                      {item.observation.trim() !== "" && (
                        <p className="brasaCheckoutObservacao">Obs.: {item.observation}</p>
                      )}
                    </div>
                    <strong className="brasaCheckoutPrecoItem">{formatarPreco(preco * item.quantity)}</strong>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="finalizacaoCard brasaCheckoutCard" aria-labelledby="checkoutFidelidade">
            <div className="brasaCheckoutCardTopo">
              <div>
                <span className="brasaCheckoutNumero">03 / FIDELIDADE</span>
                <h2 id="checkoutFidelidade">SEUS PONTOS VALEM MAIS</h2>
              </div>
              <span className="brasaCheckoutSaldo">{usuario.points} pts</span>
            </div>

            <label className={`brasaCheckoutPontos ${usarPontos ? "selecionado" : ""} ${usuario.points < 100 ? "indisponivel" : ""}`}>
              <input
                type="checkbox"
                checked={usarPontos}
                disabled={usuario.points < 100}
                onChange={(event) => {
                  setUsarPontos(event.target.checked);
                  setMensagem("");
                }}
              />
              <span>
                <strong>Trocar 100 pontos por R$ 5,00 de desconto</strong>
                <small>{usuario.points >= 100
                  ? "Ative esta opção para aplicar o desconto ao pedido."
                  : `Você tem ${usuario.points} pontos. São necessários 100 para resgatar.`}</small>
              </span>
              <span className="brasaCheckoutPontosDesconto">− R$ 5</span>
            </label>

            <p className="brasaCheckoutInfoPontos">Ao concluir o pedido, você receberá {pontosGanhos} {pontosGanhos === 1 ? "ponto" : "pontos"} de fidelidade.</p>
          </section>

          <section className="finalizacaoCard brasaCheckoutCard" aria-labelledby="checkoutPagamento">
            <div className="brasaCheckoutCardTopo">
              <div>
                <span className="brasaCheckoutNumero">04 / PAGAMENTO</span>
                <h2 id="checkoutPagamento">COMO QUER PAGAR?</h2>
              </div>
            </div>

            <fieldset className="brasaCheckoutFormasPagamento">
              <legend>Escolha a forma de pagamento</legend>
              <label className={`brasaCheckoutPagamentoOpcao ${formaPagamento === "Pix" ? "selecionado" : ""}`}>
                <input
                  type="radio"
                  name="formaPagamento"
                  value="Pix"
                  checked={formaPagamento === "Pix"}
                  onChange={() => {
                    setFormaPagamento("Pix");
                    setMensagem("");
                  }}
                />
                <span>
                  <strong>Pix</strong>
                  <small>Pagamento instantâneo (simulado)</small>
                </span>
              </label>

              <label className={`brasaCheckoutPagamentoOpcao ${formaPagamento === "Cartão" ? "selecionado" : ""}`}>
                <input
                  type="radio"
                  name="formaPagamento"
                  value="Cartão"
                  checked={formaPagamento === "Cartão"}
                  onChange={() => {
                    setFormaPagamento("Cartão");
                    setMensagem("");
                  }}
                />
                <span>
                  <strong>Cartão</strong>
                  <small>Pagamento com cartão (simulado)</small>
                </span>
              </label>
            </fieldset>

            <div className="brasaCheckoutSimulacao">
              <label htmlFor="resultadoPagamento">Resultado do pagamento de teste</label>
              <select
                id="resultadoPagamento"
                value={resultadoSimulado}
                onChange={(event) => {
                  setResultadoSimulado(event.target.value);
                  setMensagem("");
                }}
              >
                <option value="aprovado">Aprovado — pedido confirmado</option>
                <option value="negado">Recusado — testar pagamento negado</option>
                <option value="erro">Erro — testar indisponibilidade</option>
              </select>
              <p>Ambiente demonstrativo. Não solicitamos dados bancários e nenhuma cobrança será realizada.</p>
            </div>
          </section>
        </div>

        <aside className="resumoFinalizacao brasaCheckoutResumo" aria-label="Resumo e confirmação da compra">
          <span className="brasaEtiqueta">ÚLTIMO PASSO</span>
          <h2>RESUMO DO PEDIDO</h2>

          <div className="brasaCheckoutResumoLinha">
            <span>Produtos ({quantidadeProdutos})</span>
            <strong>{formatarPreco(subtotal)}</strong>
          </div>

          <div className="brasaCheckoutResumoLinha">
            <span>Taxa de embalagem</span>
            <strong>{formatarPreco(taxaEmbalagem)}</strong>
          </div>

          {desconto > 0 && (
            <div className="brasaCheckoutResumoLinha desconto">
              <span>Desconto de fidelidade</span>
              <strong>− {formatarPreco(desconto)}</strong>
            </div>
          )}

          <div className="brasaCheckoutResumoTotal">
            <span>Total</span>
            <strong>{formatarPreco(total)}</strong>
          </div>

          <p className="brasaCheckoutResumoNota">Pedido para retirada na unidade {unit.name}.</p>

          {mensagem !== "" && (
            <p className="brasaCheckoutErro" role="alert">{mensagem}</p>
          )}

          <div className="acoesFinalizacao brasaCheckoutAcoes">
            <button type="submit" disabled={carrinho.length === 0}>
              Confirmar pedido →
            </button>
            <button type="button" onClick={voltarCarrinho}>
              ← Voltar ao carrinho
            </button>
          </div>

          <p className="brasaCheckoutRodape">Pagamento 100% simulado · Nenhuma cobrança real</p>
        </aside>
      </form>
    </main>
  );
}
