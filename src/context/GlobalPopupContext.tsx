import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type PopupKind = 'success' | 'error' | 'info';

export interface PopupToast {
  id: number;
  kind: PopupKind;
  message: string;
}

interface GlobalPopupContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const GlobalPopupContext = createContext<GlobalPopupContextValue | null>(null);

/**
 * Module-level bridge so code outside the React tree (e.g. the axios
 * interceptor) can trigger a toast without needing access to context.
 */
type ExternalShowFn = (kind: PopupKind, message: string) => void;
let externalShow: ExternalShowFn | null = null;

export function emitGlobalPopup(kind: PopupKind, message: string): void {
  if (externalShow) {
    externalShow(kind, message);
  } else {
    // Provider not mounted yet; fall back to console so errors aren't silent.
    console.warn(`[popup:${kind}]`, message);
  }
}

const KIND_STYLES: Record<PopupKind, string> = {
  success: 'bg-green-600 border-green-700',
  error: 'bg-red-600 border-red-700',
  info: 'bg-blue-600 border-blue-700',
};

const KIND_ICON: Record<PopupKind, string> = {
  success: '✅',
  error: '⚠️',
  info: 'ℹ️',
};

export function GlobalPopupProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<PopupToast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: PopupKind, message: string) => {
      const id = idRef.current++;
      setToasts((prev) => [...prev, { id, kind, message }]);
      window.setTimeout(() => dismiss(id), 3000);
    },
    [dismiss],
  );

  externalShow = push;

  const value: GlobalPopupContextValue = {
    showSuccess: (message: string) => push('success', message),
    showError: (message: string) => push('error', message),
    showInfo: (message: string) => push('info', message),
  };

  return (
    <GlobalPopupContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[90vw]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`text-white text-sm rounded-lg shadow-lg border px-4 py-3 flex items-start gap-2 animate-[fadeIn_0.2s_ease-out] ${KIND_STYLES[toast.kind]}`}
          >
            <span>{KIND_ICON[toast.kind]}</span>
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="text-white/80 hover:text-white leading-none"
              aria-label="Đóng thông báo"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </GlobalPopupContext.Provider>
  );
}

export function useGlobalPopup(): GlobalPopupContextValue {
  const ctx = useContext(GlobalPopupContext);
  if (!ctx) {
    throw new Error('useGlobalPopup must be used within a GlobalPopupProvider');
  }
  return ctx;
}
