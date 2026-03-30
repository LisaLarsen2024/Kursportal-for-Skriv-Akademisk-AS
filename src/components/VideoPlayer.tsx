import { PlayCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => {
  if (!videoUrl || videoUrl === 'PLACEHOLDER') {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed border-brand-teal/20 bg-brand-teal/5 flex flex-col items-center justify-center gap-3 text-brand-ink/40">
        <PlayCircle size={48} className="text-brand-teal/30" />
        <div className="text-center">
          <p className="font-semibold text-brand-teal/50">Videoer kommer snart</p>
          <p className="text-sm mt-0.5">Les læringsmålene og gjør deg klar</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="aspect-video w-full overflow-hidden rounded-2xl border border-brand-teal/10 shadow-soft relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={videoUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; microphone; screen-wake-lock"
        allowFullScreen
      />
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 14,
          fontSize: '11px',
          color: 'rgba(255,255,255,0.35)',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '0.02em',
          fontWeight: 500,
        }}
      >
        Skriv Akademisk™
      </div>
    </div>
  );
};

export default VideoPlayer;
