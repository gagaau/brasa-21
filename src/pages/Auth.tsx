import { useState } from "react";
import type { User } from "../types/User";

type AuthProps = {
  usuarios: User[];
  atualizarUsuarios: (usuarios: User[]) => void;
  entrar: (usuario: User) => void;
  continuarSemLogin: () => void;
};

export function Auth({usuarios, atualizarUsuarios, entrar, continuarSemLogin}: AuthProps) {
  const [nome, setNome] = useState<string>("");
  const [aceitouAviso, setAceitouAviso] = useState<boolean>(false);
  const [receberPromocoes, setReceberPromocoes] = useState<boolean>(false);
  const [erroLogin, setErroLogin] = useState<string>("");
  const [erroCadastro, setErroCadastro] = useState<string>("");

  const contaDemonstracao = usuarios.find((usuario) => usuario.id === 1) ?? usuarios[0];

  function entrarComContaDemonstracao() {
    if (contaDemonstracao === undefined) {
      setErroLogin("A conta de demonstração não está disponível.");
      return;
    }

    setErroLogin("");
    entrar(contaDemonstracao);
  }

  function criarPerfilDemonstrativo() {
    if (nome.trim().length < 2) {
      setErroCadastro("Informe um nome de exibição com pelo menos 2 caracteres.");
      return;
    }

    if (!aceitouAviso) {
      setErroCadastro("Confirme que entendeu como funciona o perfil demonstrativo.");
      return;
    }

    const maiorId = usuarios.reduce((acumulador, usuario) => {
      return usuario.id > acumulador ? usuario.id : acumulador;
    }, 0);

    const novoId = maiorId + 1;

    const novoUsuario: User = {
      id: novoId,
      name: nome.trim(),
      email: `cliente-${novoId}@demo.brasa21.invalid`,
      acceptedTerms: true,
      receivePromotions: receberPromocoes,
      points: 0
    };

    atualizarUsuarios([...usuarios, novoUsuario]);
    setErroCadastro("");
    entrar(novoUsuario);
  }

  return (
    <main className="paginaAuth brasaAuth">
      <section className="brasaAuthApresentacao" aria-labelledby="tituloAuth">
        <img
          src="/images/hero-brasa21.png"
          alt=""
          className="brasaAuthImagem"
          aria-hidden="true"
        />

        <div className="brasaAuthApresentacaoConteudo">
          <span className="brasaAuthEtiqueta">BRASA 21 · BURGER HOUSE</span>
          <h1 id="tituloAuth">SUA FOME.<br /><span>SEU PEDIDO.</span></h1>
          <p>
            Monte seu pedido, acompanhe o preparo e descubra as vantagens
            do nosso programa de fidelidade.
          </p>

          <div className="brasaAuthDestaques">
            <span>Pedidos para retirada</span>
            <span>Pontos a cada compra</span>
            <span>Experiência demonstrativa</span>
          </div>
        </div>
      </section>

      <section className="brasaAuthConteudo" aria-labelledby="subtituloAuth">
        <div className="brasaAuthTopo">
          <span className="brasaAuthEtiqueta">BEM-VINDO AO BRASA 21</span>
          <h2 id="subtituloAuth">Escolha como experimentar</h2>
          <p>
            Este é um projeto de demonstração. Não é necessário criar uma conta
            real nem informar senha ou dados pessoais.
          </p>
        </div>

        <div className="authCard brasaAuthCard">
          <div className="brasaAuthCardCabecalho">
            <span className="brasaAuthNumero">01 / ACESSO RÁPIDO</span>
            <span className="brasaAuthSelo">RECOMENDADO</span>
          </div>

          <h3>Entrar com conta de teste</h3>
          <p>
            Explore o cardápio, finalize pedidos e teste o desconto de fidelidade
            com um perfil que já possui pontos.
          </p>

          {contaDemonstracao !== undefined && (
            <div className="brasaAuthContaTeste">
              <div className="brasaAuthAvatar" aria-hidden="true">
                {contaDemonstracao.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{contaDemonstracao.name}</strong>
                <span>{contaDemonstracao.points} pontos disponíveis</span>
              </div>
            </div>
          )}

          {erroLogin !== "" && (
            <p className="brasaAuthErro" role="alert">{erroLogin}</p>
          )}

          <button
            type="button"
            className="brasaAuthBotao"
            onClick={entrarComContaDemonstracao}
          >
            Entrar na demonstração
          </button>
        </div>

        <div className="brasaAuthSeparador"><span>OU</span></div>

        <div className="authCard brasaAuthCard">
          <span className="brasaAuthNumero">02 / NOVO PERFIL</span>
          <h3>Criar perfil de teste</h3>
          <p>
            Prefere começar do zero? Escolha um apelido e receba um perfil
            demonstrativo com zero pontos.
          </p>

          <form onSubmit={(event) => {
            event.preventDefault();
            criarPerfilDemonstrativo();
          }}>
            <label className="brasaAuthLabel" htmlFor="nomeDemonstrativo">
              Nome de exibição
            </label>
            <input
              id="nomeDemonstrativo"
              type="text"
              value={nome}
              onChange={(event) => {
                setNome(event.target.value);
                setErroCadastro("");
              }}
              placeholder="Ex.: Cliente Brasa"
              maxLength={40}
              autoComplete="off"
              required
            />

            <label className="brasaAuthCheckbox">
              <input
                type="checkbox"
                checked={receberPromocoes}
                onChange={(event) => setReceberPromocoes(event.target.checked)}
              />
              <span>Ativar preferência de promoções (apenas simulação).</span>
            </label>

            <label className="brasaAuthCheckbox">
              <input
                type="checkbox"
                checked={aceitouAviso}
                onChange={(event) => {
                  setAceitouAviso(event.target.checked);
                  setErroCadastro("");
                }}
              />
              <span>Entendi que o perfil é demonstrativo e não devo informar dados reais.</span>
            </label>

            {erroCadastro !== "" && (
              <p className="brasaAuthErro" role="alert">{erroCadastro}</p>
            )}

            <button type="submit" className="brasaAuthBotao brasaAuthBotaoSecundario">
              Criar meu perfil de teste
            </button>
          </form>
        </div>

        <div className="continuarVisitante brasaAuthRodape">
          <p>Quer apenas conhecer os produtos?</p>
          <button type="button" onClick={continuarSemLogin}>
            Voltar ao cardápio sem entrar
          </button>
        </div>

        <p className="brasaAuthNota">
          Os dados demonstrativos ficam salvos apenas neste navegador, inclusive
          depois de atualizar a página. Não informe dados reais. Nenhum pagamento é processado.
        </p>
      </section>
    </main>
  );
}
