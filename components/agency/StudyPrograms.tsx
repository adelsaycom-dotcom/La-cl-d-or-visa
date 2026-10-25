import React, { useState, useMemo, useRef } from 'react';
import { useAppStore, StudyProgram, StudyApplication } from '../../src/store/useAppStore';
import { 
  Search, MapPin, FileText, ChevronRight, GraduationCap, 
  UploadCloud, CheckCircle2, Clock, AlertCircle, Eye, 
  Download, Loader2, ArrowLeft, Globe2, Building2, 
  Calendar, Check, ShieldCheck, Sparkles, BookOpen, User, 
  Phone, Mail, FileCheck, ExternalLink, X, Copy, Printer,
  AlertTriangle, RefreshCw, Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { auth } from '../../src/firebase';
import { useLanguage } from "../../src/i18n/LanguageContext";
import { uploadFileToServer, downloadFileSafe, resolveAttachmentData } from '../../src/utils/fileUpload';
import { DocumentPreviewModal, PreviewDocData } from '../common/DocumentPreviewModal';
import { useToast } from '../ui/toast';

// Données de secours réalistes si Firestore est vide
const DEFAULT_PRESET_PROGRAMS: StudyProgram[] = [
  {
    id: "prog_ru_1",
    title: "Faculté de Médecine Générale & Dentaire",
    country: "Russie",
    countryFlag: "🇷🇺",
    university: "Université d'État de Moscou (MGU - Lomonossov)",
    city: "Moscou",
    type: "Master",
    description: "Formation d'excellence en médecine générale en cursus bilingue (russe et anglais). Laboratoires ultramodernes et hôpitaux universitaires affiliés.",
    conditions: "Baccalauréat scientifique avec moyenne minimale de 12/20. Âge maximum 27 ans. Certificat médical complet exigé.",
    processingTime: "25 à 35 jours ouvrés",
    intake: "Septembre 2025",
    languageOfStudy: "Russe / Anglais",
    price: 65000,
    tuitionFeeYear: "4 200 $ / an",
    requiredDocuments: [
      "Scan du Passeport (validité min. 18 mois)",
      "Diplôme du Baccalauréat original",
      "Traduction officielle du Baccalauréat",
      "Relevés de notes des 3 années de lycée",
      "Photo d'identité sur fond blanc (format passeport)",
      "Certificat médical d'aptitude & Test VIH / Hépatite"
    ],
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "prog_ru_2",
    title: "Année Préparatoire Linguistique (Faculté Zéro)",
    country: "Russie",
    countryFlag: "🇷🇺",
    university: "Université Polytechnique Pierre-le-Grand de Saint-Pétersbourg",
    city: "Saint-Pétersbourg",
    type: "Préparatoire",
    description: "Apprentissage intensif de la langue russe et mise à niveau en sciences (mathématiques, physique, informatique) avant intégration en faculté.",
    conditions: "Accessible dès l'obtention du Baccalauréat toutes filières. Pas de test de langue préalable requis.",
    processingTime: "20 à 30 jours ouvrés",
    intake: "Septembre & Février",
    languageOfStudy: "Russe (Apprentissage intensif)",
    price: 45000,
    tuitionFeeYear: "2 200 $ / an",
    requiredDocuments: [
      "Scan du Passeport (validité min. 18 mois)",
      "Diplôme du Baccalauréat original",
      "Traduction officielle du Baccalauréat",
      "Photo d'identité sur fond blanc (format passeport)"
    ],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "prog_my_1",
    title: "Génie Informatique & Intelligence Artificielle",
    country: "Malaisie",
    countryFlag: "🇲🇾",
    university: "Asia Pacific University of Technology & Innovation (APU)",
    city: "Kuala Lumpur",
    type: "Bachelor",
    description: "Campus technologique de renommée mondiale, cours dispensés à 100% en anglais. Double diplôme britannique possible.",
    conditions: "Baccalauréat scientifique ou technique, niveau d'anglais intermédiaire ou test d'entrée sur place.",
    processingTime: "15 à 25 jours ouvrés",
    intake: "Mars, Juillet & Novembre",
    languageOfStudy: "Anglais",
    price: 55000,
    tuitionFeeYear: "5 500 $ / an",
    requiredDocuments: [
      "Scan du Passeport (validité min. 18 mois)",
      "Diplôme du Baccalauréat original",
      "Relevés de notes des 3 années de lycée",
      "Photo d'identité sur fond blanc (format passeport)",
      "Attestation de niveau de langue (si applicable)"
    ],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "prog_ro_1",
    title: "Faculté de Pharmacie & Odontologie",
    country: "Roumanie",
    countryFlag: "🇷🇴",
    university: "Université de Médecine et Pharmacie Iuliu Hațieganu",
    city: "Cluj-Napoca",
    type: "Master",
    description: "Diplôme d'État reconnu dans toute l'Union Européenne. Cursus en section francophone ou anglophone sans concours d'entrée.",
    conditions: "Sélection sur dossier académique. Baccalauréat avec matières scientifiques (biologie/chimie).",
    processingTime: "30 à 45 jours ouvrés",
    intake: "Octobre 2025",
    languageOfStudy: "Français / Anglais",
    price: 70000,
    tuitionFeeYear: "7 500 € / an",
    requiredDocuments: [
      "Scan du Passeport (validité min. 18 mois)",
      "Diplôme du Baccalauréat original",
      "Traduction officielle du Baccalauréat",
      "Relevés de notes des 3 années de lycée",
      "Extrait d'acte de naissance traduit",
      "Certificat médical d'aptitude & Test VIH / Hépatite"
    ],
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80",
    status: "active",
    createdAt: new Date().toISOString()
  }
];

export default function StudyPrograms() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const toast = useToast();

  const { studyPrograms, studyApplications, addStudyApplication } = useAppStore();
  const currentAgencyId = auth.currentUser?.uid || 'unknown';

  const [activeTab, setActiveTab] = useState<'programs' | 'my-applications'>('programs');

  // Navigation Étape 1 : Pays sélectionné (null = hub des pays)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [programSearchTerm, setProgramSearchTerm] = useState('');

  // Candidature sélectionnée & Modal
  const [selectedProgram, setSelectedProgram] = useState<StudyProgram | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // État du formulaire avec validation temps réel
  const [formData, setFormData] = useState({
    studentName: '',
    passportNumber: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [uploadedAttachments, setUploadedAttachments] = useState<Record<string, any>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppRef, setSubmittedAppRef] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Modal intelligent pour documents manquants (remplace confirm())
  const [missingDocsModalOpen, setMissingDocsModalOpen] = useState(false);
  const [highlightMissing, setHighlightMissing] = useState(false);

  // Prévisualisation document
  const [previewDoc, setPreviewDoc] = useState<PreviewDocData | null>(null);
  const [resolvingDocName, setResolvingDocName] = useState<string | null>(null);

  // Filtre mes candidatures
  const [myAppSearch, setMyAppSearch] = useState('');
  const [myAppStatusFilter, setMyAppStatusFilter] = useState('all');

  // Catalogue effectif
  const activePrograms = (studyPrograms && studyPrograms.length > 0)
    ? studyPrograms.filter(p => p.status === 'active')
    : DEFAULT_PRESET_PROGRAMS;

  // Validation intelligente en temps réel
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    const nameTrimmed = formData.studentName.trim();
    if (!nameTrimmed) {
      errs.studentName = "Le nom et prénom de l'étudiant sont obligatoires.";
    } else if (nameTrimmed.length < 3) {
      errs.studentName = "Veuillez saisir un nom complet d'au moins 3 caractères.";
    }

    const passTrimmed = formData.passportNumber.trim();
    if (!passTrimmed) {
      errs.passportNumber = "Le numéro de passeport est obligatoire.";
    } else if (passTrimmed.length < 6 || passTrimmed.length > 14) {
      errs.passportNumber = "Format invalide (6 à 14 caractères alphanumériques).";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = "Format d'adresse email invalide.";
      }
    }

    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/[\s\-\.]/g, '');
      if (cleanPhone.length < 8) {
        errs.phone = "Numéro de téléphone incomplet (min. 8 chiffres).";
      }
    }

    return errs;
  }, [formData]);

  // Calcul du score de complétude (0 à 100%)
  const completeness = useMemo(() => {
    if (!selectedProgram) return { percent: 0, ready: false, missingDocs: [] as string[] };
    const requiredDocs = selectedProgram.requiredDocuments || [];
    const missingDocs = requiredDocs.filter(d => !documents[d]);

    let points = 0;
    if (formData.studentName.trim().length >= 3) points += 25;
    if (formData.passportNumber.trim().length >= 6) points += 25;
    if (formData.email.trim() || formData.phone.trim()) points += 15;
    else points += 5;

    if (requiredDocs.length > 0) {
      const uploadedRatio = (requiredDocs.length - missingDocs.length) / requiredDocs.length;
      points += Math.round(uploadedRatio * 35);
    } else {
      points += 35;
    }

    const percent = Math.min(100, points);
    const ready = !errors.studentName && !errors.passportNumber && (!errors.email) && (!errors.phone);

    return { percent, ready, missingDocs };
  }, [formData, documents, selectedProgram, errors]);

  // Liste des Pays disponibles avec statistiques
  const countrySummaries = useMemo(() => {
    const map = new Map<string, { country: string; flag: string; count: number; universities: Set<string>; minPrice: number }>();
    activePrograms.forEach(p => {
      const c = p.country || "Autre";
      if (!map.has(c)) {
        map.set(c, {
          country: c,
          flag: p.countryFlag || "🎓",
          count: 0,
          universities: new Set(),
          minPrice: p.price || 0
        });
      }
      const entry = map.get(c)!;
      entry.count += 1;
      entry.universities.add(p.university);
      if (p.price && (entry.minPrice === 0 || p.price < entry.minPrice)) {
        entry.minPrice = p.price;
      }
    });

    return Array.from(map.values())
      .filter(item => item.country.toLowerCase().includes(countrySearchTerm.toLowerCase()))
      .sort((a, b) => b.count - a.count);
  }, [activePrograms, countrySearchTerm]);

  // Universités pour le pays sélectionné
  const programsForSelectedCountry = useMemo(() => {
    if (!selectedCountry) return [];
    return activePrograms.filter(p => {
      const matchCountry = p.country.toLowerCase() === selectedCountry.toLowerCase();
      const matchSearch = 
        p.university.toLowerCase().includes(programSearchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(programSearchTerm.toLowerCase()) ||
        (p.city && p.city.toLowerCase().includes(programSearchTerm.toLowerCase()));
      return matchCountry && matchSearch;
    });
  }, [activePrograms, selectedCountry, programSearchTerm]);

  // Candidatures de l'agence
  const myApplications = useMemo(() => {
    return (studyApplications || []).filter(a => 
      a.agencyId === currentAgencyId || a.agencyName === auth.currentUser?.email
    ).filter(app => {
      const matchStatus = myAppStatusFilter === 'all' || app.status === myAppStatusFilter;
      const matchSearch = 
        app.studentName.toLowerCase().includes(myAppSearch.toLowerCase()) ||
        app.passportNumber.toLowerCase().includes(myAppSearch.toLowerCase()) ||
        (app.university && app.university.toLowerCase().includes(myAppSearch.toLowerCase())) ||
        (app.country && app.country.toLowerCase().includes(myAppSearch.toLowerCase()));
      return matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }, [studyApplications, currentAgencyId, myAppSearch, myAppStatusFilter]);

  const handleOpenDoc = async (docName: string, rawUrl: string) => {
    setResolvingDocName(docName);
    try {
      const resolved = await resolveAttachmentData(rawUrl);
      const isPdf = resolved.startsWith('data:application/pdf') || docName.toLowerCase().endsWith('.pdf');
      setPreviewDoc({
        src: resolved,
        title: docName,
        type: isPdf ? 'application/pdf' : 'image/jpeg'
      });
    } catch (e) {
      console.error("Erreur prévisualisation:", e);
      toast.error("Erreur d'ouverture", "Impossible d'afficher l'aperçu du document.");
    } finally {
      setResolvingDocName(null);
    }
  };

  const handleDownloadDoc = async (docName: string, rawUrl: string) => {
    setResolvingDocName(docName);
    try {
      const resolved = await resolveAttachmentData(rawUrl);
      const ext = (resolved.startsWith('data:application/pdf') || docName.toLowerCase().endsWith('.pdf')) ? '.pdf' : '.jpg';
      const safeName = docName.endsWith(ext) ? docName : `${docName}${ext}`;
      downloadFileSafe(resolved, safeName);
      toast.success("Téléchargement démarré", `Fichier « ${safeName} » téléchargé.`);
    } catch (e) {
      console.error("Erreur téléchargement:", e);
      toast.error("Erreur", "Échec du téléchargement du fichier.");
    } finally {
      setResolvingDocName(null);
    }
  };

  const handleFileUpload = async (docName: string, file: File) => {
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Fichier trop volumineux", "Le fichier dépasse la taille maximale autorisée de 8 Mo.");
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png|webp)$/i)) {
      toast.error("Format non supporté", "Veuillez téléverser un fichier PDF ou une image (JPG, PNG).");
      return;
    }

    setUploadingDoc(docName);
    setUploadProgress(20);

    try {
      const timer = setInterval(() => {
        setUploadProgress(prev => (prev < 80 ? prev + 25 : prev));
      }, 150);

      const uploadRes = await uploadFileToServer(file, docName);
      clearInterval(timer);
      setUploadProgress(100);

      const fileData = uploadRes.dataUrl || uploadRes.url;
      setDocuments(prev => ({ ...prev, [docName]: fileData }));
      setUploadedAttachments(prev => ({
        ...prev,
        [docName]: {
          id: uploadRes.storageId,
          name: file.name,
          category: docName,
          type: file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
          size: uploadRes.size,
          dataUrl: uploadRes.dataUrl,
          url: uploadRes.url,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "Agency"
        }
      }));

      toast.success("Document vérifié", `« ${docName} » téléversé avec succès.`);
    } catch (err: any) {
      console.error("Erreur téléversement:", err);
      toast.error("Erreur de téléversement", "Impossible d'enregistrer le fichier sur le serveur.");
    } finally {
      setTimeout(() => {
        setUploadingDoc(null);
        setUploadProgress(0);
      }, 300);
    }
  };

  const handleRemoveDoc = (docName: string) => {
    setDocuments(prev => {
      const next = { ...prev };
      delete next[docName];
      return next;
    });
    setUploadedAttachments(prev => {
      const next = { ...prev };
      delete next[docName];
      return next;
    });
    toast.info("Document retiré", `La pièce « ${docName} » a été supprimée du dossier.`);
  };

  const triggerSubmit = async () => {
    if (!selectedProgram) return;

    // Marquer tous les champs comme touchés
    setTouched({ studentName: true, passportNumber: true, email: true, phone: true });

    if (errors.studentName || errors.passportNumber || errors.email || errors.phone) {
      toast.error("Formulaire incomplet", "Veuillez corriger les informations signalées en rouge avant de continuer.");
      return;
    }

    // Vérifier les pièces manquantes
    if (completeness.missingDocs.length > 0) {
      setMissingDocsModalOpen(true);
      return;
    }

    await executeSubmission();
  };

  const executeSubmission = async () => {
    if (!selectedProgram) return;

    setIsSubmitting(true);
    setMissingDocsModalOpen(false);
    try {
      const newRefId = `ETUD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await addStudyApplication({
        id: newRefId,
        programId: selectedProgram.id,
        programTitle: selectedProgram.title,
        country: selectedProgram.country,
        university: selectedProgram.university,
        city: selectedProgram.city || '',
        agencyId: currentAgencyId,
        agencyName: auth.currentUser?.email || "Mon Agence Partenaire",
        studentName: formData.studentName.trim(),
        passportNumber: formData.passportNumber.toUpperCase().trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: "Pending",
        price: selectedProgram.price || 0,
        paidAmount: 0,
        paymentStatus: 'unpaid',
        documents: documents,
        attachments: Object.values(uploadedAttachments),
        adminNotes: formData.notes?.trim() || ''
      } as any);

      setSubmittedAppRef(newRefId);
      toast.success("Candidature enregistrée !", `Dossier #${newRefId} transmis à l'administration.`);
    } catch (err: any) {
      console.error("Erreur dépôt dossier études:", err);
      toast.error("Erreur de soumission", "Une erreur est survenue lors de l'enregistrement du dossier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (!submittedAppRef) return;
    navigator.clipboard.writeText(submittedAppRef);
    setCopiedRef(true);
    toast.success("Référence copiée", `Code #${submittedAppRef} copié dans votre presse-papiers.`);
    setTimeout(() => setCopiedRef(false), 3000);
  };

  const handlePrintReceipt = () => {
    if (!selectedProgram || !submittedAppRef) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.warning("Impression bloquée", "Veuillez autoriser les fenêtres pop-up pour imprimer le récépissé.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Récépissé Officiel B2B - ${submittedAppRef}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #7B1B38; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 24px; font-weight: 900; color: #7B1B38; }
            .badge { background: #f1f5f9; padding: 6px 12px; border-radius: 8px; font-family: monospace; font-weight: bold; font-size: 13px; }
            .title { font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #0f172a; text-transform: uppercase; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px; }
            .label { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; margin-bottom: 3px; }
            .val { font-weight: 700; color: #0f172a; }
            .docs-list { margin-top: 10px; font-size: 12px; }
            .doc-item { padding: 6px 0; border-bottom: 1px dashed #cbd5e1; display: flex; justify-content: space-between; }
            .footer { margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            .signature { margin-top: 40px; display: flex; justify-content: space-between; }
            .sig-box { border: 1px dashed #cbd5e1; width: 220px; height: 90px; border-radius: 8px; padding: 10px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">VISA B2B PLATFORM</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 3px;">Pôle International & Admissions Universitaires</div>
            </div>
            <div class="badge">RÉF : ${submittedAppRef}</div>
          </div>

          <div class="title">RÉCÉPISSÉ OFFICIEL DE DÉPÔT DE CANDIDATURE</div>

          <div class="box">
            <div class="grid">
              <div>
                <div class="label">Étudiant Candidat</div>
                <div class="val" style="font-size: 15px;">${formData.studentName}</div>
              </div>
              <div>
                <div class="label">Numéro de Passeport</div>
                <div class="val" style="font-family: monospace;">${formData.passportNumber}</div>
              </div>
              <div>
                <div class="label">Université Cible</div>
                <div class="val">${selectedProgram.university} (${selectedProgram.country})</div>
              </div>
              <div>
                <div class="label">Formation & Niveau</div>
                <div class="val">${selectedProgram.title} (${selectedProgram.type})</div>
              </div>
              <div>
                <div class="label">Agence Dépositaire</div>
                <div class="val">${auth.currentUser?.email || "Mon Agence Partenaire"}</div>
              </div>
              <div>
                <div class="label">Date & Heure de Dépôt</div>
                <div class="val">${new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div class="box">
            <div class="label">Pièces Justificatives Transmises (${Object.keys(documents).length})</div>
            <div class="docs-list">
              ${Object.keys(documents).map(d => `<div class="doc-item"><span>• ${d}</span><span style="color: #10b981; font-weight: bold;">✓ Reçu conforme</span></div>`).join('')}
              ${Object.keys(documents).length === 0 ? '<div style="color: #94a3b8; font-style: italic;">Aucune pièce téléversée lors du dépôt initial.</div>' : ''}
            </div>
          </div>

          <div class="box" style="background: #ecfdf5; border-color: #a7f3d0;">
            <div class="grid">
              <div>
                <div class="label" style="color: #065f46;">Frais de Traitement Agence</div>
                <div class="val" style="font-size: 16px; color: #065f46;">${(selectedProgram.price || 0).toLocaleString()} DZD</div>
              </div>
              <div>
                <div class="label" style="color: #065f46;">Statut Financier</div>
                <div class="val" style="color: #065f46;">Règlement différé (Sans débit immédiat)</div>
              </div>
            </div>
          </div>

          <div class="signature">
            <div class="sig-box">Cachet & Signature de l'Agence</div>
            <div class="sig-box">Visa de Réception Administration</div>
          </div>

          <div class="footer">
            Document généré électroniquement par la plateforme Visa B2B. Fait foi de dépôt de dossier universitaire auprès de l'administration centrale.
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span>Admission Validée</span>
          </Badge>
        );
      case 'Processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-1">
            <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
            <span>En Traitement</span>
          </Badge>
        );
      case 'ActionRequired':
        return (
          <Badge className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2.5 py-1">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            <span>Complément Requis</span>
          </Badge>
        );
      case 'Rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-300 font-bold px-2.5 py-1">
            <X className="w-3.5 h-3.5 mr-1 text-red-600" />
            <span>Non Retenu</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border border-slate-300 font-bold px-2.5 py-1">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>Dossier Transmis</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* En-tête Espace Études */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#7B1B38] text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/10 rounded-xl">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              Admission Internationale & Visa Étudiant
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Programmes d'Études & Universités Partenaires
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed">
            Sélectionnez d'abord le pays de destination pour découvrir les universités agréées, leurs conditions d'accès spécifiques et téléverser les pièces requises pour vos étudiants.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dépôt garanti sans débit de solde</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <FileCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Délivrance de lettre d'invitation officielle</span>
            </span>
          </div>
        </div>
      </div>

      {/* Onglets : Catalogue / Mes Candidatures */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-max border border-slate-200">
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'programs'
              ? 'bg-white text-[#7B1B38] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Explorer les Universités</span>
        </button>

        <button
          onClick={() => setActiveTab('my-applications')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'my-applications'
              ? 'bg-white text-[#7B1B38] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mes Candidatures Déposées</span>
          {myApplications.length > 0 && (
            <span className="ml-1 bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {myApplications.length}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* ONGLET 1 : CATALOGUE (PAYS D'ABORD -> UNIVERSITÉS)      */}
      {/* ======================================================== */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* CAS 1 : AUCUN PAYS SÉLECTIONNÉ -> SÉLECTION DU PAYS */}
          {!selectedCountry ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-[#7B1B38]" />
                    <span>Étape 1 : Choisissez la Destination Universitaire</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cliquez sur le pays pour voir toutes les universités partenaires et leurs conditions.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Filtrer par pays..."
                    value={countrySearchTerm}
                    onChange={e => setCountrySearchTerm(e.target.value)}
                    className="h-9 pl-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Grille des Pays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {countrySummaries.map((item) => (
                  <div
                    key={item.country}
                    onClick={() => {
                      setSelectedCountry(item.country);
                      setProgramSearchTerm('');
                    }}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg hover:border-[#7B1B38]/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                          {item.flag}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full group-hover:bg-[#7B1B38]/10 group-hover:text-[#7B1B38] transition-colors">
                          {item.count} {item.count > 1 ? "Universités" : "Université"}
                        </span>
                      </div>

                      <h4 className="text-lg font-black text-slate-900 group-hover:text-[#7B1B38] transition-colors">
                        {item.country}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {Array.from(item.universities).slice(0, 2).join(' • ')}
                        {item.universities.size > 2 ? ' ...' : ''}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Frais dès</span>
                        <span className="text-sm font-black font-mono text-slate-900">
                          {item.minPrice.toLocaleString()} DZD
                        </span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#7B1B38] group-hover:text-white flex items-center justify-center transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}

                {countrySummaries.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                    <Globe2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Aucune destination trouvée</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* CAS 2 : PAYS SÉLECTIONNÉ -> LISTE DES UNIVERSITÉS DE CE PAYS */
            <div className="space-y-6">
              {/* Barre de retour et fil d'Ariane */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCountry(null)}
                    className="h-9 px-3 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Choisir un autre pays</span>
                  </Button>

                  <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {programsForSelectedCountry[0]?.countryFlag || "🎓"}
                      </span>
                      <h3 className="text-base font-black text-slate-900">
                        Universités en {selectedCountry}
                      </h3>
                      <span className="bg-[#7B1B38]/10 text-[#7B1B38] text-xs font-bold px-2 py-0.5 rounded-full">
                        {programsForSelectedCountry.length} {programsForSelectedCountry.length > 1 ? "offres disponibles" : "offre disponible"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Filtrer par université..."
                    value={programSearchTerm}
                    onChange={e => setProgramSearchTerm(e.target.value)}
                    className="h-9 pl-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Grille des Universités de ce Pays */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programsForSelectedCountry.map((prog) => (
                  <div
                    key={prog.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Photo & Localisation */}
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={prog.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80"}
                          alt={prog.university}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>

                        <div className="absolute top-3 left-3">
                          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-400" />
                            <span>{prog.city || prog.country}</span>
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="bg-[#7B1B38] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                            {prog.type}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                            {prog.languageOfStudy || "Programme Certifié"}
                          </span>
                          <h4 className="text-base font-black leading-tight text-white line-clamp-1">
                            {prog.university}
                          </h4>
                        </div>
                      </div>

                      {/* Contenu et Conditions de cette Université */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h5 className="text-xs font-black text-slate-900 leading-snug">
                            {prog.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                            {prog.description}
                          </p>
                        </div>

                        {/* Bloc Conditions d'admission spécifiques */}
                        <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Conditions d'Admission :</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                            {prog.conditions || "Baccalauréat requis. Examen du dossier académique par l'université."}
                          </p>
                          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900">
                            <span className="flex items-center gap-1 font-semibold">
                              <Clock className="w-3 h-3 text-amber-700" /> Délais :
                            </span>
                            <span className="font-bold">{prog.processingTime || "20 à 35 jours"}</span>
                          </div>
                          {prog.tuitionFeeYear && (
                            <div className="flex items-center justify-between text-[11px] text-amber-900">
                              <span className="flex items-center gap-1 font-semibold">
                                <BookOpen className="w-3 h-3 text-amber-700" /> Scolarité :
                              </span>
                              <span className="font-bold font-mono">{prog.tuitionFeeYear}</span>
                            </div>
                          )}
                        </div>

                        {/* Bloc Documents à téléverser */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                            Dossier à téléverser pour cette université ({prog.requiredDocuments?.length || 0}) :
                          </span>
                          <div className="space-y-1">
                            {(prog.requiredDocuments || []).slice(0, 4).map((doc, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium truncate">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{doc}</span>
                              </div>
                            ))}
                            {(prog.requiredDocuments?.length || 0) > 4 && (
                              <span className="text-[10px] font-bold text-slate-400 pl-4.5 block">
                                + {(prog.requiredDocuments?.length || 0) - 4} autres pièces obligatoires
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pied de Carte : Prix & Bouton Dépôt */}
                    <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Frais Traitement</span>
                        <span className="text-base font-black font-mono text-slate-900">
                          {(prog.price || 0).toLocaleString()} <span className="text-xs text-slate-500">DZD</span>
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 block">
                          Sans débit immédiat
                        </span>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedProgram(prog);
                          setSubmittedAppRef(null);
                          setDocuments({});
                          setUploadedAttachments({});
                          setFormData({ studentName: '', passportNumber: '', email: '', phone: '', notes: '' });
                          setTouched({});
                          setHighlightMissing(false);
                          setIsApplyOpen(true);
                        }}
                        className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm cursor-pointer"
                      >
                        <span>Déposer Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}

                {programsForSelectedCountry.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                    <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">Aucune université trouvée pour cette recherche</p>
                    <p className="text-xs text-slate-400 mt-0.5">Essayez avec un autre mot-clé ou sélectionnez un autre pays.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ONGLET 2 : MES CANDIDATURES ÉTUDES (SUIVI)               */}
      {/* ======================================================== */}
      {activeTab === 'my-applications' && (
        <div className="space-y-6">
          {/* Filtres Mes Candidatures */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7B1B38]" />
                <span>Suivi de vos Dossiers Étudiants</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultez l'avancement, téléchargez les attestations officielles et complétez les pièces demandées.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Recherche candidat, passeport..."
                  value={myAppSearch}
                  onChange={e => setMyAppSearch(e.target.value)}
                  className="h-9 pl-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              <select
                value={myAppStatusFilter}
                onChange={e => setMyAppStatusFilter(e.target.value)}
                className="h-9 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="Pending">En attente</option>
                <option value="Processing">En traitement</option>
                <option value="ActionRequired">Complément requis</option>
                <option value="Approved">Admission émise</option>
              </select>
            </div>
          </div>

          {/* Liste des Dossiers Soumis */}
          <div className="space-y-4">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        #{app.id}
                      </span>
                      <span className="font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                        {app.country || 'Destination'}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>
                    <h4 className="text-lg font-black text-slate-900">
                      {app.studentName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Passeport : <span className="font-mono font-bold text-slate-700">{app.passportNumber}</span> • Université : <span className="font-bold text-slate-800">{app.university || app.programTitle}</span>
                    </p>
                  </div>

                  <div className="text-right sm:border-l sm:pl-6 border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Frais de dossier</span>
                    <span className="text-base font-black font-mono text-slate-900">
                      {(app.price || 0).toLocaleString()} DZD
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 block">
                      Déposé le {new Date(app.submissionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Si la Lettre d'Admission Officielle est disponible */}
                {app.finalDocument && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-black text-xs text-emerald-900 block">
                          Lettre d'Admission Universitaire Officielle Émise !
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Le document officiel de l'université a été validé. Téléchargez-le pour la suite des démarches de visa.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDoc(app.finalDocumentName || "Lettre d'Admission", app.finalDocument!)}
                        className="h-9 px-3 text-xs font-bold text-emerald-800 border-emerald-300 bg-white hover:bg-emerald-100 rounded-xl"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> Aperçu
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadDoc(app.finalDocumentName || "Lettre d'Admission", app.finalDocument!)}
                        className="h-9 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> Télécharger l'Admission (PDF)
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pièces jointes soumises */}
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                    Pièces du dossier fournies ({Object.keys(app.documents || {}).length}) :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(app.documents || {}).map(([docName, docUrl]) => {
                      const isResolving = resolvingDocName === docName;
                      return (
                        <div
                          key={docName}
                          className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-slate-700 truncate max-w-[200px]">{docName}</span>
                          <button
                            disabled={isResolving}
                            onClick={() => handleOpenDoc(docName, docUrl)}
                            className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                            title="Aperçu"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {myApplications.length === 0 && (
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <h4 className="text-base font-black text-slate-800">Aucun dossier étudiant déposé pour le moment</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Découvrez les pays et universités disponibles dans l'onglet « Explorer les Universités » pour soumettre votre premier dossier.
                </p>
                <Button
                  onClick={() => setActiveTab('programs')}
                  className="mt-4 bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-9 px-4 rounded-xl"
                >
                  Explorer le catalogue
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : DÉPÔT DE CANDIDATURE ÉTUDIANT (INTELLIGENT)      */}
      {/* ======================================================== */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-4xl lg:max-w-5xl w-[96vw] max-h-[92vh] p-0 overflow-hidden rounded-3xl bg-slate-50 flex flex-col shadow-2xl">
          {selectedProgram && (
            <>
              {/* En-tête modal */}
              <div className="bg-[#7B1B38] text-white px-6 py-5 shrink-0 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {selectedProgram.country} • {selectedProgram.type}
                    </span>
                    {selectedProgram.city && (
                      <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-300" />
                        <span>{selectedProgram.city}</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black leading-tight">
                    {selectedProgram.university}
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    {selectedProgram.title} • Rentrée : {selectedProgram.intake || "Septembre 2025"}
                  </p>
                </div>
                <button
                  onClick={() => setIsApplyOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ÉCRAN DE SUCCÈS INTELLIGENT AVEC RÉCÉPISSÉ */}
              {submittedAppRef ? (
                <div className="p-8 text-center space-y-6 my-auto overflow-y-auto">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75 duration-300">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Confirmation Officielle d'Enregistrement
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 pt-1">
                      Dossier d'Admission Transmis avec Succès !
                    </h4>
                    <p className="text-sm text-slate-500 max-w-lg mx-auto">
                      Votre dossier pour <strong className="text-slate-800">{formData.studentName}</strong> à l'université <strong className="text-slate-800">{selectedProgram.university}</strong> a été transmis directement au pôle d'admission.
                    </p>
                  </div>

                  {/* Carte référence copiable */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 inline-block text-left max-w-md w-full space-y-3 shadow-sm">
                    <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2.5">
                      <span className="text-slate-500 font-medium">Référence Unique :</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-sm text-[#7B1B38] bg-[#7B1B38]/10 px-2.5 py-1 rounded-lg">
                          #{submittedAppRef}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyRef}
                          className="h-7 px-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                          title="Copier la référence"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          <span>{copiedRef ? "Copié !" : "Copier"}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Établissement Cible :</span>
                      <span className="font-bold text-slate-900">{selectedProgram.university} ({selectedProgram.country})</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                      <span className="text-slate-500 font-medium">Délais d'invitation estimés :</span>
                      <span className="font-bold text-slate-900">{selectedProgram.processingTime || "20 à 30 jours"}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Modalité de paiement :</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Règlement différé (Aucun débit immédiat)
                      </span>
                    </div>
                  </div>

                  {/* Actions post-dépôt */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                      onClick={handlePrintReceipt}
                      variant="outline"
                      className="h-11 px-6 text-xs font-bold rounded-xl border-slate-300 hover:bg-slate-100 text-slate-800 shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-[#7B1B38]" />
                      <span>Imprimer / Télécharger le Récépissé (PDF)</span>
                    </Button>

                    <Button
                      onClick={() => {
                        setIsApplyOpen(false);
                        setActiveTab('my-applications');
                      }}
                      className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-11 px-8 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <span>Suivre dans « Mes Candidatures »</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                /* Formulaire de dépôt en 2 Colonnes avec Validation Intelligente */
                <div className="p-6 lg:p-8 overflow-y-auto space-y-6 flex-1">
                  {/* Barre d'information & Score de complétude en temps réel */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-black text-xs text-slate-800 block">
                            Dépôt B2B Sécurisé • Aucun débit de solde immédiat
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Règlement effectué selon le suivi de facturation de votre agence.
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Complétude du Dossier
                        </span>
                        <span className={`text-sm font-black font-mono ${
                          completeness.percent === 100 ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {completeness.percent}% {completeness.percent === 100 ? "• Prêt à l'envoi" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Barre de progression animée */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          completeness.percent === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${completeness.percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLONNE GAUCHE : IDENTITÉ DE L'ÉTUDIANT & RÉCAPITULATIF */}
                    <div className="space-y-6">
                      {/* 1. Informations du Candidat avec Validation en Direct */}
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1B38] flex items-center gap-1.5">
                            <User className="w-4 h-4" /> 1. Informations du Candidat
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400">* Obligatoire</span>
                        </div>

                        <div className="space-y-3.5">
                          {/* Nom & Prénom */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs font-bold text-slate-700">Nom & Prénom de l'Étudiant *</Label>
                              {formData.studentName.trim().length >= 3 && !errors.studentName && (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Valide
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <Input
                                placeholder="Ex: BENALI Amine"
                                value={formData.studentName}
                                onBlur={() => setTouched(prev => ({ ...prev, studentName: true }))}
                                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                                className={`h-11 text-xs bg-slate-50 border rounded-xl font-bold transition-all focus:bg-white ${
                                  touched.studentName && errors.studentName
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                    : 'border-slate-200 focus:border-[#7B1B38]'
                                }`}
                              />
                              {formData.studentName.trim().length >= 3 && !errors.studentName && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              )}
                            </div>
                            {touched.studentName && errors.studentName && (
                              <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3" /> {errors.studentName}
                              </p>
                            )}
                          </div>

                          {/* Passeport */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <Label className="text-xs font-bold text-slate-700">Numéro de Passeport *</Label>
                              {formData.passportNumber.trim().length >= 6 && !errors.passportNumber && (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Valide
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <Input
                                placeholder="Ex: 21AA12345"
                                value={formData.passportNumber}
                                onBlur={() => setTouched(prev => ({ ...prev, passportNumber: true }))}
                                onChange={e => {
                                  const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                                  setFormData({ ...formData, passportNumber: sanitized });
                                }}
                                className={`h-11 text-xs bg-slate-50 border rounded-xl font-mono uppercase font-bold transition-all focus:bg-white ${
                                  touched.passportNumber && errors.passportNumber
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                    : 'border-slate-200 focus:border-[#7B1B38]'
                                }`}
                              />
                              {formData.passportNumber.trim().length >= 6 && !errors.passportNumber && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              )}
                            </div>
                            {touched.passportNumber && errors.passportNumber && (
                              <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3" /> {errors.passportNumber}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Email */}
                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700">Email de Contact</Label>
                              <Input
                                type="email"
                                placeholder="etudiant@email.com"
                                value={formData.email}
                                onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className={`h-11 text-xs bg-slate-50 border rounded-xl transition-all focus:bg-white ${
                                  touched.email && errors.email
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-slate-200 focus:border-[#7B1B38]'
                                }`}
                              />
                              {touched.email && errors.email && (
                                <p className="text-[10px] text-red-600 mt-1">{errors.email}</p>
                              )}
                            </div>

                            {/* Téléphone */}
                            <div className="space-y-1">
                              <Label className="text-xs font-bold text-slate-700">Téléphone / WhatsApp</Label>
                              <Input
                                placeholder="0550 00 00 00"
                                value={formData.phone}
                                onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                className={`h-11 text-xs bg-slate-50 border rounded-xl font-mono transition-all focus:bg-white ${
                                  touched.phone && errors.phone
                                    ? 'border-red-400 focus:border-red-500'
                                    : 'border-slate-200 focus:border-[#7B1B38]'
                                }`}
                              />
                              {touched.phone && errors.phone && (
                                <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-700">Notes & Remarques (Optionnel)</Label>
                            <Input
                              placeholder="Spécialité visée, antécédents, remarques..."
                              value={formData.notes}
                              onChange={e => setFormData({ ...formData, notes: e.target.value })}
                              className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Récapitulatif de l'Université Ciblée */}
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                          Récapitulatif de l'Offre Universitaire
                        </h4>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400">Destination :</span>
                            <span className="font-bold">{selectedProgram.country} {selectedProgram.countryFlag || "🎓"}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400">Établissement :</span>
                            <span className="font-bold">{selectedProgram.university}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400">Niveau / Type :</span>
                            <span className="font-bold">{selectedProgram.type}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-700">
                            <span className="text-slate-400">Délais d'invitation :</span>
                            <span className="font-bold">{selectedProgram.processingTime || "20 à 30 jours"}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Frais Traitement Agence</span>
                            <span className="text-xl font-black font-mono text-slate-900">
                              {(selectedProgram.price || 0).toLocaleString()} <span className="text-xs text-slate-500">DZD</span>
                            </span>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Règlement différé
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* COLONNE DROITE : TÉLÉVERSEMENT INTELLIGENT DES PIÈCES */}
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1B38] flex items-center gap-1.5">
                              <FileCheck className="w-4 h-4" /> 2. Pièces Requises par cette Université
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Formats acceptés : PDF, JPG, PNG (Max. 8 Mo par fichier).
                            </p>
                          </div>
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${
                            Object.keys(documents).length === (selectedProgram.requiredDocuments?.length || 0)
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {Object.keys(documents).length} / {selectedProgram.requiredDocuments?.length || 0}
                          </span>
                        </div>

                        {/* Liste interactive des pièces */}
                        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                          {(selectedProgram.requiredDocuments || []).map((docName) => {
                            const isUploaded = Boolean(documents[docName]);
                            const isCurrentUploading = uploadingDoc === docName;
                            const isMissing = highlightMissing && !isUploaded;

                            return (
                              <div
                                key={docName}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isUploaded
                                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                                    : isMissing
                                    ? 'bg-red-50/60 border-red-300 animate-pulse'
                                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                      isUploaded 
                                        ? 'bg-emerald-600 text-white' 
                                        : isMissing
                                        ? 'bg-red-200 text-red-700'
                                        : 'bg-slate-200 text-slate-500'
                                    }`}>
                                      {isUploaded ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                    </div>
                                    <div className="min-w-0">
                                      <span className={`text-xs block leading-tight ${
                                        isUploaded ? 'font-bold text-emerald-950' : 'font-medium text-slate-800'
                                      }`}>
                                        {docName}
                                      </span>
                                      {isUploaded ? (
                                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                                          ✓ Document prêt & validé
                                        </span>
                                      ) : isMissing ? (
                                        <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                                          Document requis manquant
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 block mt-0.5">
                                          En attente de téléversement
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                                    {isUploaded && (
                                      <>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleOpenDoc(docName, documents[docName])}
                                          className="h-8 px-2.5 text-xs font-bold text-emerald-800 border-emerald-300 bg-white hover:bg-emerald-100 rounded-xl cursor-pointer"
                                        >
                                          <Eye className="w-3.5 h-3.5 mr-1" /> Aperçu
                                        </Button>
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleRemoveDoc(docName)}
                                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 rounded-xl"
                                          title="Supprimer la pièce"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                      </>
                                    )}

                                    <div className="relative">
                                      <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleFileUpload(docName, file);
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        disabled={isCurrentUploading}
                                      />
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={isUploaded ? "ghost" : "outline"}
                                        disabled={isCurrentUploading}
                                        className={`h-8 px-3 text-xs font-bold rounded-xl cursor-pointer ${
                                          isUploaded
                                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                                            : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-xs'
                                        }`}
                                      >
                                        {isCurrentUploading ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-slate-500" />
                                        ) : (
                                          <UploadCloud className="w-3.5 h-3.5 mr-1 text-slate-500" />
                                        )}
                                        <span>{isCurrentUploading ? "Vérification..." : (isUploaded ? "Remplacer" : "Téléverser")}</span>
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {isCurrentUploading && (
                                  <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-blue-600 h-full transition-all duration-200"
                                      style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pied de modal avec boutons d'action */}
              {!submittedAppRef && (
                <div className="p-5 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => setIsApplyOpen(false)}
                    className="h-11 px-5 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Annuler
                  </Button>

                  <Button
                    onClick={triggerSubmit}
                    disabled={isSubmitting}
                    className="h-11 px-7 text-xs font-bold bg-[#7B1B38] hover:bg-[#63142c] text-white rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmission en cours...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmer & Transmettre le Dossier</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL INTELLIGENT DE CONFIRMATION SI PIÈCES MANQUANTES */}
      <Dialog open={missingDocsModalOpen} onOpenChange={setMissingDocsModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl bg-white space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">
                Pièces Obligatoires Incomplètes
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Il manque encore <strong className="text-slate-800">{completeness.missingDocs.length} document(s) requis</strong> pour cette université :
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto space-y-1.5 text-xs">
            {completeness.missingDocs.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{doc}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Souhaitez-vous compléter les pièces manquantes maintenant pour accélérer le traitement, ou transmettre le dossier en différé ?
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={() => {
                setMissingDocsModalOpen(false);
                setHighlightMissing(true);
              }}
              className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-10 px-4 rounded-xl flex-1 cursor-pointer"
            >
              Compléter les pièces
            </Button>
            <Button
              variant="outline"
              onClick={executeSubmission}
              className="border-slate-300 text-slate-700 font-bold text-xs h-10 px-4 rounded-xl flex-1 cursor-pointer"
            >
              Transmettre en différé
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lecteur de Prévisualisation universel PDF & Images */}
      <DocumentPreviewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
