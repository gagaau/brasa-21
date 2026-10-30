import { units } from "../data/units";
import type { Order } from "../types/Order";

type OperationsProps = {
  pedido: Order | null;
  avancarStatus: () => void;
  voltar: () => void;
};

export function Operations({pedido, avancarStatus, voltar}: OperationsProps) {

  return (
    <div className="paginaOperacao">

      <div className="paginaHeading">
        <h1>Painel operacional</h1>
        <p>Simulação do acompanhamento de pedidos pela cozinha.</p>
      </div>

      <h2>Unidades da rede</h2>

      <div className="operacaoGrid">
        {units.map((unidade) => {
          return (
            <div key={unidade.id} className="operacaoCard">
              <h3>Unidade {unidade.name}</h3>

              <p>{unidade.address}</p>
              <p>{unidade.city}</p>

              <p>Situação: {unidade.isOpen ? "Aberta" : "Fechada"}</p>

              <p>Produtos cadastrados na unidade: {unidade.availableProductIds.length}</p>
            </div>
          )
        })}
      </div>

      <div className="pedidoOperacao">

        <h2>Pedido registrado</h2>

        {pedido === null ? (
          <p>Nenhum pedido registrado nesta simulação.</p>
        ) : (
          <div>

            <h3>Pedido nº {pedido.id}</h3>

            <p>Unidade: {pedido.unit.name}</p>

            <p>Pagamento: {pedido.paymentMethod} - Aprovado</p>

            <h3>Produtos</h3>

            {pedido.items.map((item) => {
              return (
                <div key={item.id} className="itemOperacao">
                  <p>{item.product.name} - {item.quantity}x</p>
                  <p>Observação: {item.observation || "Nenhuma"}</p>
                </div>
              )
            })}

            <h3>Status atual: {pedido.status}</h3>

            {pedido.status !== "Concluído" && (
              <button onClick={avancarStatus}>
                Avançar status (simulação)
              </button>
            )}

            {pedido.status === "Concluído" && (
              <p>Pedido concluído e pontos creditados ao cliente.</p>
            )}

          </div>
        )}

      </div>

      <button onClick={voltar}>
        Voltar à seleção de unidade
      </button>

    </div>
  )
}
