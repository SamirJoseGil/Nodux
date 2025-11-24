interface TrendDownIconProps {
    className?: string;
    size?: number;
}

export default function TrendDownIcon({ className = "", size = 24 }: TrendDownIconProps) {
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
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
