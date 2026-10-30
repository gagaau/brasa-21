import { useState } from "react";
import type { User } from "../types/User";
import type { Unit } from "../types/Unit";

type ProfileProps = {
  usuario: User;
  unit: Unit | null;
  salvarPromocoes: (receberPromocoes: boolean) => void;
  voltar: () => void;
};

export function Profile({usuario, unit, salvarPromocoes, voltar}: ProfileProps) {

  const [receberPromocoes, setReceberPromocoes] = useState<boolean>(usuario.receivePromotions);
  const [mensagem, setMensagem] = useState<string>("");
  const sucoDisponivel = unit !== null && unit.availableProductIds.includes(3);
  const comboDisponivel = unit !== null && unit.availableProductIds.includes(2);

  function salvarPreferencias() {
    salvarPromocoes(receberPromocoes);
    setMensagem("Preferências atualizadas com sucesso.");
  }

  
  return (
    <div className="paginaPerfil">

      <div className="paginaHeading">
        <h1>Meu perfil</h1>
        <p>Consulte seus pontos e preferências.</p>
      </div>

      <div className="perfilLayout">

        <div className="perfilColuna">

          <div className="perfilCard">

            <h2>Dados do usuário</h2>

            <p>Nome: {usuario.name}</p>
            <p>E-mail: {usuario.email}</p>

          </div>

          <div className="perfilCard">

            <h2>Programa de fidelidade</h2>

            <p>Saldo atual:</p>

            <h2 className="saldoPontos">{usuario.points} pontos</h2>

          </div>

        </div>

        <div className="perfilColuna">

          <div className="perfilCard">

            <h2>Recompensas</h2>

            <div className="recompensa">

              <h3>R$ 5,00 de desconto</h3>
              <p>100 pontos</p>

              {usuario.points >= 100 ? (
                <p>Disponível para utilizar na finalização do pedido.</p>
              ) : (
                <p>Pontos insuficientes.</p>
              )}

            </div>

            <div className="recompensa">

              <h3>Suco de Umbu grátis</h3>
              <p>200 pontos</p>

              
              {usuario.points < 200 ? (
                <p>Pontos insuficientes.</p>
              ) : (
                <>
                  {unit === null ? (
                    <p>Selecione uma unidade para consultar a disponibilidade.</p>
                  ) : (
                    <p>{sucoDisponivel ? "Disponível na unidade selecionada." : "Indisponível na unidade selecionada."}</p>
                  )}
                </>
              )}


              <p>Resgate demonstrativo, ainda não habilitado.</p>

            </div>

            <div className="recompensa">

              <h3>Combo com desconto</h3>
              <p>300 pontos</p>

              
              {usuario.points < 300 ? (
                <p>Pontos insuficientes.</p>
              ) : (
                <>
                  {unit === null ? (
                    <p>Selecione uma unidade para consultar a disponibilidade.</p>
                  ) : (
                    <p>{comboDisponivel ? "Disponível na unidade selecionada." : "Indisponível na unidade selecionada."}</p>
                  )}
                </>
              )}


              <p>Resgate demonstrativo, ainda não habilitado.</p>

            </div>

          </div>

          <div className="perfilCard">

            <h2>Preferências de comunicação</h2>

            <label className="preferenciaPromocoes">
              <input
                type="checkbox"
                checked={receberPromocoes}
                onChange={(event) => {
                  setReceberPromocoes(event.target.checked);
                  setMensagem("");
                }}
              />
              Desejo receber promoções personalizadas por e-mail.
            </label>

            <p>Você pode alterar esta preferência quando quiser.</p>

            {mensagem !== "" && (
              <p>{mensagem}</p>
            )}

            <button onClick={salvarPreferencias}>
              Salvar preferências
            </button>

          </div>

        </div>

      </div>

      <button onClick={voltar}>Voltar</button>

    </div>
  )
}
