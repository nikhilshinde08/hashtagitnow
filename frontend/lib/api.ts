import { createClient } from '@/lib/supabase/client';

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const token = supabase
    ? (await supabase.auth.getSession()).data.session?.access_token
    : undefined;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiPost<T>(path: string, body: object): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Backend returned ${res.status} from ${API}${path}: ${text.slice(0, 120)}`);
  }
}
