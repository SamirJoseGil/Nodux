import { useEffect, useState } from 'react';

interface WelcomeAnimationProps {
    onComplete: () => void;
    studentName?: string;
}

export default function WelcomeAnimation({ onComplete, studentName = 'Estudiante' }: WelcomeAnimationProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="text-center space-y-6 animate-fade-in-up">
                <div className="relative">
                    <div className="absolute inset-0 blur-3xl bg-blue-400 opacity-20 animate-pulse"></div>
                    <h1 className="relative text-6xl font-bold text-white mb-4 animate-slide-down">
                        Bienvenido
                    </h1>
                </div>
                <p className="text-2xl text-blue-100 animate-slide-up animation-delay-300">
                    {studentName}
                </p>
                <div className="flex justify-center space-x-2 animate-fade-in animation-delay-600">
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-100"></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce animation-delay-200"></div>
                </div>
            </div>
        </div>
    );
}
