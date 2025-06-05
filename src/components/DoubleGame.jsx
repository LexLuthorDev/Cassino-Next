"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import {
  ChevronUp,
  ChevronDown,
  History,
  Award,
  Home,
  Bitcoin,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom"; // ✅ correto para React Router DOM

// Função para exibir os confetes
const showConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  // Explosão de confetes
  confetti(
    Object.assign({}, defaults, {
      particleCount: count,
      spread: 70,
      startVelocity: 30,
      ticks: 200,
    })
  );

  // Confetes que caem de vários ângulos
  confetti(
    Object.assign({}, defaults, {
      particleCount: count,
      spread: 150,
      startVelocity: 20,
      angle: 60,
      ticks: 100,
    })
  );
  confetti(
    Object.assign({}, defaults, {
      particleCount: count,
      spread: 150,
      startVelocity: 20,
      angle: 120,
      ticks: 100,
    })
  );
};

// Notyf instance for notifications
const notyf = new Notyf({
  duration: 4000,
  position: { x: "center", y: "top" },
  types: [
    {
      type: "success",
      background: "#22c55e",
      icon: { className: "fas fa-check", tagName: "i", color: "#fff" },
    },
    {
      type: "error",
      background: "#ef4444",
      icon: { className: "fas fa-times", tagName: "i", color: "#fff" },
    },
  ],
});

