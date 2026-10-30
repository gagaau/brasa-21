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



export function Totem({usuarios, salvarUsuario, registrarPedido, encerrarAtendimento}: TotemProps) {

  const unidadeTotem = units.find((unidade) => unidade.id === 1);
  const [telaTotem, setTelaTotem] = useState<"menu" | "carrinho" | "login" | "finalizacao" | "pedido">("menu");
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [usuarioTotem, setUsuarioTotem] = useState<User | null>(null);
  const [pedidoTotem, setPedidoTotem] = useState<Order | null>(null);

  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [erroLogin, setErroLogin] = useState<string>("");

  const totalQuantidade = carrinho.reduce((acumulador, item) => {
    return acumulador + item.quantity;
  }, 0);

  const subtotal = carrinho.reduce((acumulador, item) => {
    const preco = item.product.promotionalPrice ?? item.product.price;

    const resultado = acumulador + (preco * item.quantity);

    return resultado;
  }, 0);

  const taxaEmbalagem = carrinho.length > 0 ? 2 : 0;

  const total = subtotal + taxaEmbalagem;

  function adicionarItem(novoItem: CartItem) {
    setCarrinho(carrinhoAtual => [...carrinhoAtual, novoItem]);
  }

  function alterarQuantidade(id: string, quantidade: number) {

    if (quantidade < 1) {
      return;
    }

    const resultado = carrinho.map((item) => {
      if (item.id === id) {
        return {...item, quantity: quantidade};
      }

      return item;
    });

    setCarrinho(resultado);
  }

  function removerItem(id: string) {
    const resultado = carrinho.filter((item) => item.id !== id);

    setCarrinho(resultado);
  }

  function finalizarCompra() {

    if (carrinho.length === 0) {
      return;
    }

    if (usuarioTotem === null) {
      setTelaTotem("login");
      return;
    }

    setTelaTotem("finalizacao");
  }

  function fazerLogin() {

    if (!email.trim() || !senha) {
      setErroLogin("Preencha o e-mail e a senha.");
      return;
    }

    const emailFormatado = email.trim().toLowerCase();

    const usuarioEncontrado = usuarios.find((usuario) => {
      return usuario.email === emailFormatado && usuario.password === senha;
    });

    if (!usuarioEncontrado) {
      setErroLogin("E-mail ou senha incorretos.");
      return;
    }

    setUsuarioTotem(usuarioEncontrado);
    setEmail("");
    setSenha("");
    setErroLogin("");
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
      const confirmou = window.confirm("Encerrar atendimento? Os produtos do carrinho serão removidos.");

      if (!confirmou) {
        return;
      }
    }

    setUsuarioTotem(null);
    setCarrinho([]);
    setPedidoTotem(null);
    setEmail("");
    setSenha("");

    encerrarAtendimento();
  }

  if (unidadeTotem === undefined) {
    return <p>Unidade Centro não encontrada.</p>;
  }

  return (
    <div className="paginaTotem">

      <div className="topoTotem">
        <div>
          <h1>Raízes do Nordeste</h1>
          <p>Totem de autoatendimento - Unidade {unidadeTotem.name}</p>
        </div>

        <button onClick={encerrar}>Encerrar atendimento</button>
      </div>

      {telaTotem === "menu" && (
        <div className="totemLayout">

          <Menu
            unit={unidadeTotem}
            carrinho={carrinho}
            adicionarItem={adicionarItem}
            abrirCarrinho={() => setTelaTotem("carrinho")}
          />

          <div className="carrinhoTotem">

            <h2>Meu carrinho</h2>

            <p>Quantidade total: {totalQuantidade}</p>

            {carrinho.length === 0 && (
              <p>Nenhum produto adicionado.</p>
            )}

            {carrinho.map((item) => {
              return (
                <div key={item.id} className="itemTotem">

                  <h3>{item.product.name}</h3>

                  <p>Quantidade: {item.quantity}</p>

                  <div className="botoesTotem">
                    <button
                      onClick={() => alterarQuantidade(item.id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>

                    <button onClick={() => alterarQuantidade(item.id, item.quantity + 1)}>
                      +
                    </button>

                    <button onClick={() => removerItem(item.id)}>
                      Remover
                    </button>
                  </div>

                  <p>{((item.product.promotionalPrice ?? item.product.price) * item.quantity).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}</p>

                </div>
              )
            })}

            <div className="totalTotem">
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
            </div>

            <button
              onClick={() => setTelaTotem("carrinho")}
              disabled={carrinho.length === 0}
            >
              Editar carrinho
            </button>

            <button
              onClick={finalizarCompra}
              disabled={carrinho.length === 0}
            >
              Continuar para finalização
            </button>

          </div>
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

      {telaTotem === "login" && (
        <div className="loginTotem">

          <h2>Identificação do cliente</h2>

          <p>Faça login para finalizar seu pedido.</p>

          <form onSubmit={(event) => {
            event.preventDefault();
            fazerLogin();
          }}>

            <p>E-mail:</p>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Seu e-mail"
            />

            <p>Senha:</p>

            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Sua senha"
            />

            {erroLogin !== "" && (
              <p role="alert">{erroLogin}</p>
            )}

            <button type="submit">Entrar</button>

          </form>

          <p>Conta de demonstração: maria@email.com / 123456</p>

          <button onClick={() => {
            setErroLogin("");
            setTelaTotem("menu");
          }}>
            Voltar ao cardápio
          </button>

        </div>
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
        <OrderTracking
          pedido={pedidoTotem}
          voltarInicio={encerrar}
        />
      )}

    </div>
  )
}
