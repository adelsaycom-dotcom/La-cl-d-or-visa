import { useState, useMemo, useEffect, useRef, useCallback, type ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import {
  useAppStore,
  type PrestationService,
  type Application
} from "../store/useAppStore";
import { type AgencyServiceConfig } from "../constants/servicesConfig";
import {
  findFamilyByParam,
  doesServiceMatchFamily,
  computeFamilyCounts,
  resolveApplicationServiceType
} from "../utils/serviceMatching";
import {
  uploadFileToServer,
  compressImageIfPossible,
  fileToBase64
} from "../utils/fileUpload";
import { scanPassportSmart } from "../utils/passportScanner";
import { convertPdfPageToImage } from "../utils/pdfToImage";
import { getAgencyDisplayName } from "../utils/agencyName";

export interface AttachmentItem {
  id: string;
  name: string;
  category: string;
  type: string;
  size: number;
  dataUrl: string;
  url?: string;
  previewUrl?: string;
  uploadedAt: string;
  uploadedBy: "Agency";
}

export interface ApplicantFormState {
  firstName: string;
  lastName: string;
  passportNumber: string;
  dateOfBirth: string;
  expiryDate: string;
  issueDate: string;
  nationality: string;
  gender: "M" | "F";
  placeOfBirth: string;
  phone: string;
  email: string;
  address: string;
}

const INITIAL_APPLICANT: ApplicantFormState = {
  firstName: "",
  lastName: "",
  passportNumber: "",
  dateOfBirth: "",
  expiryDate: "",
  issueDate: "",
  nationality: "Algérienne",
  gender: "M",
  placeOfBirth: "",
  phone: "",
  email: "",
  address: ""
};

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

export function useVisaWizard() {
  const services = useAppStore((s) => s.services);
  const catalogLoading = useAppStore((s) => s.catalogLoading);
  const catalogLoaded = useAppStore((s) => s.catalogLoaded);
  const addApplication = useAppStore((s) => s.addApplication);
  const agencyBalance = useAppStore((s) => s.agencyBalance);
  const currentAgency = useAppStore((s) => s.currentAgency);
  const b2cMode = useAppStore((s) => s.b2cMode);
  const setB2cMode = useAppStore((s) => s.setB2cMode);
  const b2cMarginPercent = useAppStore((s) => s.b2cMarginPercent);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlServiceParam = searchParams.get("service");

  const initialService = useMemo(
    () => findFamilyByParam(urlServiceParam),
    [urlServiceParam]
  );

  const [selectedFamily, setSelectedFamily] = useState<AgencyServiceConfig | null>(initialService);
  const [step, setStep] = useState<number>(1);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<PrestationService | null>(null);
  const [detailedServiceOption, setDetailedServiceOption] = useState<PrestationService | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Étape 2: Passeport / Permis & Données Voyageur
  const [passportFile, setPassportFile] = useState<AttachmentItem | null>(null);
  const [passportPreview, setPassportPreview] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatusText, setScanStatusText] = useState<string>("");
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [scanSource, setScanSource] = useState<string>("");
  const passportInputRef = useRef<HTMLInputElement>(null);

  const [applicant, setApplicant] = useState<ApplicantFormState>(INITIAL_APPLICANT);

  // Étape 3: Pièces complémentaires & soumission
  const [attachments, setAttachments] = useState<Record<string, AttachmentItem>>({});
  const [textFields, setTextFields] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string>("");

  // Protection contre les mises à jour d'état après démontage lors des opérations asynchrones
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Synchronisation avec le paramètre d'URL
  useEffect(() => {
    setSelectedFamily(findFamilyByParam(urlServiceParam));
    setStep(1);
    setSelectedCountry("");
    setSelectedOption(null);
    setPassportFile(null);
    setPassportPreview("");
    setScanSuccess(false);
    setAttachments({});
    setTextFields({});
    setFileError("");
  }, [urlServiceParam]);

  const isPermisService = useMemo(() => {
    const famId = selectedFamily?.id || "";
    const famName = (selectedFamily?.name || "").toLowerCase();
    const optType = (selectedOption?.type || "").toLowerCase();
    const optTitle = (selectedOption?.title || "").toLowerCase();
    const urlParam = (urlServiceParam || "").toLowerCase();

    return (
      famId === "permis" ||
      famName.includes("permis") ||
      optType.includes("permis") ||
      optTitle.includes("permis") ||
      urlParam.includes("permis")
    );
  }, [selectedFamily, selectedOption, urlServiceParam]);

  // Comptage O(N) de toutes les formules actives par famille pour le hub d'accueil
  const activeFamilyCounts = useMemo(() => computeFamilyCounts(services), [services]);

  // Prestations correspondantes pour la famille sélectionnée
  const matchingServices = useMemo(() => {
    if (!selectedFamily && !urlServiceParam) return [];
    const paramLower = (urlServiceParam || "").toLowerCase().trim();

    return (services || []).filter((s) => {
      if (!s || !s.active) return false;
      if (selectedFamily) {
        return doesServiceMatchFamily(s, selectedFamily);
      }
      if (paramLower) {
        const sType = (s.type || "").toLowerCase().trim();
        return sType === paramLower || sType.includes(paramLower);
      }
      return true;
    });
  }, [services, selectedFamily, urlServiceParam]);

  // Pays éligibles
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    for (const s of matchingServices) {
      if (s.destination) countries.add(s.destination);
    }
    return Array.from(countries).sort();
  }, [matchingServices]);

  // Formules disponibles pour le pays sélectionné
  const availableOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return matchingServices.filter((s) => s.destination === selectedCountry);
  }, [matchingServices, selectedCountry]);

  const isStep2Valid = useMemo(() => {
    return (
      applicant.firstName.trim().length > 0 &&
      applicant.lastName.trim().length > 0 &&
      applicant.passportNumber.trim().length > 0
    );
  }, [applicant.firstName, applicant.lastName, applicant.passportNumber]);

  const handleSelectFamilyFromHub = useCallback(
    (srv: AgencyServiceConfig) => {
      if (srv.isExternalLink) {
        navigate(srv.path);
      } else {
        setSelectedFamily(srv);
        setSearchParams({ service: srv.name });
      }
    },
    [navigate, setSearchParams]
  );

  const handleResetToHub = useCallback(() => {
    setSelectedFamily(null);
    setSelectedCountry("");
    setSelectedOption(null);
    setSearchParams({});
  }, [setSearchParams]);

  const handlePassportUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileError("");

      if (file.size > 5 * 1024 * 1024) {
        setFileError("Le document dépasse la taille maximale autorisée de 5 Mo.");
        return;
      }

      try {
        setIsScanning(true);
        setScanSuccess(false);
        setScanProgress(15);
        setScanStatusText("Téléversement et optimisation du document...");

        let previewData = "";
        const isPdfFile =
          file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");

        if (isPdfFile) {
          setScanStatusText("Extraction de la page d'identité du PDF...");
          const converted = await convertPdfPageToImage(file);
          if (converted?.dataUrl) {
            previewData = converted.dataUrl;
          }
        }

        if (!previewData) {
          previewData = file.type.startsWith("image/")
            ? await compressImageIfPossible(file)
            : await fileToBase64(file);
        }

        if (!isMountedRef.current) return;
        setPassportPreview(previewData);

        const docLabel = isPermisService ? "Permis de Conduire" : "Passeport";
        const uploadRes = await uploadFileToServer(file, docLabel);
        if (!isMountedRef.current) return;

        const passportItem: AttachmentItem = {
          id: uploadRes.storageId || `doc_${Date.now()}`,
          name: file.name,
          category: docLabel,
          type: file.type || (isPdfFile ? "application/pdf" : "image/jpeg"),
          size: uploadRes.size,
          dataUrl: uploadRes.dataUrl,
          url: uploadRes.url,
          previewUrl: previewData || uploadRes.dataUrl,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "Agency"
        };

        setPassportFile(passportItem);
        setScanProgress(35);
        setScanStatusText(
          isPermisService
            ? "Détection des données du permis de conduire..."
            : "Détection de la zone biométrique du passeport..."
        );

        const scanResult = await scanPassportSmart(
          previewData || file,
          (status, prog) => {
            if (!isMountedRef.current) return;
            setScanStatusText(status);
            setScanProgress(prog);
          }
        );

        if (!isMountedRef.current) return;

        if (scanResult.success && scanResult.data) {
          const data = scanResult.data;
          setApplicant((prev) => ({
            ...prev,
            firstName: data.firstName || prev.firstName,
            lastName: data.lastName || prev.lastName,
            passportNumber: data.passportNumber || prev.passportNumber,
            dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
            expiryDate: data.expiryDate || prev.expiryDate,
            issueDate: data.issueDate || prev.issueDate,
            nationality: data.nationality || prev.nationality || "Algérienne",
            gender: data.gender === "F" ? "F" : "M",
            placeOfBirth: data.placeOfBirth || prev.placeOfBirth
          }));
          setScanSuccess(true);
          setScanSource(scanResult.source === "gemini" ? "ai" : "mrz");
        } else {
          setScanSuccess(false);
          setScanSource("manuel");
        }
      } catch (err: unknown) {
        if (!isMountedRef.current) return;
        const message =
          err instanceof Error
            ? err.message
            : "Impossible d'analyser automatiquement ce document. Veuillez renseigner les informations ci-dessous.";
        setFileError(message);
      } finally {
        if (isMountedRef.current) {
          setIsScanning(false);
        }
      }
    },
    [isPermisService]
  );

  const removePassport = useCallback(() => {
    setPassportFile(null);
    setPassportPreview("");
    setScanSuccess(false);
    if (passportInputRef.current) {
      passportInputRef.current.value = "";
    }
  }, []);

  const handleAdditionalFileUpload = useCallback(
    async (docName: string, e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileError("");

      if (file.size > 5 * 1024 * 1024) {
        setFileError(
          `Le fichier « ${docName} » dépasse la taille maximale autorisée de 5 Mo.`
        );
        return;
      }

      try {
        const uploadRes = await uploadFileToServer(file, docName);
        if (!isMountedRef.current) return;

        const attachment: AttachmentItem = {
          id:
            uploadRes.storageId ||
            `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          name: file.name,
          category: docName,
          type: file.type || "application/octet-stream",
          size: uploadRes.size,
          dataUrl: uploadRes.dataUrl || uploadRes.url,
          url: uploadRes.url,
          previewUrl: uploadRes.dataUrl || uploadRes.url,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "Agency"
        };

        setAttachments((prev) => ({
          ...prev,
          [docName]: attachment
        }));
      } catch (err: unknown) {
        if (!isMountedRef.current) return;
        const message =
          err instanceof Error
            ? err.message
            : `Erreur lors de l'enregistrement du fichier « ${docName} ».`;
        setFileError(message);
      }
    },
    []
  );

  const removeAttachment = useCallback((docName: string) => {
    setAttachments((prev) => {
      const next = { ...prev };
      delete next[docName];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedOption) return;

    if (agencyBalance < selectedOption.price) {
      setFileError(
        "Solde insuffisant dans votre portefeuille agence pour passer cette commande."
      );
      return;
    }

    setIsSubmitting(true);
    setFileError("");

    try {
      const allAttachmentsList: NonNullable<Application["attachments"]> = [];

      if (passportFile) {
        const hasServerFile = Boolean(passportFile.url && passportFile.url.startsWith("/api/files/"));
        allAttachmentsList.push({
          id: passportFile.id,
          name: passportFile.name,
          category: passportFile.category,
          type: passportFile.type,
          size: passportFile.size,
          storageId: passportFile.id,
          url: passportFile.url || passportFile.dataUrl,
          dataUrl: hasServerFile ? "" : (passportFile.dataUrl || passportFile.url || ""),
          uploadedAt: passportFile.uploadedAt,
          uploadedBy: "Agency"
        });
      }

      for (const att of Object.values(attachments)) {
        const hasServerFile = Boolean(att.url && att.url.startsWith("/api/files/"));
        allAttachmentsList.push({
          id: att.id,
          name: att.name,
          category: att.category,
          type: att.type,
          size: att.size,
          storageId: att.id,
          url: att.url || att.dataUrl,
          dataUrl: hasServerFile ? "" : (att.dataUrl || att.url || ""),
          uploadedAt: att.uploadedAt,
          uploadedBy: "Agency"
        });
      }

      const newAppId = `DOSS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const newApp: Application = {
        id: newAppId,
        agencyId: currentAgency?.id || auth.currentUser?.uid || "unknown",
        agencyName: getAgencyDisplayName(currentAgency, auth.currentUser?.email, "Agence Partenaire"),
        serviceType: resolveApplicationServiceType(selectedOption.type),
        country: selectedOption.destination,
        visaType: selectedOption.title,
        travelerName: `${applicant.lastName.toUpperCase()} ${applicant.firstName}`,
        passportNumber: applicant.passportNumber.toUpperCase().trim(),
        status: "Pending",
        price: selectedOption.price,
        attachments: allAttachmentsList,
        customFormData: {
          serviceId: selectedOption.id,
          applicantDetails: {
            ...applicant,
            fullName: `${applicant.lastName.toUpperCase()} ${applicant.firstName}`
          },
          textFields,
          attachmentsCount: allAttachmentsList.length
        },
        timeline: [
          {
            id: `init_${Date.now()}`,
            date: new Date().toISOString(),
            title: "Dossier soumis avec succès",
            message: `Demande créée pour ${applicant.lastName.toUpperCase()} ${applicant.firstName} avec ${allAttachmentsList.length} pièce(s) jointe(s).`,
            sender: "Agency"
          }
        ],
        submissionDate: new Date().toISOString()
      };

      await addApplication(newApp);
      if (!isMountedRef.current) return;
      setSubmittedAppId(newAppId);
      setStep(4);
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const message =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la soumission de votre dossier.";
      setFileError(message);
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [
    selectedOption,
    agencyBalance,
    currentAgency,
    passportFile,
    attachments,
    applicant,
    textFields,
    addApplication
  ]);

  const handleCreateAnother = useCallback(() => {
    setApplicant(INITIAL_APPLICANT);
    setPassportFile(null);
    setPassportPreview("");
    setAttachments({});
    setTextFields({});
    setScanSuccess(false);
    setFileError("");
    setStep(1);
  }, []);

  return {
    // Store state & actions
    agencyBalance,
    catalogLoading,
    catalogLoaded,
    b2cMode,
    setB2cMode,
    b2cMarginPercent,
    navigate,
    urlServiceParam,
    // Wizard state
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
    // Derived data
    activeFamilyCounts,
    availableCountries,
    availableOptions,
    isStep2Valid,
    // Step 2
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
    // Step 3
    attachments,
    textFields,
    setTextFields,
    fileError,
    isSubmitting,
    submittedAppId,
    // Handlers
    handleSelectFamilyFromHub,
    handleResetToHub,
    handlePassportUpload,
    removePassport,
    handleAdditionalFileUpload,
    removeAttachment,
    handleSubmit,
    handleCreateAnother
  };
}
