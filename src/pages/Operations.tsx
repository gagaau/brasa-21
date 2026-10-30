import { units } from "../data/units";
import type { Order } from "../types/Order";

type OperationsProps = {
  pedido: Order | null;
  avancarStatus: () => void;
  voltar: () => void;
};

const etapas: Order["status"][] = [
  "Recebido",
  "Em preparação",
  "Pronto para retirada",
  "Concluído"
];

const textosStatus: Record<Order["status"], string> = {
  "Recebido": "Pedido confirmado e aguardando o início do preparo.",
  "Em preparação": "A cozinha está preparando os produtos do pedido.",
  "Pronto para retirada": "O pedido está pronto e pode ser retirado no balcão.",
  "Concluído": "Pedido entregue e pontos de fidelidade creditados."
};

const textosBotao: Record<Order["status"], string> = {
  "Recebido": "Iniciar preparação",
  "Em preparação": "Marcar como pronto",
  "Pronto para retirada": "Concluir pedido",
  "Concluído": "Pedido concluído"
};

export function Operations({ pedido, avancarStatus, voltar }: OperationsProps) {
  const indiceAtual = pedido === null ? -1 : etapas.indexOf(pedido.status);
  const quantidadeItens = pedido?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const proximaEtapa = indiceAtual >= 0 && indiceAtual < etapas.length - 1
    ? etapas[indiceAtual + 1]
    : null;

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  return (
    <div className="paginaOperacao brasaOperacao">
      <header className="brasaOperacaoTopo">
        <div className="brasaOperacaoIdentidade">
          <span className="brasaOperacaoMarca">BRASA <strong>21</strong></span>
          <span className="brasaOperacaoSeparador" aria-hidden="true" />
          <span className="brasaOperacaoArea">CENTRAL DA COZINHA</span>
        </div>

        <button className="brasaOperacaoVoltar" onClick={voltar}>
          ← Voltar ao início
        </button>
      </header>

      <div className="brasaOperacaoApresentacao">
        <div>
          <span className="brasaOperacaoLegenda">CONTROLE DE PEDIDOS</span>
          <h1>Painel operacional<span>.</span></h1>
          <p>Acompanhe os pedidos recebidos e atualize cada etapa do preparo.</p>
        </div>

        <div className="brasaOperacaoDemonstracao">
          <span className="brasaOperacaoSinal" aria-hidden="true" />
          AMBIENTE DE DEMONSTRAÇÃO
        </div>
      </div>

      <section className="brasaOperacaoResumo" aria-label="Resumo do pedido atual">
        <div className="brasaOperacaoResumoCard">
          <span>Pedidos em andamento</span>
          <strong>{pedido !== null && pedido.status !== "Concluído" ? 1 : 0}</strong>
          <small>Esta versão demonstra um pedido por vez</small>
        </div>
        <div className="brasaOperacaoResumoCard">
          <span>Itens do último pedido</span>
          <strong>{quantidadeItens}</strong>
          <small>Soma das quantidades de cada produto</small>
        </div>
        <div className="brasaOperacaoResumoCard">
          <span>Status do pedido</span>
          <strong className="brasaOperacaoResumoStatus">
            {pedido?.status ?? "Sem pedidos"}
          </strong>
          <small>{pedido === null ? "Aguardando novo pedido" : `Pedido #${pedido.id}`}</small>
        </div>
      </section>

      <div className="brasaOperacaoSecaoTitulo">
        <div>
          <span className="brasaOperacaoLegenda">FLUXO DE PREPARO</span>
          <h2>Pedido na cozinha</h2>
        </div>
        {pedido !== null && (
          <span className={`brasaOperacaoStatus brasaOperacaoStatus-${indiceAtual}`} role="status">
            {pedido.status}
          </span>
        )}
      </div>

      {pedido === null ? (
        <section className="brasaOperacaoVazio">
          <div className="brasaOperacaoVazioIcone" aria-hidden="true">01</div>
          <h3>Nenhum pedido por enquanto</h3>
          <p>Faça um pedido pelo cardápio ou pelo totem para acompanhar as etapas do preparo aqui.</p>
          <button onClick={voltar}>Ir para a página inicial</button>
        </section>
      ) : (
        <div className="brasaOperacaoPedidoLayout">
          <section className="brasaOperacaoPedido">
            <div className="brasaOperacaoPedidoCabecalho">
              <div>
                <span className="brasaOperacaoLegenda">COMANDA DIGITAL</span>
                <h3>Pedido #{pedido.id}</h3>
                <p>{pedido.unit.name} · {pedido.unit.city}</p>
              </div>
              <div className="brasaOperacaoQuantidade">
                <strong>{quantidadeItens}</strong>
                <span>{quantidadeItens === 1 ? "item" : "itens"}</span>
              </div>
            </div>

            <div className="brasaOperacaoItens">
              {pedido.items.map((item) => {
                return (
                  <div key={item.id} className="brasaOperacaoItem">
                    <img
                      src={`/images/produtos/${item.product.id}.png`}
                      alt=""
                      loading="lazy"
                    />

                    <div className="brasaOperacaoItemDetalhes">
                      <strong>{item.product.name}</strong>
                      <span>{item.product.category}</span>
                      {item.observation.trim() !== "" && (
                        <p><b>Observação:</b> {item.observation}</p>
                      )}
                    </div>

                    <span className="brasaOperacaoItemQuantidade">{item.quantity}×</span>
                  </div>
                );
              })}
            </div>

            <div className="brasaOperacaoPedidoRodape">
              <span>Pagamento confirmado · {pedido.paymentMethod}</span>
              <strong>{formatarPreco(pedido.total)}</strong>
            </div>
          </section>

          <aside className="brasaOperacaoControle">
            <span className="brasaOperacaoLegenda">ACOMPANHAMENTO</span>
            <h3>Etapas do pedido</h3>

            <ol className="brasaOperacaoEtapas">
              {etapas.map((etapa, index) => {
                const concluida = index < indiceAtual;
                const atual = index === indiceAtual;

                return (
                  <li
                    key={etapa}
                    className={`brasaOperacaoEtapa ${concluida ? "concluida" : ""} ${atual ? "atual" : ""}`}
                    aria-current={atual ? "step" : undefined}
                  >
                    <span className="brasaOperacaoEtapaNumero">{concluida ? "✓" : index + 1}</span>
                    <div>
                      <strong>{etapa}</strong>
                      <small>{concluida ? "Etapa finalizada" : atual ? "Etapa atual" : "Aguardando"}</small>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="brasaOperacaoAviso" role="status" aria-live="polite">
              <strong>{pedido.status}</strong>
              <p>{textosStatus[pedido.status]}</p>
            </div>

            {pedido.status !== "Concluído" ? (
              <>
                <button className="brasaOperacaoAvancar" onClick={avancarStatus}>
                  {textosBotao[pedido.status]} →
                </button>
                {proximaEtapa !== null && (
                  <p className="brasaOperacaoProxima">Próxima etapa: {proximaEtapa}</p>
                )}
              </>
            ) : (
              <p className="brasaOperacaoFinalizado">
                Atendimento finalizado. O próximo pedido substituirá esta comanda na demonstração.
              </p>
            )}
          </aside>
        </div>
      )}

      <section className="brasaOperacaoUnidades">
        <div className="brasaOperacaoSecaoTitulo">
          <div>
            <span className="brasaOperacaoLegenda">REDE BRASA 21</span>
            <h2>Unidades cadastradas</h2>
          </div>
          <span className="brasaOperacaoUnidadesTotal">{units.length} unidades</span>
        </div>

        <div className="operacaoGrid brasaOperacaoUnidadesGrid">
          {units.map((unidade) => {
            return (
              <div key={unidade.id} className="operacaoCard brasaOperacaoUnidade">
                <div className="brasaOperacaoUnidadeTopo">
                  <h3>{unidade.name}</h3>
                  <span className={unidade.isOpen ? "brasaOperacaoAberta" : "brasaOperacaoFechada"}>
                    {unidade.isOpen ? "Aberta" : "Fechada"}
                  </span>
                </div>
                <p>{unidade.address}</p>
                <p>{unidade.city}</p>
                <div className="brasaOperacaoUnidadeRodape">
                  {unidade.availableProductIds.length} produtos no cardápio
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="brasaOperacaoRodape">
        Painel demonstrativo. Status atualizados manualmente; não há integração com uma cozinha real.
      </p>
    </div>
  );
}
