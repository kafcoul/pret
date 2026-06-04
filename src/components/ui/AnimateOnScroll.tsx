import { type ReactNode, type CSSProperties, useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

type AnimationType = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'zoom-in';

function usePrefersReducedMotion(): boolean {
    const [prefersReduced, setPrefersReduced] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return prefersReduced;
}

interface AnimateOnScrollProps {
    children: ReactNode;
    animation?: AnimationType;
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
}

const animations: Record<AnimationType, { hidden: CSSProperties; visible: CSSProperties }> = {
    'fade-up': {
        hidden: { opacity: 0, transform: 'translateY(32px)' },
        visible: { opacity: 1, transform: 'translateY(0)' },
    },
    'fade-in': {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    'fade-left': {
        hidden: { opacity: 0, transform: 'translateX(-32px)' },
        visible: { opacity: 1, transform: 'translateX(0)' },
    },
    'fade-right': {
        hidden: { opacity: 0, transform: 'translateX(32px)' },
        visible: { opacity: 1, transform: 'translateX(0)' },
    },
    'zoom-in': {
        hidden: { opacity: 0, transform: 'scale(0.92)' },
        visible: { opacity: 1, transform: 'scale(1)' },
    },
};

export default function AnimateOnScroll({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 600,
    className = '',
    threshold = 0.15,
}: AnimateOnScrollProps) {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold });
    const prefersReducedMotion = usePrefersReducedMotion();
    const anim = animations[animation];

    // Respect prefers-reduced-motion: show content immediately without animation
    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const style: CSSProperties = {
        ...(isVisible ? anim.visible : anim.hidden),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
    };

    return (
        <div ref={ref} style={style} className={className}>
            {children}
        </div>
    );
}
