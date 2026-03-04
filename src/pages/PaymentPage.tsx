import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentPageProps {
  onPurchase: () => void;
}

const PaymentPage = ({ onPurchase }: PaymentPageProps) => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    onPurchase();
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-soft">
      <h1 className="text-3xl text-brand-teal">Kjøp tilgang</h1>
      <p className="mt-2 text-brand-ink/80">Betalingsmur aktiv. Integrasjonspunkt klart for Stripe Checkout (NOK).</p>
      <div className="mt-6 rounded-2xl bg-brand-cream p-5">
        <p className="text-sm text-brand-ink/70">Kurspakke</p>
        <p className="text-4xl text-brand-teal">1 990 NOK</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-brand-ink/80">
          <li>Tilgang til alle moduler</li>
          <li>Fremgangssporing på tvers av leksjoner</li>
          <li>Kontinuerlige oppdateringer</li>
        </ul>
      </div>
      <button
        type="button"
        onClick={handlePurchase}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-coral px-5 py-3 font-semibold text-white"
      >
        <CreditCard size={18} /> Kjøp tilgang (Stripe placeholder)
      </button>
    </div>
  );
};

export default PaymentPage;
