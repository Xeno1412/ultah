// API Client Helper compatible with both Node.js/Express and Apache/PHP (XAMPP)

// Data lama menyimpan path gambar seperti "/assets/...". Path absolut itu
// rusak kalau web dipasang di subfolder XAMPP (mis. /birthday/), jadi ubah
// menjadi path relatif terhadap halaman yang sedang dibuka.
export function resolveAssetUrl(url?: string): string {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return url.replace(/^\/+/, '');
}

// Ubah endpoint API menjadi file .php langsung, dipakai saat mod_rewrite
// Apache tidak aktif sehingga /api/content dan sejenisnya tidak bisa dipetakan.
function toPhpEndpoint(endpoint: string): string {
  const [pathPart, query] = endpoint.split('?');
  if (pathPart.endsWith('.php')) return endpoint;

  // api/responses/<id> -> api/responses.php?id=<id>
  const idMatch = pathPart.match(/^api\/responses\/([^/]+)$/);
  if (idMatch) {
    const id = encodeURIComponent(idMatch[1]);
    return `api/responses.php?id=${id}${query ? `&${query}` : ''}`;
  }

  return `${pathPart}.php${query ? `?${query}` : ''}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  // Normalize endpoint: remove leading slash to make it relative to current path (e.g. /ultah/)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  try {
    const res = await fetch(cleanEndpoint, options);
    // If not found (404) and Apache mod_rewrite is disabled, fallback to .php file
    if (res.status === 404 && !cleanEndpoint.endsWith('.php')) {
      const phpRes = await fetch(toPhpEndpoint(cleanEndpoint), options);
      if (phpRes.ok || phpRes.status !== 404) {
        return phpRes;
      }
    }
    return res;
  } catch (err) {
    // Retry with .php directly
    if (!cleanEndpoint.endsWith('.php')) {
      return fetch(toPhpEndpoint(cleanEndpoint), options);
    }
    throw err;
  }
}
