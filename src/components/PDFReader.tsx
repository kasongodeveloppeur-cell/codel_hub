import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ArrowLeft, 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Bookmark, 
  Sun, 
  Moon, 
  RotateCw,
  Maximize2,
  Minimize2,
  Home,
  BookOpen
} from 'lucide-react';
import { LibraryResource, ReadingProgress, Bookmark as BookmarkType } from '../types';
import { libraryService } from '../services/libraryService';
import { useAuth } from '../context/AuthContext';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFReaderProps {
  resource: LibraryResource;
  onClose?: () => void;
  initialPage?: number;
  initialScale?: number;
}

export const PDFReader: React.FC<PDFReaderProps> = ({
  resource,
  onClose,
  initialPage = 1,
  initialScale = 1.0
}) => {
  const { user } = useAuth();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(initialScale);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState<boolean>(false);
  const [bookmarkNote, setBookmarkNote] = useState<string>('');
  const [bookmarkTitle, setBookmarkTitle] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);

  // Charger les styles CSS de react-pdf dynamiquement (désactivé pour le build)
  useEffect(() => {
    // Styles CSS désactivés temporairement pour résoudre le problème de build Vercel
    // Les styles seront ajoutés manuellement dans le CSS global si nécessaire
    console.log('PDFReader component mounted');
  }, []);

  // Charger la progression de lecture
  useEffect(() => {
    if (user && resource) {
      loadReadingProgress();
    }
  }, [user, resource]);

  const loadReadingProgress = async () => {
    if (!user) return;
    
    try {
      const progress = await libraryService.getReadingProgress(user.id, resource.id);
      if (progress) {
        setReadingProgress(progress);
        setPageNumber(progress.currentPage || 1);
        setBookmarks(progress.bookmarks || []);
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder la progression de lecture
  const saveProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      await libraryService.saveReadingProgress(user.id, resource.id, {
        currentPage: pageNumber,
        progress: (pageNumber / numPages) * 100,
        isCompleted: pageNumber === numPages,
        readingTime: (readingProgress?.readingTime || 0) + 1 // Minute approximative
      });
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  }, [user, resource, pageNumber, numPages, readingProgress]);

  // Sauvegarder automatiquement la progression
  useEffect(() => {
    if (numPages > 0 && !isLoading) {
      const timer = setTimeout(() => {
        saveProgress();
      }, 2000); // Sauvegarder après 2 secondes d'inactivité
      
      return () => clearTimeout(timer);
    }
  }, [pageNumber, saveProgress, numPages, isLoading]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const rotateDocument = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const downloadPDF = () => {
    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, '_blank');
    } else {
      window.open(resource.url, '_blank');
    }
  };

  const addBookmark = async () => {
    if (!user || !bookmarkTitle.trim()) return;
    
    try {
      await libraryService.addBookmark(user.id, resource.id, {
        page: pageNumber,
        note: bookmarkNote.trim(),
        title: bookmarkTitle.trim()
      });
      
      // Recharger les bookmarks
      await loadReadingProgress();
      
      // Réinitialiser le formulaire
      setBookmarkTitle('');
      setBookmarkNote('');
      setShowBookmarkModal(false);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const goToBookmark = (bookmark: BookmarkType) => {
    if (bookmark.page) {
      setPageNumber(bookmark.page);
    }
  };

  const goToFirstPage = () => {
    setPageNumber(1);
  };

  const goToLastPage = () => {
    setPageNumber(numPages);
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Header avec contrôles */}
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
              title="Fermer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex flex-col">
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {resource.title}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Page {pageNumber} / {numPages} • {Math.round((pageNumber / numPages) * 100)}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Navigation */}
          <button
            onClick={goToFirstPage}
            disabled={pageNumber === 1}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Première page"
          >
            <Home className="w-4 h-4" />
          </button>
          
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Page précédente"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Page suivante"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToLastPage}
            disabled={pageNumber === numPages}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Dernière page"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

          {/* Zoom */}
          <button
            onClick={zoomOut}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={zoomIn}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />

          {/* Actions */}
          <button
            onClick={rotateDocument}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Rotation"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Mode sombre"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Plein écran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setShowBookmarkModal(true)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Ajouter un marque-page"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          
          <button
            onClick={downloadPDF}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Télécharger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zone de lecture principale */}
      <div className="flex-1 overflow-auto flex">
        {/* Barre latérale des bookmarks */}
        {bookmarks.length > 0 && (
          <div className={`w-64 border-r ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-4 overflow-y-auto`}>
            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Marque-pages ({bookmarks.length})
            </h4>
            <div className="space-y-2">
              {bookmarks.map((bookmark) => (
                <button
                  key={bookmark.id}
                  onClick={() => goToBookmark(bookmark)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
                >
                  <div className="font-medium text-sm">{bookmark.title}</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Page {bookmark.page}
                  </div>
                  {bookmark.note && (
                    <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {bookmark.note}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conteneur PDF */}
        <div className="flex-1 flex items-center justify-center p-8">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Chargement du document...
              </p>
            </div>
          ) : (
            <div
              className="relative"
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                transition: 'transform 0.3s ease'
              }}
            >
              <Document
                file={resource.url}
                onLoadSuccess={onDocumentLoadSuccess}
                className="shadow-2xl"
              >
                <Page
                  pageNumber={pageNumber}
                  className="border border-gray-300"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout de bookmark */}
      {showBookmarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-96 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Ajouter un marque-page
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Titre
                </label>
                <input
                  type="text"
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  placeholder="Titre du marque-page"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Note (optionnelle)
                </label>
                <textarea
                  value={bookmarkNote}
                  onChange={(e) => setBookmarkNote(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  rows={3}
                  placeholder="Ajouter une note..."
                />
              </div>
              
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Page actuelle: {pageNumber}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowBookmarkModal(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                Annuler
              </button>
              <button
                onClick={addBookmark}
                disabled={!bookmarkTitle.trim()}
                className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 bg-blue-500 hover:bg-blue-600 text-white`}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
