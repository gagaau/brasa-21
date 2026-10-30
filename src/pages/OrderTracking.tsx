import type { Order } from "../types/Order";

type OrderTrackingProps = {
  pedido: Order;
  voltarInicio: () => void;
};



export function OrderTracking({pedido, voltarInicio}: OrderTrackingProps) {

  const etapas = [
    "Recebido",
    "Em preparação",
    "Pronto para retirada",
    "Concluído"
  ];


  const indiceAtual = etapas.indexOf(pedido.status);

  
  return (
    <div className="paginaPedido">

      <div className="paginaHeading">
        <h1>Acompanhar pedido</h1>
        <p>Pedido nº {pedido.id}</p>
        <p>Pagamento aprovado via {pedido.paymentMethod}.</p>

        {pedido.usedPoints > 0 && (
          <p>Pontos utilizados: {pedido.usedPoints}</p>
        )}
      </div>

      <div className="pedidoLayout">

        <div className="pedidoCard">

          <h2>Status do pedido</h2>

          <div className="etapasPedido">
            {etapas.map((etapa, index) => {

              let classeEtapa = "etapaPedido";

              if (index < indiceAtual) {
                classeEtapa = "etapaPedido etapaConcluida";
              }

              if (index === indiceAtual) {
                classeEtapa = "etapaPedido etapaAtual";
              }

              return (
                <div key={etapa} className={classeEtapa}>
                  <span>{index + 1}</span>
                  <p>{etapa}</p>
                </div>
              )
            })}
          </div>

          <h3>Status atual: {pedido.status}</h3>

          {pedido.status === "Concluído" && (
            <p>Pedido concluído. Obrigado pela preferência!</p>
          )}

          {pedido.status === "Concluído" ? (
            <p>Pontos recebidos: {pedido.pointsToEarn}</p>
          ) : (
            <p>Você receberá {pedido.pointsToEarn} pontos após a conclusão do pedido.</p>
          )}

        </div>

        <div className="pedidoCard">

          <h2>Produtos</h2>

          {pedido.items.map((item) => {
            return (
              <div key={item.id} className="itemPedido">
                <p>{item.product.name} - {item.quantity}x</p>
                <p>Observação: {item.observation || "Nenhuma"}</p>
              </div>
            )
          })}

          <h2>Total pago</h2>

          <p className="produtoPreco">
            {pedido.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </p>

          <h2>Retirada</h2>

          <p>Unidade {pedido.unit.name}</p>
          <p>{pedido.unit.address} - {pedido.unit.city}</p>

          {pedido.status !== "Concluído" && (
            <p>Previsão ilustrativa: 15 a 20 minutos.</p>
          )}

        </div>

      </div>

      <button onClick={voltarInicio}>Voltar ao início</button>

    </div>
  )
}
