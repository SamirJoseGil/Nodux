import { useState, useEffect } from 'react';
import type { MetaFunction } from '@remix-run/node';
import { useAuth } from '~/contexts/AuthContext';
import ProtectedRoute from '~/components/ProtectedRoute';
import SystemAdminLayout from '~/components/Layout/SystemAdminLayout';

export const meta: MetaFunction = () => {
    return [
        { title: `Logs del Sistema - Nodux` },
        {
            name: "description",
            content: `Visualización y análisis de logs del sistema Nodux`,
        },
    ];
};

interface LogEntry {
    id: string;
    timestamp: string;
    level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
    source: string;
    user?: string;
    action: string;
    details: string;
    ip?: string;
    userAgent?: string;
}

export default function SystemLogs() {
    const { user } = useAuth();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

    // Filtros
    const [levelFilter, setLevelFilter] = useState<string>('all');
    const [sourceFilter, setSourceFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('today');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // Simular datos de logs
                const mockLogs: LogEntry[] = [
                    {
                        id: '1',
                        timestamp: '2024-02-20T10:30:45Z',
                        level: 'INFO',
                        source: 'AUTH',
                        user: 'admin@nodux.com',
                        action: 'USER_LOGIN',
                        details: 'Usuario admin inició sesión exitosamente',
                        ip: '192.168.1.100',
                        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    {
                        id: '2',
                        timestamp: '2024-02-20T10:28:12Z',
                        level: 'WARNING',
                        source: 'API',
                        user: 'mentor@nodux.com',
                        action: 'RATE_LIMIT_EXCEEDED',
                        details: 'Usuario excedió el límite de peticiones por minuto',
                        ip: '192.168.1.105'
                    },
                    {
                        id: '3',
                        timestamp: '2024-02-20T10:25:33Z',
                        level: 'ERROR',
                        source: 'DATABASE',
                        action: 'CONNECTION_FAILED',
                        details: 'Error al conectar con la base de datos principal',
                        ip: 'server'
                    },
                    {
                        id: '4',
                        timestamp: '2024-02-20T10:22:18Z',
                        level: 'INFO',
                        source: 'PROJECTS',
                        user: 'student@nodux.com',
                        action: 'PROJECT_CREATED',
                        details: 'Nuevo proyecto "App Móvil" creado',
                        ip: '192.168.1.110'
                    },
                    {
                        id: '5',
                        timestamp: '2024-02-20T10:20:44Z',
                        level: 'DEBUG',
                        source: 'CACHE',
                        action: 'CACHE_INVALIDATED',
                        details: 'Cache de usuarios invalidado automáticamente',
                        ip: 'server'
                    },
                    {
                        id: '6',
                        timestamp: '2024-02-20T10:18:55Z',
                        level: 'WARNING',
                        source: 'SECURITY',
                        action: 'FAILED_LOGIN_ATTEMPT',
                        details: 'Intento de login fallido para usuario inexistente',
                        ip: '192.168.1.200'
                    }
                ];

                setLogs(mockLogs);
                setFilteredLogs(mockLogs);
            } catch (error) {
                console.error('Error al cargar logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        let result = [...logs];

        // Filtro por nivel
        if (levelFilter !== 'all') {
            result = result.filter(log => log.level === levelFilter);
        }

        // Filtro por fuente
        if (sourceFilter !== 'all') {
            result = result.filter(log => log.source === sourceFilter);
        }

        // Filtro por término de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(log =>
                log.action.toLowerCase().includes(term) ||
                log.details.toLowerCase().includes(term) ||
                log.user?.toLowerCase().includes(term) ||
                log.source.toLowerCase().includes(term)
            );
        }

        // Filtro por fecha
        if (dateFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);

            result = result.filter(log => {
                const logDate = new Date(log.timestamp);
                switch (dateFilter) {
                    case 'today':
                        return logDate >= today;
                    case 'yesterday':
                        return logDate >= yesterday && logDate < today;
                    case 'week':
                        return logDate >= lastWeek;
                    default:
                        return true;
                }
            });
        }

        setFilteredLogs(result);
    }, [logs, levelFilter, sourceFilter, searchTerm, dateFilter]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'ERROR':
                return 'badge-error';
            case 'WARNING':
                return 'badge-warning';
            case 'INFO':
                return 'badge-info';
            case 'DEBUG':
                return 'badge-neutral';
            default:
                return 'badge-neutral';
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'ERROR':
                return '🔴';
            case 'WARNING':
                return '🟡';
            case 'INFO':
                return '🔵';
            case 'DEBUG':
                return '⚪';
            default:
                return '⚫';
        }
    };

    const sources = [...new Set(logs.map(log => log.source))];
    const levels = ['ERROR', 'WARNING', 'INFO', 'DEBUG'];

    return (
        <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
            <SystemAdminLayout title="Logs del Sistema">
                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">🔴</span>
                            </div>
                            <div className="flex-1">
                                <dt className="text-sm font-medium text-slate-600">Errores</dt>
                                <dd className="text-2xl font-semibold text-slate-900">
                                    {logs.filter(log => log.level === 'ERROR').length}
                                </dd>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">🟡</span>
                            </div>
                            <div className="flex-1">
                                <dt className="text-sm font-medium text-slate-600">Advertencias</dt>
                                <dd className="text-2xl font-semibold text-slate-900">
                                    {logs.filter(log => log.level === 'WARNING').length}
                                </dd>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">🔵</span>
                            </div>
                            <div className="flex-1">
                                <dt className="text-sm font-medium text-slate-600">Info</dt>
                                <dd className="text-2xl font-semibold text-slate-900">
                                    {logs.filter(log => log.level === 'INFO').length}
                                </dd>
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div className="flex-1">
                                <dt className="text-sm font-medium text-slate-600">Total</dt>
                                <dd className="text-2xl font-semibold text-slate-900">{logs.length}</dd>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de filtros y lista de logs */}
                    <div className="lg:col-span-2">
                        {/* Filtros */}
                        <div className="card mb-6">
                            <div className="card-body">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div>
                                        <label className="form-label">Buscar</label>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="form-input"
                                            placeholder="Buscar en logs..."
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Nivel</label>
                                        <select
                                            value={levelFilter}
                                            onChange={(e) => setLevelFilter(e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="all">Todos</option>
                                            {levels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">Fuente</label>
                                        <select
                                            value={sourceFilter}
                                            onChange={(e) => setSourceFilter(e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="all">Todas</option>
                                            {sources.map(source => (
                                                <option key={source} value={source}>{source}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label">Fecha</label>
                                        <select
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="all">Todas</option>
                                            <option value="today">Hoy</option>
                                            <option value="yesterday">Ayer</option>
                                            <option value="week">Última semana</option>
                                        </select>
                                    </div>

                                    <div className="flex items-end">
                                        <button className="btn-primary w-full">
                                            Exportar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de logs */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Logs del Sistema ({filteredLogs.length})
                                </h3>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                                </div>
                            ) : filteredLogs.length === 0 ? (
                                <div className="card-body text-center py-12">
                                    <span className="text-6xl mb-4 block">📋</span>
                                    <h3 className="text-lg font-medium text-slate-900 mb-2">No hay logs</h3>
                                    <p className="text-slate-600">No se encontraron logs con los filtros aplicados.</p>
                                </div>
                            ) : (
                                <div className="card-body p-0">
                                    <div className="divide-y divide-gray-200">
                                        {filteredLogs.map((log) => (
                                            <div
                                                key={log.id}
                                                onClick={() => setSelectedLog(log)}
                                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedLog?.id === log.id ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-lg">{getLevelIcon(log.level)}</span>
                                                            <span className={`badge ${getLevelColor(log.level)}`}>
                                                                {log.level}
                                                            </span>
                                                            <span className="badge badge-neutral">{log.source}</span>
                                                            <span className="text-sm text-slate-500">
                                                                {new Date(log.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-900 mb-1">
                                                            {log.action}
                                                        </p>
                                                        <p className="text-sm text-slate-600 truncate">
                                                            {log.details}
                                                        </p>
                                                        {log.user && (
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Usuario: {log.user} | IP: {log.ip}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de detalle */}
                    <div className="lg:col-span-1">
                        {selectedLog ? (
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Detalle del Log
                                    </h3>
                                </div>
                                <div className="card-body space-y-4">
                                    <div>
                                        <label className="form-label">Timestamp</label>
                                        <p className="text-sm text-slate-900">
                                            {new Date(selectedLog.timestamp).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="form-label">Nivel</label>
                                        <div>
                                            <span className={`badge ${getLevelColor(selectedLog.level)}`}>
                                                {getLevelIcon(selectedLog.level)} {selectedLog.level}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label">Fuente</label>
                                        <p className="text-sm text-slate-900">{selectedLog.source}</p>
                                    </div>

                                    <div>
                                        <label className="form-label">Acción</label>
                                        <p className="text-sm text-slate-900">{selectedLog.action}</p>
                                    </div>

                                    <div>
                                        <label className="form-label">Detalles</label>
                                        <p className="text-sm text-slate-900 bg-gray-50 p-3 rounded-lg">
                                            {selectedLog.details}
                                        </p>
                                    </div>

                                    {selectedLog.user && (
                                        <div>
                                            <label className="form-label">Usuario</label>
                                            <p className="text-sm text-slate-900">{selectedLog.user}</p>
                                        </div>
                                    )}

                                    {selectedLog.ip && (
                                        <div>
                                            <label className="form-label">Dirección IP</label>
                                            <p className="text-sm text-slate-900">{selectedLog.ip}</p>
                                        </div>
                                    )}

                                    {selectedLog.userAgent && (
                                        <div>
                                            <label className="form-label">User Agent</label>
                                            <p className="text-xs text-slate-600 bg-gray-50 p-2 rounded break-all">
                                                {selectedLog.userAgent}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="card p-6 text-center">
                                <span className="text-6xl mb-4 block">📋</span>
                                <p className="text-slate-600">Selecciona un log para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>
            </SystemAdminLayout>
        </ProtectedRoute>
    );
}
