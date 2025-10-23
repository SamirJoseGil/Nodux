import { Link } from '@remix-run/react';

interface DashboardCardProps {
    title: string;
    icon: React.ReactNode;
    href: string;
    badge?: {
        text: string;
        variant: 'warning' | 'info' | 'success';
    };
    isExternal?: boolean;
}

export default function DashboardCard({ title, icon, href, badge, isExternal = false }: DashboardCardProps) {
    const badgeColors = {
        warning: 'bg-red-100 text-red-700 border-red-200',
        info: 'bg-blue-100 text-blue-700 border-blue-200',
        success: 'bg-green-100 text-green-700 border-green-200',
    };

    const cardContent = (
        <>
            <div className="flex flex-col items-center justify-center h-full space-y-4 relative">
                <div className="text-blue-900 transform transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>
                <h3 className="text-center text-sm font-semibold text-blue-900 px-4">
                    {title}
                </h3>
                {badge && (
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full border ${badgeColors[badge.variant]}`}>
                        {badge.text}
                    </span>
                )}
            </div>
        </>
    );

    const commonClasses = "group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-1 h-full min-h-[180px] flex items-center justify-center";

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={commonClasses}
            >
                {cardContent}
            </a>
        );
    }

    return (
        <Link to={href} className={commonClasses}>
            {cardContent}
        </Link>
    );
}
