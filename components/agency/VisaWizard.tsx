import {
  ChevronRight, ChevronLeft, MapPin, Clock,
  FileText, CheckCircle2, AlertCircle, Upload, User,
  ScanLine, Loader2, Trash2, Calendar, ShieldCheck,
  Phone, Mail, FileCheck, ArrowRight, Car, Eye, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { parseConditionsList } from "../../src/utils/conditions";
import { computeB2cPricing } from "../../src/utils/serviceMatching";
import { AGENCY_SERVICES } from "../../src/constants/servicesConfig";
import { useLanguage } from "../../src/i18n/LanguageContext";
import { useVisaWizard, formatFileSize } from "../../src/hooks/useVisaWizard";
import { CountryFlag } from "../common/CountryFlag";

export function VisaWizard() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const {
    agencyBalance,
    catalogLoading,
    catalogLoaded,
    b2cMode,
    setB2cMode,
    b2cMarginPercent,
    navigate,
    urlServiceParam,
    selectedFamily,
    step,
    setStep,
    selectedCountry,
    setSelectedCountry,
    selectedOption,
    setSelectedOption,
    detailedServiceOption,
    setDetailedServiceOption,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isPermisService,
    activeFamilyCounts,
    availableCountries,
    availableOptions,
    isStep2Valid,
    passportFile,
    passportPreview,
    isScanning,
    scanProgress,
    scanStatusText,
    scanSuccess,
    scanSource,
    passportInputRef,
    applicant,
    setApplicant,
    attachments,
    textFields,
    setTextFields,
    fileError,
    isSubmitting,
    submittedAppId,
    handleSelectFamilyFromHub,
    handleResetToHub,
    handlePassportUpload,
    removePassport,
    handleAdditionalFileUpload,
    removeAttachment,
    handleSubmit,
    handleCreateAnother
  } = useVisaWizard();

  // ==========================================
  // HUB : Sélection parmi toutes les familles
  // ==========================================
  const renderServiceHub = () => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-[#661915]/10 text-[#661915] font-bold text-xs uppercase tracking-wider mb-3">
            {isEn ? "B2B Multi-Service Catalog • La Clé d'Or" : "Catalogue B2B Multi-Services • La Clé d'Or"}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {isEn ? "What service would you like to process today?" : "Que souhaitez-vous traiter aujourd'hui ?"}
          </h2>
          <p className="text-slate-500 font-medium">
            {isEn
              ? "Choose the consular or administrative procedure category to initiate for your traveler."
              : "Choisissez la famille de prestations consulaire ou administrative à initier pour votre client."}
          </p>
        </div>

        {/* Quick B2C mode notice */}
        <div className="relative z-10 flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setB2cMode(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !b2cMode
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {isEn ? "B2B Wholesale View" : "Vue B2B (Solde)"}
          </button>
          <button
            type="button"
            onClick={() => setB2cMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              b2cMode
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-emerald-700"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>
              {isEn
                ? `Client Desk View (+${b2cMarginPercent}%)`
                : `Comptoir B2C (+${b2cMarginPercent}%)`}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {AGENCY_SERVICES.map((srv) => {
          const matchingCount = activeFamilyCounts[srv.id]?.active || 0;

          return (
            <div
              key={srv.id}
              onClick={() => handleSelectFamilyFromHub(srv)}
              className={`group bg-white rounded-3xl border-2 ${srv.borderColor} p-5 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${srv.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}
                  >
                    <srv.icon className="w-6 h-6" />
                  </div>
                  <Badge className="bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wide uppercase">
                    {isEn ? srv.badgeEn || srv.badge : srv.badge}
                  </Badge>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-[#661915] transition-colors mb-1.5 leading-tight">
                  {isEn ? srv.nameEn || srv.name : srv.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3 line-clamp-2">
                  {isEn ? srv.descriptionEn || srv.description : srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-[11px] font-semibold text-slate-400">
                  {srv.isExternalLink
                    ? isEn
                      ? "Direct Access"
                      : "Accès direct"
                    : matchingCount > 0
                    ? isEn
                      ? `${matchingCount} package(s)`
                      : `${matchingCount} formule(s)`
                    : isEn
                    ? "Browse countries"
                    : "Consulter pays"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#661915] group-hover:translate-x-1 transition-transform">
                  {isEn ? "Open" : "Ouvrir"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  // ==========================================
  // ÉTAPE 1 : Destination & Formule de service
  // ==========================================
  const renderStep1 = () => {
    if (!selectedFamily && !urlServiceParam) {
      return renderServiceHub();
    }

    const currentFamilyTitle = isEn
      ? selectedFamily?.nameEn || selectedFamily?.name || urlServiceParam || "Service"
      : selectedFamily?.name || urlServiceParam || "Demande";

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="space-y-8"
      >
        {/* Navigation bar entre le Hub et le wizard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToHub}
              className="rounded-xl border-slate-200 hover:bg-slate-100 text-xs font-bold gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> {isEn ? "All services" : "Toutes les prestations"}
            </Button>
            <Badge className="bg-[#661915]/10 text-[#661915] font-bold text-xs uppercase tracking-wider">
              {currentFamilyTitle}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              {isEn ? "Display:" : "Affichage :"}
            </span>
            <button
              type="button"
              onClick={() => setB2cMode(!b2cMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                b2cMode
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>
                {b2cMode
                  ? isEn
                    ? `Client Desk (+${b2cMarginPercent}%)`
                    : `Comptoir B2C (+${b2cMarginPercent}%)`
                  : isEn
                  ? "Raw B2B Rates"
                  : "Tarifs B2B Bruts"}
              </span>
            </button>
          </div>
        </div>

        {!selectedCountry ? (
          <div>
            <div className="text-center mb-8">
              <Badge className="bg-[#661915]/10 text-[#661915] font-bold text-xs uppercase tracking-wider mb-2">
                {isEn ? "Step 1 of 3 • Destination" : "Étape 1 sur 3 • Destination"}
              </Badge>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {isEn ? "Where is your client travelling?" : "Où voyage votre client ?"}
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                {isEn
                  ? "Select destination country for requests of type "
                  : "Sélectionnez le pays de destination pour les demandes de type "}
                <strong className="text-[#661915]">{currentFamilyTitle}</strong>.
              </p>
            </div>

            {catalogLoading && !catalogLoaded && availableCountries.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
                <Loader2 className="w-10 h-10 mx-auto mb-3 text-[#661915] animate-spin" />
                <p className="font-bold text-base text-slate-800">
                  {isEn ? "Loading destinations..." : "Chargement des destinations..."}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isEn ? "Syncing available packages." : "Synchronisation des formules disponibles."}
                </p>
              </div>
            ) : availableCountries.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="font-semibold text-lg text-slate-700">
                  {isEn ? "No active destination at this time" : "Aucune destination active pour le moment"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {isEn
                    ? "Our consular teams regularly publish new packages."
                    : "Nos équipes consulaires publient régulièrement de nouvelles formules."}
                </p>
                <Button
                  onClick={handleResetToHub}
                  className="mt-6 bg-[#661915] hover:bg-[#4d120f] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isEn ? "View other available services" : "Voir les autres services disponibles"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {availableCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => setSelectedCountry(country)}
                    className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#661915] hover:shadow-xl hover:shadow-[#661915]/10 hover:-translate-y-1 transition-all text-center relative overflow-hidden cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#661915]/10 transition-all shadow-sm">
                      <CountryFlag country={country} size="xl" />
                    </div>
                    <span className="font-black text-slate-900 text-lg group-hover:text-[#661915] transition-colors">
                      {country}
                    </span>
                    <span className="text-xs text-slate-400 font-medium mt-1">
                      {isEn ? "Click to view packages" : "Cliquez pour voir les formules"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedCountry("")}
                  className="rounded-xl border-slate-200 hover:bg-slate-100 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </Button>
                <div>
                  <Badge className="bg-[#661915]/10 text-[#661915] font-bold text-xs uppercase tracking-wider mb-1">
                    {isEn ? `Destination: ${selectedCountry}` : `Destination : ${selectedCountry}`}
                  </Badge>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {isEn ? "Choose your package" : "Choisissez votre formule"}
                  </h2>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => setSelectedCountry("")}
                className="text-xs text-slate-500 hover:text-[#661915] cursor-pointer"
              >
                {isEn ? "Change country" : "Changer de pays"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableOptions.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                const { clientPrice } = computeB2cPricing(Number(opt.price || 0), b2cMarginPercent);
                const cardConditions = parseConditionsList(opt.conditions);

                return (
                  <div
                    key={opt.id}
                    className={`bg-white border-2 rounded-3xl p-6 flex flex-col transition-all shadow-sm relative ${
                      isSelected
                        ? "border-[#661915] ring-4 ring-[#661915]/10 shadow-lg"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-[#661915]/10 text-[#661915] font-bold">
                        {opt.type}
                      </Badge>
                      <div className="text-right">
                        {b2cMode ? (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {isEn ? "Client Public Rate" : "Tarif Public Client"}
                            </span>
                            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                              {Number(clientPrice || 0).toLocaleString()} <span className="text-xs">DZD</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {isEn ? "B2B Rate" : "Tarif B2B"}
                            </span>
                            <div className="text-2xl font-black text-[#661915] font-mono mt-1">
                              {Number(opt.price || 0).toLocaleString()} <span className="text-xs">DZD</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2">{opt.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>
                        {isEn ? "Average processing time:" : "Délai moyen :"}{" "}
                        <strong>{opt.processingTime || (isEn ? "48h to 72h" : "48h à 72h")}</strong>
                      </span>
                    </div>

                    {opt.description && (
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{opt.description}</p>
                    )}

                    {cardConditions.length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 mb-5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-black text-amber-950 uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            {isEn ? "Key Conditions" : "Conditions Clés"}
                          </span>
                          <span className="text-[10px] text-amber-800 bg-amber-100/90 font-bold px-1.5 py-0.5 rounded-md font-mono">
                            {cardConditions.length}{" "}
                            {cardConditions.length > 1
                              ? isEn
                                ? "reqs"
                                : "critères"
                              : isEn
                              ? "req"
                              : "critère"}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-amber-900 leading-relaxed line-clamp-2">
                          {cardConditions[0]}
                        </p>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setDetailedServiceOption(opt);
                          setIsDetailModalOpen(true);
                        }}
                        className="h-12 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isEn ? "Details" : "Détails"}</span>
                      </Button>

                      <Button
                        onClick={() => {
                          setSelectedOption(opt);
                          setStep(2);
                        }}
                        className="h-12 text-xs font-black rounded-xl bg-[#661915] hover:bg-[#4d120f] text-white shadow-md shadow-[#661915]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>{isEn ? "Select" : "Choisir"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL : FICHE PRODUIT / DÉTAILS DE LA FORMULE SÉLECTIONNÉE */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="w-[96vw] max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col border-0">
            {detailedServiceOption && (
              <div className="flex flex-col h-full overflow-hidden">
                {/* En-tête */}
                <div className="bg-[#661915] text-white p-6 shrink-0 relative">
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <CountryFlag country={detailedServiceOption.destination} size="md" />
                    <Badge className="bg-white/20 text-white border-0 font-bold text-xs">
                      {detailedServiceOption.type}
                    </Badge>
                    <span className="text-white/80 text-xs font-semibold">
                      • {detailedServiceOption.destination}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black leading-tight text-white">
                    {detailedServiceOption.title}
                  </h3>
                </div>

                {/* Corps défilant */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isEn ? "B2B Rate" : "Tarif B2B Débité"}
                      </span>
                      <div className="text-2xl font-black font-mono text-[#661915] mt-0.5">
                        {Number(detailedServiceOption.price || 0).toLocaleString()}{" "}
                        <span className="text-xs font-bold text-slate-500">DZD</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {isEn ? "Processing Time" : "Délai Consulaire"}
                      </span>
                      <div className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#661915]" />
                        <span>{detailedServiceOption.processingTime || "24h à 48h"}</span>
                      </div>
                    </div>
                  </div>

                  {detailedServiceOption.description && (
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                        {isEn ? "Description" : "Description de la formule"}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium">
                        {detailedServiceOption.description}
                      </p>
                    </div>
                  )}

                  {(() => {
                    const parsedConditions = parseConditionsList(detailedServiceOption.conditions);
                    if (parsedConditions.length === 0) return null;

                    return (
                      <div className="bg-gradient-to-br from-amber-50/90 via-amber-50/50 to-orange-50/40 p-5 rounded-3xl border border-amber-200/90 shadow-xs space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase tracking-wider">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                            </div>
                            <span>
                              {isEn
                                ? "Conditions & Eligibility Criteria"
                                : "Conditions & Critères d'Éligibilité"}
                            </span>
                          </div>
                          <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                            {parsedConditions.length}{" "}
                            {parsedConditions.length > 1
                              ? isEn
                                ? "criteria"
                                : "critères"
                              : isEn
                              ? "criterion"
                              : "critère"}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {parsedConditions.map((cond, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 rounded-2xl bg-white/95 border border-amber-100/90 shadow-2xs hover:border-amber-300/80 transition-colors"
                            >
                              <div className="w-5 h-5 rounded-full bg-amber-500/15 text-amber-900 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono">
                                {i + 1}
                              </div>
                              <p className="text-xs text-slate-800 font-medium leading-relaxed flex-1">
                                {cond}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-800/80 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            {isEn
                              ? "Make sure these requirements are verified before submitting."
                              : "Veillez à vérifier la conformité de ces exigences avant la soumission."}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>
                        {isEn ? "Required Documents" : "Pièces Justificatives Obligatoires"} (
                        {detailedServiceOption.requiredDocuments?.length || 0})
                      </span>
                    </h4>
                    <div className="space-y-1.5">
                      {(
                        detailedServiceOption.requiredDocuments || [
                          "Scan du Passeport",
                          "Photo d'identité"
                        ]
                      ).map((docItem, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{docItem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pied de modal avec CTA Choisir */}
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="h-11 text-xs font-bold rounded-xl border-slate-200 cursor-pointer"
                  >
                    {isEn ? "Close" : "Fermer"}
                  </Button>

                  <Button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedOption(detailedServiceOption);
                      setStep(2);
                    }}
                    className="h-11 px-6 bg-[#661915] hover:bg-[#4d120f] text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isEn ? "Choose This Package" : "Choisir cette formule"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    );
  };

  // ==========================================
  // ÉTAPE 2 : Passeport & Données Intelligentes
  // ==========================================
  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header étape 2 */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStep(1)}
            className="rounded-xl border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </Button>
          <div>
            <Badge className="bg-[#661915]/10 text-[#661915] font-bold text-xs uppercase tracking-wider mb-1">
              {isEn ? "Step 2 of 3 • Smart Processing" : "Étape 2 sur 3 • Analyse Intelligente"}
            </Badge>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isPermisService
                ? isEn
                  ? "Driving License & Holder Details"
                  : "Permis de Conduire & Coordonnées"
                : isEn
                ? "Passport & Traveler Information"
                : "Passeport & Coordonnées du Voyageur"}
            </h2>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <div className="text-xs text-slate-400 font-bold uppercase">
            {isEn ? "Selected package" : "Formule sélectionnée"}
          </div>
          <div className="font-black text-slate-800">
            {selectedOption?.title} ({selectedCountry})
          </div>
        </div>
      </div>

      {fileError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{fileError}</p>
        </div>
      )}

      {/* Zone de Dépôt Passeport / Permis */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#661915]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6 relative z-10">
          <div>
            <p className="inline-flex items-center gap-1.5 text-rose-300 text-xs font-bold tracking-[0.12em] uppercase mb-2">
              <ScanLine className="w-3.5 h-3.5 animate-pulse" />
              {isPermisService
                ? isEn
                  ? "Secure Registration & Driving License Scan"
                  : "Enregistrement Sécurisé & Scan Permis de Conduire"
                : isEn
                ? "Secure Registration & Passport Data"
                : "Enregistrement Sécurisé & Données Passeport"}
            </p>
            <h3 className="text-xl md:text-2xl font-black">
              {isPermisService
                ? isEn
                  ? "Upload or scan driving license"
                  : "Déposez ou scannez le permis de conduire"
                : isEn
                ? "Upload or scan passport"
                : "Déposez ou scannez le passeport"}
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              {isPermisService
                ? isEn
                  ? "Upload the driving license (photo or PDF scan). The document is saved and attached to the application, and personal details are filled automatically."
                  : "Déposez le permis de conduire (photo nette ou scan PDF). Le document est sauvegardé et rattaché à la demande, et les coordonnées sont pré-remplies automatiquement."
                : isEn
                ? "Upload the passport identity page (clear photo or PDF scan). The document is saved and attached to the application, allowing you to review or complete the information below."
                : "Déposez la page d'identité du passeport (photo nette ou scan PDF). Le document est sauvegardé et rattaché à la demande, vous permettant de vérifier ou compléter les coordonnées ci-dessous."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {isEn
              ? "Allowed formats: JPG, PNG, PDF (max 5 MB)"
              : "Formats autorisés : JPG, PNG, PDF (max 5 Mo)"}
          </div>
        </div>

        {/* Zone de Drop ou Résultat */}
        {!passportFile ? (
          <div className="relative z-10">
            <input
              ref={passportInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handlePassportUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div className="border-2 border-dashed border-slate-700 hover:border-[#661915] bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[180px]">
              <div className="w-16 h-16 bg-[#661915]/20 text-[#661915] rounded-2xl flex items-center justify-center mb-4">
                {isPermisService ? <Car className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
              </div>
              <p className="font-bold text-base text-white">
                {isPermisService
                  ? isEn
                    ? "Drag & drop driving license photo or scan here"
                    : "Glissez-déposez la photo ou le scan du permis de conduire ici"
                  : isEn
                  ? "Drag & drop passport photo or scan here"
                  : "Glissez-déposez la photo ou le scan du passeport ici"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isEn
                  ? "or click to browse files from your computer"
                  : "ou cliquez pour parcourir les fichiers de votre ordinateur"}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80">
            {isScanning ? (
              <div className="py-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[#661915]/30 border-t-[#661915] animate-spin flex items-center justify-center"></div>
                  <ScanLine className="w-5 h-5 text-rose-400 absolute inset-0 m-auto" />
                </div>
                <h4 className="font-bold text-base text-white">
                  {isPermisService
                    ? isEn
                      ? "Driving license scanning in progress..."
                      : "Analyse du permis de conduire en cours..."
                    : isEn
                    ? "Biometric passport scanning in progress..."
                    : "Analyse biométrique du passeport en cours..."}
                </h4>
                <p className="text-slate-300 text-xs mt-1.5 font-medium">
                  {scanStatusText ||
                    (isEn
                      ? "Reading and extracting information automatically..."
                      : "Lecture et extraction automatique des informations...")}
                </p>

                <div className="w-full bg-slate-700/60 rounded-full h-2 mt-4 overflow-hidden border border-slate-600">
                  <div
                    className="bg-gradient-to-r from-[#661915] to-emerald-500 h-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(10, Math.min(100, scanProgress))}%` }}
                  />
                </div>
                <div className="flex justify-between items-center w-full mt-1.5 text-[10px] text-slate-400">
                  <span>{isEn ? "Optical Extraction Engine" : "Moteur d'extraction optique"}</span>
                  <span className="font-mono font-bold text-white">{scanProgress}%</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-14 h-14 bg-[#661915]/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/30 overflow-hidden">
                    {passportFile.type.includes("pdf") ? (
                      <FileText className="w-7 h-7 text-rose-400" />
                    ) : (
                      <img
                        src={passportPreview || passportFile.dataUrl}
                        alt="Aperçu document"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm truncate max-w-[220px] sm:max-w-xs">
                        {passportFile.name}
                      </p>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px]">
                        {formatFileSize(passportFile.size)}
                      </Badge>
                    </div>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {scanSource === "ai"
                        ? isEn
                          ? "Document scanned by AI • Details auto-filled"
                          : "Document analysé par IA • Coordonnées pré-remplies"
                        : scanSource === "mrz"
                        ? isEn
                          ? "Optical scan successful • Details auto-filled"
                          : "Lecture optique réussie • Coordonnées pré-remplies"
                        : isEn
                        ? "Document saved successfully • Details editable"
                        : "Document enregistré avec succès • Coordonnées modifiables"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removePassport}
                    className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-rose-400 rounded-xl text-xs gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {isEn ? "Replace" : "Remplacer"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message de succès automatique */}
      {scanSuccess && !isScanning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-emerald-900 text-sm">
                {isEn ? "Document successfully decoded!" : "Document décodé avec succès !"}
              </h4>
              <Badge className="bg-emerald-600 text-white border-none text-[10px] px-2 py-0.5">
                {scanSource === "ai"
                  ? isEn
                    ? "Smart AI Engine"
                    : "Moteur IA Intelligent"
                  : isEn
                  ? "ICAO MRZ Optical Engine"
                  : "Moteur Optique MRZ ICAO"}
              </Badge>
            </div>
            <p className="text-xs text-emerald-800 mt-1">
              {isEn
                ? "Holder details (Last name, First name, Document No, Dates) were extracted and filled in the form. You can adjust them anytime below."
                : "Les coordonnées du titulaire (Nom, Prénom, N° Document, Dates) ont été extraites et injectées dans le formulaire. Vous pouvez les ajuster à tout moment ci-dessous."}
            </p>
            {applicant.passportNumber && (
              <div className="mt-2.5 flex items-center gap-3 text-xs bg-emerald-100/60 p-2 rounded-xl text-emerald-950 font-medium">
                <span>
                  {isPermisService
                    ? isEn
                      ? "License No:"
                      : "N° Permis :"
                    : isEn
                    ? "Passport No:"
                    : "N° Passeport :"}{" "}
                  <strong className="font-mono font-bold text-emerald-900">
                    {applicant.passportNumber}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  {isEn ? "Holder:" : "Titulaire :"}{" "}
                  <strong>
                    {applicant.lastName} {applicant.firstName}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Formulaire des données personnelles du voyageur */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#661915]" />{" "}
            {isEn ? "Traveler personal information" : "Informations personnelles du voyageur"}
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isEn ? "100% Editable" : "100% Modifiable"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              {isEn ? "Last Name" : "Nom de famille"} <span className="text-red-500">*</span>
            </Label>
            <Input
              value={applicant.lastName}
              onChange={(e) =>
                setApplicant({ ...applicant, lastName: e.target.value.toUpperCase() })
              }
              className="h-11 rounded-xl uppercase font-bold text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
              placeholder="Ex: BENALI"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              {isEn ? "First Name(s)" : "Prénom(s)"} <span className="text-red-500">*</span>
            </Label>
            <Input
              value={applicant.firstName}
              onChange={(e) => setApplicant({ ...applicant, firstName: e.target.value })}
              className="h-11 rounded-xl font-bold text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
              placeholder="Ex: Mohamed Amine"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              {isPermisService
                ? isEn
                  ? "Driving License Number"
                  : "Numéro de Permis de Conduire"
                : isEn
                ? "Passport Number"
                : "Numéro de Passeport"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              value={applicant.passportNumber}
              onChange={(e) =>
                setApplicant({
                  ...applicant,
                  passportNumber: e.target.value.toUpperCase().replace(/\s+/g, "")
                })
              }
              className="h-11 rounded-xl uppercase font-mono font-black text-slate-900 border-slate-200 tracking-wider focus-visible:ring-[#661915]"
              placeholder={isPermisService ? "Ex: 191245678" : "Ex: 214589632"}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
              {isEn ? "Date of Birth" : "Date de naissance"}
            </Label>
            <Input
              type="date"
              value={applicant.dateOfBirth}
              onChange={(e) => setApplicant({ ...applicant, dateOfBirth: e.target.value })}
              className="h-11 rounded-xl text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />{" "}
              {isPermisService
                ? isEn
                  ? "License Expiration Date"
                  : "Date d'expiration du permis"
                : isEn
                ? "Passport Expiration Date"
                : "Date d'expiration du passeport"}
            </Label>
            <Input
              type="date"
              value={applicant.expiryDate}
              onChange={(e) => setApplicant({ ...applicant, expiryDate: e.target.value })}
              className="h-11 rounded-xl text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              {isEn ? "Gender" : "Sexe / Genre"}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setApplicant({ ...applicant, gender: "M" })}
                className={`h-11 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                  applicant.gender === "M"
                    ? "bg-[#661915] text-white border-[#661915] shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {isEn ? "Male (M)" : "Homme (M)"}
              </button>
              <button
                type="button"
                onClick={() => setApplicant({ ...applicant, gender: "F" })}
                className={`h-11 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                  applicant.gender === "F"
                    ? "bg-[#661915] text-white border-[#661915] shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {isEn ? "Female (F)" : "Femme (F)"}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              {isEn ? "Nationality" : "Nationalité"}
            </Label>
            <Input
              value={applicant.nationality}
              onChange={(e) => setApplicant({ ...applicant, nationality: e.target.value })}
              className="h-11 rounded-xl text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
              placeholder={isEn ? "Ex: Algerian" : "Ex: Algérienne"}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              {isEn ? "Place of Birth" : "Lieu de naissance"}
            </Label>
            <Input
              value={applicant.placeOfBirth}
              onChange={(e) => setApplicant({ ...applicant, placeOfBirth: e.target.value })}
              className="h-11 rounded-xl text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
              placeholder="Ex: Alger"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />{" "}
              {isEn ? "Contact Phone" : "Téléphone de contact"}
            </Label>
            <Input
              value={applicant.phone}
              onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
              className="h-11 rounded-xl text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
              placeholder="Ex: 0550 12 34 56"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />{" "}
              {isEn ? "Email Address" : "Adresse courriel"}
            </Label>
            <Input
              type="email"
              value={applicant.email}
              onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
              className="h-11 rounded-xl text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
              placeholder="client@domaine.com"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs font-bold text-slate-700">
              {isEn ? "Residential Address / City" : "Adresse / Commune de résidence"}
            </Label>
            <Input
              value={applicant.address}
              onChange={(e) => setApplicant({ ...applicant, address: e.target.value })}
              className="h-11 rounded-xl text-slate-800 border-slate-200 focus-visible:ring-[#661915]"
              placeholder="Ex: Bab El Oued, Alger"
            />
          </div>
        </div>

        {/* Bouton de validation vers étape 3 */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep(1)}
            className="text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {isEn ? "Back to Step 1" : "Retour à l'étape 1"}
          </Button>

          <Button
            disabled={!isStep2Valid}
            onClick={() => setStep(3)}
            className="h-12 px-8 bg-[#661915] hover:bg-[#4d120f] text-white font-black text-sm rounded-xl shadow-md shadow-[#661915]/20 flex items-center gap-2 cursor-pointer"
          >
            {isEn ? "Continue to Attachments" : "Continuer vers les Pièces Jointes"}{" "}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  // ==========================================
  // ÉTAPE 3 : Pièces requises & Récapitulatif
  // ==========================================
  const renderStep3 = () => {
    const b2cPricing = selectedOption
      ? computeB2cPricing(selectedOption.price, b2cMarginPercent)
      : { clientPrice: 0, marginAmount: 0 };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        {/* Header étape 3 */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setStep(2)}
              className="rounded-xl border-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </Button>
            <div>
              <Badge className="bg-[#661915]/10 text-[#661915] font-bold text-xs uppercase tracking-wider mb-1">
                {isEn
                  ? "Step 3 of 3 • Attachments & Confirmation"
                  : "Étape 3 sur 3 • Pièces Jointes & Confirmation"}
              </Badge>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEn
                  ? "Required Documents & Wallet Debit"
                  : "Justificatifs requis & Débit portefeuille"}
              </h2>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <div className="text-xs text-slate-400 font-bold uppercase">
              {isEn ? "Traveler" : "Voyageur"}
            </div>
            <div className="font-black text-slate-800">
              {applicant.lastName} {applicant.firstName}
            </div>
          </div>
        </div>

        {fileError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{fileError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche (2/3) : Liste des pièces complémentaires */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#661915]" />{" "}
                  {isEn ? "Supporting documents to attach" : "Documents justificatifs à joindre"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isEn
                    ? "All files (JPG, PNG or PDF scans up to 5 MB) are securely transmitted and directly accessible by consular staff."
                    : "Tous les fichiers (scans JPG, PNG ou PDF jusqu'à 5 Mo) sont transmis de manière sécurisée et directement accessibles par l'administration consulaire."}
                </p>
              </div>

              {/* Document d'identité résumé */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {isPermisService
                        ? isEn
                          ? "Driving License"
                          : "Permis de conduire"
                        : isEn
                        ? "Biometric passport"
                        : "Passeport biométrique"}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      N° {applicant.passportNumber}{" "}
                      {passportFile ? `(${formatFileSize(passportFile.size)})` : ""}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#661915] hover:bg-[#661915]/10 cursor-pointer"
                >
                  {isEn ? "Edit" : "Modifier"}
                </Button>
              </div>

              {/* Pièces dynamiques requises selon l'option */}
              {!selectedOption?.requiredDocuments ||
              selectedOption.requiredDocuments.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-700">
                    {isEn
                      ? "No additional documents required"
                      : "Aucun autre document supplémentaire n'est requis"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isEn
                      ? "The document registered in the previous step is sufficient to process this request."
                      : "Le document enregistré à l'étape précédente suffit pour traiter cette demande."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedOption.requiredDocuments.map((req) => {
                    const isTextField =
                      req.toLowerCase().includes("(texte)") ||
                      req.toLowerCase().includes("(text)");
                    const cleanName = req.replace(/\((texte|text)\)/i, "").trim();

                    if (isTextField) {
                      return (
                        <div
                          key={req}
                          className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200"
                        >
                          <Label className="text-xs font-bold text-slate-800">
                            {cleanName} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            className="h-11 bg-white rounded-xl border-slate-200"
                            placeholder={
                              isEn
                                ? `Enter ${cleanName.toLowerCase()}...`
                                : `Renseigner ${cleanName.toLowerCase()}...`
                            }
                            value={textFields[req] || ""}
                            onChange={(e) =>
                              setTextFields((prev) => ({ ...prev, [req]: e.target.value }))
                            }
                          />
                        </div>
                      );
                    }

                    const uploadedDoc = attachments[req];

                    return (
                      <div
                        key={req}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span>{req}</span>
                            <span className="text-red-500">*</span>
                          </Label>
                          <span className="text-[10px] font-semibold text-slate-400">
                            PDF, JPG, PNG (Max 5 Mo)
                          </span>
                        </div>

                        {!uploadedDoc ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              onChange={(e) => handleAdditionalFileUpload(req, e)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex items-center justify-between p-3.5 border-2 border-dashed border-slate-300 hover:border-[#661915] bg-white rounded-xl transition-all cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                  <Upload className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-medium text-slate-600">
                                  {isEn
                                    ? "Click or drag document here"
                                    : "Cliquer ou glisser le document ici"}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs rounded-lg pointer-events-none"
                              >
                                {isEn ? "Select" : "Sélectionner"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-300 shadow-xs">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                {uploadedDoc.type.includes("pdf") ? (
                                  <FileText className="w-5 h-5 text-rose-500" />
                                ) : (
                                  <CheckCircle2 className="w-5 h-5" />
                                )}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                                  {uploadedDoc.name}
                                </p>
                                <p className="text-[10px] text-emerald-600 font-medium">
                                  {isEn ? "Ready" : "Prêt"} • {formatFileSize(uploadedDoc.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(req)}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite (1/3) : Récapitulatif financier & Débit */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#661915]/30 rounded-full blur-2xl pointer-events-none"></div>

              <h3 className="text-lg font-black mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#661915]" />{" "}
                {isEn ? "Order Summary" : "Récapitulatif Commande"}
              </h3>

              <div className="space-y-4 text-xs text-slate-300 mb-6">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">{isEn ? "Service" : "Service"}</span>
                  <span className="font-bold text-white text-right">{selectedOption?.title}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">{isEn ? "Destination" : "Destination"}</span>
                  <span className="font-bold text-white text-right">{selectedCountry}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">{isEn ? "Traveler" : "Voyageur"}</span>
                  <span className="font-bold text-white uppercase text-right">
                    {applicant.lastName} {applicant.firstName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">
                    {isPermisService
                      ? isEn
                        ? "License No"
                        : "Permis"
                      : isEn
                      ? "Passport"
                      : "Passeport"}
                  </span>
                  <span className="font-mono font-bold text-white text-right">
                    {applicant.passportNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">
                    {isEn ? "Attachments" : "Pièces jointes"}
                  </span>
                  <span className="font-bold text-emerald-400 text-right">
                    {(passportFile ? 1 : 0) + Object.keys(attachments).length}{" "}
                    {isEn ? "document(s)" : "document(s)"}
                  </span>
                </div>
              </div>

              {/* Solde & Total */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 mb-6 space-y-3">
                {b2cMode && selectedOption && (
                  <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/80 mb-2 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-300 font-medium">
                        {isEn
                          ? `Client billed price (+${b2cMarginPercent}%):`
                          : `Prix facturé au client (+${b2cMarginPercent}%) :`}
                      </span>
                      <span className="font-mono font-bold text-emerald-300">
                        {b2cPricing.clientPrice.toLocaleString()} DZD
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-medium">
                        {isEn ? "Your net commercial margin:" : "Votre marge commerciale nette :"}
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        +{b2cPricing.marginAmount.toLocaleString()} DZD
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">
                    {isEn ? "Current wallet balance:" : "Solde portefeuille actuel :"}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {Number(agencyBalance || 0).toLocaleString()} DZD
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">
                    {isEn ? "Net debit on balance:" : "Débit net sur votre solde :"}
                  </span>
                  <span className="font-mono font-bold text-rose-400">
                    - {Number(selectedOption?.price || 0).toLocaleString()} DZD
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">
                    {isEn ? "Remaining balance after debit:" : "Solde restant après validation :"}
                  </span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      agencyBalance >= (selectedOption?.price || 0)
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {(Number(agencyBalance || 0) - Number(selectedOption?.price || 0)).toLocaleString()} DZD
                  </span>
                </div>
              </div>

              <Button
                disabled={isSubmitting || agencyBalance < (selectedOption?.price || 0)}
                onClick={handleSubmit}
                className="w-full h-14 bg-[#661915] hover:bg-[#4d120f] text-white font-black text-base rounded-2xl shadow-lg shadow-[#661915]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isEn ? "Submitting application..." : "Transmission du dossier..."}
                  </>
                ) : (
                  <>
                    {isEn ? "Debit & Submit Application" : "Débiter et Soumettre le dossier"}{" "}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              {agencyBalance < (selectedOption?.price || 0) && (
                <p className="text-[11px] text-center text-rose-400 mt-3 font-semibold">
                  {isEn
                    ? "Insufficient balance. Please top up your agency wallet."
                    : "Solde insuffisant. Veuillez recharger votre portefeuille agence."}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ==========================================
  // ÉTAPE 4 : Confirmation Réussie
  // ==========================================
  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 max-w-xl mx-auto"
    >
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-mono text-xs uppercase mb-3">
        {isEn ? `Application No. ${submittedAppId}` : `Dossier N° ${submittedAppId}`}
      </Badge>

      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
        {isEn ? "Application Submitted Successfully!" : "Dossier Transmis avec Succès !"}
      </h2>
      <p className="text-slate-600 text-base leading-relaxed mb-8">
        {isEn
          ? `The application for ${applicant.lastName} ${applicant.firstName} has been registered and transmitted to our consular team. All attached documents and passport data are now accessible for processing.`
          : `La demande pour ${applicant.lastName} ${applicant.firstName} a bien été enregistrée et transmise à notre équipe consulaire. L'ensemble des pièces jointes et des informations sont désormais accessibles pour instruction.`}
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 mb-8 flex justify-around">
        <div>
          <span className="text-slate-400 block font-semibold">
            {isEn ? "Debited Amount" : "Montant Débité"}
          </span>
          <strong className="text-slate-900 font-mono text-sm">
            {Number(selectedOption?.price || 0).toLocaleString()} DZD
          </strong>
        </div>
        <div className="border-r border-slate-200"></div>
        <div>
          <span className="text-slate-400 block font-semibold">
            {isEn ? "New Balance" : "Nouveau Solde"}
          </span>
          <strong className="text-[#661915] font-mono text-sm">
            {Number(agencyBalance || 0).toLocaleString()} DZD
          </strong>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={() => navigate("/agency/applications")}
          variant="outline"
          className="h-12 px-6 font-bold rounded-xl border-slate-300 hover:bg-slate-100 cursor-pointer"
        >
          {isEn ? "Go to Applications Tracking" : "Accéder au Suivi des Dossiers"}
        </Button>
        <Button
          onClick={handleCreateAnother}
          className="h-12 px-6 bg-[#661915] hover:bg-[#4d120f] text-white font-bold rounded-xl shadow-md shadow-[#661915]/20 cursor-pointer"
        >
          {isEn ? "Create Another Application" : "Créer un Nouveau Dossier"}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Barre de progression 3 étapes */}
      {step < 4 && (
        <div className="mb-10 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#661915] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            />

            {[
              { num: 1, title: isEn ? "Destination & Package" : "Destination & Offre" },
              {
                num: 2,
                title: isPermisService
                  ? isEn
                    ? "License & Holder"
                    : "Permis & Titulaire"
                  : isEn
                  ? "Passport & Traveler"
                  : "Passeport & Voyageur"
              },
              { num: 3, title: isEn ? "Documents & Payment" : "Pièces & Validation" }
            ].map((item) => {
              const isPassed = step > item.num;
              const isCurrent = step === item.num;

              return (
                <div key={item.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                      isPassed
                        ? "bg-slate-900 text-white shadow-md"
                        : isCurrent
                        ? "bg-[#661915] text-white shadow-lg shadow-[#661915]/30 scale-110"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : item.num}
                  </div>
                  <span
                    className={`text-xs mt-2 font-bold transition-colors hidden sm:block ${
                      isCurrent
                        ? "text-[#661915]"
                        : isPassed
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rendu dynamique des étapes */}
      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </AnimatePresence>
    </div>
  );
}
