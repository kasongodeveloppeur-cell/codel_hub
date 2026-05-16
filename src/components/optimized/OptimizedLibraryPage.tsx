import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Video, 
  Download, 
  Star, 
  Eye, 
  Heart,
  Bookmark,
  Grid,
  List,
  Moon,
  Sun,
  ChevronDown,
  Users,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { LibraryResource, LibraryCategory, SearchQuery } from '../../types';
import { libraryService } from '../../services/libraryService';
import { academyService } from '../../services/academyService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';

// Composants optimisés séparés
const ResourceCard: React.FC<{
  resource: LibraryResource;
  isDarkMode: boolean;
  onView: (resource: LibraryResource) => void;
  onDownload: (resource: LibraryResource) => void;
  onFavorite: (resource: LibraryResource) => void;
}> = ({ resource, isDarkMode, onView, onDownload, onFavorite }) => {
  const cardClasses = `
    group relative overflow-hidden rounded-xl border transition-all duration-300
    ${isDarkMode 
      ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/50' 
      : 'bg-white border-gray-200 hover:border-cyan-500'
    }
    hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1
  `;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <BookOpen className="w-4 h-4" />;
      case 'VIDEO': return <Video className="w-4 h-4" />;
      case 'DOCUMENTATION': return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'VIDEO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DOCUMENTATION': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      className={cardClasses}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {resource.thumbnail ? (
          <LazyImage
            src={resource.thumbnail}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
          }`}>
            {getTypeIcon(resource.type)}
          </div>
        )}
        
        {/* Overlay avec actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onView(resource)}
              className="flex-1"
            >
              Voir
            </Button>
            {resource.downloadUrl && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(resource)}
                icon={<Download className="w-3 h-3" />}
              />
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onFavorite(resource)}
              icon={<Heart className="w-3 h-3" />}
            />
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
            {resource.type}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star className="w-3 h-3 fill-current" />
            {resource.rating}
          </div>
        </div>
        
        <h3 className={`font-semibold text-sm mb-1 line-clamp-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {resource.title}
        </h3>
        
        <p className={`text-xs mb-3 line-clamp-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {resource.views}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {resource.downloads}
            </span>
          </div>
          {resource.duration && (
            <span>{resource.duration}</span>
          )}
        </div>
        
        {/* Tags */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {resource.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FilterPanel: React.FC<{
  categories: LibraryCategory[];
  selectedCategory: string;
  selectedType: string;
  selectedDifficulty: string;
  sortBy: string;
  onCategoryChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onSortChange: (value: string) => void;
  isDarkMode: boolean;
}> = ({
  categories,
  selectedCategory,
  selectedType,
  selectedDifficulty,
  sortBy,
  onCategoryChange,
  onTypeChange,
  onDifficultyChange,
  onSortChange,
  isDarkMode
}) => {
  return (
    <Card variant="outlined" className="p-6">
      <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Filtres
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Catégorie
          </label>
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={[
              { value: '', label: 'Toutes les catégories' },
              ...categories.map(cat => ({ value: cat.id, label: cat.name }))
            ]}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Type
          </label>
          <Select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            options={[
              { value: '', label: 'Tous les types' },
              { value: 'PDF', label: 'PDF' },
              { value: 'VIDEO', label: 'Vidéo' },
              { value: 'DOCUMENTATION', label: 'Documentation' },
              { value: 'NOTES', label: 'Notes' },
              { value: 'ARTICLE', label: 'Article' }
            ]}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Difficulté
          </label>
          <Select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            options={[
              { value: '', label: 'Tous les niveaux' },
              { value: 'Débutant', label: 'Débutant' },
              { value: 'Intermédiaire', label: 'Intermédiaire' },
              { value: 'Avancé', label: 'Avancé' }
            ]}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Trier par
          </label>
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            options={[
              { value: 'relevance', label: 'Pertinence' },
              { value: 'rating', label: 'Note' },
              { value: 'downloads', label: 'Téléchargements' },
              { value: 'date', label: 'Date' },
              { value: 'title', label: 'Titre' }
            ]}
          />
        </div>
      </div>
    </Card>
  );
};

export const OptimizedLibraryPage: React.FC = () => {
  const { user } = useAuth();
  
  // États optimisés
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'downloads' | 'date' | 'title'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les modales
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);

  // Filtrage et tri optimisés avec useMemo
  const filteredResources = useMemo(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      const matchesType = !selectedType || resource.type === selectedType;
      const matchesDifficulty = !selectedDifficulty || resource.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
    });

    // Tri
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'relevance':
        default:
          // Pertinence basée sur la correspondance de recherche
          const aRelevance = (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                            (a.description.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
          const bRelevance = (b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 2 : 0) +
                            (b.description.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0);
          return bRelevance - aRelevance;
      }
    });
  }, [resources, searchQuery, selectedCategory, selectedType, selectedDifficulty, sortBy]);

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const [resourcesData, categoriesData] = await Promise.all([
          libraryService.getResources(),
          libraryService.getCategories()
        ]);
        setResources(resourcesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading library data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleViewResource = (resource: LibraryResource) => {
    setSelectedResource(resource);
    // Logique pour afficher la ressource
  };

  const handleDownloadResource = (resource: LibraryResource) => {
    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, '_blank');
    }
  };

  const handleFavoriteResource = (resource: LibraryResource) => {
    // Logique pour ajouter aux favoris
    console.log('Favorite:', resource.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Bibliothèque CODEL
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span>{resources.length} ressources</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  icon={<Grid className="w-4 h-4" />}
                />
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  icon={<List className="w-4 h-4" />}
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                icon={isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Input
              placeholder="Rechercher des ressources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="text-lg"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filtres latéraux */}
          <div className="w-80 flex-shrink-0">
            <FilterPanel
              categories={categories}
              selectedCategory={selectedCategory}
              selectedType={selectedType}
              selectedDifficulty={selectedDifficulty}
              sortBy={sortBy}
              onCategoryChange={setSelectedCategory}
              onTypeChange={setSelectedType}
              onDifficultyChange={setSelectedDifficulty}
              onSortChange={setSortBy}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Résultats */}
            <div className="mb-6 flex items-center justify-between">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredResources.length} résultat{filteredResources.length > 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </p>
              
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tri:
                </span>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  options={[
                    { value: 'relevance', label: 'Pertinence' },
                    { value: 'rating', label: 'Note' },
                    { value: 'downloads', label: 'Téléchargements' },
                    { value: 'date', label: 'Date' },
                    { value: 'title', label: 'Titre' }
                  ]}
                />
              </div>
            </div>

            {/* Grille de ressources */}
            {filteredResources.length > 0 ? (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredResources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isDarkMode={isDarkMode}
                    onView={handleViewResource}
                    onDownload={handleDownloadResource}
                    onFavorite={handleFavoriteResource}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className={`w-12 h-12 mx-auto mb-4 ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <h3 className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Aucune ressource trouvée
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Essayez de modifier vos filtres ou votre recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedLibraryPage;
