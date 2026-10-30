import { useEffect, useState } from "react";
import { products } from "../data/products";
import { units } from "../data/units";
import { users } from "../data/users";
import { Menu } from "./Menu";
import { Cart } from "./Cart";
import { Auth } from "./Auth";
import { Checkout } from "./Checkout";
import { OrderTracking } from "./OrderTracking";
import { Profile } from "./Profile";
import { Totem } from "./Totem";
import { Operations } from "./Operations";
import type { Unit } from "../types/Unit";
import type { User } from "../types/User";
import type { CartItem } from "../types/CartItem";
import type { Order } from "../types/Order";


// Salva apenas os dados da simulação no próprio navegador.
const CHAVE_DADOS = "brasa21-demonstracao-v1";

type DadosSalvos = {
  usuarios: User[];
  usuarioLogadoId: number | null;
  unidadeSelecionadaId: number | null;
  carrinho: CartItem[];
  pedidoAtual: Order | null;
};

function restaurarItens(valor: unknown): CartItem[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  const itens: CartItem[] = [];

  for (const item of valor) {
    if (item === null || typeof item !== "object") {
      continue;
    }

    const dados = item as Partial<CartItem>;
    const produto = products.find((produtoAtual) => produtoAtual.id === dados.product?.id);

    if (
      produto === undefined ||
      typeof dados.id !== "string" ||
      typeof dados.quantity !== "number" ||
      !Number.isInteger(dados.quantity) ||
      dados.quantity < 1 ||
      dados.quantity > 99
    ) {
      continue;
    }

    itens.push({
      id: dados.id,
      product: produto,
      quantity: dados.quantity,
      observation: typeof dados.observation === "string" ? dados.observation.slice(0, 500) : ""
    });
  }

  return itens;
}

function restaurarPedido(valor: unknown): Order | null {
  if (valor === null || typeof valor !== "object") {
    return null;
  }

  const pedido = valor as Partial<Order>;
  const unidade = units.find((item) => item.id === pedido.unit?.id);
  const itens = restaurarItens(pedido.items);
  const statusValidos: Order["status"][] = ["Recebido", "Em preparação", "Pronto para retirada", "Concluído"];

  if (
    unidade === undefined || itens.length === 0 ||
    typeof pedido.id !== "number" || typeof pedido.userId !== "number" || !Number.isInteger(pedido.userId) ||
    typeof pedido.total !== "number" || !Number.isFinite(pedido.total) ||
    typeof pedido.paymentMethod !== "string" ||
    typeof pedido.usedPoints !== "number" || !Number.isFinite(pedido.usedPoints) ||
    typeof pedido.pointsToEarn !== "number" || !Number.isFinite(pedido.pointsToEarn) ||
    !statusValidos.includes(pedido.status as Order["status"])
  ) {
    return null;
  }

  return {
    id: pedido.id,
    userId: pedido.userId,
    unit: unidade,
    items: itens,
    total: pedido.total,
    paymentMethod: pedido.paymentMethod,
    usedPoints: pedido.usedPoints,
    pointsToEarn: pedido.pointsToEarn,
    status: pedido.status as Order["status"]
  };
}

function carregarDados(): DadosSalvos | null {
  try {
    const conteudo = window.localStorage.getItem(CHAVE_DADOS);

    if (conteudo === null) {
      return null;
    }

    const salvo: unknown = JSON.parse(conteudo);

    if (salvo === null || typeof salvo !== "object") {
      return null;
    }

    const dados = salvo as Partial<DadosSalvos>;
    const usuariosSalvos = Array.isArray(dados.usuarios) ? dados.usuarios : [];
    const usuariosValidos = usuariosSalvos.filter((usuario): usuario is User => {
      return usuario !== null && typeof usuario === "object" &&
        Number.isInteger(usuario.id) && typeof usuario.name === "string" &&
        typeof usuario.email === "string" && typeof usuario.receivePromotions === "boolean" &&
        Number.isFinite(usuario.points);
    }).map((usuario) => ({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      acceptedTerms: true,
      receivePromotions: usuario.receivePromotions,
      points: Math.max(0, Math.floor(usuario.points))
    }));

    const usuariosRestaurados = usuariosValidos.length > 0 ? usuariosValidos : users;
    const unidade = units.find((item) => item.id === dados.unidadeSelecionadaId);
    const usuarioLogado = usuariosRestaurados.find((usuario) => usuario.id === dados.usuarioLogadoId);
    const carrinhoRestaurado = unidade === undefined ? [] : restaurarItens(dados.carrinho).filter((item) => {
      return unidade.availableProductIds.includes(item.product.id);
    });

    return {
      usuarios: usuariosRestaurados,
      usuarioLogadoId: usuarioLogado?.id ?? null,
      unidadeSelecionadaId: unidade?.id ?? null,
      carrinho: carrinhoRestaurado,
      pedidoAtual: restaurarPedido(dados.pedidoAtual)
    };
  }
  catch {
    return null;
  }
}

