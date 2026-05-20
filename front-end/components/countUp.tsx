"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface CountUpProps {
    to: number;          // número final
    duration?: number;   // duração da animação em segundos
    className?: string;  // classes para estilização
    style?: React.CSSProperties; // estilos inline
}

export default function CountUp({
    to,
    duration = 5,
    className,
    style,
}: CountUpProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
        const controls = animate(count, to, { duration });
        return controls.stop;
    }, [to, duration]);

    return (
        <motion.span className={className} style={style}>
            {rounded}
        </motion.span>
    );
}