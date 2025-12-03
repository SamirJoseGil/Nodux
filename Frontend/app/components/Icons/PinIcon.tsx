interface PinIconProps {
    className?: string;
    size?: number;
}

export default function PinIcon({ className = "", size = 24 }: PinIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2H6a2 2 0 00-2 2v2l1.5 1.5L9 15l-4 4h4l4-4 3.5-3.5L18 10V8a2 2 0 00-2-2h-2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
