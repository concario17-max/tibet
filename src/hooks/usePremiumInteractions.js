import { useState, useCallback, useRef } from 'react';

/**
 * 전설적인 Meta-Design을 위한 프리미엄 인터랙션 훅
 * 마우스 위치를 추적하여 3D Tilt 효과와 마그네틱 효과를 계산함
 */
export const usePremiumInteractions = (intensity = 15) => {
    const [style, setStyle] = useState({});
    const ref = useRef(null);

    const onMouseMove = useCallback((e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -intensity;
        const rotateY = ((x - centerX) / centerX) * intensity;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out'
        });
    }, [intensity]);

    const onMouseLeave = useCallback(() => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)'
        });
    }, []);

    return { ref, style, onMouseMove, onMouseLeave };
};
