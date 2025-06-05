"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Icons components to avoid dependencies
const DiamondIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 2H8l-4 6 8 14 8-14-4-6z"></path>
    <path d="M12 12v-6"></path>
    <path d="M8 8h8"></path>
  </svg>
);

const BombIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="13" r="8"></circle>
    <path d="m16.2 7.8-2.3-2.3"></path>
    <path d="M21 5 19 3"></path>
    <path d="m11 1 1 3"></path>
    <path d="m7 5-3 1"></path>
  </svg>
);

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
        type === "error" ? "bg-red-600" : "bg-green-600"
      } text-white`}
    >
      <p>{message}</p>
    </div>
  );
};

// Main Mines Game Component
const MinesGame = ({ token_jogador }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [valorAposta, setValorAposta] = useState(1);
  const [bombas, setBombas] = useState(3);
  const [toast, setToast] = useState(null);
  const [gameState, setGameState] = useState({
    grid: [],
    revelados: [],
    multiplicador: "1.00",
    jogando: false,
  });

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Clear toast notification
  const clearToast = () => {
    setToast(null);
  };

  useEffect(() => {
    // Create socket inside effect
    socketRef.current = io("https://162f-161-22-59-57.ngrok-free.app", {
      transports: ["websocket"],
      auth: {
        token: token_jogador, // Certifique-se de passar o mesmo token usado na outra página
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    const socketInstance = socketRef.current;

    console.log("🔌 Connecting to server...", socketInstance);

    socketInstance.on("connect", () => {
      console.log("✅ Connected to server:");
      setConnected(true);
      showToast("Conectado ao servidor de jogos");
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
      setGameStarted(false);
      showToast("Você foi desconectado do servidor", "error");
    });

    socketInstance.on("mines:grid", (grid) => {
      setGameState((prev) => ({ ...prev, grid }));
    });

    socketInstance.on("mines:continuar", (data) => {
      setGameState((prev) => ({
        ...prev,
        bombas: data.bombas,
        revelados: data.revelados,
        multiplicador: data.multiplicador,
        jogando: true,
      }));
      setGameStarted(true);
    });

    socketInstance.on("mines:novoJogo", (data) => {
      setGameState((prev) => ({
        ...prev,
        bombas: data.bombas,
        revelados: data.revelados,
        multiplicador: data.multiplicador,
        jogando: true,
      }));
    });

    socketInstance.on("mines:acertou", (data) => {
      setGameState((prev) => ({
        ...prev,
        revelados: [...prev.revelados, data.posicao],
        multiplicador: data.multiplicador,
      }));
    });

    socketInstance.on("mines:perdeu", (data) => {
      showToast("Você encontrou uma bomba!", "error");
      setGameState((prev) => ({
        ...prev,
        revelados: [...prev.revelados, data.posicao],
        jogando: false,
      }));
    });

    socketInstance.on("mines:sacado", (data) => {
      showToast(`Você ganhou ${data.payout}!`);
      setGameState((prev) => ({
        ...prev,
        jogando: false,
      }));
    });

    socketInstance.on("mines:saldos", (data) => {
      setSaldo(data.saldo_usuario);
    });

    socketInstance.on("mines:erro", (data) => {
      showToast(data.mensagem, "error");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const iniciarJogo = () => {
    if (!connected) return;
    socket.emit("mines:start");
    setGameStarted(true);
  };

  const fazerAposta = () => {
    if (!connected || !gameStarted) return;
    socket.emit("mines:apostar", {
      valor: valorAposta,
      bombas,
    });
  };

  const revelarPosicao = (posicao) => {
    if (!connected || !gameStarted || !gameState.jogando) return;
    socket.emit("mines:revelar", { posicao });
  };

  const fazerCashout = () => {
    if (!connected || !gameStarted || !gameState.jogando) return;
    socket.emit("mines:cashout", {});
  };

  // Grid component
  const Grid = () => {
    const [grid, setGrid] = useState(Array(25).fill(null));

    useEffect(() => {
      // Update grid with revealed positions
      const newGrid = Array(25).fill(null);
      gameState.revelados.forEach((pos) => {
        // If position is revealed and game is over, it's a bomb
        // Otherwise, it's a gem
        newGrid[pos] = gameState.jogando ? "gem" : "bomb";
      });
      setGrid(newGrid);
    }, [gameState.revelados, gameState.jogando]);

    return (
      <div className="grid grid-cols-5 gap-2 mt-4">
        {grid.map((item, index) => (
          <button
            key={index}
            onClick={() => revelarPosicao(index)}
            disabled={!gameState.jogando || gameState.revelados.includes(index)}
            className={`
              aspect-square flex items-center justify-center rounded-md transition-all
              ${
                item === null
                  ? "bg-gray-700 hover:bg-gray-600 cursor-pointer"
                  : item === "gem"
                  ? "bg-emerald-600"
                  : "bg-red-600"
              }
              ${
                !gameState.jogando && item === null
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }
            `}
            style={{
              width: "100%",
              height: 0,
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item === "gem" && <DiamondIcon />}
              {item === "bomb" && <BombIcon />}
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}

      <div className="w-full max-w-md bg-gray-800 text-white border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-center text-2xl font-bold">Mines Game</h1>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Saldo</p>
              <p className="text-xl font-bold">{saldo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Multiplicador</p>
              <p className="text-xl font-bold">{gameState.multiplicador}x</p>
            </div>
          </div>

          {!gameStarted ? (
            <button
              onClick={iniciarJogo}
              className="w-full py-2 px-4 mb-4 bg-emerald-600 hover:bg-emerald-700 rounded-md font-medium disabled:opacity-50"
              disabled={!connected}
            >
              Iniciar Jogo
            </button>
          ) : !gameState.jogando ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="valorAposta"
                  className="block text-sm font-medium"
                >
                  Valor da Aposta
                </label>
                <input
                  id="valorAposta"
                  type="number"
                  min="1"
                  step="0.1"
                  value={valorAposta}
                  onChange={(e) =>
                    setValorAposta(Number.parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="bombas" className="block text-sm font-medium">
                    Bombas: {bombas}
                  </label>
                  <span className="text-sm text-gray-400">
                    Min: 1 | Max: 24
                  </span>
                </div>
                <input
                  id="bombas"
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={bombas}
                  onChange={(e) => setBombas(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={fazerAposta}
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-md font-medium disabled:opacity-50"
                disabled={!connected}
              >
                Apostar
              </button>
            </div>
          ) : (
            <button
              onClick={fazerCashout}
              className="w-full py-2 px-4 mb-4 bg-amber-600 hover:bg-amber-700 rounded-md font-medium disabled:opacity-50"
              disabled={!connected}
            >
              Sacar ({gameState.multiplicador}x)
            </button>
          )}

          {gameStarted && <Grid />}
        </div>
      </div>
    </div>
  );
};

export default MinesGame;
