import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function isChunkLoadError(err: unknown): boolean {
  const msg = err instanceof Error ? `${err.name} ${err.message}` : String(err || "");
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Loading chunk .* failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg)
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  scoped?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary a intercepté une erreur d'exécution:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const chunkErr = isChunkLoadError(this.state.error);
      return (
        <div className={`${this.props.scoped ? "min-h-[420px] py-12" : "min-h-screen"} bg-slate-50 flex flex-col items-center justify-center p-6 text-center`}>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {chunkErr ? "Actualisation requise" : "Incident d'affichage temporaire"}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {chunkErr
                ? "Une nouvelle version de la plateforme a été déployée. Rechargez la page pour charger les derniers modules."
                : "Une erreur inattendue s'est produite dans ce module. Vous pouvez réessayer ou recharger la page."}
            </p>
            {this.state.error?.message && !chunkErr && (
              <div className="text-[11px] font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-500 break-words">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              {!chunkErr && (
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Réessayer
                </button>
              )}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 h-11 bg-[#661915] hover:bg-[#4d120f] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
