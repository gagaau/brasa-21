import type { Order } from "../types/Order";

type OrderTrackingProps = {
  pedido: Order;
  voltarInicio: () => void;
};

export function OrderTracking({ pedido, voltarInicio }: OrderTrackingProps) {
  const etapas = [
    { nome: "Recebido", descricao: "Seu pedido entrou na fila da cozinha." },
    { nome: "Em preparação", descricao: "Estamos preparando seus produtos." },
    { nome: "Pronto para retirada", descricao: "Seu pedido está esperando por você no balcão." },
    { nome: "Concluído", descricao: "Pedido retirado e pontos de fidelidade creditados." }
  ];

  const indiceAtual = etapas.findIndex((etapa) => etapa.nome === pedido.status);
  const pedidoConcluido = pedido.status === "Concluído";

  const quantidadeProdutos = pedido.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  return (
    <main className="paginaPedido brasaPedido">
      <div className="paginaHeading brasaPedidoCabecalho">
        <span className="brasaEtiqueta">BRASA 21 · ACOMPANHAMENTO</span>

        <div className="brasaPedidoTitulo">
          <div>
            <h1>{pedidoConcluido ? "PEDIDO FINALIZADO." : "SEU PEDIDO TÁ NA BRASA."}</h1>
            <p>Acompanhe as etapas do preparo e confira os detalhes da retirada.</p>
          </div>

          <span className="brasaPedidoNumero">PEDIDO Nº {pedido.id}</span>
        </div>
      </div>

      <section className="brasaPedidoDestaque" aria-label="Situação atual do pedido">
        <div>
          <span className="brasaPedidoRotulo">STATUS ATUAL</span>
          <h2 role="status" aria-live="polite">{pedido.status}</h2>
          <p>{etapas[indiceAtual]?.descricao}</p>
        </div>

        <span className="brasaPedidoContador">
          ETAPA {indiceAtual + 1} DE {etapas.length}
        </span>
      </section>

      <div className="pedidoLayout brasaPedidoLayout">
        <section className="pedidoCard brasaPedidoCard brasaPedidoProgresso" aria-labelledby="tituloProgresso">
          <div className="brasaPedidoCardTopo">
            <div>
              <span className="brasaPedidoRotulo">DO PEDIDO À RETIRADA</span>
              <h2 id="tituloProgresso">ACOMPANHE AS ETAPAS</h2>
            </div>
          </div>

          <ol className="etapasPedido brasaPedidoEtapas">
            {etapas.map((etapa, index) => {
              const concluida = index < indiceAtual;
              const atual = index === indiceAtual;

              let classeEtapa = "etapaPedido";

              if (concluida) {
                classeEtapa += " etapaConcluida";
              }
              else if (atual) {
                classeEtapa += " etapaAtual";
              }

              return (
                <li
                  key={etapa.nome}
                  className={classeEtapa}
                  aria-current={atual ? "step" : undefined}
                >
                  <span className="brasaPedidoEtapaIcone" aria-hidden="true">
                    {concluida ? "✓" : index + 1}
                  </span>

                  <div className="brasaPedidoEtapaTexto">
                    <strong>{etapa.nome}</strong>
                    <p>{etapa.descricao}</p>
                  </div>

                  {atual && <small className="brasaPedidoEtapaMarcador">AGORA</small>}
                </li>
              );
            })}
          </ol>

          <div className="brasaPedidoInformacao">
            <strong>{pedidoConcluido ? "Tudo pronto!" : "Como funciona o acompanhamento?"}</strong>
            <p>
              {pedidoConcluido
                ? "Obrigado por pedir com a BRASA 21. Esperamos você novamente!"
                : "Nesta demonstração, os status são atualizados manualmente pelo painel operacional."}
            </p>
          </div>

          <div className="brasaPedidoPontos">
            <div>
              <span className="brasaPedidoRotulo">CLUBE BRASA</span>
              <strong>{pedidoConcluido ? `+${pedido.pointsToEarn} pontos recebidos` : `+${pedido.pointsToEarn} pontos a receber`}</strong>
              <p>
                {pedidoConcluido
                  ? "Pontos creditados na conclusão do pedido."
                  : "Os pontos serão creditados quando o pedido for concluído."}
              </p>
            </div>

            {pedido.usedPoints > 0 && (
              <p className="brasaPedidoPontosUsados">{pedido.usedPoints} pontos utilizados neste pedido</p>
            )}
          </div>
        </section>

        <div className="brasaPedidoLateral">
          <section className="pedidoCard brasaPedidoCard" aria-labelledby="tituloProdutosPedido">
            <div className="brasaPedidoCardTopo">
              <div>
                <span className="brasaPedidoRotulo">RESUMO DA COMPRA</span>
                <h2 id="tituloProdutosPedido">SEUS PRODUTOS</h2>
              </div>
              <span className="brasaPedidoQuantidade">{quantidadeProdutos} {quantidadeProdutos === 1 ? "item" : "itens"}</span>
            </div>

            <div className="brasaPedidoProdutos">
              {pedido.items.map((item) => {
                return (
                  <div key={item.id} className="itemPedido brasaPedidoProduto">
                    <img
                      src={`/images/produtos/${item.product.id}.png`}
                      alt={`Imagem ilustrativa de ${item.product.name}`}
                      loading="lazy"
                    />

                    <div>
                      <h3>{item.product.name}</h3>
                      <p>{item.quantity} {item.quantity === 1 ? "unidade" : "unidades"}</p>
                      {item.observation.trim() !== "" && (
                        <p className="brasaPedidoObservacao">Obs.: {item.observation}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="brasaPedidoPagamento">
              <div>
                <span>Pagamento</span>
                <strong>{pedido.paymentMethod} · Aprovado</strong>
              </div>
              <div className="brasaPedidoTotal">
                <span>Total pago</span>
                <strong>{formatarPreco(pedido.total)}</strong>
              </div>
            </div>
          </section>

          <section className="pedidoCard brasaPedidoCard brasaPedidoRetirada" aria-labelledby="tituloRetirada">
            <span className="brasaPedidoRotulo">ONDE RETIRAR</span>
            <h2 id="tituloRetirada">BRASA 21 · {pedido.unit.name}</h2>
            <p>{pedido.unit.address}</p>
            <p>{pedido.unit.city}</p>
            <div className="brasaPedidoRetiradaAviso">
              {pedidoConcluido
                ? "Retirada concluída. Obrigado pela preferência!"
                : "Aguarde o status ‘Pronto para retirada’ antes de ir ao balcão."}
            </div>
          </section>
        </div>
      </div>

      <div className="brasaPedidoRodape">
        <button type="button" onClick={voltarInicio}>Voltar ao início</button>
        <p>Este é um ambiente demonstrativo. Nenhum pagamento real foi realizado.</p>
      </div>
    </main>
  );
}
