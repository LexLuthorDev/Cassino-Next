import { useConfigCassino } from "@/context/ConfigCassinoContext";
export default function BannerSection() {
  const { configCassino, loadingConfigCassino } = useConfigCassino();

  const cassino = configCassino?.cassino;
  const bannerCassino = cassino?.ImagensCassinos?.find(img => img.tipo === 1);

  const urlBannerCassino = bannerCassino ? bannerCassino.url : "";

  // Se ainda estiver carregando ou não veio nada, retorna null
  if (loadingConfigCassino || !configCassino) return null;
    return (
    <section className="relative h-[180px] sm:h-[250px] md:h-[400px] overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-zinc-900/70"></div>
      <img
        //src="/assets/banner_principal_1.png"
        src={urlBannerCassino}
        alt="Banner do Cassino"
        className="absolute inset-0 w-full h-full "
        loading="eager"
      />
    </section>
  );
}