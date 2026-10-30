import { useState } from "react";
import type { User } from "../types/User";
import type { Unit } from "../types/Unit";

type ProfileProps = {
  usuario: User;
  unit: Unit | null;
  salvarPromocoes: (receberPromocoes: boolean) => void;
  voltar: () => void;
};

export function Profile({ usuario, unit, salvarPromocoes, voltar }: ProfileProps) {
  const [receberPromocoes, setReceberPromocoes] = useState<boolean>(usuario.receivePromotions);
  const [mensagem, setMensagem] = useState<string>("");

  const pontosParaDesconto = 100;
  const desconto = 5;
  const podeResgatar = usuario.points >= pontosParaDesconto;
  const pontosRestantes = Math.max(0, pontosParaDesconto - usuario.points);
  const progresso = Math.min(100, (usuario.points / pontosParaDesconto) * 100);
  const inicial = usuario.name.trim().charAt(0).toUpperCase() || "B";

  function salvarPreferencias() {
    salvarPromocoes(receberPromocoes);
    setMensagem("Preferência atualizada nesta demonstração.");
  }

  return (
    <main className="paginaPerfil brasaPerfil">
      <div className="paginaHeading brasaPerfilCabecalho">
        <span className="brasaEtiqueta">BRASA 21 · SUA CONTA</span>
        <h1>SEU ESPAÇO NA BRASA.</h1>
        <p>Confira seus dados, acompanhe seus pontos e escolha suas preferências.</p>
      </div>

      <section className="brasaPerfilDestaque" aria-label="Resumo da conta">
        <div className="brasaPerfilIdentidade">
          <span className="brasaPerfilAvatar" aria-hidden="true">{inicial}</span>
          <div>
            <span className="brasaPerfilRotulo">BEM-VINDO DE VOLTA</span>
            <h2>{usuario.name}</h2>
            <p>Perfil demonstrativo · Dados salvos neste navegador</p>
          </div>
        </div>
        <span className="brasaPerfilMarca">BRASA<span>21</span></span>
      </section>

      <div className="perfilLayout brasaPerfilLayout">
        <div className="perfilColuna">
          <section className="perfilCard brasaPerfilCard">
            <span className="brasaPerfilRotulo">SUA CONTA</span>
            <h2>DADOS DO PERFIL</h2>

            <div className="brasaPerfilDado">
              <span>Nome</span>
              <strong>{usuario.name}</strong>
            </div>
            <div className="brasaPerfilDado">
              <span>Tipo de conta</span>
              <strong>Perfil de demonstração</strong>
            </div>
            <div className="brasaPerfilDado">
              <span>Unidade selecionada</span>
              <strong>{unit !== null ? `${unit.name} · ${unit.city}` : "Nenhuma unidade selecionada"}</strong>
            </div>
          </section>

          <section className="perfilCard brasaPerfilCard">
            <span className="brasaPerfilRotulo">COMO FUNCIONA</span>
            <h2>FIDELIDADE SEM COMPLICAÇÃO.</h2>

            <div className="brasaPerfilRegras">
              <div>
                <span className="brasaPerfilRegraNumero">01</span>
                <p>Faça seu pedido e ganhe <strong>1 ponto a cada R$ 1 pago</strong>, considerando apenas valores inteiros.</p>
              </div>
              <div>
                <span className="brasaPerfilRegraNumero">02</span>
                <p>Seus pontos são creditados quando o pedido recebe o status <strong>Concluído</strong>.</p>
              </div>
              <div>
                <span className="brasaPerfilRegraNumero">03</span>
                <p>Use <strong>100 pontos por R$ 5 de desconto</strong> ao finalizar uma nova compra.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="perfilColuna">
          <section className="perfilCard brasaPerfilCard brasaPerfilFidelidade">
            <div className="brasaPerfilSaldoTopo">
              <div>
                <span className="brasaPerfilRotulo">CLUBE BRASA 21</span>
                <h2>SEUS PONTOS</h2>
              </div>
              <span className="brasaPerfilSelo">B21</span>
            </div>

            <div className="brasaPerfilSaldo">
              <strong className="saldoPontos">{usuario.points}</strong>
              <span>pontos disponíveis</span>
            </div>

            <div className="brasaPerfilProgressoTopo">
              <span>Próximo desconto de R$ {desconto},00</span>
              <strong>{Math.min(usuario.points, pontosParaDesconto)} / {pontosParaDesconto}</strong>
            </div>
            <div
              className="brasaPerfilBarra"
              role="progressbar"
              aria-label="Progresso para desconto de fidelidade"
              aria-valuenow={Math.min(usuario.points, pontosParaDesconto)}
              aria-valuemin={0}
              aria-valuemax={pontosParaDesconto}
            >
              <div style={{ width: `${progresso}%` }} />
            </div>

            <p className="brasaPerfilProgressoMensagem">
              {podeResgatar
                ? "Você já tem pontos suficientes para aproveitar o desconto!"
                : `Faltam ${pontosRestantes} ${pontosRestantes === 1 ? "ponto" : "pontos"} para liberar o desconto.`}
            </p>
          </section>

          <section className="perfilCard brasaPerfilCard brasaPerfilRecompensa">
            <span className="brasaPerfilRotulo">RECOMPENSA DISPONÍVEL</span>
            <div className="brasaPerfilRecompensaTopo">
              <div>
                <h2>R$ 5,00 OFF</h2>
                <p>Troque 100 pontos por desconto no checkout.</p>
              </div>
              <span className={podeResgatar ? "brasaPerfilDisponivel" : "brasaPerfilPendente"}>
                {podeResgatar ? "Liberado" : "Em progresso"}
              </span>
            </div>
            <p className="brasaPerfilRecompensaAviso">
              {podeResgatar
                ? "Para utilizar, selecione a opção de fidelidade ao finalizar seu próximo pedido."
                : "Continue fazendo pedidos para acumular pontos e liberar esta recompensa."}
            </p>
          </section>

          <section className="perfilCard brasaPerfilCard">
            <span className="brasaPerfilRotulo">SUAS ESCOLHAS</span>
            <h2>PREFERÊNCIAS</h2>

            <label className="preferenciaPromocoes brasaPerfilPreferencias">
              <input
                type="checkbox"
                checked={receberPromocoes}
                onChange={(event) => {
                  setReceberPromocoes(event.target.checked);
                  setMensagem("");
                }}
              />
              <span>
                <strong>Quero receber novidades e promoções</strong>
                <small>Você pode mudar essa preferência quando quiser.</small>
              </span>
            </label>

            <p className="brasaPerfilAvisoDemo">Preferência demonstrativa. Nenhum e-mail é enviado por este projeto.</p>

            {mensagem !== "" && (
              <p className="brasaPerfilMensagem" role="status">{mensagem}</p>
            )}

            <button type="button" className="brasaPerfilSalvar" onClick={salvarPreferencias}>
              Salvar preferências
            </button>
          </section>
        </div>
      </div>

      <div className="brasaPerfilRodape">
        <button type="button" onClick={voltar}>← Voltar</button>
        <p>BRASA 21 · Experiência demonstrativa</p>
      </div>
    </main>
  );
}
