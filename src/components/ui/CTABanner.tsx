import { Link } from 'react-router-dom';

interface CTABannerProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: 'primary' | 'accent';
}

export default function CTABanner({
  title,
  subtitle,
  buttonText = 'Faire une demande en ligne',
  buttonLink = '/demande-en-ligne',
  variant = 'primary',
}: CTABannerProps) {
  const bgClass = variant === 'primary'
    ? 'bg-linear-to-r from-primary-700 to-primary-600'
    : 'bg-linear-to-r from-accent-600 to-accent-500';

  return (
    <section className={`${bgClass} py-16`}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        {subtitle && (
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{subtitle}</p>
        )}
        <Link
          to={buttonLink}
          className={`inline-block px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-105 ${variant === 'primary'
              ? 'bg-accent-500 hover:bg-accent-400 text-white'
              : 'bg-white hover:bg-gray-50 text-primary-700'
            }`}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
