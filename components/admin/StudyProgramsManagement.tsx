import React, { useState, useMemo } from 'react';
import { useAppStore, StudyProgram, StudyApplication } from '../../src/store/useAppStore';
import { 
  Plus, Edit, Trash2, MapPin, Search, GraduationCap, 
  FileText, CheckCircle, Clock, XCircle, File, Settings, 
  CreditCard, List, CheckCircle2, X, Eye, Download, 
  Globe2, Building2, Calendar, Award, ArrowLeft, Upload,
  DollarSign, AlertCircle, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useLanguage } from '../../src/i18n/LanguageContext';
import { DocumentPreviewModal, PreviewDocData } from '../common/DocumentPreviewModal';
import { resolveAttachmentData, downloadFileSafe, uploadFileToServer } from '../../src/utils/fileUpload';
import { useToast } from '../ui/toast';

// Documents types fréquemment demandés par les universités
const STANDARD_DOCUMENTS = [
  "Scan du Passeport (validité min. 18 mois)",
  "Diplôme du Baccalauréat original",
  "Traduction officielle du Baccalauréat",
  "Relevés de notes des 3 années de lycée",
  "Traduction officielle des relevés de notes",
  "Photo d'identité sur fond blanc (format passeport)",
  "Certificat médical d'aptitude & Test VIH / Hépatite",
  "Attestation de niveau de langue (si applicable)",
  "Extrait d'acte de naissance traduit",
  "Lettre de motivation"
];

// Destinations populaires par défaut si le catalogue est vide
const DEFAULT_PRESET_PROGRAMS: Omit<StudyProgram, 'id' | 'createdAt'>[] = [
  {
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
    status: "active"
  },
  {
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
    status: "active"
  },
  {
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
    status: "active"
  },
  {
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
    status: "active"
  }
];

