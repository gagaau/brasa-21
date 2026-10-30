import { useState } from "react";
import type { User } from "../types/User";

type AuthProps = {
  usuarios: User[];
  atualizarUsuarios: (usuarios: User[]) => void;
  entrar: (usuario: User) => void;
  continuarSemLogin: () => void;
};

export function Auth({usuarios, atualizarUsuarios, entrar, continuarSemLogin}: AuthProps) {

  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const [nome, setNome] = useState<string>("");
  const [emailCadastro, setEmailCadastro] = useState<string>("");
  const [senhaCadastro, setSenhaCadastro] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const [aceitouTermos, setAceitouTermos] = useState<boolean>(false);
  const [receberPromocoes, setReceberPromocoes] = useState<boolean>(false);

  const [erroLogin, setErroLogin] = useState<string>("");
  const [erroCadastro, setErroCadastro] = useState<string>("");

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

    setErroLogin("");
    entrar(usuarioEncontrado);
  }

  function fazerCadastro() {

    if (!nome.trim() || !emailCadastro.trim() || !senhaCadastro || !confirmarSenha) {
      setErroCadastro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senhaCadastro.length < 6) {
      setErroCadastro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (senhaCadastro !== confirmarSenha) {
      setErroCadastro("As senhas não são iguais.");
      return;
    }

    if (!aceitouTermos) {
      setErroCadastro("Você precisa aceitar os termos e a política de privacidade.");
      return;
    }

    const emailFormatado = emailCadastro.trim().toLowerCase();

    const emailExistente = usuarios.some((usuario) => {
      return usuario.email === emailFormatado;
    });

    if (emailExistente) {
      setErroCadastro("Este e-mail já está cadastrado.");
      return;
    }

    const maiorId = usuarios.reduce((acumulador, usuario) => {
      if (usuario.id > acumulador) {
        return usuario.id;
      }

      return acumulador;
    }, 0);

    const novoUsuario: User = {
      id: maiorId + 1,
      name: nome.trim(),
      email: emailFormatado,
      password: senhaCadastro,
      acceptedTerms: true,
      receivePromotions: receberPromocoes,
      points: 0
    };

    atualizarUsuarios([...usuarios, novoUsuario]);

    setErroCadastro("");
    entrar(novoUsuario);
  }

  return (
    <div className="paginaAuth">

      <h1>Raízes do Nordeste</h1>
      <p className="textoAuth">Entre na sua conta ou faça seu cadastro para realizar pedidos.</p>

      <div className="authLayout">

        <div className="authCard">

          <h2>Entrar</h2>

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
              <p className="avisoAuth" role="alert">{erroLogin}</p>
            )}

            <button type="submit">Entrar</button>

          </form>

          <button onClick={() => setErroLogin("A recuperação de senha não está disponível nesta simulação.")}>
            Esqueci minha senha
          </button>

          <p className="contaTeste">Conta de teste:</p>
          <p>maria@email.com / 123456</p>

        </div>

        <div className="authCard">

          <h2>Criar conta</h2>

          <form onSubmit={(event) => {
            event.preventDefault();
            fazerCadastro();
          }}>

            <p>Nome:</p>
            <input
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Seu nome"
            />

            <p>E-mail:</p>
            <input
              type="email"
              value={emailCadastro}
              onChange={(event) => setEmailCadastro(event.target.value)}
              placeholder="Seu e-mail"
            />

            <p>Senha:</p>
            <input
              type="password"
              value={senhaCadastro}
              onChange={(event) => setSenhaCadastro(event.target.value)}
              placeholder="Crie uma senha"
            />

            <p>Confirmar senha:</p>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              placeholder="Confirme sua senha"
            />

            <details>
              <summary>Termos e política de privacidade</summary>

              <p>
                Este projeto é uma simulação acadêmica.
                Os dados informados são utilizados apenas
                para demonstrar o funcionamento do cadastro,
                login e programa de fidelidade.
              </p>

              <p>
                Os dados permanecem apenas na memória da
                aplicação durante o uso e não são enviados
                para um servidor. Não utilize senhas reais.
              </p>

              <p>
                A opção de receber promoções é voluntária
                e pode ser alterada posteriormente no perfil.
                Nenhum e-mail promocional é realmente enviado.
              </p>
            </details>

            <label>
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(event) => setAceitouTermos(event.target.checked)}
              />
              Li e concordo com os termos e a política de privacidade.
            </label>

            <label>
              <input
                type="checkbox"
                checked={receberPromocoes}
                onChange={(event) => setReceberPromocoes(event.target.checked)}
              />
              Desejo receber promoções personalizadas por e-mail.
            </label>

            {erroCadastro !== "" && (
              <p className="avisoAuth" role="alert">{erroCadastro}</p>
            )}

            <button type="submit">Criar conta</button>

          </form>

        </div>

      </div>

      <div className="continuarVisitante">
        <p>Deseja apenas consultar o cardápio?</p>

        <button onClick={continuarSemLogin}>
          Continuar sem login
        </button>
      </div>

    </div>
  )
}
