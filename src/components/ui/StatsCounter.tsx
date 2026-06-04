import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Clock, Handshake } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useSiteContent } from '../../lib/SiteContentContext';

interface CounterItemProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: React.ReactNode;
  duration?: number;
}

function CounterItem({ end, suffix = '', prefix = '', label, icon, duration = 2000 }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 });

  useEffect(() => {
    if (isVisible && !startedRef.current) {
      startedRef.current = true;

      // Respect prefers-reduced-motion: show final value immediately
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time animation fallback
        setCount(end);
        return;
      }

      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-accent-500/10 rounded-2xl mb-4">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white font-serif mb-2">
        {prefix}{count.toLocaleString('fr-CA')}{suffix}
      </div>
      <div className="text-primary-200 text-sm">{label}</div>
    </div>
  );
}

export default function StatsCounter() {
  const { c } = useSiteContent();
  const icons = [
    <Clock className="h-7 w-7 text-accent-500" />,
    <Users className="h-7 w-7 text-accent-500" />,
    <TrendingUp className="h-7 w-7 text-accent-500" />,
    <Handshake className="h-7 w-7 text-accent-500" />,
  ];
  const durations = [2000, 2500, 2000, 2200];

  return (
    <section className="py-16 bg-primary-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 50%, rgba(200,150,62,0.4) 0%, transparent 50%), radial-gradient(circle at 90% 50%, rgba(200,150,62,0.3) 0%, transparent 50%)',
          }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {([1, 2, 3, 4] as const).map((n, i) => (
            <CounterItem
              key={n}
              end={parseInt(c(`stats.${n}.end`, ['25', '5000', '48', '150'][i]), 10)}
              suffix={c(`stats.${n}.suffix`, ['+', '+', 'h', '+'][i])}
              label={c(`stats.${n}.label`, ["Années d'expérience", 'Clients financés', "Délai d'approbation", 'Courtiers partenaires'][i])}
              icon={icons[i]}
              duration={durations[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
