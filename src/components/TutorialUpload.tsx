import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Video, 
  FileText, 
  Link, 
  Code, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import { Tutorial, TutorialResource } from '../types';
import { academyService } from '../services/academyService';
import { useAuth } from '../context/AuthContext';

interface TutorialUploadProps {
  onSuccess?: (tutorialId: string) => void;
  onCancel?: () => void;
}

export const TutorialUpload: React.FC<TutorialUploadProps> = ({
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'PROGRAMMATION' as Tutorial['category'],
    level: 'Débutant' as Tutorial['level'],
    tags: [] as string[],
    estimatedDuration: '',
    prerequisites: [] as string[]
  });
  
  // Média
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  // Ressources
  const [resources, setResources] = useState<TutorialResource[]>([]);
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'LINK' as TutorialResource['type'],
    url: '',
    description: ''
  });
  
  // Tags
  const [newTag, setNewTag] = useState('');
  
  // Prérequis
  const [newPrerequisite, setNewPrerequisite] = useState('');
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const categories: Tutorial['category'][] = [
    'PROGRAMMATION', 'DEVELOPPEMENT_MOBILE', 'WEB', 'IA', 'CYBERSECURITE', 'LINUX', 'DESIGN', 'OUTILS'
  ];

  const levels: Tutorial['level'][] = ['Débutant', 'Intermédiaire', 'Avancé'];

  const resourceTypes: TutorialResource['type'][] = ['PDF', 'LINK', 'CODE', 'DOWNLOAD', 'IMAGE'];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        const preview = URL.createObjectURL(file);
        setVideoPreview(preview);
      } else {
        alert('Veuillez sélectionner un fichier vidéo valide');
      }
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setThumbnailFile(file);
        const preview = URL.createObjectURL(file);
        setThumbnailPreview(preview);
      } else {
        alert('Veuillez sélectionner une image valide pour la miniature');
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisiteToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(prereq => prereq !== prerequisiteToRemove)
    }));
  };

  const addResource = () => {
    if (newResource.title.trim() && newResource.url.trim()) {
      const resource: TutorialResource = {
        id: `resource-${Date.now()}`,
        title: newResource.title.trim(),
        type: newResource.type,
        url: newResource.url.trim(),
        description: newResource.description.trim()
      };
      
      setResources(prev => [...prev, resource]);
      setNewResource({ title: '', type: 'LINK', url: '', description: '' });
    }
  };

  const removeResource = (resourceId: string) => {
    setResources(prev => prev.filter(resource => resource.id !== resourceId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler l'upload des fichiers (en réalité, on utiliserait un service de stockage)
      const videoUrl = videoFile ? 'https://example.com/video.mp4' : '';
      const thumbnailUrl = thumbnailFile ? 'https://example.com/thumbnail.jpg' : 'https://images.unsplash.com/photo-1626398224579-6baa0e8b5b5c?q=80&w=400';

      const tutorial: Omit<Tutorial, 'id' | 'views' | 'likes' | 'dislikes' | 'commentsCount' | 'createdAt' | 'lastUpdated'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        thumbnail: thumbnailUrl,
        videoUrl: videoUrl || undefined,
        videoDuration: videoFile ? 1800 : undefined, // 30 minutes par défaut
        category: formData.category,
        level: formData.level,
        tags: formData.tags,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        status: 'PENDING', // En attente de validation
        isOfficial: false,
        isVerified: false,
        resources,
        estimatedDuration: formData.estimatedDuration || '30 minutes',
        prerequisites: formData.prerequisites.length > 0 ? formData.prerequisites : undefined
      };

      const tutorialId = await academyService.publishTutorial(tutorial);
      onSuccess?.(tutorialId);
    } catch (error) {
      console.error('Error uploading tutorial:', error);
      alert('Erreur lors de la publication du tutoriel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Aperçu du tutoriel</h2>
          <div className="flex space-x-2">
            <button
              onClick={togglePreview}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <EyeOff className="w-4 h-4 inline mr-2" />
              Retour à l'édition
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* En-tête du tutoriel */}
          <div className="flex space-x-6">
            {thumbnailPreview && (
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail" 
                className="w-48 h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{formData.title || 'Titre du tutoriel'}</h3>
              <p className="text-gray-600 mt-2">{formData.description || 'Description du tutoriel'}</p>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {formData.level}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  {formData.category}
                </span>
                <span>{formData.estimatedDuration || '30 minutes'}</span>
              </div>
            </div>
          </div>

          {/* Vidéo */}
          {videoPreview && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vidéo du tutoriel</h4>
              <video 
                src={videoPreview} 
                controls 
                className="w-full max-w-2xl rounded-lg"
              />
            </div>
          )}

          {/* Contenu */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Contenu du tutoriel</h4>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700">
                {formData.content || 'Contenu du tutoriel...'}
              </pre>
            </div>
          </div>

          {/* Tags */}
          {formData.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Prérequis */}
          {formData.prerequisites.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Prérequis</h4>
              <ul className="list-disc list-inside text-gray-700">
                {formData.prerequisites.map(prereq => (
                  <li key={prereq}>{prereq}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ressources */}
          {resources.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Ressources</h4>
              <div className="space-y-2">
                {resources.map(resource => (
                  <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-600">{resource.description}</div>
                      <div className="text-xs text-blue-600 mt-1">{resource.type}</div>
                    </div>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Link className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Publier un tutoriel</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={togglePreview}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Aperçu
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du tutoriel *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Introduction à React"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Tutorial['category'] }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as Tutorial['level'] }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée estimée
            </label>
            <input
              type="text"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 45 minutes"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Décrivez ce que les étudiants vont apprendre..."
            required
          />
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenu du tutoriel *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={10}
            placeholder="Écrivez le contenu détaillé de votre tutoriel..."
            required
          />
        </div>

        {/* Upload média */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vidéo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vidéo du tutoriel
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              
              {videoPreview ? (
                <div>
                  <video 
                    src={videoPreview} 
                    controls 
                    className="w-full h-40 rounded mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview('');
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Supprimer la vidéo
                  </button>
                </div>
              ) : (
                <div>
                  <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Choisir une vidéo
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    MP4, WebM, OGG (Max 500MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Miniature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miniature (Thumbnail)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              
              {thumbnailPreview ? (
                <div>
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail" 
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview('');
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Supprimer l'image
                  </button>
                </div>
              ) : (
                <div>
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Choisir une image
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ajouter un tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Prérequis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prérequis (optionnel)
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newPrerequisite}
              onChange={(e) => setNewPrerequisite(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ajouter un prérequis..."
            />
            <button
              type="button"
              onClick={addPrerequisite}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.prerequisites.map(prereq => (
              <div key={prereq} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{prereq}</span>
                <button
                  type="button"
                  onClick={() => removePrerequisite(prereq)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ressources */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ressources additionnelles
          </label>
          
          {/* Formulaire d'ajout de ressource */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              value={newResource.title}
              onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Titre"
            />
            <select
              value={newResource.type}
              onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as TutorialResource['type'] }))}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {resourceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="url"
              value={newResource.url}
              onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="URL"
            />
            <button
              type="button"
              onClick={addResource}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <input
            type="text"
            value={newResource.description}
            onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            placeholder="Description de la ressource (optionnel)"
          />

          {/* Liste des ressources */}
          <div className="space-y-2">
            {resources.map(resource => (
              <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {resource.type === 'PDF' && <FileText className="w-4 h-4 text-red-500" />}
                  {resource.type === 'LINK' && <Link className="w-4 h-4 text-blue-500" />}
                  {resource.type === 'CODE' && <Code className="w-4 h-4 text-green-500" />}
                  {resource.type === 'IMAGE' && <ImageIcon className="w-4 h-4 text-purple-500" />}
                  <div>
                    <div className="font-medium text-gray-900">{resource.title}</div>
                    {resource.description && (
                      <div className="text-sm text-gray-600">{resource.description}</div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeResource(resource.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons de soumission */}
        <div className="flex justify-end space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <AlertCircle className="w-4 h-4 mr-2" />
            Le tutoriel sera soumis pour validation avant publication
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                Publication en cours...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2 inline" />
                Publier le tutoriel
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
