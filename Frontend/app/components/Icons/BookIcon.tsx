interface BookIconProps {
    className?: string;
    size?: number;
}

export default function BookIcon({ className = "", size = 24 }: BookIconProps) {
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
                d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
