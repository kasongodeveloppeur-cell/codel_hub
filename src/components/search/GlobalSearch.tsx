import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  FileText, 
  Video, 
  BookOpen, 
  User, 
  Calendar, 
  Code, 
  Award,
  Briefcase,
  Globe,
  Clock,
  TrendingUp,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useThemeClasses } from '../../hooks/useTheme';

interface SearchResult {
  id: string;
  type: 'tutorial' | 'project' | 'resource' | 'user' | 'event' | 'quiz' | 'forum_post';
  title: string;
  description: string;
  url: string;
  category?: string;
  author?: string;
  date: Date;
  tags: string[];
  relevanceScore: number;
  metadata?: {
    duration?: string;
    difficulty?: string;
    participants?: number;
    status?: string;
    views?: number;
    likes?: number;
  };
}

interface SearchFilters {
  types: string[];
  categories: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'date' | 'popularity';
}

const ResultItem: React.FC<{
  result: SearchResult;
  onClick: (result: SearchResult) => void;
  isDarkMode: boolean;
}> = ({ result, onClick, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tutorial': return <Video className="w-4 h-4" />;
      case 'project': return <Code className="w-4 h-4" />;
      case 'resource': return <BookOpen className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'quiz': return <Award className="w-4 h-4" />;
      case 'forum_post': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tutorial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'project': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'resource': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'user': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'event': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'quiz': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'forum_post': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className={`${bgCard} rounded-lg border p-4 cursor-pointer hover:shadow-md transition-all hover:border-cyan-500/50`}
      whileHover={{ x: 4 }}
      onClick={() => onClick(result)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${getTypeColor(result.type)} flex-shrink-0`}>
          {getTypeIcon(result.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className={`font-semibold ${text} mb-1 line-clamp-1`}>
                {result.title}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                {result.description}
              </p>
            </div>
            
            <div className="ml-3 text-right">
              <div className="text-xs text-gray-500">
                {result.relevanceScore}% match
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {result.author && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {result.author}
                </span>
              )}
              
              {result.metadata?.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {result.metadata.duration}
                </span>
              )}
              
              {result.metadata?.views && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {result.metadata.views} vues
                </span>
              )}
              
              <span>{result.date.toLocaleDateString()}</span>
            </div>
            
            {result.category && (
              <Badge variant="outline" size="sm">
                {result.category}
              </Badge>
            )}
          </div>
          
          {result.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
              {result.tags.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{result.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SearchFilters: React.FC<{
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableCategories: string[];
  isDarkMode: boolean;
}> = ({ filters, onFiltersChange, availableCategories, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const types = [
    { value: 'tutorial', label: 'Tutoriels' },
    { value: 'project', label: 'Projets' },
    { value: 'resource', label: 'Ressources' },
    { value: 'user', label: 'Utilisateurs' },
    { value: 'event', label: 'Événements' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'forum_post', label: 'Forum' }
  ];

  const dateRanges = [
    { value: 'all', label: 'Toutes les dates' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'year', label: 'Cette année' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularité' }
  ];

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    onFiltersChange({ ...filters, types: newTypes });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Types */}
          <div>
            <h4 className={`font-medium ${text} mb-3`}>Types de contenu</h4>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <label
                  key={type.value}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    filters.types.includes(type.value)
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.value)}
                    onChange={() => handleTypeToggle(type.value)}
                    className="sr-only"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          {availableCategories.length > 0 && (
            <div>
              <h4 className={`font-medium ${text} mb-3`}>Catégories</h4>
              <div className="flex flex-wrap gap-2">
                {availableCategories.slice(0, 8).map(category => (
                  <label
                    key={category}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                      filters.categories.includes(category)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...filters.categories, category]
                          : filters.categories.filter(c => c !== category);
                        onFiltersChange({ ...filters, categories: newCategories });
                      }}
                      className="sr-only"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Date Range and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${text} mb-2`}>
                Période
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value as any })}
                className={`w-full px-3 py-2 rounded-lg border ${bgCard} ${text} border-gray-200 dark:border-gray-700`}
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${text} mb-2`}>
                Trier par
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
                className={`w-full px-3 py-2 rounded-lg border ${bgCard} ${text} border-gray-200 dark:border-gray-700`}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const GlobalSearch: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    types: ['tutorial', 'project', 'resource', 'user', 'event', 'quiz', 'forum_post'],
    categories: [],
    dateRange: 'all',
    sortBy: 'relevance'
  });

  // Données de démonstration
  const demoResults: SearchResult[] = [
    {
      id: '1',
      type: 'tutorial',
      title: 'React Hooks Avancés',
      description: 'Apprenez à maîtriser les hooks React avec des patterns avancés et meilleures pratiques.',
      url: '/tutorials/react-hooks-advanced',
      category: 'Frontend',
      author: 'Alice Martin',
      date: new Date('2024-01-15'),
      tags: ['React', 'JavaScript', 'Hooks'],
      relevanceScore: 95,
      metadata: {
        duration: '2h30',
        difficulty: 'Avancé',
        views: 1234,
        likes: 89
      }
    },
    {
      id: '2',
      type: 'project',
      title: 'E-Commerce Platform',
      description: 'Plateforme e-commerce complète avec React, Node.js et MongoDB.',
      url: '/projects/ecommerce-platform',
      category: 'Full Stack',
      author: 'Bob Dupont',
      date: new Date('2024-02-01'),
      tags: ['React', 'Node.js', 'MongoDB', 'E-commerce'],
      relevanceScore: 88,
      metadata: {
        status: 'completed',
        likes: 156
      }
    },
    {
      id: '3',
      type: 'resource',
      title: 'Guide CSS Grid Complet',
      description: 'Guide complet sur CSS Grid avec exemples pratiques et exercices.',
      url: '/resources/css-grid-guide',
      category: 'Frontend',
      author: 'Claire Durand',
      date: new Date('2024-01-20'),
      tags: ['CSS', 'Grid', 'Layout'],
      relevanceScore: 82,
      metadata: {
        duration: '1h45',
        views: 892
      }
    },
    {
      id: '4',
      type: 'event',
      title: 'Workshop React Native',
      description: 'Atelier pratique sur le développement mobile avec React Native.',
      url: '/events/react-native-workshop',
      category: 'Workshop',
      author: 'CODEL Club',
      date: new Date('2024-03-15'),
      tags: ['React Native', 'Mobile', 'Workshop'],
      relevanceScore: 78,
      metadata: {
        participants: 25,
        status: 'upcoming'
      }
    },
    {
      id: '5',
      type: 'quiz',
      title: 'JavaScript Fundamentals',
      description: 'Testez vos connaissances en JavaScript avec ce quiz complet.',
      url: '/quiz/javascript-fundamentals',
      category: 'Quiz',
      author: 'CODEL Academy',
      date: new Date('2024-01-10'),
      tags: ['JavaScript', 'Quiz', 'Fundamentals'],
      relevanceScore: 75,
      metadata: {
        duration: '30min',
        difficulty: 'Intermédiaire'
      }
    }
  ];

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    demoResults.forEach(result => {
      if (result.category) categories.add(result.category);
    });
    return Array.from(categories);
  }, []);

  const filteredResults = useMemo(() => {
    let filtered = demoResults.filter(result => {
      // Filter by query
      if (query) {
        const queryLower = query.toLowerCase();
        const matchesQuery = 
          result.title.toLowerCase().includes(queryLower) ||
          result.description.toLowerCase().includes(queryLower) ||
          result.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
          (result.author && result.author.toLowerCase().includes(queryLower)) ||
          (result.category && result.category.toLowerCase().includes(queryLower));
        
        if (!matchesQuery) return false;
      }

      // Filter by type
      if (filters.types.length > 0 && !filters.types.includes(result.type)) {
        return false;
      }

      // Filter by category
      if (filters.categories.length > 0 && result.category && !filters.categories.includes(result.category)) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const resultDate = new Date(result.date);
        
        switch (filters.dateRange) {
          case 'today':
            if (resultDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (resultDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (resultDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (resultDate < yearAgo) return false;
            break;
        }
      }

      return true;
    });

    // Sort results
    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'popularity':
          return (b.metadata?.views || 0) - (a.metadata?.views || 0);
        case 'relevance':
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });
  }, [query, filters]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    
    // Simuler une recherche asynchrone
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Navigate to:', result.url);
    // Navigation vers le résultat
  };

  const clearFilters = () => {
    setFilters({
      types: ['tutorial', 'project', 'resource', 'user', 'event', 'quiz', 'forum_post'],
      categories: [],
      dateRange: 'all',
      sortBy: 'relevance'
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.dateRange !== 'all';

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-cyan-500 mr-3" />
            <h1 className="text-4xl font-bold">Recherche Globale</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Trouvez des tutoriels, projets, ressources et plus encore
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <Input
            placeholder="Rechercher des tutoriels, projets, ressources..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="text-lg"
          />
          
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
            >
              Filtres {hasActiveFilters && `(${filters.categories.length + (filters.dateRange !== 'all' ? 1 : 0)})`}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Effacer les filtres
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <SearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableCategories={availableCategories}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${text}`}>
              {query ? `Résultats pour "${query}"` : 'Tous les contenus'}
            </h2>
            
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''}
              {isLoading && ' (recherche...)'}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`${bg} rounded-lg p-4 animate-pulse`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-4">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ResultItem
                    result={result}
                    onClick={handleResultClick}
                    isDarkMode={isDarkMode}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-medium mb-2 ${text}`}>
                {query ? 'Aucun résultat trouvé' : 'Commencez votre recherche'}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {query 
                  ? 'Essayez de modifier votre recherche ou vos filtres'
                  : 'Tapez quelque chose dans la barre de recherche pour commencer'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
