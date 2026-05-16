import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Clock, 
  Code, 
  Globe, 
  Shield, 
  Database, 
  Palette, 
  Wifi, 
  Cpu, 
  Bot,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Upload,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { MembershipApplication } from '../types';
import { accessService } from '../services/accessService';

interface MembershipApplicationProps {
  onSubmit: (application: Omit<MembershipApplication, 'id' | 'submittedAt'>) => Promise<void>;
  onCancel: () => void;
}

export const MembershipApplication: React.FC<MembershipApplicationProps> = ({ 
  onSubmit, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    personalInfo: {
      fullName: '',
      photo: '',
      gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
      birthDate: ''
    },
    
    // Informations universitaires
    universityInfo: {
      university: '',
      faculty: '',
      department: '',
      level: '',
      studentId: ''
    },
    
    // Contact
    contact: {
      email: '',
      phone: ''
    },
    
    // Motivation
    motivation: {
      reason: '',
      interests: [] as ('WEB' | 'MOBILE' | 'AI' | 'CYBERSECURITY' | 'DESIGN' | 'NETWORK' | 'ROBOTICS')[],
      currentLevel: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
      availability: [] as ('WEEKEND' | 'EVENING' | 'WEEKDAYS')[],
      existingSkills: ''
    },
    
    // Engagement
    commitment: {
      respectsRules: false,
      participatesActivities: false
    }
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const interestOptions = [
    { id: 'WEB', label: 'Développement Web', icon: <Globe className="w-4 h-4" /> },
    { id: 'MOBILE', label: 'Développement Mobile', icon: <Phone className="w-4 h-4" /> },
    { id: 'AI', label: 'Intelligence Artificielle', icon: <Cpu className="w-4 h-4" /> },
    { id: 'CYBERSECURITY', label: 'Cybersécurité', icon: <Shield className="w-4 h-4" /> },
    { id: 'DESIGN', label: 'Design', icon: <Palette className="w-4 h-4" /> },
    { id: 'NETWORK', label: 'Réseaux', icon: <Wifi className="w-4 h-4" /> },
    { id: 'ROBOTICS', label: 'Robotique', icon: <Bot className="w-4 h-4" /> }
  ];

  const availabilityOptions = [
    { id: 'WEEKEND', label: 'Week-end', icon: <Calendar className="w-4 h-4" /> },
    { id: 'EVENING', label: 'Soir', icon: <Clock className="w-4 h-4" /> },
    { id: 'WEEKDAYS', label: 'Jours ouvrables', icon: <Calendar className="w-4 h-4" /> }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.personalInfo.fullName.trim()) {
          newErrors.fullName = 'Le nom complet est requis';
        }
        if (!formData.contact.email.trim()) {
          newErrors.email = 'L\'email est requis';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.contact.email)) {
          newErrors.email = 'L\'email n\'est pas valide';
        }
        if (!formData.contact.phone.trim()) {
          newErrors.phone = 'Le téléphone est requis';
        }
        break;
        
      case 2:
        if (!formData.universityInfo.university.trim()) {
          newErrors.university = 'L\'université est requise';
        }
        if (!formData.universityInfo.faculty.trim()) {
          newErrors.faculty = 'La faculté est requise';
        }
        if (!formData.universityInfo.department.trim()) {
          newErrors.department = 'Le département est requis';
        }
        if (!formData.universityInfo.level.trim()) {
          newErrors.level = 'Le niveau est requis';
        }
        break;
        
      case 3:
        if (!formData.motivation.reason.trim()) {
          newErrors.reason = 'La raison de votre demande est requise';
        }
        if (formData.motivation.reason.length < 50) {
          newErrors.reason = 'Veuillez fournir au moins 50 caractères';
        }
        if (formData.motivation.interests.length === 0) {
          newErrors.interests = 'Sélectionnez au moins un centre d\'intérêt';
        }
        break;
        
      case 4:
        if (!formData.motivation.availability.length) {
          newErrors.availability = 'Sélectionnez au moins une disponibilité';
        }
        break;
        
      case 5:
        if (!formData.commitment.respectsRules) {
          newErrors.respectsRules = 'Vous devez accepter de respecter les règles';
        }
        if (!formData.commitment.participatesActivities) {
          newErrors.participatesActivities = 'Vous devez vous engager à participer aux activités';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      const application: Omit<MembershipApplication, 'id' | 'submittedAt'> = {
        userId: '', // Sera rempli par le service
        status: 'PENDING',
        ...formData,
        motivation: {
          ...formData.motivation,
          existingSkills: formData.motivation.existingSkills.split(',').map(s => s.trim()).filter(s => s)
        }
      };
      
      await onSubmit(application);
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la soumission' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const toggleInterest = (interest: typeof interestOptions[0]['id']) => {
    updateFormData('motivation.interests', 
      formData.motivation.interests.includes(interest)
        ? formData.motivation.interests.filter(i => i !== interest)
        : [...formData.motivation.interests, interest]
    );
  };

  const toggleAvailability = (availability: typeof availabilityOptions[0]['id']) => {
    updateFormData('motivation.availability', 
      formData.motivation.availability.includes(availability)
        ? formData.motivation.availability.filter(a => a !== availability)
        : [...formData.motivation.availability, availability]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Informations Personnelles</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nom Complet *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => updateFormData('personalInfo.fullName', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan',
                    errors.fullName ? 'border-red-500' : 'border-hub-border'
                  )}
                  placeholder="Jean Dupont"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => updateFormData('contact.email', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan',
                    errors.email ? 'border-red-500' : 'border-hub-border'
                  )}
                  placeholder="jean.dupont@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => updateFormData('contact.phone', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan',
                    errors.phone ? 'border-red-500' : 'border-hub-border'
                  )}
                  placeholder="+243 000 000 000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sexe (optionnel)
                </label>
                <select
                  value={formData.personalInfo.gender}
                  onChange={(e) => updateFormData('personalInfo.gender', e.target.value)}
                  className="w-full px-4 py-3 bg-hub-surface/50 border border-hub-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                >
                  <option value="">Sélectionner</option>
                  <option value="MALE">Masculin</option>
                  <option value="FEMALE">Féminin</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Date de naissance (optionnel)
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.birthDate}
                  onChange={(e) => updateFormData('personalInfo.birthDate', e.target.value)}
                  className="w-full px-4 py-3 bg-hub-surface/50 border border-hub-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Informations Universitaires</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Université *
                </label>
                <input
                  type="text"
                  value={formData.universityInfo.university}
                  onChange={(e) => updateFormData('universityInfo.university', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan',
                    errors.university ? 'border-red-500' : 'border-hub-border'
                  )}
                  placeholder="UNILU"
                />
                {errors.university && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.university}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Faculté *
                </label>
                <input
                  type="text"
                  value={formData.universityInfo.faculty}
                  onChange={(e) => updateFormData('universityInfo.faculty', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan',
                    errors.faculty ? 'border-red-500' : 'border-hub-border'
                  )}
                  placeholder="Sciences et Technologies"
                />
                {errors.faculty && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.faculty}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Département *
                </label>
                <input
                  type="text"
                  value={formData.universityInfo.department}
                  onChange={(e) => updateFormData('universityInfo.department', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan',
                    errors.department ? 'border-red-500' : 'border-hub-border'
                  )}
                  placeholder="Informatique"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Niveau *
                </label>
                <input
                  type="text"
                  value={formData.universityInfo.level}
                  onChange={(e) => updateFormData('universityInfo.level', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan',
                    errors.level ? 'border-red-500' : 'border-hub-border'
                  )}
                  placeholder="L2"
                />
                {errors.level && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.level}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Matricule étudiant (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.universityInfo.studentId}
                  onChange={(e) => updateFormData('universityInfo.studentId', e.target.value)}
                  className="w-full px-4 py-3 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  placeholder="2024001234"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Motivation et Centres d'Intérêt</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pourquoi voulez-vous rejoindre CODEL ? *
                </label>
                <textarea
                  value={formData.motivation.reason}
                  onChange={(e) => updateFormData('motivation.reason', e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 bg-hub-surface/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan resize-none',
                    errors.reason ? 'border-red-500' : 'border-hub-border'
                  )}
                  rows={4}
                  placeholder="Je souhaite rejoindre CODEL pour..."
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.reason}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {formData.motivation.reason.length}/500 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Centres d'intérêt *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id as any)}
                      className={clsx(
                        'p-3 rounded-lg border transition-all duration-200 flex items-center gap-2',
                        formData.motivation.interests.includes(interest.id as any)
                          ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                          : 'bg-hub-surface/50 border-hub-border text-slate-400 hover:border-brand-cyan/50'
                      )}
                    >
                      {interest.icon}
                      <span className="text-sm">{interest.label}</span>
                    </button>
                  ))}
                </div>
                {errors.interests && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.interests}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Niveau actuel
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => updateFormData('motivation.currentLevel', level)}
                      className={clsx(
                        'p-3 rounded-lg border transition-all duration-200',
                        formData.motivation.currentLevel === level
                          ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                          : 'bg-hub-surface/50 border-hub-border text-slate-400 hover:border-brand-cyan/50'
                      )}
                    >
                      {level === 'BEGINNER' ? 'Débutant' : level === 'INTERMEDIATE' ? 'Intermédiaire' : 'Avancé'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Compétences existantes
                </label>
                <input
                  type="text"
                  value={formData.motivation.existingSkills}
                  onChange={(e) => updateFormData('motivation.existingSkills', e.target.value)}
                  className="w-full px-4 py-3 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  placeholder="Python, HTML, Git (séparez par des virgules)"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Disponibilité</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Quand êtes-vous disponible ? *
                </label>
                <div className="space-y-3">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => toggleAvailability(option.id as any)}
                      className={clsx(
                        'w-full p-4 rounded-lg border transition-all duration-200 flex items-center gap-3',
                        formData.motivation.availability.includes(option.id as any)
                          ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                          : 'bg-hub-surface/50 border-hub-border text-slate-400 hover:border-brand-cyan/50'
                      )}
                    >
                      {option.icon}
                      <div className="flex-1 text-left">
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {formData.motivation.availability.includes(option.id as any) && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.availability}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Engagement</h3>
            
            <div className="space-y-4">
              <div className="bg-hub-surface/50 border border-hub-border rounded-lg p-6">
                <h4 className="font-bold text-white mb-4">Règles du Club CODEL</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Respecter tous les membres du club</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Participer activement aux activités</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Partager ses connaissances et aider les autres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Respecter les délais et engagements pris</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Maintenir un comportement professionnel</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.commitment.respectsRules}
                    onChange={(e) => updateFormData('commitment.respectsRules', e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand-cyan bg-hub-surface/50 border-hub-border rounded focus:ring-brand-cyan"
                  />
                  <span className="text-slate-300">
                    Je m'engage à respecter les règles du club CODEL *
                  </span>
                </label>
                {errors.respectsRules && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.respectsRules}
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.commitment.participatesActivities}
                    onChange={(e) => updateFormData('commitment.participatesActivities', e.target.checked)}
                    className="mt-1 w-4 h-4 text-brand-cyan bg-hub-surface/50 border-hub-border rounded focus:ring-brand-cyan"
                  />
                  <span className="text-slate-300">
                    Je m'engage à participer activement aux activités du club *
                  </span>
                </label>
                {errors.participatesActivities && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.participatesActivities}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-hub-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-hub-surface/80 backdrop-blur-md border border-hub-border rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-hub-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Demande d'Adhésion CODEL
              </h2>
              <button
                onClick={onCancel}
                className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Étape {currentStep} sur {totalSteps}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-hub-border rounded-full h-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-hub-border">
            <div className="flex justify-between items-center">
              <button
                onClick={onCancel}
                className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="px-6 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors"
                  >
                    Précédent
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/80 transition-colors flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-brand-cyan to-brand-purple text-white rounded-lg hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Soumission...
                      </>
                    ) : (
                      <>
                        Envoyer la demande
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {errors.submit && (
              <p className="mt-4 text-sm text-red-500 text-center">
                {errors.submit}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipApplication;
