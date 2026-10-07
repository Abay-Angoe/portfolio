import type { UITrack } from "@/lib/musicTypes";

/**
 * Fetches free, Creative-Commons-licensed tracks from the Jamendo API and maps
 * them to UITracks. Streaming Jamendo audio is legal; get a free client id at
 * https://devportal.jamendo.com and set NEXT_PUBLIC_JAMENDO_CLIENT_ID.
 *
 * Throws if no client id is configured or the request fails — the Music app
 * falls back to the built-in synth tracks in that case.
 */
interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  duration: number;
  audio: string;
  album_image?: string;
  image?: string;
}

export async function fetchJamendoTracks(limit = 12): Promise<UITrack[]> {
  const clientId = process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID;
  if (!clientId) throw new Error("NEXT_PUBLIC_JAMENDO_CLIENT_ID is not set");

  const params = new URLSearchParams({
    client_id: clientId,
    format: "json",
    limit: String(limit),
    audioformat: "mp32",
    order: "popularity_total",
    groupby: "artist_id", // one track per artist for variety
    include: "musicinfo",
  });
  const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?${params.toString()}`);
  if (!res.ok) throw new Error(`Jamendo request failed: ${res.status}`);

  const data = (await res.json()) as { results?: JamendoTrack[] };
  const results = data.results ?? [];
  return results
    .filter((t) => t.audio)
    .map((t) => ({
      id: String(t.id),
      title: t.name,
      artist: t.artist_name,
      album: t.album_name || t.artist_name,
      image: t.album_image || t.image,
      src: t.audio,
      duration: Number(t.duration) || 0,
    }));
}
