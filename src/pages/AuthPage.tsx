import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
  onLogin: (email: string) => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('student@example.com');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onLogin(email);
    navigate('/betaling');
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-soft">
      <h1 className="text-3xl text-brand-teal">Innlogging</h1>
      <p className="mt-2 text-brand-ink/70">Supabase Auth-klargjort. Demoen simulerer e-post/passord eller magic link.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          E-post
          <input
            className="mt-1 w-full rounded-xl border border-brand-teal/20 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block text-sm">
          Passord
          <input className="mt-1 w-full rounded-xl border border-brand-teal/20 px-3 py-2" type="password" required />
        </label>
        <button className="w-full rounded-xl bg-brand-teal px-4 py-3 font-semibold text-white" type="submit">
          Logg inn
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
