import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Search, 
  Filter,
  BookOpen,
  ExternalLink,
  Shield,
  FileText,
  Globe,
  Download,
  Users,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { SecureLibraryResource, SecureResourceSource, ResourceLicense } from '../types';
import { secureLibraryService } from '../services/secureLibraryService';
import { useAuth } from '../context/AuthContext';

interface ResourceValidationProps {
  onValidationComplete?: () => void;
}

export const ResourceValidation: React.FC<ResourceValidationProps> = ({ 
  onValidationComplete 
}) => {
  const { user } = useAuth();
  const [pendingResources, setPendingResources] = useState<SecureLibraryResource[]>([]);
  const [validatedResources, setValidatedResources] = useState<SecureLibraryResource[]>([]);
  const [rejectedResources, setRejectedResources] = useState<SecureLibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [validationNotes, setValidationNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      // Simuler le chargement des ressources en attente de validation
      const mockPendingResources: SecureLibraryResource[] = [
        {
          id: 'pending-1',
          title: 'Python Programming Complete Guide',
          description: 'A comprehensive guide to Python programming for beginners and advanced developers',
          category: 'PROGRAMMATION',
          type: 'PDF',
          source: 'OPEN_LIBRARY',
          license: 'PUBLIC_DOMAIN',
          sourceUrl: 'https://openlibrary.org/books/OL123456M',
          isDownloadable: false,
          author: 'John Doe',
          publishedYear: 2023,
          pages: 450,
          language: 'EN',
          difficulty: 'DEBUTANT',
          views: 0,
          reads: 0,
          averageRating: 0,
          ratingCount: 0,
          tags: ['python', 'programming', 'beginner'],
          keywords: ['python', 'programming', 'tutorial'],
          isOfficial: false,
          isVerified: false,
          isValidated: false,
          requiresMembership: true,
          minRole: 'MEMBER',
          addedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'pending-2',
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to machine learning concepts and algorithms',
          category: 'IA',
          type: 'PDF',
          source: 'INTERNET_ARCHIVE',
          license: 'CREATIVE_COMMONS',
          sourceUrl: 'https://archive.org/details/ml-fundamentals',
          isDownloadable: false,
          author: 'Jane Smith',
          publishedYear: 2022,
          pages: 320,
          language: 'EN',
          difficulty: 'INTERMEDIAIRE',
          views: 0,
          reads: 0,
          averageRating: 0,
          ratingCount: 0,
          tags: ['machine-learning', 'ai', 'algorithms'],
          keywords: ['ml', 'ai', 'data-science'],
          isOfficial: false,
          isVerified: false,
          isValidated: false,
          requiresMembership: true,
          minRole: 'MEMBER',
          addedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];

      setPendingResources(mockPendingResources);
      setLoading(false);
    } catch (error) {
      console.error('Error loading resources:', error);
      setLoading(false);
    }
  };

  const handleValidate = async (resourceId: string) => {
    try {
      const resource = pendingResources.find(r => r.id === resourceId);
      if (!resource) return;

      const validatedResource = {
        ...resource,
        isValidated: true,
        validatedBy: user?.id,
        validationDate: new Date().toISOString()
      };

      // Ajouter à la bibliothèque sécurisée
      await secureLibraryService.addSecureResource(validatedResource);

      // Mettre à jour les listes
      setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      setValidatedResources(prev => [validatedResource, ...prev]);

      if (onValidationComplete) {
        onValidationComplete();
      }
    } catch (error) {
      console.error('Error validating resource:', error);
    }
  };

  const handleReject = async (resourceId: string, reason: string) => {
    try {
      const resource = pendingResources.find(r => r.id === resourceId);
      if (!resource) return;

      const rejectedResource = {
        ...resource,
        isValidated: false,
        validatedBy: user?.id,
        validationDate: new Date().toISOString()
      };

      setPendingResources(prev => prev.filter(r => r.id !== resourceId));
      setRejectedResources(prev => [rejectedResource, ...prev]);
    } catch (error) {
      console.error('Error rejecting resource:', error);
    }
  };

  const getSourceIcon = (source: SecureResourceSource) => {
    switch (source) {
      case 'OPEN_LIBRARY':
        return <BookOpen className="w-4 h-4" />;
      case 'INTERNET_ARCHIVE':
        return <Globe className="w-4 h-4" />;
      case 'OFFICIAL_DOCS':
        return <FileText className="w-4 h-4" />;
      case 'FREE_BOOKS':
        return <Download className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLicenseColor = (license: ResourceLicense) => {
    switch (license) {
      case 'PUBLIC_DOMAIN':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'CREATIVE_COMMONS':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'OPEN_SOURCE':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'FAIR_USE':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'EDUCATIONAL_USE':
        return 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30';
      default:
        return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'DEBUTANT':
        return 'bg-green-500/20 text-green-500';
      case 'INTERMEDIAIRE':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'AVANCE':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-slate-500/20 text-slate-500';
    }
  };

  const filteredResources = pendingResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === 'ALL' || resource.source === sourceFilter;
    
    return matchesSearch && matchesSource;
  });

  const ResourceCard: React.FC<{ resource: SecureLibraryResource }> = ({ resource }) => {
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleRejectSubmit = () => {
      if (rejectionReason.trim()) {
        handleReject(resource.id, rejectionReason);
        setShowRejectionModal(false);
        setRejectionReason('');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-hub-surface/50 border border-hub-border rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-white">
                  {resource.title}
                </h3>
                <div className={clsx(
                  'px-3 py-1 rounded-full border text-xs font-medium',
                  getLicenseColor(resource.license)
                )}>
                  {resource.license}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  {getSourceIcon(resource.source)}
                  {resource.source}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  {resource.author}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  {resource.publishedYear}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText className="w-4 h-4" />
                  {resource.pages} pages
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setExpandedResource(expandedResource === resource.id ? null : resource.id)}
              className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
            >
              {expandedResource === resource.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {expandedResource === resource.id && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="border-t border-hub-border"
            >
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="font-bold text-white mb-2">Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="font-bold text-white mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-hub-surface/50 text-slate-300 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Catégorie et difficulté */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-white mb-2">Catégorie</h4>
                    <div className="px-3 py-1 bg-hub-surface/50 text-slate-300 rounded-lg text-sm">
                      {resource.category}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">Difficulté</h4>
                    <div className={clsx(
                      'px-3 py-1 rounded-lg text-sm',
                      getDifficultyColor(resource.difficulty)
                    )}>
                      {resource.difficulty}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-hub-border">
                  <button
                    onClick={() => handleValidate(resource.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Valider
                  </button>
                  
                  <button
                    onClick={() => setShowRejectionModal(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Refuser
                  </button>
                  
                  {resource.sourceUrl && (
                    <a
                      href={resource.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Voir source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rejection Modal */}
        <AnimatePresence>
          {showRejectionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowRejectionModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-hub-surface border border-hub-border rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">Refuser la ressource</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Raison du refus *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-4 py-3 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan resize-none"
                    rows={4}
                    placeholder="Expliquez pourquoi vous refusez cette ressource..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectionModal(false)}
                    className="flex-1 px-4 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Refuser
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Validation des Ressources</h2>
        <p className="text-slate-400">Examinez et validez les nouvelles ressources pour la bibliothèque CODEL</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold text-white">{pendingResources.length}</div>
              <div className="text-sm text-yellow-500">En attente</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-white">{validatedResources.length}</div>
              <div className="text-sm text-green-500">Validées</div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-2xl font-bold text-white">{rejectedResources.length}</div>
              <div className="text-sm text-red-500">Refusées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, auteur ou description..."
              className="w-full pl-10 pr-4 py-2 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
            />
          </div>
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            title="Filtrer par source"
            className="pl-10 pr-4 py-2 bg-hub-surface/50 border border-hub-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan appearance-none"
          >
            <option value="ALL">Toutes les sources</option>
            <option value="OPEN_LIBRARY">Open Library</option>
            <option value="INTERNET_ARCHIVE">Internet Archive</option>
            <option value="OFFICIAL_DOCS">Documentation officielle</option>
            <option value="FREE_BOOKS">Livres gratuits</option>
          </select>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <div className="text-center py-12 bg-hub-surface/50 rounded-lg border border-hub-border">
            <Shield className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">
              {pendingResources.length === 0 
                ? 'Aucune ressource en attente de validation' 
                : 'Aucune ressource ne correspond à vos filtres'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceValidation;
