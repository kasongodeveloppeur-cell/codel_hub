import React, { useState, useEffect } from 'react';
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
  Upload,
  Grid,
  List,
  Moon,
  Sun,
  X,
  ChevronDown,
  Users,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { LibraryResource, LibraryCategory, SearchQuery } from '../types';
import { libraryService } from '../services/libraryService';
import { academyService } from '../services/academyService';
import { PDFReader } from './PDFReader';
import { TutorialUpload } from './TutorialUpload';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

export const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  
  // États pour la bibliothèque
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'downloads' | 'date' | 'title'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les modales
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const [showPDFReader, setShowPDFReader] = useState(false);
  const [showTutorialUpload, setShowTutorialUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour les statistiques
  const [popularResources, setPopularResources] = useState<LibraryResource[]>([]);
  const [recentResources, setRecentResources] = useState<LibraryResource[]>([]);

  useEffect(() => {
    initializeLibrary();
  }, []);

  const initializeLibrary = async () => {
    try {
      setIsLoading(true);
      
      // Initialiser les catégories
      await libraryService.initCategories();
      
      // Charger les données
      const [categoriesData, popularData, recentData] = await Promise.all([
        libraryService.getCategories(),
        libraryService.getPopularResources(8),
        libraryService.getRecentResources(8)
      ]);
      
      setCategories(categoriesData);
      setPopularResources(popularData);
      setRecentResources(recentData);
      
      // Charger toutes les ressources initiales
      await performSearch();
    } catch (error) {
      console.error('Error initializing library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      setIsLoading(true);
      
      const query: SearchQuery = {
        query: searchQuery,
        category: selectedCategory || undefined,
        type: selectedType || undefined,
        difficulty: selectedDifficulty || undefined,
        sortBy,
        sortOrder: 'desc'
      };
      
      const results = await libraryService.searchResources(query);
      setResources(results.map(r => r.resource));
    } catch (error) {
      console.error('Error searching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery || selectedCategory || selectedType || selectedDifficulty) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, selectedCategory, selectedType, selectedDifficulty, sortBy]);

  const handleResourceClick = (resource: LibraryResource) => {
    setSelectedResource(resource);
    if (resource.type === 'PDF') {
      setShowPDFReader(true);
    } else {
      window.open(resource.url, '_blank');
    }
  };

  const toggleFavorite = async (resourceId: string) => {
    if (!user) return;
    
    try {
      await libraryService.toggleFavorite(user.id, resourceId);
      // Recharger les ressources pour mettre à jour l'état des favoris
      await performSearch();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const downloadResource = async (resource: LibraryResource) => {
    try {
      await libraryService.incrementDownloads(resource.id);
      window.open(resource.downloadUrl || resource.url, '_blank');
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  const getResourceIcon = (type: LibraryResource['type']) => {
    switch (type) {
      case 'PDF': return <BookOpen className="w-5 h-5 text-red-500" />;
      case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
      case 'LIVRE': return <BookOpen className="w-5 h-5 text-green-500" />;
      default: return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: LibraryResource['type']) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'VIDEO': return 'bg-blue-100 text-blue-800';
      case 'LIVRE': return 'bg-green-100 text-green-800';
      case 'TUTORIEL': return 'bg-purple-100 text-purple-800';
      case 'GUIDE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedDifficulty('');
  };

  if (showPDFReader && selectedResource) {
    return (
      <div className="h-screen">
        <PDFReader
          resource={selectedResource}
          onClose={() => {
            setShowPDFReader(false);
            setSelectedResource(null);
          }}
        />
      </div>
    );
  }

  if (showTutorialUpload) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <TutorialUpload
          onSuccess={(tutorialId) => {
            setShowTutorialUpload(false);
            // Afficher un message de succès
          }}
          onCancel={() => setShowTutorialUpload(false)}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo size="medium" />
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                CODEL Library
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => setShowTutorialUpload(true)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Publier un tutoriel
                </button>
              )}
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et filtres */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des ressources, tutoriels, guides..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            
            {/* Boutons de filtre et vue */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
                {(selectedCategory || selectedType || selectedDifficulty) && (
                  <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    {(selectedCategory || selectedType || selectedDifficulty)?.split(',').filter(Boolean).length}
                  </span>
                )}
              </button>
              
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Panneau de filtres */}
          {showFilters && (
            <div className={`mt-4 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Catégorie */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Tous les types</option>
                    <option value="PDF">PDF</option>
                    <option value="VIDEO">Vidéo</option>
                    <option value="LIVRE">Livre</option>
                    <option value="TUTORIEL">Tutoriel</option>
                    <option value="GUIDE">Guide</option>
                  </select>
                </div>

                {/* Difficulté */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Difficulté
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>

                {/* Tri */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Trier par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`w-full p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="relevance">Pertinence</option>
                    <option value="rating">Note</option>
                    <option value="downloads">Téléchargements</option>
                    <option value="date">Date</option>
                    <option value="title">Titre</option>
                  </select>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Effacer tous les filtres
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques rapide */}
        {!searchQuery && !selectedCategory && !selectedType && !selectedDifficulty && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ressources populaires */}
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Populaires
                  </h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-3">
                  {popularResources.slice(0, 3).map(resource => (
                    <div
                      key={resource.id}
                      onClick={() => handleResourceClick(resource)}
                      className={`p-3 rounded cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(resource.type)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {resource.title}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {resource.downloads} téléchargements
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ressources récentes */}
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Récents
                  </h3>
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-3">
                  {recentResources.slice(0, 3).map(resource => (
                    <div
                      key={resource.id}
                      onClick={() => handleResourceClick(resource)}
                      className={`p-3 rounded cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(resource.type)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {resource.title}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(resource.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Actions rapides
                  </h3>
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                <div className="space-y-3">
                  {user && (
                    <button
                      onClick={() => setShowTutorialUpload(true)}
                      className="w-full flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Publier un tutoriel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedCategory('PROGRAMMATION');
                      performSearch();
                    }}
                    className={`w-full p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700'}`}
                  >
                    <BookOpen className="w-4 h-4 mr-2 inline" />
                    Explorer la programmation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Résultats de recherche */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery || selectedCategory || selectedType || selectedDifficulty
                ? `${resources.length} résultat${resources.length > 1 ? 's' : ''}`
                : 'Toutes les ressources'
              }
            </h2>
            
            {resources.length > 0 && (
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {resources.length} ressource{resources.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : resources.length === 0 ? (
            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune ressource trouvée</p>
              <p className="text-sm mt-2">Essayez de modifier votre recherche ou vos filtres</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {resources.map(resource => (
                <div
                  key={resource.id}
                  className={`group relative rounded-lg shadow-sm hover:shadow-md transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}
                >
                  {/* Actions rapides */}
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user && (
                      <button
                        onClick={() => toggleFavorite(resource.id)}
                        className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'} shadow-md`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => downloadResource(resource)}
                      className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600'} shadow-md`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Contenu */}
                  <div onClick={() => handleResourceClick(resource)} className="cursor-pointer">
                    {/* Miniature ou icône */}
                    <div className={`h-48 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                      {getResourceIcon(resource.type)}
                    </div>

                    <div className="p-4">
                      {/* Type et difficulté */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(resource.type)}`}>
                          {resource.type}
                        </span>
                        {resource.difficulty && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            resource.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                            resource.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {resource.difficulty}
                          </span>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {resource.title}
                      </h3>

                      {/* Description */}
                      <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {resource.description}
                      </p>

                      {/* Métriques */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {resource.rating.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {resource.downloads}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {resource.views}
                            </span>
                          </div>
                        </div>
                        
                        {resource.fileSize && (
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {resource.fileSize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
