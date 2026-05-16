import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Video, FileText, Link, Code, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input, Textarea, Select } from '../ui/Input';
import { Tutorial, TutorialResource } from '../../types';
import { useThemeClasses } from '../../hooks/useTheme';

interface TutorialFormProps {
  onSuccess?: (tutorialId: string) => void;
  onCancel?: () => void;
  initialData?: Partial<Tutorial>;
}

export const TutorialForm: React.FC<TutorialFormProps> = ({
  onSuccess,
  onCancel,
  initialData
}) => {
  const { bg, text, border } = useThemeClasses();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category: initialData?.category || 'PROGRAMMATION' as Tutorial['category'],
    level: initialData?.level || 'Débutant' as Tutorial['level'],
    tags: initialData?.tags || [],
    estimatedDuration: initialData?.estimatedDuration || '',
    prerequisites: initialData?.prerequisites || []
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [resources, setResources] = useState<TutorialResource[]>(initialData?.resources || []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const addResource = () => {
    const newResource: TutorialResource = {
      id: Date.now().toString(),
      title: '',
      type: 'LINK',
      url: '',
      description: ''
    };
    setResources([...resources, newResource]);
  };

  const updateResource = (id: string, field: keyof TutorialResource, value: any) => {
    setResources(resources.map(res => 
      res.id === id ? { ...res, [field]: value } : res
    ));
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(res => res.id !== id));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const addPrerequisite = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newPrereq = e.currentTarget.value.trim();
      if (!formData.prerequisites.includes(newPrereq)) {
        setFormData({ ...formData, prerequisites: [...formData.prerequisites, newPrereq] });
      }
      e.currentTarget.value = '';
    }
  };

  const removePrerequisite = (prereqToRemove: string) => {
    setFormData({ 
      ...formData, 
      prerequisites: formData.prerequisites.filter(prereq => prereq !== prereqToRemove) 
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Logique de soumission à implémenter
      console.log('Tutorial submitted:', { formData, videoFile, thumbnailFile, resources });
      onSuccess?.('tutorial-id');
    } catch (error) {
      console.error('Error submitting tutorial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (previewMode) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader
          title="Aperçu du Tutoriel"
          actions={
            <Button
              variant="outline"
              onClick={() => setPreviewMode(false)}
              icon={<EyeOff className="w-4 h-4" />}
            >
              Quitter l'aperçu
            </Button>
          }
        />
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <h1>{formData.title}</h1>
            <p>{formData.description}</p>
            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader
        title={initialData ? 'Modifier le Tutoriel' : 'Créer un Tutoriel'}
        actions={
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
            icon={<Eye className="w-4 h-4" />}
          >
            Aperçu
          </Button>
        }
      />
      
      <CardContent className="space-y-8">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Titre du tutoriel"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titre attractif et descriptif"
          />
          
          <Select
            label="Catégorie"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Tutorial['category'] })}
            options={[
              { value: 'PROGRAMMATION', label: 'Programmation' },
              { value: 'DEVELOPPEMENT_MOBILE', label: 'Développement Mobile' },
              { value: 'WEB', label: 'Web' },
              { value: 'IA', label: 'Intelligence Artificielle' },
              { value: 'CYBERSECURITE', label: 'Cybersécurité' },
              { value: 'LINUX', label: 'Linux' },
              { value: 'DESIGN', label: 'Design' },
              { value: 'OUTILS', label: 'Outils' }
            ]}
          />
        </div>

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description détaillée du tutoriel..."
          rows={3}
        />

        <Textarea
          label="Contenu"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Contenu du tutoriel (supporte HTML)..."
          rows={12}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Niveau"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as Tutorial['level'] })}
            options={[
              { value: 'Débutant', label: 'Débutant' },
              { value: 'Intermédiaire', label: 'Intermédiaire' },
              { value: 'Avancé', label: 'Avancé' }
            ]}
          />
          
          <Input
            label="Durée estimée"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
            placeholder="ex: 2 heures, 30 minutes"
          />
        </div>

        {/* Tags */}
        <div>
          <label className={`block text-sm font-medium ${text} mb-2`}>Tags</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-cyan-600 hover:text-cyan-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder="Ajouter un tag et appuyer sur Entrée"
            onKeyDown={addTag}
          />
        </div>

        {/* Prérequis */}
        <div>
          <label className={`block text-sm font-medium ${text} mb-2`}>Prérequis</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.prerequisites.map(prereq => (
              <span
                key={prereq}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {prereq}
                <button
                  onClick={() => removePrerequisite(prereq)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder="Ajouter un prérequis et appuyer sur Entrée"
            onKeyDown={addPrerequisite}
          />
        </div>

        {/* Média */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${text} mb-2`}>Vidéo (optionnel)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              icon={<Video className="w-4 h-4" />}
              className="w-full"
            >
              {videoFile ? videoFile.name : 'Choisir une vidéo'}
            </Button>
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="mt-3 w-full rounded-lg"
              />
            )}
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${text} mb-2`}>Miniature</label>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => thumbnailInputRef.current?.click()}
              icon={<Upload className="w-4 h-4" />}
              className="w-full"
            >
              {thumbnailFile ? thumbnailFile.name : 'Choisir une image'}
            </Button>
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="mt-3 w-full h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Ressources */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className={`block text-sm font-medium ${text}`}>Ressources additionnelles</label>
            <Button
              variant="outline"
              onClick={addResource}
              icon={<Plus className="w-4 h-4" />}
            >
              Ajouter une ressource
            </Button>
          </div>
          
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={resource.id} className={`p-4 border rounded-lg ${border}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Titre"
                    value={resource.title}
                    onChange={(e) => updateResource(resource.id, 'title', e.target.value)}
                  />
                  
                  <Select
                    value={resource.type}
                    onChange={(e) => updateResource(resource.id, 'type', e.target.value)}
                    options={[
                      { value: 'PDF', label: 'PDF' },
                      { value: 'LINK', label: 'Lien' },
                      { value: 'CODE', label: 'Code' },
                      { value: 'DOWNLOAD', label: 'Téléchargement' },
                      { value: 'IMAGE', label: 'Image' }
                    ]}
                  />
                  
                  <Input
                    placeholder="URL"
                    value={resource.url}
                    onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResource(resource.id)}
                      icon={<Trash2 className="w-4 h-4" />}
                    />
                  </div>
                </div>
                
                <Input
                  placeholder="Description (optionnel)"
                  value={resource.description}
                  onChange={(e) => updateResource(resource.id, 'description', e.target.value)}
                  className="mt-3"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {initialData ? 'Mettre à jour' : 'Publier'} le tutoriel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorialForm;
