import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ShieldAlert, Clock, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../src/firebase";
import { useAppStore } from "../../src/store/useAppStore";
import { useLanguage } from "../../src/i18n/LanguageContext";

interface ProtectedRouteProps {
  requiredRole: "admin" | "agency";
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const authReady = useAppStore((s) => s.authReady);
  const authUserUid = useAppStore((s) => s.authUserUid);
  const authRole = useAppStore((s) => s.authRole);
  const currentAgency = useAppStore((s) => s.currentAgency);
  const clearData = useAppStore((s) => s.clearData);
  const location = useLocation();
  const { language } = useLanguage();
  const isEn = language === "en";

  const handleForceLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignorer si déjà déconnecté
    }
    clearData();
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#661915]" />
        <p className="mt-4 text-xs font-semibold text-slate-500">
          {isEn ? "Verifying secure session..." : "Vérification de la session sécurisée..."}
        </p>
      </div>
    );
  }

  if (!authUserUid || !authRole) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole === "admin" && authRole !== "admin") {
    return <Navigate to="/agency" replace />;
  }

  if (requiredRole === "agency" && authRole !== "agency") {
    return <Navigate to="/admin" replace />;
  }

  // Blocage strict des comptes agences en attente ou sans profil validé
  if (requiredRole === "agency") {
    const normalizedStatus = String(currentAgency?.status || "").trim().toUpperCase();
    if (!currentAgency || normalizedStatus === "PENDING" || normalizedStatus === "REJECTED") {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              {normalizedStatus === "PENDING" ? (
                <Clock className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900">
              {normalizedStatus === "PENDING"
                ? (isEn ? "Account Pending Approval" : "Compte en attente de validation")
                : (isEn ? "Access Restricted" : "Accès restreint")}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {normalizedStatus === "PENDING"
                ? (isEn
                    ? "Your agency registration is currently being reviewed by our administration. You will be notified once activated."
                    : "Votre inscription partenaire est en cours de vérification par l'administration. Votre accès B2B sera débloqué dès validation.")
                : (isEn
                    ? "Your agency profile could not be verified. Please sign out and contact support."
                    : "Votre profil agence est introuvable ou inactif. Veuillez vous déconnecter et contacter l'administration.")}
            </p>
            <button
              type="button"
              onClick={handleForceLogout}
              className="w-full h-11 bg-[#661915] hover:bg-[#4d120f] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{isEn ? "Sign Out" : "Se déconnecter"}</span>
            </button>
          </div>
        </div>
      );
    }
  }

  return <Outlet />;
}
