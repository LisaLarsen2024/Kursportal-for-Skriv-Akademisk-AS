import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DownloadButtonProps {
  filename: string;
  label?: string;
  variant?: 'primary' | 'outline';
}

const DownloadButton = ({ filename, label = 'Last ned ressurs', variant = 'outline' }: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: storageError } = await supabase.storage
        .from('course-downloads')
        .createSignedUrl(filename, 300);

      if (storageError || !data?.signedUrl) {
        throw new Error('Kunne ikke generere nedlastingslenke');
      }

      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setError('Nedlasting feilet. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const baseClass = 'inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition';
  const variantClass =
    variant === 'primary'
      ? 'bg-brand-teal text-white hover:bg-brand-teal/90'
      : 'border border-brand-teal/30 text-brand-teal hover:bg-brand-teal/5';

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className={`${baseClass} ${variantClass} disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        {label}
      </button>
      {error && <p className="text-xs text-brand-coral">{error}</p>}
    </div>
  );
};

export default DownloadButton;
