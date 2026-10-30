import { units } from "../data/units";
import { users } from "../data/users";
import { useState } from "react";
import { Menu } from "./Menu";
import { Cart } from "./Cart";
import { Auth } from "./Auth";
import { Checkout } from "./Checkout";
import { OrderTracking } from "./OrderTracking";
import { Profile } from "./Profile";
import type { Unit } from "../types/Unit";
import type { User } from "../types/User";
import type { CartItem } from "../types/CartItem";
import type { Order } from "../types/Order";
import { Totem } from "./Totem";
import { Operations } from "./Operations";



export default function UnitSelection() {

  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unit | null>(null);
  const [pesquisar, setPesquisar] = useState<string>("");
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [tela, setTela] = useState<"login" | "menu" | "carrinho" | "finalizacao" | "pedido" | "perfil" | "operacao">("login");
  const [telaAnterior, setTelaAnterior] = useState<"menu" | "carrinho" | "finalizacao">("menu");
  const [telaAntesPerfil, setTelaAntesPerfil] = useState<"menu" | "carrinho" | "finalizacao" | "pedido">("menu");
  const [usuarios, setUsuarios] = useState<User[]>(users);
  const [usuarioLogado, setUsuarioLogado] = useState<User | null>(null);
  const [pedidoAtual, setPedidoAtual] = useState<Order | null>(null);
  const [modoTotem, setModoTotem] = useState<boolean>(false);


  const unidadesFiltradas = units.filter((unidade) => unidade.name.toLowerCase().includes(pesquisar.trim().toLowerCase()));

  function adicionarItem(novoItem: CartItem) {
    setCarrinho(carrinhoAtual => [...carrinhoAtual, novoItem]);
  }

  function atualizarUsuario(usuarioAtualizado: User) {
    const resultado = usuarios.map((usuario) => {
      if (usuario.id === usuarioAtualizado.id) {
        return usuarioAtualizado;
      }

      return usuario;
    });

    setUsuarios(resultado);
    setUsuarioLogado(usuarioAtualizado);
  }


  function salvarUsuario(usuarioAtualizado: User) {
    setUsuarios(usuariosAtuais => {
      const resultado = usuariosAtuais.map((usuario) => {
        if (usuario.id === usuarioAtualizado.id) {
          return usuarioAtualizado;
        }

        return usuario;
      });

      return resultado;
    });

    if (usuarioLogado !== null && usuarioLogado.id === usuarioAtualizado.id) {
      setUsuarioLogado(usuarioAtualizado);
    }
  }


  function salvarPromocoes(receberPromocoes: boolean) {
    if (usuarioLogado === null) {
      return;
    }

    const usuarioAtualizado = {
      ...usuarioLogado,
      receivePromotions: receberPromocoes
    };

    atualizarUsuario(usuarioAtualizado);
  }

  function trocarUnidade() {
    if (carrinho.length > 0) {
      const confirmou = window.confirm("Ao trocar de unidade, os produtos do carrinho serão removidos. Deseja continuar?");

      if (!confirmou) {
        return;
      }
    }

    setCarrinho([]);
    setUnidadeSelecionada(null);
    setTela("menu");
  }

  function abrirLogin() {
    if (tela === "carrinho") {
      setTelaAnterior("carrinho");
    }
    else {
      setTelaAnterior("menu");
    }

    setTela("login");
  }

  function entrar(usuario: User) {
    setUsuarioLogado(usuario);
    setTela(telaAnterior);
  }

  function continuarSemLogin() {
    if (telaAnterior === "finalizacao") {
      setTela("carrinho");
      return;
    }

    setTela(telaAnterior);
  }

  function sair() {
    setUsuarioLogado(null);
    setCarrinho([]);
    setUnidadeSelecionada(null);
    setTelaAnterior("menu");
    setTela("login");
  }

  function abrirPerfil() {
    if (usuarioLogado === null) {
      return
    }

    if (tela === "carrinho" || tela === "finalizacao" || tela === "pedido") {
      setTelaAntesPerfil(tela);
    }
    else {
      setTelaAntesPerfil("menu");
    }

    setTela("perfil");
  }

  function finalizarCompra() {
    if (carrinho.length === 0) {
      return;
    }
    
    if (pedidoAtual !== null && pedidoAtual.status !== "Concluído") {

      if (usuarioLogado !== null && pedidoAtual.userId === usuarioLogado.id) {
        window.alert("Você já possui um pedido em andamento.");
        setTela("pedido");
      }
      else {
        window.alert("Já existe um pedido em andamento nesta simulação. Conclua pelo painel operacional antes de fazer outro.");
      }

      return;
    }

    if (usuarioLogado === null) {
      setTelaAnterior("finalizacao");
      setTela("login");
      return;
    }

    setTela("finalizacao")
  }

  function confirmarPedido(formaPagamento: string, total: number, usarPontos: boolean) {
    if (usuarioLogado === null) {
      setTelaAnterior("finalizacao");
      setTela("login");
      return;
    }

    if (unidadeSelecionada === null || carrinho.length === 0) {
      return;
    }

    if (usarPontos && usuarioLogado.points < 100) {
      return;
    }

    const pontosUtilizados = usarPontos ? 100 : 0;

    const pontosGanhos = Math.floor(total);

    const novoPedido: Order = {
      id: Date.now(),
      userId: usuarioLogado.id,
      unit: unidadeSelecionada,
      items: [...carrinho],
      total: total,
      paymentMethod: formaPagamento,
      usedPoints: pontosUtilizados,
      pointsToEarn: pontosGanhos,
      status: "Recebido"
    };


    if (pontosUtilizados > 0) {

      const usuarioAtualizado = {
        ...usuarioLogado,
        points: usuarioLogado.points - pontosUtilizados
      };

      atualizarUsuario(usuarioAtualizado);
    }

    setPedidoAtual(novoPedido);
    setCarrinho([]);
    setTela("pedido");
  }

  
  function avancarStatus() {
    if (pedidoAtual === null) {
      return;
    }

    if (pedidoAtual.status === "Recebido") {
      setPedidoAtual({...pedidoAtual, status: "Em preparação"});
      return;
    }

    if (pedidoAtual.status === "Em preparação") {
      setPedidoAtual({...pedidoAtual, status: "Pronto para retirada"});
      return;
    }

    if (pedidoAtual.status === "Pronto para retirada") {

      const usuarioPedido = usuarios.find((usuario) => {
        return usuario.id === pedidoAtual.userId;
      });

      if (usuarioPedido !== undefined) {
        const usuarioAtualizado = {
          ...usuarioPedido,
          points: usuarioPedido.points + pedidoAtual.pointsToEarn
        };

        salvarUsuario(usuarioAtualizado);
      }

      setPedidoAtual({...pedidoAtual, status: "Concluído"});
      return;
    }
  }


  
  function voltarInicio() {
    setUnidadeSelecionada(null);
    setTela("menu");
  }

  const areaUsuario = (
    <div className="barraDeUsuario">
      <p>
        {usuarioLogado !== null
          ? `Logado como ${usuarioLogado.name}`
          : "Você está navegando sem login."}
      </p>

      {usuarioLogado === null ? (
        <button onClick={abrirLogin}>Entrar ou criar conta</button>
      ) : (
        <div className="usuarioActions">
          <button onClick={abrirPerfil}>Meu perfil</button>
          <button onClick={sair}>Sair da conta</button>
          {pedidoAtual !== null && pedidoAtual.userId === usuarioLogado.id && (
            <button onClick={() => setTela("pedido")}>
              Acompanhar pedido
            </button>
          )}
        </div>
      )}
    </div>
  );



  if (modoTotem) {
    return (
      <Totem
        usuarios={usuarios}
        salvarUsuario={salvarUsuario}
        registrarPedido={(novoPedido) => setPedidoAtual(novoPedido)}
        encerrarAtendimento={() => setModoTotem(false)}
      />
    )
  }



  if (tela === "operacao") {
    return (
      <Operations
        pedido={pedidoAtual}
        avancarStatus={avancarStatus}
        voltar={() => setTela("menu")}
      />
    )
  }


  if (tela === "login") {
    return (
      <Auth
        usuarios={usuarios}
        atualizarUsuarios={setUsuarios}
        entrar={entrar}
        continuarSemLogin={continuarSemLogin}
      />
    )
  }

  if (tela === "perfil" && usuarioLogado !== null) {
    return (
      <Profile
        usuario={usuarioLogado}
        unit={unidadeSelecionada}
        salvarPromocoes={salvarPromocoes}
        voltar={() => setTela(telaAntesPerfil)}
      />
    )
  }

  
  if (tela === "pedido" && pedidoAtual !== null && usuarioLogado !== null && pedidoAtual.userId === usuarioLogado.id) {
    return (
      <div>
        {areaUsuario}

        <OrderTracking
          pedido={pedidoAtual}
          voltarInicio={voltarInicio}
        />
      </div>
    )
  }

  if (unidadeSelecionada !== null) {

    if (tela === "finalizacao" && usuarioLogado !== null) {
      return (
        <div>
          {areaUsuario}

          <Checkout
            unit={unidadeSelecionada}
            usuario={usuarioLogado}
            carrinho={carrinho}
            confirmarPedido={confirmarPedido}
            voltarCarrinho={() => setTela("carrinho")}
          />
        </div>
      )
    }

    if (tela === "carrinho") {
      return (
        <div>
          {areaUsuario}

          <Cart
            unit={unidadeSelecionada}
            carrinho={carrinho}
            atualizarCarrinho={setCarrinho}
            voltarMenu={() => setTela("menu")}
            finalizarPedido={finalizarCompra}
          />

          <button onClick={trocarUnidade}>Trocar unidade</button>
        </div>
      )
    }

    return (
      <div>
        {areaUsuario}

        <Menu
          unit={unidadeSelecionada}
          carrinho={carrinho}
          adicionarItem={adicionarItem}
          abrirCarrinho={() => setTela("carrinho")}
        />

        <button onClick={trocarUnidade}>Trocar unidade</button>
      </div>
    )
  }

  
return (
  <div>
    {areaUsuario}

    <div className="paginaHeading">
      <h1>Selecione uma unidade</h1>
      <p>Escolha a unidade onde deseja retirar seu pedido.</p>
    </div>

    
    <button onClick={() => {
      if (pedidoAtual !== null && pedidoAtual.status !== "Concluído") {
        window.alert("Conclua o pedido em andamento pelo painel operacional antes de iniciar outro atendimento.");
        return;
      }
      setUsuarioLogado(null);
      setTelaAnterior("menu");
      setTela("menu");
      setModoTotem(true);
    }}>
      Simular Totem - Unidade Centro
    </button>


    <button onClick={() => setTela("operacao")}>
      Simular painel operacional
    </button>

    <input
      placeholder="Pesquisar unidade"
      value={pesquisar}
      onChange={(event) => setPesquisar(event.target.value)}
    />

    {unidadesFiltradas.length === 0 && (
      <p>Nenhuma unidade encontrada.</p>
    )}

    <div className="unitGrid">
      {unidadesFiltradas.map((unidade) => {
        return (
          <div key={unidade.id} className="unitCard">
            <h2>Unidade {unidade.name}</h2>

            <p>{unidade.city}</p>
            <p>{unidade.address}</p>

            <p className="unitStatus">
              {unidade.isOpen ? "Aberta" : "Fechada"}
            </p>

            <button
              onClick={() => setUnidadeSelecionada(unidade)}
              disabled={!unidade.isOpen}
            >
              Selecionar
            </button>
          </div>
            )
          })}
        </div>
      </div>
    );
}
