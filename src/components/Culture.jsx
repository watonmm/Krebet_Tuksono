import { useSiteData } from '../context/SiteDataContext';

const CultureSkeleton = () => (
  <div className="animate-pulse rounded-3xl border border-warm-200 bg-white p-6 space-y-4">
    <div className="h-44 rounded-2xl bg-warm-100" />
    <div className="h-5 w-3/4 rounded bg-warm-200" />
    <div className="h-4 w-full rounded bg-warm-200" />
    <div className="h-10 w-1/2 rounded bg-warm-200" />
  </div>
);

export default function Culture() {
  const { culture, loading } = useSiteData();

  return (
    <section id="kebudayaan" className="py-16 md:py-24 bg-warm-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900 mb-2">
            Kebudayaan & Kesenian Krebet
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Pelajari kegiatan budaya dan kesenian khas Krebet yang terus dilestarikan oleh warga.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <CultureSkeleton key={index} />
              ))
            : culture && culture.length > 0
            ? culture.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-warm-200 bg-white overflow-hidden shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-44 bg-warm-100 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Gambar belum tersedia
                      </div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-700">
                        {item.type || 'Kebudayaan'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-500">
                      {item.address && (
                        <p>
                          <span className="font-semibold text-gray-700">Lokasi:</span>{' '}
                          {item.address}
                        </p>
                      )}
                      {item.phone && (
                        <p>
                          <span className="font-semibold text-gray-700">Kontak:</span>{' '}
                          {item.phone}
                        </p>
                      )}
                    </div>
                    {item.gmaps && (
                      <a
                        href={item.gmaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-leaf-200 px-4 py-2 text-sm font-medium text-leaf-700 hover:bg-leaf-50 transition"
                      >
                        Lihat di Google Maps
                      </a>
                    )}
                  </div>
                </article>
              ))
            : (
              <div className="col-span-full rounded-3xl border border-dashed border-leaf-200 bg-white/90 p-10 text-center text-sm text-gray-500">
                Data kebudayaan dan kesenian belum tersedia.
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
