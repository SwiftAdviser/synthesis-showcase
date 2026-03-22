import { getVideoId, getLoomId, getInitials, hashGradient } from "@/lib/utils";

interface Props {
  name: string;
  videoURL: string | null;
  coverImageURL: string | null;
}

export function ProjectHero({ name, videoURL, coverImageURL }: Props) {
  if (videoURL) {
    const ytId = getVideoId(videoURL);
    const loomId = getLoomId(videoURL);

    if (ytId) {
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-bg-surface">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      );
    }

    if (loomId) {
      return (
        <div className="aspect-video rounded-xl overflow-hidden bg-bg-surface">
          <iframe
            src={`https://www.loom.com/embed/${loomId}`}
            title={name}
            allowFullScreen
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      );
    }

    return (
      <a
        href={videoURL}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-video rounded-xl overflow-hidden bg-bg-surface flex items-center justify-center hover:bg-bg-raised transition-colors"
        style={{ background: hashGradient(name) }}
      >
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto text-white/60">
            <path d="M8 5v14l11-7z" />
          </svg>
          <p className="text-sm text-white/60 mt-2">Watch video</p>
        </div>
      </a>
    );
  }

  if (coverImageURL) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-bg-surface">
        <img src={coverImageURL} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className="aspect-video rounded-xl overflow-hidden flex items-center justify-center"
      style={{ background: hashGradient(name) }}
    >
      <span className="text-5xl font-bold text-white/30 font-display">
        {getInitials(name)}
      </span>
    </div>
  );
}
