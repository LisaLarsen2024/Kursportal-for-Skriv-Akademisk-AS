interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoPlayer = ({ videoUrl, title }: VideoPlayerProps) => (
  <div className="aspect-video w-full overflow-hidden rounded-2xl border border-brand-teal/10 shadow-soft">
    <iframe
      src={videoUrl}
      title={title}
      className="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

export default VideoPlayer;
