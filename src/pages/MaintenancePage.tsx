import { Helmet } from 'react-helmet-async';

const MaintenancePage = () => {
  return (
    <>
      <Helmet>
        <title>Under utvikling — Skriv Akademisk Kursportal</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="min-h-screen bg-brand-cream flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-brand-teal-light text-brand-teal mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-brand-ink mb-6">
            Kursportalen er under utvikling
          </h1>

          <p className="text-lg md:text-xl text-brand-gray mb-4 leading-relaxed">
            Vi gjør Skriv Akademisk Kursportal enda bedre. Tilbake i full drift{' '}
            <span className="text-brand-coral font-semibold">15. august 2026</span>.
          </p>

          <p className="text-base text-brand-gray mb-10">
            Takk for tålmodigheten — vi gleder oss til å åpne dørene igjen.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://skrivakademisk.no"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brand-teal text-white font-medium hover:opacity-90 transition"
            >
              Gå til skrivakademisk.no
            </a>
            <a
              href="mailto:lisa@skrivakademisk.no"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-brand-border text-brand-ink font-medium hover:bg-brand-warm transition"
            >
              Kontakt oss
            </a>
          </div>

          <p className="mt-12 text-sm text-brand-gray">
            Skriv Akademisk AS · org.nr. 930 906 107
          </p>
        </div>
      </main>
    </>
  );
};

export default MaintenancePage;
