import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileText, 
  Archive,
  Download,
  Eye,
  Trash2,
  Edit,
  Share2,
  Copy,
  Move,
  FolderOpen,
  FolderPlus,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  AlertCircle,
  Clock,
  HardDrive,
  Wifi,
  Cloud,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Heart,
  MessageSquare,
  Link,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useThemeClasses } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
  size: number; // in bytes
  url?: string;
  thumbnail?: string;
  duration?: number; // for video/audio in seconds
  dimensions?: { width: number; height: number }; // for images
  format: string;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
  description?: string;
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  folder?: string;
  metadata?: {
    [key: string]: any;
  };
}

interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  files: string[]; // file IDs
  folders: string[]; // folder IDs
  createdAt: Date;
  createdBy: string;
  isPublic: boolean;
  color?: string;
  icon?: string;
}

interface MediaStats {
  totalFiles: number;
  totalSize: number;
  storageUsed: number;
  storageLimit: number;
  fileTypes: Record<string, number>;
  recentUploads: MediaFile[];
  mostViewed: MediaFile[];
}

const MediaCard: React.FC<{
  file: MediaFile;
  viewMode: 'grid' | 'list';
  onSelect: (file: MediaFile) => void;
  onPreview: (file: MediaFile) => void;
  onEdit: (file: MediaFile) => void;
  onDelete: (fileId: string) => void;
  onDownload: (file: MediaFile) => void;
  onShare: (file: MediaFile) => void;
  isDarkMode: boolean;
}> = ({ file, viewMode, onSelect, onPreview, onEdit, onDelete, onDownload, onShare, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'archive': return <Archive className="w-5 h-5" />;
      default: return <File className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'video': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'audio': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'document': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'archive': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (viewMode === 'grid') {
    return (
      <motion.div
        className={`${bgCard} rounded-lg border overflow-hidden cursor-pointer hover:shadow-lg transition-all group`}
        whileHover={{ y: -4 }}
        onClick={() => onSelect(file)}
      >
        {/* Thumbnail/Preview */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {file.type === 'image' && file.thumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : file.type === 'video' && file.thumbnail ? (
            <div className="relative">
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className={`p-4 rounded-lg ${getTypeColor(file.type)}`}>
                {getFileIcon(file.type)}
              </div>
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(file);
              }}
              icon={<Eye className="w-4 h-4" />}
              className="text-white"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(file);
              }}
              icon={<Edit className="w-4 h-4" />}
              className="text-white"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare(file);
              }}
              icon={<Share2 className="w-4 h-4" />}
              className="text-white"
            />
          </div>
        </div>

        {/* File Info */}
        <div className="p-4">
          <h4 className={`font-medium ${text} mb-1 truncate`}>{file.name}</h4>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>{formatFileSize(file.size)}</span>
            <span>{formatDate(file.uploadedAt)}</span>
          </div>
          
          {/* Tags */}
          {file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {file.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
              {file.tags.length > 2 && (
                <Badge variant="secondary" size="sm">
                  +{file.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {file.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {file.downloadCount}
            </span>
            {file.isPublic && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Public
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // List View
  return (
    <motion.div
      className={`${bgCard} rounded-lg border p-4 cursor-pointer hover:shadow-md transition-all`}
      whileHover={{ x: 4 }}
      onClick={() => onSelect(file)}
    >
      <div className="flex items-center gap-4">
        {/* File Icon */}
        <div className={`p-3 rounded-lg ${getTypeColor(file.type)} flex-shrink-0`}>
          {getFileIcon(file.type)}
        </div>
        
        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-medium ${text} truncate`}>{file.name}</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(file);
                }}
                icon={<Eye className="w-4 h-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(file);
                }}
                icon={<Download className="w-4 h-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(file.id);
                }}
                icon={<Trash2 className="w-4 h-4" />}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{formatFileSize(file.size)}</span>
            <span>{file.format}</span>
            <span>{formatDate(file.uploadedAt)}</span>
            {file.duration && (
              <span>{Math.floor(file.duration / 60)}:{(file.duration % 60).toString().padStart(2, '0')}</span>
            )}
          </div>
          
          {/* Tags */}
          {file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {file.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
              {file.tags.length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{file.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MediaPreview: React.FC<{
  file: MediaFile | null;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}> = ({ file, isOpen, onClose, isDarkMode }) => {
  const { bg, text } = useThemeClasses();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!isOpen || !file) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePlayPause = () => {
    if (file.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (file.type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (file.type === 'video' && videoRef.current) {
      videoRef.current.volume = newVolume;
    } else if (file.type === 'audio' && audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleFullscreen = () => {
    if (file.type === 'image' || file.type === 'video') {
      // Implement fullscreen logic
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`${bg} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h3 className={`font-semibold ${text}`}>{file.name}</h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)} • {file.format}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                icon={<Maximize2 className="w-4 h-4" />}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<X className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800">
            {file.type === 'image' && file.url && (
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-full object-contain"
              />
            )}
            
            {file.type === 'video' && file.url && (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={file.url}
                  className="max-w-full max-h-full"
                  controls={false}
                />
                
                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 rounded-lg p-3 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    className="text-white"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                      icon={volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      className="text-white"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {file.type === 'audio' && file.url && (
              <div className="w-full max-w-md">
                <audio
                  ref={audioRef}
                  src={file.url}
                  className="w-full"
                  controls={false}
                />
                
                {/* Audio Controls */}
                <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    className="text-white"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                      icon={volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      className="text-white"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {file.type === 'document' && (
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className={`${text} mb-4`}`Aperçu non disponible pour ce type de fichier</p>
                <Button variant="primary" onClick={() => window.open(file.url, '_blank')}>
                  Ouvrir le document
                </Button>
              </div>
            )}
            
            {file.type === 'archive' && (
              <div className="text-center">
                <Archive className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className={`${text} mb-4`}`Aperçu non disponible pour ce type de fichier</p>
                <Button variant="primary" onClick={() => window.open(file.url, '_blank')}>
                  Télécharger l'archive
                </Button>
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Taille:</span>
                <span className={`ml-2 ${text}`}>{formatFileSize(file.size)}</span>
              </div>
              <div>
                <span className="text-gray-500">Format:</span>
                <span className={`ml-2 ${text}`}>{file.format}</span>
              </div>
              <div>
                <span className="text-gray-500">Uploadé:</span>
                <span className={`ml-2 ${text}`}>{file.uploadedAt.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Vues:</span>
                <span className={`ml-2 ${text}`}>{file.viewCount}</span>
              </div>
            </div>
            
            {file.tags.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-500 text-sm">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {file.tags.map(tag => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const MediaManager: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const { user } = useAuth();
  const [isDarkMode] = useState(false);
  
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [filter, setFilter] = useState({
    type: 'all',
    search: '',
    tags: [] as string[]
  });
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Demo data
  const demoFiles: MediaFile[] = [
    {
      id: '1',
      name: 'screenshot-projet-react.png',
      type: 'image',
      size: 245760,
      url: '/api/placeholder/400/300',
      thumbnail: '/api/placeholder/200/150',
      dimensions: { width: 1920, height: 1080 },
      format: 'PNG',
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: user?.uid || '1',
      tags: ['react', 'projet', 'frontend'],
      description: 'Screenshot du projet React',
      isPublic: true,
      downloadCount: 12,
      viewCount: 45
    },
    {
      id: '2',
      name: 'tuto-javascript-avance.mp4',
      type: 'video',
      size: 5242880,
      url: '/api/video/tutorial',
      thumbnail: '/api/placeholder/320/180',
      duration: 1800,
      format: 'MP4',
      uploadedAt: new Date('2024-02-20'),
      uploadedBy: user?.uid || '1',
      tags: ['javascript', 'tutoriel', 'avance'],
      description: 'Tutoriel JavaScript avancé',
      isPublic: true,
      downloadCount: 34,
      viewCount: 156
    },
    {
      id: '3',
      name: 'podcast-developpement-web.mp3',
      type: 'audio',
      size: 1048576,
      url: '/api/audio/podcast',
      duration: 3600,
      format: 'MP3',
      uploadedAt: new Date('2024-03-10'),
      uploadedBy: user?.uid || '1',
      tags: ['podcast', 'web', 'developpement'],
      description: 'Podcast sur le développement web',
      isPublic: false,
      downloadCount: 8,
      viewCount: 23
    },
    {
      id: '4',
      name: 'documentation-api.pdf',
      type: 'document',
      size: 524288,
      url: '/api/docs/api',
      format: 'PDF',
      uploadedAt: new Date('2024-03-15'),
      uploadedBy: user?.uid || '1',
      tags: ['documentation', 'api', 'reference'],
      description: 'Documentation API REST',
      isPublic: true,
      downloadCount: 67,
      viewCount: 234
    },
    {
      id: '5',
      name: 'assets-projet.zip',
      type: 'archive',
      size: 2097152,
      url: '/api/archive/assets',
      format: 'ZIP',
      uploadedAt: new Date('2024-04-01'),
      uploadedBy: user?.uid || '1',
      tags: ['assets', 'projet', 'ressources'],
      description: 'Archive des assets du projet',
      isPublic: false,
      downloadCount: 15,
      viewCount: 45
    }
  ];

  const demoFolders: MediaFolder[] = [
    {
      id: '1',
      name: 'Images',
      files: ['1'],
      folders: [],
      createdAt: new Date('2024-01-01'),
      createdBy: user?.uid || '1',
      isPublic: true,
      color: 'blue'
    },
    {
      id: '2',
      name: 'Vidéos',
      files: ['2'],
      folders: [],
      createdAt: new Date('2024-01-01'),
      createdBy: user?.uid || '1',
      isPublic: true,
      color: 'purple'
    },
    {
      id: '3',
      name: 'Documents',
      files: ['4'],
      folders: [],
      createdAt: new Date('2024-01-01'),
      createdBy: user?.uid || '1',
      isPublic: false,
      color: 'yellow'
    }
  ];

  const demoStats: MediaStats = {
    totalFiles: 5,
    totalSize: 9437184,
    storageUsed: 9437184,
    storageLimit: 1073741824, // 1GB
    fileTypes: {
      image: 1,
      video: 1,
      audio: 1,
      document: 1,
      archive: 1
    },
    recentUploads: demoFiles.slice(0, 3),
    mostViewed: demoFiles.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3)
  };

  useEffect(() => {
    setFiles(demoFiles);
    setFolders(demoFolders);
    setStats(demoStats);
  }, []);

  const filteredFiles = files.filter(file => {
    if (filter.type !== 'all' && file.type !== filter.type) return false;
    if (filter.search && !file.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.tags.length > 0 && !filter.tags.some(tag => file.tags.includes(tag))) return false;
    return true;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.uploadedAt.getTime() - a.uploadedAt.getTime();
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleFileSelect = (file: MediaFile) => {
    setSelectedFile(file);
  };

  const handlePreview = (file: MediaFile) => {
    setSelectedFile(file);
    setShowPreview(true);
  };

  const handleEdit = (file: MediaFile) => {
    console.log('Edit file:', file);
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDownload = (file: MediaFile) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const handleShare = (file: MediaFile) => {
    if (navigator.share) {
      navigator.share({
        title: file.name,
        text: file.description,
        url: file.url
      });
    } else {
      navigator.clipboard.writeText(file.url || '');
    }
  };

  const handleUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const newFile: MediaFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' :
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' :
              file.type.includes('pdf') ? 'document' :
              ['zip', 'rar', '7z'].includes(file.name.split('.').pop()?.toLowerCase() || '') ? 'archive' : 'other',
        size: file.size,
        format: file.name.split('.').pop()?.toUpperCase() || '',
        uploadedAt: new Date(),
        uploadedBy: user?.uid || '1',
        tags: [],
        isPublic: false,
        downloadCount: 0,
        viewCount: 0
      };
      
      setFiles(prev => [newFile, ...prev]);
      setUploadProgress(prev => ({ ...prev, [newFile.id]: 100 }));
      
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[newFile.id];
          return newProgress;
        });
      }, 2000);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = stats ? (stats.storageUsed / stats.storageLimit) * 100 : 0;

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <HardDrive className="w-8 h-8 text-cyan-500" />
            <div>
              <h1 className="text-3xl font-bold">Gestionnaire Média</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Stockez et gérez tous vos fichiers multimédias
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              icon={<Upload className="w-4 h-4" />}
            >
              Téléverser
            </Button>
          </div>
        </div>

        {/* Storage Stats */}
        {stats && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Espace utilisé</span>
                    <span className="text-sm font-medium">
                      {formatFileSize(stats.storageUsed)} / {formatFileSize(stats.storageLimit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-500">{stats.totalFiles}</div>
                  <div className="text-sm text-gray-500">Fichiers total</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {Object.keys(stats.fileTypes).length}
                  </div>
                  <div className="text-sm text-gray-500">Types de fichiers</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {stats.recentUploads.length}
                  </div>
                  <div className="text-sm text-gray-500">Uploads récents</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="Rechercher des fichiers..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              {/* Type Filter */}
              <select
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
              >
                <option value="all">Tous les types</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="archive">Archives</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
              >
                <option value="date">Date</option>
                <option value="name">Nom</option>
                <option value="size">Taille</option>
                <option value="type">Type</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  icon={<Grid className="w-4 h-4" />}
                />
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  icon={<List className="w-4 h-4" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {sortedFiles.map(file => (
            <MediaCard
              key={file.id}
              file={file}
              viewMode={viewMode}
              onSelect={handleFileSelect}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onShare={handleShare}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="fixed bottom-4 right-4 space-y-2">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <motion.div
                key={fileId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${bg} rounded-lg shadow-lg p-3 min-w-[300px]`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Téléversement...</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        <MediaPreview
          file={selectedFile}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          isDarkMode={isDarkMode}
        />

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${bg} rounded-xl max-w-md w-full p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${text}`}>Téléverser des fichiers</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploadModal(false)}
                    icon={<X className="w-4 h-4" />}
                  />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className={`${text} mb-4`}>
                    Glissez-déposez des fichiers ici ou cliquez pour sélectionner
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        handleUpload(e.target.files);
                        setShowUploadModal(false);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    variant="primary"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Sélectionner des fichiers
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {sortedFiles.length === 0 && (
          <div className="text-center py-12">
            <HardDrive className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${text}`}>
              Aucun fichier trouvé
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Commencez par téléverser vos fichiers multimédias
            </p>
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              icon={<Upload className="w-4 h-4" />}
            >
              Téléverser des fichiers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
