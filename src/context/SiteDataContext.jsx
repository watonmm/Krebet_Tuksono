import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { siteConfig } from '../data/siteData';
import { API_CONFIG } from '../data/apiConfig';

const SiteDataContext = createContext(null);

/* ═══════════════════════════════════════════════════════════
   Google Sheets Response Parser
   ═══════════════════════════════════════════════════════════
   Google Sheets gviz/tq mengembalikan format JSONP:
   google.visualization.Query.setResponse({...});

   Parser ini menangani kasus-kasus khusus:
   1. parsedNumHeaders=0 → baris pertama = header, bukan data
   2. Kolom bertipe number (misal WhatsApp) → pakai formatted value
   3. Cell null → default ke empty string
   ═══════════════════════════════════════════════════════════ */
function parseGoogleSheetsResponse(text) {
  // Extract JSON dari wrapper JSONP
  const match = text.match(
    /google\.visualization\.Query\.setResponse\(({.*})\)/s
  );
  if (!match) {
    throw new Error('Format response Google Sheets tidak valid');
  }

  const json = JSON.parse(match[1]);
  const table = json.table;

  // ── Tentukan nama kolom (header) ──
  // Cek apakah Google Sheets mendeteksi header otomatis
  const hasAutoHeaders = table.cols.some((col) => col.label && col.label.trim() !== '');

  let cols;
  let dataRows;

  if (hasAutoHeaders) {
    // Google mendeteksi header → ambil dari cols.label
    cols = table.cols.map((col) => col.label || '');
    dataRows = table.rows;
  } else {
    // parsedNumHeaders=0 → baris pertama adalah header
    // Ambil nama kolom dari row pertama
    cols = table.rows[0].c.map((cell) =>
      cell ? String(cell.v || '') : ''
    );
    dataRows = table.rows.slice(1); // Skip baris header
  }

  // ── Konversi setiap baris menjadi object { NamaKolom: nilai } ──
  return dataRows
    .map((row) => {
      const obj = {};
      row.c.forEach((cell, i) => {
        if (!cols[i]) return;

        if (!cell || cell.v == null) {
          obj[cols[i]] = '';
          return;
        }

        // Gunakan formatted value (f) jika ada, agar angka seperti
        // nomor WhatsApp (6.285E12) tetap tampil benar ("6285158424337")
        if (cell.f != null) {
          obj[cols[i]] = String(cell.f);
        } else {
          obj[cols[i]] = cell.v;
        }
      });
      return obj;
    })
    .filter((row) => {
      // Filter baris kosong (semua value empty string)
      return Object.values(row).some((v) => v !== '');
    });
}

/* ═══════════════════════════════════════════════════════════
   localStorage Cache — Stale-While-Revalidate Pattern
   ═══════════════════════════════════════════════════════════
   - Cache FRESH selama 30 menit → langsung pakai, skip fetch
   - Cache STALE setelah 30 menit → tampilkan langsung, fetch
     di background untuk update
   - Tidak ada cache → fetch dan tampilkan loading skeleton
   ═══════════════════════════════════════════════════════════ */
const CACHE_PREFIX = 'padukuhan_data_';
const CACHE_DURATION = 30 * 60 * 1000; // 30 menit (naik dari 5 menit)

/**
 * Ambil data dari cache.
 * @returns {{ data: any, fresh: boolean } | null}
 *   - fresh=true  → data masih valid, tidak perlu re-fetch
 *   - fresh=false → data stale, tampilkan tapi re-fetch di background
 *   - null        → tidak ada cache
 */
function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const { data, ts } = JSON.parse(raw);
    const age = Date.now() - ts;

    if (age > CACHE_DURATION) {
      // Stale — masih bisa ditampilkan tapi perlu refresh
      return { data, fresh: false };
    }
    // Fresh — langsung pakai
    return { data, fresh: true };
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    // localStorage penuh atau tidak tersedia — abaikan
  }
}

