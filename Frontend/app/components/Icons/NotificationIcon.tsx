interface NotificationIconProps {
    className?: string;
    size?: number;
}

export default function NotificationIcon({ className = "", size = 24 }: NotificationIconProps) {
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
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.73 21a2 2 0 01-3.46 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
