import { useSiteData } from '../context/SiteDataContext';

export default function Hero() {
  const { hero, padukuhan } = useSiteData();

  return (
    <section
      id="beranda"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <img
        src={hero.backgroundImage || '/images/Profildesa.jpeg'}
        alt={hero.title}
        className="absolute inset-0 w-full h-full object-cover object-[center_80%]"
      />

      {/* Green gradient overlay — blends with the image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(150deg, rgba(2,132,199,0.92) 0%, rgba(14,165,233,0.85) 35%, rgba(3,105,161,0.78) 65%, rgba(2,132,199,0.88) 100%)',
        }}
      />

      {/* Extra radial glow for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 80%, rgba(14,165,233,0.3) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-24">
        {/* Accent line */}
        <div className="w-10 h-[2px] bg-leaf-400/50 mx-auto mb-8" />

        {/* Location */}
        <p className="text-white/30 text-[11px] font-medium uppercase tracking-[0.25em] mb-7 drop-shadow-sm">
          {padukuhan.desa} · {padukuhan.kecamatan} · {padukuhan.kabupaten}
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-snug mb-5 drop-shadow-md">
          {hero.title}
        </h1>

        <p className="text-white/70 text-[15px] max-w-lg mx-auto mb-10 leading-relaxed font-medium drop-shadow-sm">
          {hero.subtitle}
        </p>

        {/* CTA — bordered, fills on hover */}
        <a
          href="#umkm"
          className="inline-flex items-center gap-2.5 px-7 py-3 border border-white/25 text-white text-sm font-semibold rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 drop-shadow-sm"
        >
          {hero.ctaText}
          <span className="opacity-60 ml-2">→</span>
        </a>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-100 to-transparent pointer-events-none" />
    </section>
  );
}