/**
 * Mengubah URL Google Drive sharing menjadi URL gambar langsung
 * dengan parameter resize untuk loading lebih cepat.
 *
 * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://lh3.googleusercontent.com/d/FILE_ID=s600
 *
 * Parameter =s600 membuat Google me-resize gambar menjadi max 600px,
 * sehingga file lebih kecil dan loading lebih cepat.
 *
 * Jika bukan URL Google Drive, dikembalikan apa adanya.
 */
function toDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return null;

  // Pattern: drive.google.com/file/d/{FILE_ID}/...
  const driveMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}=s600`;
  }

  // Pattern: drive.google.com/open?id={FILE_ID}
  const openMatch = url.match(
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
  );
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}=s600`;
  }

  return url;
}

/* ── Mapper: row → format UMKM app ── */
function mapUmkmRow(row, index) {
  const rawImage = row['Foto'] || row['foto'] || null;

  return {
    id: index + 1,
    name: row['Nama'] || row['nama'] || '',
    description: row['Deskripsi'] || row['deskripsi'] || '',
    image: toDirectImageUrl(rawImage),
    qris: String(row['QRIS'] || row['qris'] || '').toLowerCase() === 'ya',
    whatsapp: String(row['WhatsApp'] || row['whatsapp'] || ''),
    category: row['Kategori'] || row['kategori'] || 'Lainnya',
    gmaps: row['Gmaps'] || row['gmaps'] || null,
  };
}

function mapFacilityRow(row, index) {
  const rawImage = row['Foto'] || row['foto'] || null;

  return {
    id: index + 1,
    name: row['Nama'] || row['nama'] || '',
    type: row['Tipe'] || row['Jenis'] || row['type'] || row['type'] || 'Fasilitas Umum',
    description: row['Deskripsi'] || row['deskripsi'] || '',
    address: row['Alamat'] || row['alamat'] || row['Address'] || row['address'] || '',
    phone: String(row['Telepon'] || row['telepon'] || row['Phone'] || row['phone'] || ''),
    image: toDirectImageUrl(rawImage),
    gmaps: row['Gmaps'] || row['gmaps'] || null,
  };
}

/* ── Mapper: row → format statistik app ── */
function mapStatsRow(row) {
  return {
    id: String(row['ID'] || row['id'] || row['Label'] || '').toLowerCase(),
    label: row['Label'] || row['label'] || '',
    value: parseInt(row['Nilai'] || row['nilai'] || 0, 10),
    description: row['Deskripsi'] || row['deskripsi'] || '',
    icon: row['Icon'] || row['icon'] || 'home',
  };
}

/**
 * Fetch data dari Google Sheets langsung (tanpa cache logic di sini).
 * Cache logic dipindah ke SiteDataProvider agar bisa implementasi
 * stale-while-revalidate.
 */
