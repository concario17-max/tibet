import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * PasswordGuard - 앱 진입 보안 레이어 (Meta-Design)
 * @param {Object} children - 인증 후 렌더링할 자식 컴포넌트
 */
const PasswordGuard = ({ children }) => {
    const [password, setPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('tibet_authorized');
        if (auth === 'true') {
            setIsAuthorized(true);
        }
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === '0228') {
            setIsAuthorized(true);
            localStorage.setItem('tibet_authorized', 'true');
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 500);
        }
    };

    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFCF9] dark:bg-[#0A0A0A] font-inter overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                <div className="absolute inset-0 bg-grid-slate-900/[0.1] dark:bg-grid-white/[0.1]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px] px-6 text-center space-y-12"
            >
                {/* Icon & Title */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mx-auto w-16 h-16 rounded-2xl bg-[#F4F1EA] dark:bg-[#1A1A1A] flex items-center justify-center border border-[#E5E0D5] dark:border-[#2A2A2A]"
                    >
                        <svg className="w-8 h-8 text-[#B29A62]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-playfair italic text-[#B29A62] tracking-tight">
                            Access Restricted
                        </h1>
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B29A62]/60">
                            LIGHT OF YOGA
                        </p>
                    </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <motion.div
                        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                        className="relative"
                    >
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-full h-14 bg-white dark:bg-black border border-[#D1D1D1] dark:border-[#333] rounded-xl px-4 text-center text-lg tracking-[0.5em] focus:outline-none focus:border-[#B29A62] transition-colors placeholder:tracking-normal placeholder:text-gray-400 dark:text-white"
                        />
                    </motion.div>

                    <button
                        type="submit"
                        className="w-full h-14 bg-[#111] dark:bg-white text-white dark:text-black rounded-xl font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-[#E5E5E5] transition-all transform active:scale-[0.98]"
                    >
                        ENTER GATEWAY
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>

                {/* Footer Info */}
                <div className="space-y-8 pt-4">
                    <div className="text-[11px] text-[#A1A1A1] flex items-center justify-center gap-1">
                        문의: <span className="text-[#B29A62] italic">roadsea@naver.com</span>
                    </div>

                    <div className="text-[9px] font-bold tracking-[0.2em] text-[#A1A1A1]/40 uppercase max-w-[200px] mx-auto leading-relaxed">
                        Dedicated to the timeless wisdom of patanjali
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PasswordGuard;
