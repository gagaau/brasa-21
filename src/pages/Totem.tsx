import { useState } from "react";
import { units } from "../data/units";
import { Menu } from "./Menu";
import { Cart } from "./Cart";
import { Checkout } from "./Checkout";
import { OrderTracking } from "./OrderTracking";
import type { User } from "../types/User";
import type { CartItem } from "../types/CartItem";
import type { Order } from "../types/Order";

type TotemProps = {
  usuarios: User[];
  salvarUsuario: (usuario: User) => void;
  registrarPedido: (pedido: Order) => void;
  encerrarAtendimento: () => void;
};

export function Totem({ usuarios, salvarUsuario, registrarPedido, encerrarAtendimento }: TotemProps) {
  const unidadeTotem = units.find((unidade) => unidade.id === 1);
  const contaDemonstracao = usuarios.find((usuario) => usuario.id === 1) ?? usuarios[0];

  const [telaTotem, setTelaTotem] = useState<"menu" | "carrinho" | "identificacao" | "finalizacao" | "pedido">("menu");
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [usuarioTotem, setUsuarioTotem] = useState<User | null>(null);
  const [pedidoTotem, setPedidoTotem] = useState<Order | null>(null);
  const [mensagem, setMensagem] = useState<string>("");

  const totalQuantidade = carrinho.reduce((total, item) => total + item.quantity, 0);

  const subtotal = carrinho.reduce((total, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;
    return total + preco * item.quantity;
  }, 0);

  const taxaEmbalagem = carrinho.length > 0 ? 2 : 0;
  const total = subtotal + taxaEmbalagem;

  function formatarPreco(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function adicionarItem(novoItem: CartItem) {
    setCarrinho(carrinhoAtual => [...carrinhoAtual, novoItem]);
  }

  function alterarQuantidade(id: string, quantidade: number) {
    if (quantidade < 1) {
      return;
    }

    setCarrinho(carrinhoAtual => carrinhoAtual.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: quantidade };
      }

      return item;
    }));
  }

  function removerItem(id: string) {
    setCarrinho(carrinhoAtual => carrinhoAtual.filter((item) => item.id !== id));
  }

  function finalizarCompra() {
    if (carrinho.length === 0) {
      return;
    }

    setMensagem("");

    if (usuarioTotem === null) {
      setTelaTotem("identificacao");
      return;
    }

    setTelaTotem("finalizacao");
  }

  function continuarComContaDeTeste() {
    if (contaDemonstracao === undefined) {
      setMensagem("A conta de demonstração não está disponível.");
      return;
    }

    setUsuarioTotem(contaDemonstracao);
    setMensagem("");
    setTelaTotem("finalizacao");
  }

  function confirmarPedido(formaPagamento: string, totalPago: number, usarPontos: boolean) {
    if (usuarioTotem === null || unidadeTotem === undefined || carrinho.length === 0) {
      return;
    }

    if (usarPontos && usuarioTotem.points < 100) {
      return;
    }

    const pontosUtilizados = usarPontos ? 100 : 0;

    const novoPedido: Order = {
      id: Date.now(),
      userId: usuarioTotem.id,
      unit: unidadeTotem,
      items: [...carrinho],
      total: totalPago,
      paymentMethod: formaPagamento,
      usedPoints: pontosUtilizados,
      pointsToEarn: Math.floor(totalPago),
      status: "Recebido"
    };

    if (pontosUtilizados > 0) {
      const usuarioAtualizado = {
        ...usuarioTotem,
        points: usuarioTotem.points - pontosUtilizados
      };

      setUsuarioTotem(usuarioAtualizado);
      salvarUsuario(usuarioAtualizado);
    }

    setPedidoTotem(novoPedido);
    registrarPedido(novoPedido);
    setCarrinho([]);
    setTelaTotem("pedido");
  }

  function encerrar() {
    if (carrinho.length > 0) {
      const confirmou = window.confirm("Encerrar o atendimento? Os produtos do carrinho serão removidos.");

      if (!confirmou) {
        return;
      }
    }

    setUsuarioTotem(null);
    setCarrinho([]);
    setPedidoTotem(null);
    encerrarAtendimento();
  }

  if (unidadeTotem === undefined || !unidadeTotem.isOpen) {
    return (
      <div className="paginaTotem brasaTotem">
        <div className="brasaTotemAviso">
          <h1>Totem indisponível</h1>
          <p>A unidade Centro não está disponível para atendimento neste momento.</p>
          <button onClick={encerrarAtendimento}>Voltar ao início</button>
        </div>
      </div>
    );
  }

  const etapas = [
    { id: "menu", nome: "Cardápio" },
    { id: "carrinho", nome: "Carrinho" },
    { id: "identificacao", nome: "Identificação" },
    { id: "finalizacao", nome: "Pagamento" },
    { id: "pedido", nome: "Pedido" }
  ];

  const indiceAtual = etapas.findIndex((etapa) => etapa.id === telaTotem);

  return (
    <div className="paginaTotem brasaTotem">
      <header className="topoTotem brasaTotemTopo">
        <div className="brasaTotemMarca">
          <img src="/images/logo-brasa21.png" alt="BRASA 21" />
          <div>
            <span className="brasaEtiqueta">PEDIU. PAGOU. PARTIU.</span>
            <h1>AUTOATENDIMENTO</h1>
            <p>Unidade {unidadeTotem.name} · Retirada no balcão</p>
          </div>
        </div>

        <button type="button" className="brasaTotemSair" onClick={encerrar}>
          Encerrar atendimento
        </button>
      </header>

      <nav className="brasaTotemEtapas" aria-label="Etapas do autoatendimento">
        {etapas.map((etapa, index) => (
          <span
            key={etapa.id}
            className={index === indiceAtual ? "atual" : index < indiceAtual ? "concluida" : ""}
            aria-current={index === indiceAtual ? "step" : undefined}
          >
            <span className="brasaTotemEtapaNumero">{index < indiceAtual ? "✓" : index + 1}</span>
            {etapa.nome}
          </span>
        ))}
      </nav>

      {telaTotem === "menu" && (
        <div className="totemLayout brasaTotemLayout">
          <Menu
            unit={unidadeTotem}
            carrinho={carrinho}
            adicionarItem={adicionarItem}
            abrirCarrinho={() => setTelaTotem("carrinho")}
          />

          <aside className="carrinhoTotem brasaTotemCarrinho" aria-label="Resumo do carrinho">
            <div className="brasaTotemCarrinhoTopo">
              <div>
                <span className="brasaEtiqueta">SEU PEDIDO</span>
                <h2>MEU CARRINHO</h2>
              </div>
              <span className="brasaTotemQuantidade">{totalQuantidade}</span>
            </div>

            {carrinho.length === 0 ? (
              <div className="brasaTotemVazio">
                <span aria-hidden="true">🍔</span>
                <strong>Escolha o primeiro favorito.</strong>
                <p>Os produtos adicionados aparecerão aqui.</p>
              </div>
            ) : (
              <div className="brasaTotemLista">
                {carrinho.map((item) => (
                  <div key={item.id} className="itemTotem brasaTotemItem">
                    <img
                      src={`/images/produtos/${item.product.id}.png`}
                      alt={`Imagem ilustrativa de ${item.product.name}`}
                      loading="lazy"
                    />

                    <div className="brasaTotemItemConteudo">
                      <h3>{item.product.name}</h3>
                      <strong>{formatarPreco((item.product.promotionalPrice ?? item.product.price) * item.quantity)}</strong>
                      {item.observation.trim() !== "" && <p>Obs.: {item.observation}</p>}

                      <div className="botoesTotem brasaTotemControles">
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(item.id, item.quantity - 1)}
                          disabled={item.quantity === 1}
                          aria-label={`Diminuir quantidade de ${item.product.name}`}
                        >
                          −
                        </button>
                        <span aria-label={`Quantidade: ${item.quantity}`}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => alterarQuantidade(item.id, item.quantity + 1)}
                          aria-label={`Aumentar quantidade de ${item.product.name}`}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="brasaTotemRemover"
                          onClick={() => removerItem(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="totalTotem brasaTotemTotais">
              <div><span>Subtotal</span><strong>{formatarPreco(subtotal)}</strong></div>
              <div><span>Embalagem</span><strong>{formatarPreco(taxaEmbalagem)}</strong></div>
              <div className="brasaTotemTotal"><span>Total</span><strong>{formatarPreco(total)}</strong></div>
            </div>

            <div className="brasaTotemAcoes">
              <button
                type="button"
                className="brasaTotemPrincipal"
                onClick={finalizarCompra}
                disabled={carrinho.length === 0}
              >
                Continuar pedido →
              </button>
              <button
                type="button"
                className="brasaTotemSecundario"
                onClick={() => setTelaTotem("carrinho")}
                disabled={carrinho.length === 0}
              >
                Editar carrinho
              </button>
            </div>
          </aside>
        </div>
      )}

      {telaTotem === "carrinho" && (
        <Cart
          unit={unidadeTotem}
          carrinho={carrinho}
          atualizarCarrinho={setCarrinho}
          voltarMenu={() => setTelaTotem("menu")}
          finalizarPedido={finalizarCompra}
        />
      )}

      {telaTotem === "identificacao" && (
        <section className="loginTotem brasaTotemIdentificacao">
          <span className="brasaEtiqueta">QUASE LÁ</span>
          <h2>CONTINUE SEM SENHA.</h2>
          <p>
            Para experimentar o pagamento e o clube de fidelidade, vamos usar uma
            conta fictícia. Não é necessário informar dados pessoais.
          </p>

          {contaDemonstracao !== undefined && (
            <div className="brasaTotemConta">
              <span className="brasaTotemAvatar" aria-hidden="true">
                {contaDemonstracao.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>{contaDemonstracao.name}</strong>
                <p>Perfil de teste · {contaDemonstracao.points} pontos</p>
              </div>
            </div>
          )}

          {mensagem !== "" && <p className="brasaTotemErro" role="alert">{mensagem}</p>}

          <button type="button" className="brasaTotemPrincipal" onClick={continuarComContaDeTeste}>
            Continuar com perfil de teste →
          </button>
          <button type="button" className="brasaTotemSecundario" onClick={() => setTelaTotem("carrinho")}>
            ← Voltar ao carrinho
          </button>
          <small>Pagamento simulado. Nenhuma cobrança será feita.</small>
        </section>
      )}

      {telaTotem === "finalizacao" && usuarioTotem !== null && (
        <Checkout
          unit={unidadeTotem}
          usuario={usuarioTotem}
          carrinho={carrinho}
          confirmarPedido={confirmarPedido}
          voltarCarrinho={() => setTelaTotem("carrinho")}
        />
      )}

      {telaTotem === "pedido" && pedidoTotem !== null && (
        <OrderTracking pedido={pedidoTotem} voltarInicio={encerrar} />
      )}

      <p className="brasaTotemNota">
        BRASA 21 é um projeto demonstrativo. Pedidos e pagamentos não são reais.
      </p>
    </div>
  );
}