export default function StudyProgramsManagement() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const { 
    studyPrograms, 
    studyApplications, 
    addStudyProgram, 
    updateStudyProgram, 
    deleteStudyProgram, 
    updateStudyApplicationStatus,
    updateStudyApplicationPayment,
    updateStudyApplication
  } = useAppStore();

  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'programs' | 'applications'>('programs');

  // Filtre de Pays pour les programmes
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [programSearchTerm, setProgramSearchTerm] = useState('');

  // Formulaire d'ajout / modification de programme
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProgId, setEditingProgId] = useState<string | null>(null);

  // Confirmation de suppression in-app
  const [programToDelete, setProgramToDelete] = useState<{ id: string; university: string; title: string } | null>(null);

  const [newProgram, setNewProgram] = useState<Partial<StudyProgram>>({
    title: '',
    country: '',
    countryFlag: '🎓',
    university: '',
    city: '',
    type: 'Bachelor',
    description: '',
    conditions: '',
    processingTime: '20 à 30 jours ouvrés',
    intake: 'Septembre 2025',
    languageOfStudy: 'Français / Anglais',
    price: 50000,
    tuitionFeeYear: '',
    requiredDocuments: [
      "Scan du Passeport (validité min. 18 mois)",
      "Diplôme du Baccalauréat original",
      "Traduction officielle du Baccalauréat",
      "Relevés de notes des 3 années de lycée"
    ],
    status: 'active',
    image: ''
  });

  const [customDocInput, setCustomDocInput] = useState('');
  const [formError, setFormError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtres Candidatures
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [appCountryFilter, setAppCountryFilter] = useState('all');
  const [appUnivFilter, setAppUnivFilter] = useState('all');
  const [appStatusFilter, setAppStatusFilter] = useState('all');

  // Modal d'instruction d'un dossier
  const [selectedApp, setSelectedApp] = useState<StudyApplication | null>(null);
  const [isAppDetailsOpen, setIsAppDetailsOpen] = useState(false);
  const [paymentInput, setPaymentInput] = useState<number>(0);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [uploadingFinalDoc, setUploadingFinalDoc] = useState(false);

  // Prévisualisation document
  const [previewDoc, setPreviewDoc] = useState<PreviewDocData | null>(null);
  const [resolvingDocName, setResolvingDocName] = useState<string | null>(null);

  // Initialisation automatique des programmes si la liste est vide
  const allPrograms = studyPrograms.length > 0 ? studyPrograms : (DEFAULT_PRESET_PROGRAMS as StudyProgram[]);

  // Liste unique de tous les pays représentés
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    allPrograms.forEach(p => { if (p.country) set.add(p.country); });
    return Array.from(set).sort();
  }, [allPrograms]);

  // Liste des universités par pays pour le filtre
  const availableUniversitiesForApp = useMemo(() => {
    const list = studyApplications
      .filter(a => appCountryFilter === 'all' || a.country === appCountryFilter)
      .map(a => a.university || 'Non spécifié')
      .filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [studyApplications, appCountryFilter]);

  // Programmes filtrés
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(prog => {
      const matchCountry = selectedCountryFilter === 'all' || prog.country.toLowerCase() === selectedCountryFilter.toLowerCase();
      const matchSearch = 
        prog.title.toLowerCase().includes(programSearchTerm.toLowerCase()) ||
        prog.university.toLowerCase().includes(programSearchTerm.toLowerCase()) ||
        (prog.city && prog.city.toLowerCase().includes(programSearchTerm.toLowerCase())) ||
        prog.country.toLowerCase().includes(programSearchTerm.toLowerCase());
      return matchCountry && matchSearch;
    });
  }, [allPrograms, selectedCountryFilter, programSearchTerm]);

  // Candidatures filtrées
  const filteredApplications = useMemo(() => {
    return (studyApplications || []).filter(app => {
      const matchCountry = appCountryFilter === 'all' || (app.country && app.country.toLowerCase() === appCountryFilter.toLowerCase());
      const matchUniv = appUnivFilter === 'all' || app.university === appUnivFilter;
      const matchStatus = appStatusFilter === 'all' || app.status === appStatusFilter;
      const matchSearch = 
        app.studentName.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
        app.passportNumber.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
        app.agencyName.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(appSearchTerm.toLowerCase());
      return matchCountry && matchUniv && matchStatus && matchSearch;
    });
  }, [studyApplications, appCountryFilter, appUnivFilter, appStatusFilter, appSearchTerm]);

  // Stats candidatures
  const appStats = useMemo(() => {
    const total = studyApplications.length;
    const pending = studyApplications.filter(a => a.status === 'Pending').length;
    const processing = studyApplications.filter(a => a.status === 'Processing').length;
    const approved = studyApplications.filter(a => a.status === 'Approved').length;
    const actionRequired = studyApplications.filter(a => a.status === 'ActionRequired').length;
    const totalRevenue = studyApplications.reduce((acc, a) => acc + (a.price || 0), 0);
    const totalCollected = studyApplications.reduce((acc, a) => acc + (a.paidAmount || 0), 0);
    return { total, pending, processing, approved, actionRequired, totalRevenue, totalCollected };
  }, [studyApplications]);

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
      console.error("Erreur ouverture doc:", e);
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
    } catch (e) {
      console.error("Erreur téléchargement doc:", e);
    } finally {
      setResolvingDocName(null);
    }
  };

  const handleSaveProgram = async () => {
    setFormError('');
    if (!newProgram.country?.trim()) {
      setFormError("Veuillez sélectionner ou renseigner le Pays.");
      return;
    }
    if (!newProgram.university?.trim()) {
      setFormError("Veuillez renseigner le nom de l'Université.");
      return;
    }
    if (!newProgram.title?.trim()) {
      setFormError("Veuillez renseigner le titre du programme.");
      return;
    }
    if (newProgram.price === undefined || newProgram.price < 0) {
      setFormError("Veuillez renseigner un tarif valide en DZD.");
      return;
    }

    setIsSubmitting(true);
    try {
      const progPayload: any = {
        title: newProgram.title.trim(),
        country: newProgram.country.trim(),
        countryFlag: newProgram.countryFlag || '🎓',
        university: newProgram.university.trim(),
        city: newProgram.city?.trim() || '',
        type: newProgram.type || 'Bachelor',
        description: newProgram.description?.trim() || '',
        conditions: newProgram.conditions?.trim() || '',
        processingTime: newProgram.processingTime?.trim() || '20 à 30 jours',
        intake: newProgram.intake?.trim() || 'Septembre 2025',
        languageOfStudy: newProgram.languageOfStudy?.trim() || 'Français / Anglais',
        price: Number(newProgram.price),
        tuitionFeeYear: newProgram.tuitionFeeYear?.trim() || '',
        requiredDocuments: newProgram.requiredDocuments || [],
        image: newProgram.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
        status: newProgram.status || 'active'
      };

      if (editingProgId) {
        await updateStudyProgram(editingProgId, progPayload);
        toast.success(`Le programme "${progPayload.university}" a été mis à jour avec succès !`);
      } else {
        await addStudyProgram(progPayload);
        toast.success(`Nouveau programme universitaire ajouté : "${progPayload.university}" !`);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsAddOpen(false);
        setEditingProgId(null);
      }, 1200);
    } catch (err: any) {
      console.error("Erreur enregistrement programme:", err);
      setFormError("Erreur lors de l'enregistrement du programme.");
      toast.error("Impossible d'enregistrer le programme. Veuillez vérifier les champs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (prog: StudyProgram) => {
    setEditingProgId(prog.id);
    setNewProgram({
      title: prog.title,
      country: prog.country,
      countryFlag: prog.countryFlag || '🎓',
      university: prog.university,
      city: prog.city || '',
      type: prog.type,
      description: prog.description,
      conditions: prog.conditions || '',
      processingTime: prog.processingTime || '20 à 30 jours',
      intake: prog.intake || 'Septembre 2025',
      languageOfStudy: prog.languageOfStudy || 'Français / Anglais',
      price: prog.price,
      tuitionFeeYear: prog.tuitionFeeYear || '',
      requiredDocuments: prog.requiredDocuments || [],
      status: prog.status,
      image: prog.image
    });
    setIsAddOpen(true);
  };

  const confirmDeleteProgram = async () => {
    if (!programToDelete) return;
    try {
      await deleteStudyProgram(programToDelete.id);
      toast.info(`Programme "${programToDelete.university}" supprimé du catalogue.`);
      setProgramToDelete(null);
    } catch (err) {
      toast.error("Erreur lors de la suppression du programme.");
    }
  };

  const handleAddCustomDoc = () => {
    if (!customDocInput.trim()) return;
    const trimmed = customDocInput.trim();
    if (!newProgram.requiredDocuments?.includes(trimmed)) {
      setNewProgram(prev => ({
        ...prev,
        requiredDocuments: [...(prev.requiredDocuments || []), trimmed]
      }));
      toast.info(`Pièce ajoutée : ${trimmed}`);
    }
    setCustomDocInput('');
  };

  const handleUploadFinalDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedApp) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Le fichier dépasse la taille maximale autorisée (15 Mo).");
      return;
    }

    setUploadingFinalDoc(true);
    try {
      const uploadRes = await uploadFileToServer(file, `Lettre_Admission_${selectedApp.studentName.replace(/\s+/g, '_')}`);
      const fileUrl = uploadRes.dataUrl || uploadRes.url;
      await updateStudyApplication(selectedApp.id, {
        finalDocument: fileUrl,
        finalDocumentName: file.name,
        finalDocumentDate: new Date().toISOString(),
        status: "Approved"
      });
      setSelectedApp(prev => prev ? ({
        ...prev,
        finalDocument: fileUrl,
        finalDocumentName: file.name,
        finalDocumentDate: new Date().toISOString(),
        status: "Approved"
      }) : null);
      toast.success(`Lettre d'admission transmise avec succès ! Statut passé à "Validé".`);
    } catch (err: any) {
      console.error("Erreur téléversement lettre d'admission:", err);
      toast.error("Échec du téléversement de la lettre d'admission.");
    } finally {
      setUploadingFinalDoc(false);
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedApp || paymentInput <= 0) return;
    try {
      await updateStudyApplicationPayment(selectedApp.id, paymentInput);
      const newPaid = (selectedApp.paidAmount || 0) + paymentInput;
      const newStatus = newPaid >= selectedApp.price ? 'paid' : 'partial';
      setSelectedApp(prev => prev ? ({ ...prev, paidAmount: newPaid, paymentStatus: newStatus }) : null);
      toast.success(`Paiement de ${paymentInput.toLocaleString()} DZD enregistré avec succès !`);
      setPaymentInput(0);
    } catch (err) {
      console.error("Erreur enregistrement règlement:", err);
      toast.error("Erreur lors de l'enregistrement du règlement.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1">
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span>Admission Émise</span>
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
            <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
            <span>Rejeté</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border border-slate-300 font-bold px-2.5 py-1">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>En Attente</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* En-tête Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[#7B1B38]/10 text-[#7B1B38] rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </span>
            <span className="text-xs font-black tracking-wider uppercase text-[#7B1B38] bg-[#7B1B38]/10 px-2.5 py-0.5 rounded-full">
              Pôle International B2B
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestion des Visas Études & Universités
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configurez les universités partenaires par Pays et instruisez les dossiers étudiants transmis par vos agences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditingProgId(null);
              setNewProgram({
                title: '',
                country: selectedCountryFilter !== 'all' ? selectedCountryFilter : '',
                countryFlag: '🎓',
                university: '',
                city: '',
                type: 'Bachelor',
                description: '',
                conditions: '',
                processingTime: '20 à 30 jours ouvrés',
                intake: 'Septembre 2025',
                languageOfStudy: 'Français / Anglais',
                price: 50000,
                tuitionFeeYear: '',
                requiredDocuments: [
                  "Scan du Passeport (validité min. 18 mois)",
                  "Diplôme du Baccalauréat original",
                  "Traduction officielle du Baccalauréat",
                  "Relevés de notes des 3 années de lycée"
                ],
                status: 'active',
                image: ''
              });
              setIsAddOpen(true);
            }}
            className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Université / Offre</span>
          </Button>
        </div>
      </div>

      {/* Navigation des 2 Onglets Principaux */}
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
          <span>1. Universités & Offres par Pays</span>
          <span className="ml-1 bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {allPrograms.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-white text-[#7B1B38] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Dossiers Étudiants Transmis</span>
          {appStats.pending > 0 && (
            <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {appStats.pending}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* ONGLET 1 : CATALOGUE PAR PAYS & UNIVERSITÉS              */}
      {/* ======================================================== */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* Sélecteur de Pays en amont (Approche hiérarchique demandée) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#7B1B38]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Sélectionnez un Pays pour filtrer les Universités :
                </span>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={programSearchTerm}
                  onChange={e => setProgramSearchTerm(e.target.value)}
                  placeholder="Rechercher université, ville, diplôme..."
                  className="h-9 pl-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <button
                onClick={() => setSelectedCountryFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedCountryFilter === 'all'
                    ? 'bg-[#7B1B38] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>🌍 Tous les pays</span>
                <span className="text-[10px] opacity-80 font-mono">({allPrograms.length})</span>
              </button>

              {availableCountries.map(country => {
                const count = allPrograms.filter(p => p.country === country).length;
                const isSelected = selectedCountryFilter === country;
                return (
                  <button
                    key={country}
                    onClick={() => setSelectedCountryFilter(country)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#7B1B38] text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{country}</span>
                    <span className="text-[10px] opacity-80 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grille des Universités / Programmes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo du campus & badges */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={prog.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80"}
                    alt={prog.university}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1">
                      <span>{prog.countryFlag || "🎓"}</span>
                      <span>{prog.country}</span>
                    </span>
                    {prog.city && (
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span>{prog.city}</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      prog.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                    }`}>
                      {prog.status === 'active' ? 'Actif' : 'Brouillon'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      {prog.type}
                    </span>
                    <h3 className="text-base font-black leading-tight line-clamp-1 text-white">
                      {prog.university}
                    </h3>
                  </div>
                </div>

                {/* Contenu & Détails */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                        {prog.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {prog.description || "Aucune description renseignée."}
                      </p>
                    </div>

                    {/* Conditions & Délais */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" /> Délais invitation :
                        </span>
                        <span className="font-semibold text-slate-800">{prog.processingTime || "20 à 30 jours"}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-500" /> Rentrée :
                        </span>
                        <span className="font-semibold text-slate-800">{prog.intake || "Septembre 2025"}</span>
                      </div>
                      {prog.conditions && (
                        <div className="pt-1 border-t border-slate-200 text-slate-600">
                          <span className="font-bold text-slate-700 block">Conditions :</span>
                          <span className="text-[10px] line-clamp-2 text-slate-500">{prog.conditions}</span>
                        </div>
                      )}
                    </div>

                    {/* Documents exigés */}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Pièces obligatoires ({prog.requiredDocuments?.length || 0}) :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(prog.requiredDocuments || []).slice(0, 3).map((doc, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                            • {doc}
                          </span>
                        ))}
                        {(prog.requiredDocuments?.length || 0) > 3 && (
                          <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                            +{(prog.requiredDocuments?.length || 0) - 3} autres
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prix B2B & Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Frais Traitement B2B</span>
                      <span className="text-base font-black font-mono text-slate-900">
                        {(prog.price || 0).toLocaleString()} <span className="text-xs text-slate-500">DZD</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(prog)}
                        className="h-8 px-2.5 text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        <span>Modifier</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setProgramToDelete({ id: prog.id, university: prog.university, title: prog.title })}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Supprimer ce programme"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredPrograms.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
                <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-black text-slate-800">Aucune université trouvée pour ce filtre</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Ajoutez une nouvelle université ou sélectionnez une autre destination dans la barre de filtres.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ONGLET 2 : CANDIDATURES ÉTUDIANTES (PAR PAYS & UNIV)     */}
      {/* ======================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Cartes KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Total Dossiers</span>
              <span className="text-2xl font-black text-slate-900 font-mono">{appStats.total}</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-[11px] font-bold text-amber-700 uppercase block">En Attente</span>
              <span className="text-2xl font-black text-amber-900 font-mono">{appStats.pending}</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <span className="text-[11px] font-bold text-blue-700 uppercase block">En Traitement</span>
              <span className="text-2xl font-black text-blue-900 font-mono">{appStats.processing}</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-700 uppercase block">Admissions Validées</span>
              <span className="text-2xl font-black text-emerald-900 font-mono">{appStats.approved}</span>
            </div>
          </div>

          {/* Filtres par Pays, Université et Statut */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Filtre Pays */}
              <div>
                <Label className="text-[11px] font-bold text-slate-600 block mb-1">Filtrer par Pays :</Label>
                <Select value={appCountryFilter} onValueChange={setAppCountryFilter}>
                  <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold">
                    <SelectValue placeholder="Tous les pays" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="all">🌍 Tous les Pays</SelectItem>
                    {availableCountries.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre Université */}
              <div>
                <Label className="text-[11px] font-bold text-slate-600 block mb-1">Filtrer par Université :</Label>
                <Select value={appUnivFilter} onValueChange={setAppUnivFilter}>
                  <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold">
                    <SelectValue placeholder="Toutes les universités" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="all">🏛️ Toutes les Universités</SelectItem>
                    {availableUniversitiesForApp.map(u => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre Statut */}
              <div>
                <Label className="text-[11px] font-bold text-slate-600 block mb-1">Filtrer par Statut :</Label>
                <Select value={appStatusFilter} onValueChange={setAppStatusFilter}>
                  <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="all">Tous les Statuts</SelectItem>
                    <SelectItem value="Pending">En Attente</SelectItem>
                    <SelectItem value="Processing">En Traitement</SelectItem>
                    <SelectItem value="ActionRequired">Complément Requis</SelectItem>
                    <SelectItem value="Approved">Admission Émise</SelectItem>
                    <SelectItem value="Rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Barre de recherche */}
              <div>
                <Label className="text-[11px] font-bold text-slate-600 block mb-1">Recherche Candidat :</Label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={appSearchTerm}
                    onChange={e => setAppSearchTerm(e.target.value)}
                    placeholder="Nom, passeport, agence..."
                    className="h-9 pl-8 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des Candidatures */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Réf & Candidat</th>
                    <th className="py-3.5 px-5">Pays & Université</th>
                    <th className="py-3.5 px-5">Agence Partenaire</th>
                    <th className="py-3.5 px-5 text-right">Frais & Règlement</th>
                    <th className="py-3.5 px-5 text-center">Statut Dossier</th>
                    <th className="py-3.5 px-5 text-right">Instruction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((app) => {
                    const isPaid = (app.paidAmount || 0) >= (app.price || 0) && (app.price || 0) > 0;
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-mono text-[10px] font-bold text-slate-400 block">
                            #{app.id.substring(0, 10)}
                          </span>
                          <span className="font-bold text-slate-900 text-sm block">
                            {app.studentName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Passeport : {app.passportNumber}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700 mb-1">
                            {app.country || 'Destination'}
                          </span>
                          <span className="font-bold text-slate-800 block text-xs">
                            {app.university || app.programTitle || 'Programme Universitaire'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Déposé le {new Date(app.submissionDate).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <span className="font-bold text-slate-800 block">
                            {app.agencyName || 'Agence B2B'}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {app.email}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {app.phone}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <span className="font-mono font-black text-slate-900 text-sm block">
                            {(app.price || 0).toLocaleString()} DZD
                          </span>
                          {isPaid ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              ✓ Réglé intégralement
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              En attente de paiement ({(app.paidAmount || 0).toLocaleString()} DZD)
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-center">
                          {getStatusBadge(app.status)}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedApp(app);
                              setAdminNoteInput(app.adminNotes || '');
                              setIsAppDetailsOpen(true);
                            }}
                            className="bg-[#7B1B38] hover:bg-[#63142c] text-white font-bold text-xs h-8 px-3 rounded-xl cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            <span>Instruire</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredApplications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-14 text-center text-slate-500">
                        <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="font-bold text-slate-700">Aucun dossier étudiant trouvé</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Ajustez vos filtres par pays ou par université pour afficher les candidatures.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL : NOUVEAU / MODIFIER PROGRAMME PAR PAYS & UNIV     */}
      {/* ======================================================== */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-4xl lg:max-w-5xl w-[96vw] max-h-[92vh] p-0 overflow-hidden rounded-3xl bg-slate-50 flex flex-col shadow-2xl">
          <div className="bg-white border-b border-slate-200 px-6 py-5 flex justify-between items-center shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="p-1.5 bg-[#7B1B38]/10 text-[#7B1B38] rounded-lg">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-black uppercase text-[#7B1B38] tracking-wider">
                  Pôle International & Universités Agréées
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {editingProgId ? "Modifier l'Université / Offre d'Études" : "Ajouter une Nouvelle Université / Offre d'Études"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Renseignez le pays, l'université, les conditions académiques d'admission et les pièces à fournir par les agences.
              </p>
            </div>
            <button
              onClick={() => setIsAddOpen(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 lg:p-8 overflow-y-auto space-y-6 flex-1">
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-2 shadow-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {showSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-xs font-bold flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Université enregistrée avec succès dans le catalogue !</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* COLONNE GAUCHE */}
              <div className="space-y-6">
                {/* Étape 1 : Le Pays de Destination */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1B38] flex items-center gap-1.5">
                      <Globe2 className="w-4 h-4" /> 1. Pays de Destination
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">Étape clé</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-bold text-slate-700">Nom du Pays *</Label>
                      <Input
                        placeholder="Ex: Russie, France, Malaisie, Roumanie..."
                        value={newProgram.country}
                        onChange={e => setNewProgram({ ...newProgram, country: e.target.value })}
                        className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Drapeau</Label>
                      <Input
                        placeholder="Ex: 🇷🇺 ou 🇫🇷"
                        value={newProgram.countryFlag}
                        onChange={e => setNewProgram({ ...newProgram, countryFlag: e.target.value })}
                        className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl text-center font-bold text-lg focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Suggestions rapides des pays existants */}
                  {availableCountries.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1.5">Suggestions de pays :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {availableCountries.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setNewProgram({ ...newProgram, country: c })}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                              newProgram.country === c
                                ? 'bg-[#7B1B38] text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Étape 2 : Établissement Universitaire & Programme */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1B38] flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" /> 2. Établissement & Formation
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Nom Officiel de l'Université *</Label>
                      <Input
                        placeholder="Ex: Université d'État de Moscou (MGU - Lomonossov)"
                        value={newProgram.university}
                        onChange={e => setNewProgram({ ...newProgram, university: e.target.value })}
                        className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Ville / Campus</Label>
                        <Input
                          placeholder="Ex: Moscou, Saint-Pétersbourg..."
                          value={newProgram.city}
                          onChange={e => setNewProgram({ ...newProgram, city: e.target.value })}
                          className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Niveau d'Études</Label>
                        <Select value={newProgram.type} onValueChange={(v) => setNewProgram({ ...newProgram, type: v })}>
                          <SelectTrigger className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl text-xs">
                            <SelectItem value="Préparatoire">Année Préparatoire (Langue)</SelectItem>
                            <SelectItem value="Bachelor">Licence / Bachelor (Bac+3/4)</SelectItem>
                            <SelectItem value="Master">Master (Bac+5)</SelectItem>
                            <SelectItem value="Doctorat">Doctorat / PhD</SelectItem>
                            <SelectItem value="Autre">Autre formation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Titre du Programme ou Faculté *</Label>
                      <Input
                        placeholder="Ex: Faculté de Médecine Générale, Génie Informatique..."
                        value={newProgram.title}
                        onChange={e => setNewProgram({ ...newProgram, title: e.target.value })}
                        className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl font-bold focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Description détaillée de l'offre</Label>
                      <Textarea
                        placeholder="Présentez les atouts de l'établissement, les laboratoires, le campus, les accréditations..."
                        value={newProgram.description}
                        onChange={e => setNewProgram({ ...newProgram, description: e.target.value })}
                        rows={3}
                        className="text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Étape 5 : Tarifs B2B & Scolarité */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1B38] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" /> 3. Tarification & Visuel Campus
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Frais Traitement Agence (DZD) *</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 50000"
                        value={newProgram.price || ''}
                        onChange={e => setNewProgram({ ...newProgram, price: Number(e.target.value) })}
                        className="h-11 text-xs font-mono font-black bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Scolarité Annuelle Indicative</Label>
                      <Input
                        placeholder="Ex: 3 000 $ / an"
                        value={newProgram.tuitionFeeYear}
                        onChange={e => setNewProgram({ ...newProgram, tuitionFeeYear: e.target.value })}
                        className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-bold text-slate-700">URL Photo du Campus</Label>
                      <Input
                        placeholder="https://images.unsplash.com/..."
                        value={newProgram.image}
                        onChange={e => setNewProgram({ ...newProgram, image: e.target.value })}
                        className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl font-mono focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* COLONNE DROITE */}
              <div className="space-y-6">
                {/* Étape 3 : Conditions d'Admission & Délais */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1B38] flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> 4. Conditions d'Admission & Délais
                    </h4>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Délai Invitation</Label>
                        <Input
                          placeholder="Ex: 20 à 35 jours"
                          value={newProgram.processingTime}
                          onChange={e => setNewProgram({ ...newProgram, processingTime: e.target.value })}
                          className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Période Rentrée</Label>
                        <Input
                          placeholder="Ex: Septembre 2025"
                          value={newProgram.intake}
                          onChange={e => setNewProgram({ ...newProgram, intake: e.target.value })}
                          className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700">Langue Cursus</Label>
                        <Input
                          placeholder="Ex: Russe / Anglais"
                          value={newProgram.languageOfStudy}
                          onChange={e => setNewProgram({ ...newProgram, languageOfStudy: e.target.value })}
                          className="h-11 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Conditions académiques & critères d'admission</Label>
                      <Textarea
                        placeholder="Ex: Baccalauréat scientifique avec moyenne min. 12/20. Âge maximum 27 ans. Certificat médical complet exigé..."
                        value={newProgram.conditions}
                        onChange={e => setNewProgram({ ...newProgram, conditions: e.target.value })}
                        rows={2}
                        className="text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Étape 4 : Documents obligatoires à fournir */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#7B1B38] flex items-center gap-1.5">
                      <List className="w-4 h-4" /> 5. Dossier & Pièces Obligatoires
                    </h4>
                    <span className="text-xs font-black bg-[#7B1B38]/10 text-[#7B1B38] px-2.5 py-0.5 rounded-full">
                      {newProgram.requiredDocuments?.length || 0} sélectionnés
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    Cochez les documents que l'agence devra téléverser pour cette université spécifique :
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {STANDARD_DOCUMENTS.map((docItem) => {
                      const isChecked = (newProgram.requiredDocuments || []).includes(docItem);
                      return (
                        <div
                          key={docItem}
                          onClick={() => {
                            const current = newProgram.requiredDocuments || [];
                            if (isChecked) {
                              setNewProgram({ ...newProgram, requiredDocuments: current.filter(d => d !== docItem) });
                            } else {
                              setNewProgram({ ...newProgram, requiredDocuments: [...current, docItem] });
                            }
                          }}
                          className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#7B1B38]/10 border-[#7B1B38] text-[#7B1B38] font-bold shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-[#7B1B38] text-white' : 'border border-slate-300 bg-white'
                          }`}>
                            {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className="leading-snug">{docItem}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ajout pièce personnalisée */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Input
                      placeholder="Ajouter une autre pièce spécifique..."
                      value={customDocInput}
                      onChange={e => setCustomDocInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomDoc(); } }}
                      className="h-10 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCustomDoc}
                      className="h-10 text-xs font-bold rounded-xl px-4 cursor-pointer"
                    >
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <Switch
                checked={newProgram.status === 'active'}
                onCheckedChange={v => setNewProgram({ ...newProgram, status: v ? 'active' : 'draft' })}
              />
              <span className="text-xs font-bold text-slate-800">
                Offre active et immédiatement visible par les agences partenaires
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="h-11 px-5 text-xs font-bold rounded-xl cursor-pointer"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveProgram}
                disabled={isSubmitting}
                className="h-11 px-7 text-xs font-bold bg-[#7B1B38] hover:bg-[#63142c] text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "Enregistrement..." : (editingProgId ? "Mettre à jour l'Offre" : "Créer l'Offre Universitaire")}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* MODAL : INSTRUCTION DÉTAILLÉE D'UN DOSSIER ÉTUDIANT      */}
      {/* ======================================================== */}
      <Dialog open={isAppDetailsOpen} onOpenChange={setIsAppDetailsOpen}>
        <DialogContent className="w-[96vw] sm:max-w-4xl lg:max-w-5xl max-h-[92vh] p-0 overflow-hidden rounded-3xl bg-slate-50 flex flex-col shadow-2xl">
          {selectedApp && (
            <>
              {/* En-tête Dossier */}
              <div className="bg-[#7B1B38] text-white p-6 shrink-0 flex justify-between items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-white/20 px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wide">
                      #{selectedApp.id}
                    </span>
                    <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-bold">
                      {selectedApp.countryFlag || '🎓'} {selectedApp.country || 'Destination'}
                    </span>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{selectedApp.studentName}</h3>
                  <p className="text-xs text-white/80 mt-1 flex flex-wrap items-center gap-2">
                    <span><strong>Université :</strong> {selectedApp.university || selectedApp.programTitle}</span>
                    <span>•</span>
                    <span><strong>Agence partenaire :</strong> {selectedApp.agencyName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsAppDetailsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corps du dossier */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* 1. Informations Générales & Contact */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                    Identité du Candidat & Contact Agence
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Passeport</span>
                      <span className="font-bold text-slate-800 font-mono text-sm">{selectedApp.passportNumber || "—"}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Email Candidat</span>
                      <span className="font-semibold text-slate-800 truncate block text-xs" title={selectedApp.email || ""}>
                        {selectedApp.email || "Non communiqué"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Téléphone</span>
                      <span className="font-semibold text-slate-800 font-mono text-xs">
                        {selectedApp.phone || "Non communiqué"}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Date de Dépôt</span>
                      <span className="font-semibold text-slate-800 text-xs">
                        {selectedApp.submissionDate ? new Date(selectedApp.submissionDate).toLocaleDateString('fr-FR') : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Suivi Financier (comme voyage organisé) */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Règlement du Dossier (Non débité automatiquement du portefeuille agence)
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="text-2xl font-black text-slate-900">
                          {(selectedApp.paidAmount || 0).toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-slate-400">/</span>
                        <span className="text-base font-bold text-slate-600">
                          {(selectedApp.price || 0).toLocaleString()} DZD
                        </span>
                      </div>
                      {(selectedApp.paidAmount || 0) >= (selectedApp.price || 0) ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full whitespace-nowrap">
                          ✓ Intégralement Payé
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full whitespace-nowrap">
                          Reste dû : {((selectedApp.price || 0) - (selectedApp.paidAmount || 0)).toLocaleString()} DZD
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                    <Input
                      type="number"
                      placeholder="Montant encaissé..."
                      value={paymentInput || ''}
                      onChange={e => setPaymentInput(Number(e.target.value))}
                      className="h-10 text-xs w-44 bg-slate-50 border-slate-200 rounded-xl font-mono font-bold"
                    />
                    <Button
                      size="sm"
                      onClick={handleRegisterPayment}
                      className="h-10 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      Encaisser
                    </Button>
                  </div>
                </div>

                {/* 3. Pièces & Documents Téléversés par l'Agence */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Documents Transmis ({Object.keys(selectedApp.documents || {}).length})
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Vérifiez la conformité de chaque pièce
                    </span>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(selectedApp.documents || {}).map(([docName, docUrl]) => {
                      const isResolving = resolvingDocName === docName;
                      return (
                        <div
                          key={docName}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white transition-all text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <File className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="font-bold text-slate-800 truncate">{docName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isResolving}
                              onClick={() => handleOpenDoc(docName, docUrl)}
                              className="h-8 px-2.5 text-xs font-bold text-blue-700 bg-blue-50/50 border-blue-200 hover:bg-blue-100 rounded-lg cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              <span>{isResolving ? "..." : "Aperçu"}</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isResolving}
                              onClick={() => handleDownloadDoc(docName, docUrl)}
                              className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                              title="Télécharger"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {Object.keys(selectedApp.documents || {}).length === 0 && (
                      <p className="text-xs text-slate-400 italic py-4 text-center">
                        Aucun document téléversé pour ce dossier.
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Lettre d'Admission Officielle / Visa Études Final */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                        Lettre d'Admission Officielle / Invitation Universitaire
                      </h4>
                      <p className="text-[11px] text-emerald-700">
                        Dès réception du document officiel de l'université, téléversez-le pour l'agence.
                      </p>
                    </div>
                    {selectedApp.finalDocument && (
                      <Badge className="bg-emerald-600 text-white font-bold">
                        Document Disponible
                      </Badge>
                    )}
                  </div>

                  {selectedApp.finalDocument ? (
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            {selectedApp.finalDocumentName || "Lettre_Admission_Officielle.pdf"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Émise le {new Date(selectedApp.finalDocumentDate || Date.now()).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDoc(selectedApp.finalDocumentName || "Lettre d'Admission", selectedApp.finalDocument!)}
                          className="h-8 text-xs font-bold text-emerald-700 border-emerald-300 bg-emerald-50"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> Aperçu
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownloadDoc(selectedApp.finalDocumentName || "Lettre d'Admission", selectedApp.finalDocument!)}
                          className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" /> Télécharger
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-emerald-300 rounded-xl p-4 bg-white/70 text-center hover:bg-white transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleUploadFinalDocument}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        disabled={uploadingFinalDoc}
                      />
                      <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                      <span className="text-xs font-bold text-emerald-900 block">
                        {uploadingFinalDoc ? "Téléversement en cours..." : "Téléverser la Lettre d'Admission Finale (PDF)"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Passera automatiquement le dossier au statut « Validé » et notifiera l'agence.
                      </span>
                    </div>
                  )}
                </div>

                {/* 5. Statut & Décision */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    Mise à Jour du Statut du Dossier
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await updateStudyApplicationStatus(selectedApp.id, "Processing");
                        setSelectedApp(prev => prev ? ({ ...prev, status: "Processing" }) : null);
                        toast.info("Dossier passé au statut 'En Traitement'. L'agence partenaire a été notifiée.");
                      }}
                      className="text-xs font-bold text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" /> En Traitement
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await updateStudyApplicationStatus(selectedApp.id, "ActionRequired");
                        setSelectedApp(prev => prev ? ({ ...prev, status: "ActionRequired" }) : null);
                        toast.warning("Dossier marqué 'Complément Requis'. Notification envoyée à l'agence.");
                      }}
                      className="text-xs font-bold text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Complément Requis
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await updateStudyApplicationStatus(selectedApp.id, "Approved");
                        setSelectedApp(prev => prev ? ({ ...prev, status: "Approved" }) : null);
                        toast.success("Dossier approuvé avec succès ! L'agence a été notifiée.");
                      }}
                      className="text-xs font-bold text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Approuver le dossier
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await updateStudyApplicationStatus(selectedApp.id, "Rejected");
                        setSelectedApp(prev => prev ? ({ ...prev, status: "Rejected" }) : null);
                        toast.error("Dossier rejeté. Notification transmise à l'agence.");
                      }}
                      className="text-xs font-bold text-red-700 bg-red-50 border-red-200 hover:bg-red-100 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" /> Rejeter
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-200 flex justify-end shrink-0">
                <Button
                  onClick={() => setIsAppDetailsOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-6 rounded-xl cursor-pointer"
                >
                  Fermer
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal In-App Confirmation de Suppression Programme */}
      <Dialog open={!!programToDelete} onOpenChange={(open) => !open && setProgramToDelete(null)}>
        <DialogContent className="max-w-md p-6 rounded-3xl bg-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Confirmer la suppression</h3>
              <p className="text-xs text-slate-500">Cette action retirera le programme du catalogue des agences.</p>
            </div>
          </div>
          {programToDelete && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-800">{programToDelete.university}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">{programToDelete.title}</div>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setProgramToDelete(null)}
              className="text-xs font-bold rounded-xl h-10 px-4 cursor-pointer"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmDeleteProgram}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl h-10 px-5 cursor-pointer"
            >
              Supprimer définitivement
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