async function fetchGoogleSheet(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Sheets: HTTP ${res.status}`);

  const text = await res.text();
  return parseGoogleSheetsResponse(text);
}

/**
 * SiteDataProvider — React Context yang:
 * 1. Mulai dengan data statis dari siteData.js (instant, tanpa loading)
 * 2. Cek localStorage cache → jika ada (even stale), tampilkan langsung
 * 3. Jika cache fresh → selesai, tidak perlu fetch
 * 4. Jika cache stale/kosong → fetch dari Google Sheets (paralel)
 * 5. Jika fetch gagal → tetap tampilkan data statis/cache (fallback)
 *
 * Pattern: Stale-While-Revalidate
 * → Website terasa INSTAN karena data cache langsung ditampilkan
 * → Data terbaru di-fetch di background tanpa loading spinner
 */
export function SiteDataProvider({ children }) {
  const [data, setData] = useState(() => {
    // ── Inisialisasi: cek cache dulu ──
    // Jika ada cache (fresh atau stale), langsung pakai sebagai initial state
    // Ini membuat website terasa instan saat dibuka ulang
    const cachedUmkm = getCached('umkm');
    const cachedStats = getCached('stats');
    const cachedFacilities = getCached('facilities');

    const initial = { ...siteConfig };

    if (cachedUmkm?.data) {
      initial.umkm = cachedUmkm.data.map(mapUmkmRow);
    }
    if (cachedStats?.data) {
      initial.stats = cachedStats.data.map(mapStatsRow);
    }
    if (cachedFacilities?.data) {
      initial.facilities = cachedFacilities.data.map(mapFacilityRow);
    }

    return initial;
  });

  const [loading, setLoading] = useState(() => {
    // Hanya tampilkan loading jika TIDAK ada cache sama sekali
    if (!API_CONFIG.umkm && !API_CONFIG.stats && !API_CONFIG.facilities) return false;
    const cachedUmkm = getCached('umkm');
    const cachedStats = getCached('stats');
    const cachedFacilities = getCached('facilities');
    return !cachedUmkm && !cachedStats && !cachedFacilities;
  });

  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Tidak ada API URL? Langsung pakai data statis.
    if (!API_CONFIG.umkm && !API_CONFIG.stats) {
      setLoading(false);
      return;
    }

    // Prevent double-fetch in React StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Cek apakah semua cache masih fresh → skip fetch
    const cachedUmkm = getCached('umkm');
    const cachedStats = getCached('stats');
    const allFresh =
      (!API_CONFIG.umkm || cachedUmkm?.fresh) &&
      (!API_CONFIG.stats || cachedStats?.fresh);

    if (allFresh) {
      setLoading(false);
      return; // Cache masih fresh, tidak perlu fetch
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        // ── Fetch PARALEL dengan Promise.allSettled ──
        // Lebih cepat karena semua request jalan bersamaan
        const [umkmResult, statsResult, facilitiesResult] = await Promise.allSettled([
          API_CONFIG.umkm ? fetchGoogleSheet(API_CONFIG.umkm) : Promise.resolve(null),
          API_CONFIG.stats ? fetchGoogleSheet(API_CONFIG.stats) : Promise.resolve(null),
          API_CONFIG.facilities ? fetchGoogleSheet(API_CONFIG.facilities) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const updates = {};

        // Proses hasil UMKM
        if (umkmResult.status === 'fulfilled' && Array.isArray(umkmResult.value) && umkmResult.value.length > 0) {
          setCache('umkm', umkmResult.value);
          updates.umkm = umkmResult.value.map(mapUmkmRow);
        } else if (umkmResult.status === 'rejected') {
          console.warn('⚠️ Gagal fetch UMKM:', umkmResult.reason);
        }

        // Proses hasil Statistik
        if (statsResult.status === 'fulfilled' && Array.isArray(statsResult.value) && statsResult.value.length > 0) {
          setCache('stats', statsResult.value);
          updates.stats = statsResult.value.map(mapStatsRow);
        } else if (statsResult.status === 'rejected') {
          console.warn('⚠️ Gagal fetch Stats:', statsResult.reason);
        }

        // Proses hasil Fasilitas Umum
        if (facilitiesResult.status === 'fulfilled' && Array.isArray(facilitiesResult.value) && facilitiesResult.value.length > 0) {
          setCache('facilities', facilitiesResult.value);
          updates.facilities = facilitiesResult.value.map(mapFacilityRow);
        } else if (facilitiesResult.status === 'rejected') {
          console.warn('⚠️ Gagal fetch Facilities:', facilitiesResult.reason);
        }

        if (Object.keys(updates).length > 0) {
          setData((prev) => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.error('⚠️ Gagal memuat data dari Google Sheets:', err);
        if (!cancelled) setError(err.message);
        // Data statis / cache tetap tampil sebagai fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteDataContext.Provider value={{ ...data, loading, error }}>
      {children}
    </SiteDataContext.Provider>
  );
}

/**
 * Hook untuk mengakses data site dari context.
 * Gunakan di semua komponen yang butuh data:
 *
 *   const { umkm, stats, loading } = useSiteData();
 */
export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData() harus digunakan di dalam <SiteDataProvider>');
  }
  return ctx;
}
