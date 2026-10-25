import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title: string; message?: string; duration?: number }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let globalToastHandler: ((options: any) => void) | null = null;

export const showGlobalToast = (options: { type?: ToastType; title: string; message?: string; duration?: number }) => {
  if (globalToastHandler) {
    globalToastHandler(options);
  } else {
    console.log(`[Toast ${options.type || 'info'}]: ${options.title} - ${options.message || ''}`);
  }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((options: { type?: ToastType; title: string; message?: string; duration?: number }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration || 4500
    };

    setToasts(prev => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, [removeToast]);

  globalToastHandler = addToast;

  const success = useCallback((title: string, message?: string) => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((title: string, message?: string) => addToast({ type: 'error', title, message }), [addToast]);
  const warning = useCallback((title: string, message?: string) => addToast({ type: 'warning', title, message }), [addToast]);
  const info = useCallback((title: string, message?: string) => addToast({ type: 'info', title, message }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info }}>
      {children}

      {/* Container des toasts en superposition */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-3 sm:p-0">
        {toasts.map(t => {
          let bgClass = "bg-white border-slate-200 text-slate-800";
          let icon = <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
          let borderLeft = "border-l-4 border-l-blue-600";

          if (t.type === 'success') {
            bgClass = "bg-white border-emerald-200 text-emerald-950";
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
            borderLeft = "border-l-4 border-l-emerald-600";
          } else if (t.type === 'error') {
            bgClass = "bg-white border-red-200 text-red-950";
            icon = <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />;
            borderLeft = "border-l-4 border-l-red-600";
          } else if (t.type === 'warning') {
            bgClass = "bg-white border-amber-200 text-amber-950";
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
            borderLeft = "border-l-4 border-l-amber-600";
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-2xl border shadow-xl p-4 flex items-start justify-between gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 ${bgClass} ${borderLeft}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                {icon}
                <div className="min-w-0">
                  <h5 className="font-black text-xs leading-snug">{t.title}</h5>
                  {t.message && (
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-medium">
                      {t.message}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: showGlobalToast,
      success: (title: string, message?: string) => showGlobalToast({ type: 'success', title, message }),
      error: (title: string, message?: string) => showGlobalToast({ type: 'error', title, message }),
      warning: (title: string, message?: string) => showGlobalToast({ type: 'warning', title, message }),
      info: (title: string, message?: string) => showGlobalToast({ type: 'info', title, message }),
    };
  }
  return context;
}
