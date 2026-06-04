import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => { } });

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
    return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++nextId;
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div
                className="fixed top-4 right-4 z-100 flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)] pointer-events-none"
                aria-live="polite"
                aria-label="Notifications"
            >
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

const icons: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
};

const styles: Record<ToastType, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles: Record<ToastType, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 4500);
        return () => clearTimeout(timer);
    }, [onClose]);

    const Icon = icons[toast.type];

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 ${styles[toast.type]} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
            role="status"
        >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconStyles[toast.type]}`} />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Fermer"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
