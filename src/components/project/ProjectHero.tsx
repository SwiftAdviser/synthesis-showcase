"use client";

import { useState } from "react";
import { getVideoId, getLoomId, hashGradient } from "@/lib/utils";

interface Props {
  name: string;
  videoURL: string | null;
  coverImageURL: string | null;
  picturesURL?: string | null;
}

function VideoEmbed({ videoURL, name }: { videoURL: string; name: string }) {
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
      className="block aspect-video rounded-xl overflow-hidden flex items-center justify-center hover:bg-bg-raised transition-colors"
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

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-bg-surface/80 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ProjectHero({ name, videoURL, coverImageURL, picturesURL }: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Collect all images: cover first, then pictures URL if it looks like an image
  const images: string[] = [];
  if (coverImageURL) images.push(coverImageURL);
  if (picturesURL && /\.(png|jpg|jpeg|gif|webp|svg)/i.test(picturesURL)) {
    images.push(picturesURL);
  }

  const hasVideo = !!videoURL;
  const hasImages = images.length > 0;

  // No media at all
  if (!hasVideo && !hasImages) {
    return (
      <div
        className="aspect-video rounded-xl overflow-hidden flex items-center justify-center noise-bg"
        style={{ background: hashGradient(name) }}
      >
        <span className="text-6xl font-display text-white/15 tracking-[0.2em] uppercase select-none">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Primary: video if available, otherwise first image large */}
      {hasVideo ? (
        <VideoEmbed videoURL={videoURL!} name={name} />
      ) : (
        <div className="aspect-video rounded-xl overflow-hidden bg-bg-surface cursor-pointer" onClick={() => setLightboxSrc(images[0])}>
          <img src={images[0]} alt={name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
        </div>
      )}

      {/* Gallery strip: show images below video, or remaining images if first was shown large */}
      {(() => {
        const galleryImages = hasVideo ? images : images.slice(1);
        if (galleryImages.length === 0) return null;

        return (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {galleryImages.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxSrc(src)}
                className="shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-bg-surface border border-border hover:border-accent/50 transition-colors"
              >
                <img
                  src={src}
                  alt={`${name} screenshot ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        );
      })()}

      {/* Lightbox */}
      {lightboxSrc && (
        <ImageLightbox
          src={lightboxSrc}
          alt={name}
          onClose={() => setLightboxSrc(null)}
        />
      )}
    </div>
  );
}