export default function UnitSelection() {
  const [dadosIniciais] = useState(carregarDados);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<Unit | null>(() => {
    return units.find((unidade) => unidade.id === dadosIniciais?.unidadeSelecionadaId) ?? null;
  });
  const [pesquisar, setPesquisar] = useState<string>("");
  const [carrinho, setCarrinho] = useState<CartItem[]>(dadosIniciais?.carrinho ?? []);
  const [tela, setTela] = useState<"login" | "menu" | "carrinho" | "finalizacao" | "pedido" | "perfil" | "operacao">("menu");
  const [telaAnterior, setTelaAnterior] = useState<"menu" | "carrinho" | "finalizacao">("menu");
  const [telaAntesPerfil, setTelaAntesPerfil] = useState<"menu" | "carrinho" | "finalizacao" | "pedido">("menu");
  const [usuarios, setUsuarios] = useState<User[]>(dadosIniciais?.usuarios ?? users);
  const [usuarioLogado, setUsuarioLogado] = useState<User | null>(() => {
    return (dadosIniciais?.usuarios ?? users).find((usuario) => usuario.id === dadosIniciais?.usuarioLogadoId) ?? null;
  });
  const [pedidoAtual, setPedidoAtual] = useState<Order | null>(dadosIniciais?.pedidoAtual ?? null);
  const [modoTotem, setModoTotem] = useState<boolean>(false);

  useEffect(() => {
    const dados: DadosSalvos = {
      usuarios,
      usuarioLogadoId: usuarioLogado?.id ?? null,
      unidadeSelecionadaId: unidadeSelecionada?.id ?? null,
      carrinho,
      pedidoAtual
    };

    try {
      window.localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
    }
    catch {
      // Se o navegador bloquear o armazenamento, a simulação continua em memória.
    }
  }, [usuarios, usuarioLogado, unidadeSelecionada, carrinho, pedidoAtual]);

  const unidadesFiltradas = units.filter((unidade) => {
    const pesquisaFormatada = pesquisar.trim().toLowerCase();
    return `${unidade.name} ${unidade.city}`.toLowerCase().includes(pesquisaFormatada);
  });

  const quantidadeCarrinho = carrinho.reduce((total, item) => total + item.quantity, 0);

  function adicionarItem(novoItem: CartItem) {
    setCarrinho(carrinhoAtual => [...carrinhoAtual, novoItem]);
  }

  function atualizarUsuario(usuarioAtualizado: User) {
    setUsuarios(usuariosAtuais => usuariosAtuais.map((usuario) => {
      if (usuario.id === usuarioAtualizado.id) {
        return usuarioAtualizado;
      }

      return usuario;
    }));

    setUsuarioLogado(usuarioAtualizado);
  }

  function salvarUsuario(usuarioAtualizado: User) {
    setUsuarios(usuariosAtuais => usuariosAtuais.map((usuario) => {
      if (usuario.id === usuarioAtualizado.id) {
        return usuarioAtualizado;
      }

      return usuario;
    }));

    if (usuarioLogado !== null && usuarioLogado.id === usuarioAtualizado.id) {
      setUsuarioLogado(usuarioAtualizado);
    }
  }

  function salvarPromocoes(receberPromocoes: boolean) {
    if (usuarioLogado === null) {
      return;
    }

    atualizarUsuario({ ...usuarioLogado, receivePromotions: receberPromocoes });
  }

  function selecionarUnidade(unidade: Unit) {
    setUnidadeSelecionada(unidade);
    setTela("menu");
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
    setTela("menu");
  }

  function abrirPerfil() {
    if (usuarioLogado === null) {
      return;
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
        window.alert("Já existe um pedido em andamento nesta demonstração. Conclua pelo painel da cozinha antes de fazer outro.");
      }

      return;
    }

    if (usuarioLogado === null) {
      setTelaAnterior("finalizacao");
      setTela("login");
      return;
    }

    setTela("finalizacao");
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
      atualizarUsuario({
        ...usuarioLogado,
        points: usuarioLogado.points - pontosUtilizados
      });
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
      setPedidoAtual({ ...pedidoAtual, status: "Em preparação" });
      return;
    }

    if (pedidoAtual.status === "Em preparação") {
      setPedidoAtual({ ...pedidoAtual, status: "Pronto para retirada" });
      return;
    }

    if (pedidoAtual.status === "Pronto para retirada") {
      const usuarioPedido = usuarios.find((usuario) => usuario.id === pedidoAtual.userId);

      if (usuarioPedido !== undefined) {
        salvarUsuario({
          ...usuarioPedido,
          points: usuarioPedido.points + pedidoAtual.pointsToEarn
        });
      }

      setPedidoAtual({ ...pedidoAtual, status: "Concluído" });
    }
  }

  function voltarInicio() {
    if (pedidoAtual?.status === "Concluído") {
      setPedidoAtual(null);
    }

    setUnidadeSelecionada(null);
    setTela("menu");
  }

  function reiniciarDemonstracao() {
    const confirmou = window.confirm("Reiniciar a demonstração? Seus pedidos, carrinho e pontos acumulados neste navegador serão apagados.");

    if (!confirmou) {
      return;
    }

    setUsuarios(users);
    setUsuarioLogado(null);
    setCarrinho([]);
    setPedidoAtual(null);
    setUnidadeSelecionada(null);
    setPesquisar("");
    setTelaAnterior("menu");
    setTela("menu");
    setModoTotem(false);
  }

  function iniciarTotem() {
    if (pedidoAtual !== null && pedidoAtual.status !== "Concluído") {
      window.alert("Conclua o pedido em andamento pelo painel da cozinha antes de iniciar outro atendimento.");
      return;
    }

    setUsuarioLogado(null);
    setTelaAnterior("menu");
    setTela("menu");
    setModoTotem(true);
  }

  const cabecalho = (
    <header className="brasaHeader">
      <div className="brasaHeaderPrincipal">
        <button className="brasaMarca" onClick={trocarUnidade} aria-label="BRASA 21 - voltar ao início">
          <img src="/images/logo-brasa21.png" alt="BRASA 21" />
        </button>

        <nav className="brasaNavegacao" aria-label="Navegação principal">
          {unidadeSelecionada !== null && (
            <button onClick={trocarUnidade}>Unidades</button>
          )}

          {unidadeSelecionada !== null && (
            <button onClick={() => setTela("menu")}>Cardápio</button>
          )}

          {unidadeSelecionada !== null && (
            <button onClick={() => setTela("carrinho")}>
              Carrinho <span className="brasaContador">{quantidadeCarrinho}</span>
            </button>
          )}
        </nav>

        <div className="brasaConta">
          {usuarioLogado === null ? (
            <button className="brasaBotaoEntrar" onClick={abrirLogin}>Entrar</button>
          ) : (
            <>
              <button onClick={abrirPerfil} className="brasaBotaoPerfil">
                Olá, {usuarioLogado.name.split(" ")[0]}
              </button>
              <button onClick={sair} className="brasaBotaoSair">Sair</button>
            </>
          )}
        </div>
      </div>

      {pedidoAtual !== null && pedidoAtual.status !== "Concluído" && usuarioLogado !== null && pedidoAtual.userId === usuarioLogado.id && (
        <button className="brasaAcompanhar" onClick={() => setTela("pedido")}>
          Acompanhar pedido #{pedidoAtual.id} · {pedidoAtual.status}
        </button>
      )}
    </header>
  );

  if (modoTotem) {
    return (
      <Totem
        usuarios={usuarios}
        salvarUsuario={salvarUsuario}
        registrarPedido={(novoPedido) => setPedidoAtual(novoPedido)}
        encerrarAtendimento={() => setModoTotem(false)}
      />
    );
  }

  if (tela === "operacao") {
    return (
      <Operations
        pedido={pedidoAtual}
        avancarStatus={avancarStatus}
        voltar={() => setTela("menu")}
      />
    );
  }

  if (tela === "login") {
    return (
      <div className="brasaPagina">
        {cabecalho}
        <Auth
          usuarios={usuarios}
          atualizarUsuarios={setUsuarios}
          entrar={entrar}
          continuarSemLogin={continuarSemLogin}
        />
      </div>
    );
  }

  if (tela === "perfil" && usuarioLogado !== null) {
    return (
      <div className="brasaPagina">
        {cabecalho}
        <Profile
          usuario={usuarioLogado}
          unit={unidadeSelecionada}
          salvarPromocoes={salvarPromocoes}
          voltar={() => setTela(telaAntesPerfil)}
        />
      </div>
    );
  }

  if (tela === "pedido" && pedidoAtual !== null && usuarioLogado !== null && pedidoAtual.userId === usuarioLogado.id) {
    return (
      <div className="brasaPagina">
        {cabecalho}
        <OrderTracking pedido={pedidoAtual} voltarInicio={voltarInicio} />
      </div>
    );
  }

  if (unidadeSelecionada !== null) {
    if (tela === "finalizacao" && usuarioLogado !== null) {
      return (
        <div className="brasaPagina">
          {cabecalho}
          <Checkout
            unit={unidadeSelecionada}
            usuario={usuarioLogado}
            carrinho={carrinho}
            confirmarPedido={confirmarPedido}
            voltarCarrinho={() => setTela("carrinho")}
          />
        </div>
      );
    }

    if (tela === "carrinho") {
      return (
        <div className="brasaPagina">
          {cabecalho}
          <Cart
            unit={unidadeSelecionada}
            carrinho={carrinho}
            atualizarCarrinho={setCarrinho}
            voltarMenu={() => setTela("menu")}
            finalizarPedido={finalizarCompra}
          />
        </div>
      );
    }

    return (
      <div className="brasaPagina">
        {cabecalho}
        <Menu
          unit={unidadeSelecionada}
          carrinho={carrinho}
          adicionarItem={adicionarItem}
          abrirCarrinho={() => setTela("carrinho")}
        />
      </div>
    );
  }

  return (
    <div className="brasaPagina brasaInicio">
      {cabecalho}

      <section className="brasaHero" aria-labelledby="brasaTitulo">
        <img
          src="/images/hero-brasa21.png"
          alt="Hambúrguer artesanal com queijo derretido, bacon e pão brioche"
          className="brasaHeroImagem"
        />

        <div className="brasaHeroConteudo">
          <span className="brasaEtiqueta">BURGER HOUSE · BRASA 21</span>
          <h1 id="brasaTitulo">A FOME PEDE <span>ATITUDE.</span></h1>
          <p>Burgers de respeito, combinações intensas e aquele sabor que fala por si.</p>
          <a href="#unidades" className="brasaBotaoPrincipal">FAZER MEU PEDIDO</a>
          <span className="brasaHeroAviso">Escolha uma unidade para começar</span>
        </div>
      </section>

      <section className="brasaBeneficios" aria-label="Como funciona">
        <div>
          <strong>01 / ESCOLHA</strong>
          <p>Encontre a unidade mais conveniente para você.</p>
        </div>
        <div>
          <strong>02 / PEÇA</strong>
          <p>Monte seu pedido no cardápio ou no totem.</p>
        </div>
        <div>
          <strong>03 / ACOMPANHE</strong>
          <p>Veja cada etapa do preparo até a retirada.</p>
        </div>
      </section>

      <section className="brasaUnidades" id="unidades" aria-labelledby="tituloUnidades">
        <div className="brasaSecaoTitulo">
          <div>
            <span className="brasaEtiqueta">ONDE TEM BRASA, TEM SABOR</span>
            <h2 id="tituloUnidades">ESCOLHA SUA UNIDADE</h2>
            <p>Selecione uma unidade para conferir o cardápio disponível e fazer seu pedido.</p>
          </div>
        </div>

        <label className="brasaCampoPesquisa">
          <span>Encontre uma unidade</span>
          <input
            type="search"
            placeholder="Buscar por unidade ou cidade"
            value={pesquisar}
            onChange={(event) => setPesquisar(event.target.value)}
          />
        </label>

        {unidadesFiltradas.length === 0 && (
          <p role="status">Nenhuma unidade encontrada.</p>
        )}

        <div className="unitGrid brasaUnitGrid">
          {unidadesFiltradas.map((unidade) => (
            <article key={unidade.id} className="unitCard brasaUnitCard">
              <span className="brasaUnidadeNumero">UNIDADE {String(unidade.id).padStart(2, "0")}</span>
              <h3>{unidade.name}</h3>
              <p>{unidade.city}</p>
              <p>{unidade.address}</p>
              <span className={`unitStatus ${unidade.isOpen ? "brasaAberta" : "brasaFechada"}`}>
                {unidade.isOpen ? "Disponível para pedidos" : "Indisponível"}
              </span>
              <button
                className="brasaBotaoSelecionar"
                onClick={() => selecionarUnidade(unidade)}
                disabled={!unidade.isOpen}
              >
                Ver cardápio <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="brasaDemonstracao" aria-labelledby="tituloDemo">
        <div>
          <span className="brasaEtiqueta">CONHEÇA A EXPERIÊNCIA COMPLETA</span>
          <h2 id="tituloDemo">DO PEDIDO À COZINHA.</h2>
          <p>Este é um projeto demonstrativo. Explore também as interfaces de autoatendimento e gerenciamento dos pedidos.</p>
        </div>

        <div className="brasaDemoBotoes">
          <button onClick={iniciarTotem}>Testar totem</button>
          <button onClick={() => setTela("operacao")}>Painel da cozinha</button>
          <button onClick={reiniciarDemonstracao}>Reiniciar demonstração</button>
        </div>
      </section>

      <footer className="brasaRodape">
        <span>BRASA 21 · BURGER HOUSE</span>
        <span>Projeto demonstrativo · Pedidos e pagamentos simulados</span>
      </footer>
    </div>
  );
}
