"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { launchGame } from "@/api/igamewin";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useConfigCassino } from "@/context/ConfigCassinoContext";

export default function JogarPage() {
  const params = useParams(); // { provider, game }
  const search = useSearchParams();
  const router = useRouter();
  const { configCassino } = useConfigCassino();

  const provider = decodeURIComponent(params.provider);
  const game = decodeURIComponent(params.game);
  const lang = search.get("lang") || "pt-br";

  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // Pega a cor primária do tema para personalizar o botão
  const tema = configCassino?.tema;
  const corPrimaria = tema?.cor_primaria || "#1DC950";

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const { data } = await launchGame({
          provider_code: provider,
          game_code: game === "lobby" ? "" : game,
          lang,
        });

        if (!alive) return;
        if (data?.ok && data?.launch_url) {
          setUrl(data.launch_url);
        } else {
          setErr(data?.error || "Não foi possível obter a URL do jogo.");
        }
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.error || e?.message || "Erro ao lançar jogo");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [provider, game, lang]);

  // ================== Loading ==================
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-300">Carregando jogo…</div>
      </div>
    );
  }

  // ================== Erro ==================
  if (err) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-red-400 text-center">{err}</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            Voltar
          </Button>
          <Button
            onClick={() => router.refresh()}
            style={{ backgroundColor: corPrimaria }}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // ================== Botão de Voltar Home ==================
  const BotaoVoltarHome = () => (
    <button
      onClick={() => router.push("/")}
      className="fixed top-5 left-5 flex items-center gap-2 font-semibold px-5 py-2 rounded-full shadow-lg shadow-black/40 
                 hover:scale-105 transition-all duration-300 ease-in-out z-50"
      style={{
        background: `linear-gradient(90deg, ${corPrimaria}, ${tema?.cor_secundaria || "#14532D"})`,
        color: tema?.cor_texto_primaria || "#fff",
      }}
    >
      <Home size={18} />
      <span>Voltar</span>
    </button>
  );

  // ================== Render ==================
  return (
    <div className="min-h-screen bg-black relative">
      {/* Botão flutuante */}
      <BotaoVoltarHome />

      {/* Jogo */}
      {url ? (
        <iframe
          src={url}
          title="Game"
          className="w-full h-screen border-0"
          allow="autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media; payment"
          allowFullScreen
          sandbox="allow-forms allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-popups-to-escape-sandbox"
        />
      ) : (
        <div className="h-screen flex items-center justify-center text-zinc-300">
          URL não disponível.
        </div>
      )}
    </div>
  );
}
