
export default function BannerSection() {
    return (
    <section className="relative h-[180px] sm:h-[250px] md:h-[400px] overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-zinc-900/70"></div>
      <img
        src="/assets/banner_principal_1.png"
        //src="https://winrico.site/public/uploads/39211032025085851.png"
        alt="Banner do Cassino"
        className="absolute inset-0 w-full h-full "
        loading="eager"
      />
    </section>
  );
}