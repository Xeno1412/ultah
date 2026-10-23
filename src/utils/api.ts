// API Client Helper compatible with both Node.js/Express and Apache/PHP (XAMPP)

export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  // Normalize endpoint: remove leading slash to make it relative to current path (e.g. /ultah/)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  try {
    const res = await fetch(cleanEndpoint, options);
    // If not found (404) and Apache mod_rewrite is disabled, fallback to .php file
    if (res.status === 404 && !cleanEndpoint.endsWith('.php')) {
      const parts = cleanEndpoint.split('?');
      let phpEndpoint = parts[0] + '.php';
      if (parts[1]) phpEndpoint += '?' + parts[1];
      
      const phpRes = await fetch(phpEndpoint, options);
      if (phpRes.ok || phpRes.status !== 404) {
        return phpRes;
      }
    }
    return res;
  } catch (err) {
    // Retry with .php directly
    if (!cleanEndpoint.endsWith('.php')) {
      const parts = cleanEndpoint.split('?');
      let phpEndpoint = parts[0] + '.php';
      if (parts[1]) phpEndpoint += '?' + parts[1];
      return fetch(phpEndpoint, options);
    }
    throw err;
  }
}
