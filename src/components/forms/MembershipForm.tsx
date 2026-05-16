import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, User, Mail, Phone, GraduationCap, Code, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input, Textarea, Select } from '../ui/Input';
import { MembershipApplication } from '../../types';
import { useThemeClasses } from '../../hooks/useTheme';

interface MembershipFormProps {
  onSubmit: (application: Omit<MembershipApplication, 'id' | 'submittedAt'>) => Promise<void>;
  onCancel: () => void;
}

export const MembershipForm: React.FC<MembershipFormProps> = ({ onSubmit, onCancel }) => {
  const { bg, text, border, primary, primaryBg } = useThemeClasses();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const totalSteps = 4;
  
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      photo: '',
      gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
      birthDate: ''
    },
    universityInfo: {
      university: '',
      faculty: '',
      department: '',
      level: '',
      studentId: ''
    },
    contact: {
      email: '',
      phone: ''
    },
    motivation: {
      reason: '',
      interests: [] as string[],
      currentLevel: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
      availability: [] as string[],
      existingSkills: []
    },
    commitment: {
      respectsRules: false,
      participatesActivities: false
    }
  });

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.personalInfo.fullName) newErrors.fullName = 'Nom requis';
        if (!formData.personalInfo.gender) newErrors.gender = 'Genre requis';
        break;
      case 2:
        if (!formData.universityInfo.university) newErrors.university = 'Université requise';
        if (!formData.universityInfo.level) newErrors.level = 'Niveau requis';
        break;
      case 3:
        if (!formData.contact.email) newErrors.email = 'Email requis';
        if (!formData.contact.phone) newErrors.phone = 'Téléphone requis';
        break;
      case 4:
        if (!formData.motivation.reason) newErrors.reason = 'Motivation requise';
        if (formData.motivation.interests.length === 0) newErrors.interests = 'Intérêts requis';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData as Omit<MembershipApplication, 'id' | 'submittedAt'>);
      } catch (error) {
        console.error('Error submitting application:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className={`text-xl font-semibold ${text} mb-6`}>Informations Personnelles</h3>
            
            <Input
              label="Nom Complet"
              value={formData.personalInfo.fullName}
              onChange={(e) => updateFormData('personalInfo', 'fullName', e.target.value)}
              errorMessage={errors.fullName}
              icon={<User className="w-4 h-4" />}
              placeholder="Votre nom complet"
            />
            
            <Select
              label="Genre"
              value={formData.personalInfo.gender}
              onChange={(e) => updateFormData('personalInfo', 'gender', e.target.value)}
              errorMessage={errors.gender}
              options={[
                { value: 'MALE', label: 'Homme' },
                { value: 'FEMALE', label: 'Femme' },
                { value: 'OTHER', label: 'Autre' }
              ]}
            />
            
            <Input
              label="Date de Naissance"
              type="date"
              value={formData.personalInfo.birthDate}
              onChange={(e) => updateFormData('personalInfo', 'birthDate', e.target.value)}
            />
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className={`text-xl font-semibold ${text} mb-6`}>Informations Universitaires</h3>
            
            <Input
              label="Université"
              value={formData.universityInfo.university}
              onChange={(e) => updateFormData('universityInfo', 'university', e.target.value)}
              errorMessage={errors.university}
              icon={<GraduationCap className="w-4 h-4" />}
              placeholder="Votre université"
            />
            
            <Input
              label="Faculté"
              value={formData.universityInfo.faculty}
              onChange={(e) => updateFormData('universityInfo', 'faculty', e.target.value)}
              placeholder="Votre faculté"
            />
            
            <Input
              label="Département"
              value={formData.universityInfo.department}
              onChange={(e) => updateFormData('universityInfo', 'department', e.target.value)}
              placeholder="Votre département"
            />
            
            <Select
              label="Niveau d'étude"
              value={formData.universityInfo.level}
              onChange={(e) => updateFormData('universityInfo', 'level', e.target.value)}
              errorMessage={errors.level}
              options={[
                { value: 'L1', label: 'Licence 1' },
                { value: 'L2', label: 'Licence 2' },
                { value: 'L3', label: 'Licence 3' },
                { value: 'M1', label: 'Master 1' },
                { value: 'M2', label: 'Master 2' },
                { value: 'D', label: 'Doctorat' }
              ]}
            />
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className={`text-xl font-semibold ${text} mb-6`}>Contact</h3>
            
            <Input
              label="Email"
              type="email"
              value={formData.contact.email}
              onChange={(e) => updateFormData('contact', 'email', e.target.value)}
              errorMessage={errors.email}
              icon={<Mail className="w-4 h-4" />}
              placeholder="votre.email@exemple.com"
            />
            
            <Input
              label="Téléphone"
              type="tel"
              value={formData.contact.phone}
              onChange={(e) => updateFormData('contact', 'phone', e.target.value)}
              errorMessage={errors.phone}
              icon={<Phone className="w-4 h-4" />}
              placeholder="+226 XX XX XX XX"
            />
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h3 className={`text-xl font-semibold ${text} mb-6`}>Motivation et Intérêts</h3>
            
            <Textarea
              label="Pourquoi voulez-vous rejoindre CODEL ?"
              value={formData.motivation.reason}
              onChange={(e) => updateFormData('motivation', 'reason', e.target.value)}
              errorMessage={errors.reason}
              placeholder="Expliquez votre motivation..."
              rows={4}
            />
            
            <div>
              <label className={`block text-sm font-medium ${text} mb-2`}>
                Centres d'intérêt
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['WEB', 'MOBILE', 'AI', 'CYBERSECURITY', 'DESIGN', 'NETWORK'].map((interest) => (
                  <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.motivation.interests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData('motivation', 'interests', [...formData.motivation.interests, interest]);
                        } else {
                          updateFormData('motivation', 'interests', formData.motivation.interests.filter(i => i !== interest));
                        }
                      }}
                      className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className={`text-sm ${text}`}>{interest}</span>
                  </label>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-red-500 mt-1">{errors.interests}</p>
              )}
            </div>
            
            <Select
              label="Niveau actuel"
              value={formData.motivation.currentLevel}
              onChange={(e) => updateFormData('motivation', 'currentLevel', e.target.value)}
              options={[
                { value: 'BEGINNER', label: 'Débutant' },
                { value: 'INTERMEDIATE', label: 'Intermédiaire' },
                { value: 'ADVANCED', label: 'Avancé' }
              ]}
            />
            
            <div>
              <label className={`block text-sm font-medium ${text} mb-2`}>
                Disponibilité
              </label>
              <div className="space-y-2">
                {['WEEKEND', 'EVENING', 'WEEKDAYS'].map((availability) => (
                  <label key={availability} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.motivation.availability.includes(availability)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData('motivation', 'availability', [...formData.motivation.availability, availability]);
                        } else {
                          updateFormData('motivation', 'availability', formData.motivation.availability.filter(a => a !== availability));
                        }
                      }}
                      className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className={`text-sm ${text}`}>
                      {availability === 'WEEKEND' ? 'Weekend' : availability === 'EVENING' ? 'Soir' : 'Semaine'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <Textarea
              label="Compétences existantes"
              value={formData.motivation.existingSkills.join(', ')}
              onChange={(e) => updateFormData('motivation', 'existingSkills', e.target.value.split(', ').filter(s => s.trim()))}
              placeholder="HTML, CSS, JavaScript, Python..."
              helper="Séparez les compétences par des virgules"
              rows={3}
            />
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader
        title="Candidature CODEL"
        subtitle={`Étape ${currentStep} sur ${totalSteps}`}
        icon={<Code className="w-6 h-6 text-cyan-500" />}
      />
      
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < totalSteps - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? `${primaryBg} ${text}`
                      : `${bg} ${text} border ${border}`
                  }`}
                >
                  {index + 1 <= currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index + 1 < currentStep ? primaryBg : bg
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>Personnel</span>
            <span>Université</span>
            <span>Contact</span>
            <span>Motivation</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] mb-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Précédent
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onCancel}
            >
              Annuler
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Suivant
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={isSubmitting}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Soumettre
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipForm;
