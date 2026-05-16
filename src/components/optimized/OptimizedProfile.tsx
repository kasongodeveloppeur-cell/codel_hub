import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Code, 
  TrendingUp, 
  Settings, 
  Camera,
  Edit,
  Save,
  X,
  Shield,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Input, Textarea, Select } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useThemeClasses } from '../../hooks/useTheme';

// Composants séparés pour l'optimisation
const ProfileHeader: React.FC<{
  user: any;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  isDarkMode: boolean;
}> = ({ user, isEditing, onEditToggle, onSave, isDarkMode }) => {
  const { bg, text, border, primary, primaryBg } = useThemeClasses();

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${primaryBg} ${text}`}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              {isEditing && (
                <Button
                  variant="primary"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full p-2"
                  icon={<Camera className="w-4 h-4" />}
                />
              )}
            </div>
            
            {/* Infos principales */}
            <div>
              <h1 className={`text-2xl font-bold ${text} mb-1`}>
                {user?.name || 'Utilisateur'}
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                @{user?.handle || 'handle'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  {user?.clubRole || 'Membre'}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Niveau {user?.level || 1}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {user?.points || 0} points
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onEditToggle}
                  icon={<X className="w-4 h-4" />}
                >
                  Annuler
                </Button>
                <Button
                  onClick={onSave}
                  icon={<Save className="w-4 h-4" />}
                >
                  Sauvegarder
                </Button>
              </>
            ) : (
              <Button
                onClick={onEditToggle}
                icon={<Edit className="w-4 h-4" />}
              >
                Modifier
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsGrid: React.FC<{
  stats: any;
  isDarkMode: boolean;
}> = ({ stats, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const statItems = [
    { label: 'Projets', value: stats?.projectsCount || 0, icon: <Code className="w-5 h-5" />, color: 'text-blue-500' },
    { label: 'Tutoriels', value: stats?.tutorialsCount || 0, icon: <BookOpen className="w-5 h-5" />, color: 'text-green-500' },
    { label: 'Messages', value: stats?.forumPostsCount || 0, icon: <User className="w-5 h-5" />, color: 'text-purple-500' },
    { label: 'Événements', value: stats?.eventsAttended || 0, icon: <Calendar className="w-5 h-5" />, color: 'text-orange-500' },
    { label: 'Badges', value: stats?.badgesEarned || 0, icon: <Award className="w-5 h-5" />, color: 'text-yellow-500' },
    { label: 'Contributions', value: stats?.contributionPoints || 0, icon: <TrendingUp className="w-5 h-5" />, color: 'text-cyan-500' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${bgCard} p-4 rounded-lg border`}
        >
          <div className={`${stat.color} mb-2`}>{stat.icon}</div>
          <div className={`text-2xl font-bold ${text}`}>{stat.value}</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const BadgesSection: React.FC<{
  badges: any[];
  isDarkMode: boolean;
}> = ({ badges, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  if (!badges || badges.length === 0) {
    return (
      <Card>
        <CardHeader title="Badges" icon={<Award className="w-5 h-5 text-yellow-500" />} />
        <CardContent>
          <div className="text-center py-8">
            <Award className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Aucun badge obtenu pour le moment
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title="Badges" 
        subtitle={`${badges.length} badge${badges.length > 1 ? 's' : ''} obtenu${badges.length > 1 ? 's' : ''}`}
        icon={<Award className="w-5 h-5 text-yellow-500" />} 
      />
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${bgCard} p-4 rounded-lg border text-center`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className={`font-semibold text-sm ${text} mb-1`}>{badge.name}</h4>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {badge.description}
              </p>
              <div className="mt-2">
                <Badge variant="primary" size="sm">
                  {badge.points} pts
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const EditProfileForm: React.FC<{
  user: any;
  onChange: (field: string, value: any) => void;
  isDarkMode: boolean;
}> = ({ user, onChange, isDarkMode }) => {
  const { text } = useThemeClasses();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nom complet"
          value={user?.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Votre nom complet"
        />
        
        <Input
          label="Handle"
          value={user?.handle || ''}
          onChange={(e) => onChange('handle', e.target.value)}
          placeholder="@votre-handle"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email"
          type="email"
          value={user?.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="votre.email@exemple.com"
        />
        
        <Input
          label="Téléphone"
          type="tel"
          value={user?.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+226 XX XX XX XX"
        />
      </div>
      
      <Textarea
        label="Bio"
        value={user?.bio || ''}
        onChange={(e) => onChange('bio', e.target.value)}
        placeholder="Parlez-nous de vous..."
        rows={4}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Localisation"
          value={user?.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="Ville, Pays"
          icon={<MapPin className="w-4 h-4" />}
        />
        
        <Input
          label="Site web"
          value={user?.website || ''}
          onChange={(e) => onChange('website', e.target.value)}
          placeholder="https://votresite.com"
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${text} mb-2`}>
          Compétences
        </label>
        <Input
          placeholder="JavaScript, React, Python..."
          helper="Séparez les compétences par des virgules"
        />
      </div>
    </div>
  );
};

export const OptimizedProfile: React.FC = () => {
  const { user } = useAuth();
  const { bg, text } = useThemeClasses();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode] = useState(false); // État local pour le mode sombre

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUser(user); // Reset changes
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Logique de sauvegarde à implémenter
      console.log('Saving profile:', editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ProfileHeader
          user={editedUser}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
          isDarkMode={isDarkMode}
        />

        {/* Stats Grid */}
        <StatsGrid
          stats={user?.stats}
          isDarkMode={isDarkMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <Card>
                <CardHeader title="Modifier mon profil" />
                <CardContent>
                  <EditProfileForm
                    user={editedUser}
                    onChange={handleFieldChange}
                    isDarkMode={isDarkMode}
                  />
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader title="À propos" icon={<User className="w-5 h-5" />} />
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user?.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user?.phone || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{user?.location || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Membre depuis {new Date(user?.joinedAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title="Progression" icon={<TrendingUp className="w-5 h-5" />} />
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm">Niveau {user?.level || 1}</span>
                          <span className="text-sm">{user?.points || 0} XP</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((user?.points || 0) % 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className={`text-lg font-bold ${text}`}>{user?.stats?.projectsCount || 0}</div>
                          <div className="text-xs text-gray-500">Projets</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${text}`}>{user?.stats?.tutorialsCount || 0}</div>
                          <div className="text-xs text-gray-500">Tutoriels</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${text}`}>{user?.stats?.badgesEarned || 0}</div>
                          <div className="text-xs text-gray-500">Badges</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BadgesSection
              badges={user?.badges || []}
              isDarkMode={isDarkMode}
            />

            <Card>
              <CardHeader title="Activité récente" icon={<Zap className="w-5 h-5" />} />
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>A complété un tutoriel</span>
                    <span className="text-xs text-gray-500 ml-auto">2h</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>A rejoint un projet</span>
                    <span className="text-xs text-gray-500 ml-auto">1j</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>A obtenu un badge</span>
                    <span className="text-xs text-gray-500 ml-auto">3j</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedProfile;