export default function DoubleGame({ token_jogador }) {
  const entriesRef = useRef(null);
  const socketRef = useRef(null);
  const [valorAposta, setValorAposta] = useState(1);
  const [roleta, setRoleta] = useState([]);
  const [indexVencedor, setIndexVencedor] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [lastWinner, setLastWinner] = useState(null);
  const [valorGanho, setValorGanho] = useState(null);
  const [valorPerdido, setValorPerdido] = useState(null);
  const [saldoUsuario, setSaldoUsuario] = useState(100);
  const [isBettingDisabled, setIsBettingDisabled] = useState(false);

  const navigate = useNavigate();

  // Carregar os efeitos sonoros
  const winSound = useRef(new Audio("/sounds/sound-vitoria.mp3"));
  const loseSound = useRef(new Audio("/sounds/sound-derrota.mp3"));
  const rouletteSpinSound = useRef(new Audio("/sounds/sound-roleta.mp3")); // Som para a animação da roleta

  // Função para tocar o som
  const playSound = (soundRef) => {
    const sound = soundRef.current;
    if (sound) {
      sound.currentTime = 0; // Reseta o som para tocar desde o início
      sound.play().catch((err) => {
        console.error("Erro ao tentar reproduzir o som:", err);
      });
    }
  };

  useEffect(() => {
    // Create socket inside effect
    socketRef.current = io("https://162f-161-22-59-57.ngrok-free.app", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      socket.emit("double:start", { token_jogador });
      setIsLoading(false);
    });

    socket.on("double:erro", (err) => {
      console.error("❌ Error:", err?.mensagem);
      notyf.error(err?.mensagem || "An error occurred");
    });

    socket.on("double:roleta", ({ roleta }) => {
      console.log("🎲 Roulette received:", roleta);
      setRoleta(roleta);
      setIndexVencedor(null);
      setIsBettingDisabled(false); // ✅ Libera apostas somente após nova roleta
    });

    socket.on(
      "double:result",
      ({ ganhou, cor, payout, roleta, index, valorAposta, saldo_usuario }) => {
        console.log("📬 Result:", { ganhou, cor, payout, index, saldo_usuario });

        // Define os dados da roleta e o index vencedor para alinhar visualmente
        setRoleta(roleta);
        setIndexVencedor(index);

        // Aguarda a animação da roleta parar
        setTimeout(() => {
          // Atualiza o último vencedor e o histórico visual
          setLastWinner({ color: cor, index });

          setGameHistory((prev) => {
            const newHistory = [{ color: cor, index }, ...prev];
            return newHistory.slice(0, 13); // Mantém só os últimos 13
          });

          // Toca o som de resultado
          if (ganhou) {
            // Atualiza saldo adicionando o valor ganho
            setSaldoUsuario(parseFloat(saldo_usuario));
            setValorGanho(
              payout.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
              })
            );

            // Esconde após 3 segundos
            setTimeout(() => setValorGanho(null), 3000);
            showConfetti(); // Dispara o efeito de confetes
            playSound(winSound); // habilite se quiser som de vitória
          } else {
            // Atualiza saldo subtraindo o valor da aposta
            setSaldoUsuario(parseFloat(saldo_usuario));
            setValorPerdido(
              Number(valorAposta).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
              })
            );
            // Esconde após 3 segundos
            setTimeout(() => setValorPerdido(null), 3000);
            playSound(loseSound);
          }

          // Mostra notificação visual
          /*notyf.open({
          type: ganhou ? "success" : "error",
          message: ganhou
            ? `🎉 You won! R$ ${payout.toFixed(2)}`
            : `😢 You lost. Color: ${cor.toUpperCase()}`,
        });*/

          // Aguarda fim da notificação antes de reiniciar a próxima rodada
          setTimeout(() => {
            socket.emit("double:start", { token_jogador });
          }, 4000);
        }, 2500); // tempo da animação da roleta
      }
    );

    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
    };
  }, [token_jogador]);

  useEffect(() => {
    if (indexVencedor !== null) alignCenter(indexVencedor);
  }, [indexVencedor]);

  const alignCenter = (index) => {
    const wrapper = document.querySelector(".roulette-wrapper");
    const tile = entriesRef.current?.children[index];
    if (!tile || !wrapper) return;

    const tileCenter = tile.offsetLeft + tile.offsetWidth / 2;
    const wrapperCenter = wrapper.offsetWidth / 2;
    const displacement = tileCenter - wrapperCenter;

    const entries = entriesRef.current;

    // Reset before applying new animation
    entries.style.transition = "none";
    entries.style.transform = `translateX(0px)`; // back to start
    void entries.offsetWidth; // force reflow to restart animation

    // Apply transition normally
    entries.style.transition =
      "transform 2.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
    entries.style.transform = `translateX(-${displacement}px)`;
  };

  const placeBet = (color) => {
    // validar se o usuario tem saldo suficiente
    if (saldoUsuario < valorAposta) {
      return notyf.error("😔😔 Saldo insuficiente");
    }
    if (isBettingDisabled) return;
    if (!valorAposta || valorAposta <= 0) {
      return notyf.error("Please enter a valid amount");
    }

    setIsBettingDisabled(true); // 🔒 Desativa os botões

    console.log("📤 Sending bet:", { color, amount: valorAposta });

    // Tocar som quando a animação da roleta começar
    playSound(rouletteSpinSound); // Toca o som da roleta girando

    setTimeout(() => {
      socketRef.current.emit("double:bet", {
        cor: color,
        valor: Number.parseFloat(valorAposta),
      });
    }, 300);
  };

  const adjustBet = (amount) => {
    const newValue = Math.max(1, Number.parseFloat(valorAposta) + amount);
    setValorAposta(newValue);
  };

  const getColorClass = (color) => {
    switch (color) {
      case "red":
        return "bg-gradient-to-b from-red-500 to-red-700";
      case "green":
        return "bg-gradient-to-b from-green-500 to-green-700";
      case "black":
        return "bg-gradient-to-b from-gray-700 to-gray-900";
      default:
        return "bg-gray-800";
    }
  };

  const getColorName = (color) => {
    switch (color) {
      case "red":
        return "Red";
      case "green":
        return "Green";
      case "black":
        return "Black";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <div className="max-w-full  flex justify-center items-center ">
        <div className="flex flex-col md:flex-col gap-2  justify-center w-full">
          {/* Home navigation button */}
          <div className="max-w-full w-full mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Voltar para Home</span>
            </button>

            <span className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Bitcoin className="h-5 w-5" />
              <span>
                {saldoUsuario.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                })}
              </span>
            </span>
          </div>
          {/* Game section */}
          <div className="w-full md:w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gray-800 rounded-lg p-2 shadow-md  mt-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-200">
                    Ultimas 13 jogadas:
                  </span>
                </div>
              </div>

              {gameHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-6 bg-gray-750 rounded-lg border border-gray-700">
                  <span className="flex items-center justify-center">
                    <History className="h-4 w-4 mr-2 opacity-70" />
                    Nenhuma jogada ainda
                  </span>
                </div>
              ) : (
                <div className="w-full max-w-full overflow-x-auto">
                  <div
                    className="flex items-center gap-2 pr-1 custom-scrollbar"
                    style={{ minWidth: "max-content" }}
                  >
                    {gameHistory.map((result, i) => (
                      <div
                        key={i}
                        className={`flex-shrink-0 w-10 h-10 rounded-md ${getColorClass(
                          result.color
                        )} flex items-center justify-center text-xs font-bold text-white border border-gray-600 shadow-md`}
                        title={`${getColorName(result.color)} #${result.index}`}
                      >
                        {result.index}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Roulette display */}
            <div className="p-2">
              <div className="roulette-wrapper relative overflow-hidden w-full h-[100px] bg-gray-900 rounded-lg mb-4 p-0">
                {/* Pointer */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-stone-50 z-10 transform -translate-x-1/2"></div>

                {/* Roulette tiles */}
                <div
                  ref={entriesRef}
                  className="entries flex transition-transform absolute top-1/2 transform -translate-y-1/2"
                >
                  {roleta.map((color, i) => (
                    <div
                      key={i}
                      className={`tile-wrapper min-w-[80px] h-[80px] mx-1 rounded-lg flex items-center justify-center font-bold text-xl ${getColorClass(
                        color
                      )} shadow-lg border border-gray-600`}
                    >
                      <span className="number text-white border rounded-lg p-2">
                        {String(i).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                )}
              </div>

              {/* Betting controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      Valor da aposta
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => adjustBet(-1)}
                        className="bg-gray-700 hover:bg-gray-600 p-1 rounded all:unset"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => adjustBet(1)}
                        className="bg-gray-700 hover:bg-gray-600 p-1 rounded all:unset"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      value={valorAposta}
                      onChange={(e) => setValorAposta(e.target.value)}
                      placeholder="Bet amount"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      R$
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <button
                      onClick={() => setValorAposta(5)}
                      className="bg-gray-700 hover:bg-gray-600 py-1 rounded text-sm"
                    >
                      R$5
                    </button>
                    <button
                      onClick={() => setValorAposta(10)}
                      className="bg-gray-700 hover:bg-gray-600 py-1 rounded text-sm"
                    >
                      R$10
                    </button>
                    <button
                      onClick={() => setValorAposta(50)}
                      className="bg-gray-700 hover:bg-gray-600 py-1 rounded text-sm"
                    >
                      R$50
                    </button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-3">
                  <button
                    onClick={() => placeBet("red")}
                    disabled={isBettingDisabled}
                    className={`bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-lg p-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                      isBettingDisabled
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
                    }`}
                  >
                    <span className="text-2xl font-bold">2x</span>
                    <span className="text-sm mt-1">Vermelho</span>
                  </button>

                  <button
                    onClick={() => placeBet("green")}
                    disabled={isBettingDisabled}
                    className={`bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-lg p-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                      isBettingDisabled
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
                    }`}
                  >
                    <span className="text-2xl font-bold">14x</span>
                    <span className="text-sm mt-1">Verde</span>
                  </button>

                  <button
                    onClick={() => placeBet("black")}
                    disabled={isBettingDisabled}
                    className={`bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 rounded-lg p-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                      isBettingDisabled
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : ""
                    }`}
                  >
                    <span className="text-2xl font-bold">2x</span>
                    <span className="text-sm mt-1">Preto</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {valorGanho && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="animate-bounce bg-green-600 text-white px-6 py-3 rounded-md text-2xl font-bold shadow-lg border border-white w-full">
            🎉 {valorGanho}
          </div>
        </div>
      )}
      {valorPerdido && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="animate-bounce bg-red-600 text-white px-6 py-3 rounded-md text-2xl font-bold shadow-lg border border-white w-full">
            😔 {valorPerdido}
          </div>
        </div>
      )}
    </>
  );
}
