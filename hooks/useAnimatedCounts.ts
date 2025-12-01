import { useEffect, useState } from 'react';

export function useAnimatedCounts(targets: Record<string, number>, duration = 1800) {
    const [counts, setCounts] = useState<Record<string, number>>(() =>
        Object.fromEntries(Object.keys(targets).map((key) => [key, 0]))
    );

    useEffect(() => {
        let raf: number;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const nextCounts = Object.fromEntries(
                Object.entries(targets).map(([key, value]) => [key, Math.floor(value * eased)])
            );
            setCounts(nextCounts);
            if (progress < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [targets, duration]);

    return counts;
}
