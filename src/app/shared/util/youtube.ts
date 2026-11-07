const VIDEO_ID = /^[\w-]{11}$/;

/** Extracts a YouTube video id from the URL formats the SpaceX API uses. */
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') {
      id = parsed.pathname.slice(1);
    } else if (host.endsWith('youtube.com')) {
      id = parsed.searchParams.get('v') ?? parsed.pathname.split('/').at(-1) ?? null;
    }
    return id && VIDEO_ID.test(id) ? id : null;
  } catch {
    return null;
  }
}
