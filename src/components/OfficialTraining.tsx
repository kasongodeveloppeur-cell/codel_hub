import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Award, 
  Play, 
  CheckCircle, 
  Clock, 
  Star,
  Download,
  FileText,
  Video,
  Code,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';
import { AcademyCourse, AcademyModule, StudentProgress, AppUser } from '../types';
import { academyService } from '../services/academyService';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

export const OfficialTraining: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<AcademyCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'progress' | 'certificates'>('courses');

  useEffect(() => {
    loadOfficialCourses();
  }, []);

  const loadOfficialCourses = async () => {
    try {
      setIsLoading(true);
      const coursesData = await academyService.getAcademyCourses();
      const officialCourses = coursesData.filter(course => course.isOfficial);
      setCourses(officialCourses);
    } catch (error) {
      console.error('Error loading official courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSelect = async (course: AcademyCourse) => {
    setSelectedCourse(course);
    
    if (user) {
      const progress = await academyService.getStudentProgress(user.id, course.id);
      setStudentProgress(progress);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    
    try {
      await academyService.enrollStudent(courseId, user.id);
      
      // Recharger la progression
      if (selectedCourse) {
        const progress = await academyService.getStudentProgress(user.id, selectedCourse.id);
        setStudentProgress(progress);
      }
      
      // Mettre à jour le nombre d'étudiants
      await loadOfficialCourses();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleModuleComplete = async (moduleId: string) => {
    if (!studentProgress) return;
    
    try {
      const updatedCompletedModules = [...studentProgress.completedModules, moduleId];
      const progressPercentage = (updatedCompletedModules.length / selectedCourse!.modules.length) * 100;
      
      await academyService.updateStudentProgress(studentProgress.id, {
        completedModules: updatedCompletedModules,
        progress: progressPercentage,
        currentModule: moduleId
      });
      
      // Recharger la progression
      if (user && selectedCourse) {
        const progress = await academyService.getStudentProgress(user.id, selectedCourse.id);
        setStudentProgress(progress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getModuleIcon = (type: AcademyModule['type']) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-5 h-5 text-blue-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-red-500" />;
      case 'QUIZ': return <Target className="w-5 h-5 text-green-500" />;
      case 'PROJECT': return <Code className="w-5 h-5 text-purple-500" />;
      case 'EXERCISE': return <BookOpen className="w-5 h-5 text-yellow-500" />;
      default: return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isModuleCompleted = (moduleId: string) => {
    return studentProgress?.completedModules.includes(moduleId) || false;
  };

  const isModuleCurrent = (moduleId: string) => {
    return studentProgress?.currentModule === moduleId;
  };

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Retour
                </button>
                <Logo size="medium" />
                <h1 className="text-xl font-bold text-gray-900">
                  Formation Officielle
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête du cours */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <img 
                src={selectedCourse.thumbnail} 
                alt={selectedCourse.title}
                className="w-full lg:w-64 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCourse.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedCourse.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getLevelColor(selectedCourse.level)}`}>
                    {selectedCourse.level}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedCourse.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {selectedCourse.enrolledStudents} étudiants
                  </div>
                  {selectedCourse.certificate && (
                    <div className="flex items-center text-sm text-green-600">
                      <Award className="w-4 h-4 mr-1" />
                      Certificat
                    </div>
                  )}
                </div>

                {/* Progression */}
                {studentProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium text-gray-900">
                        {Math.round(studentProgress.progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${studentProgress.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modules du cours */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Modules ({selectedCourse.modules.length})
            </h3>
            
            <div className="space-y-4">
              {selectedCourse.modules
                .sort((a, b) => a.order - b.order)
                .map((module, index) => {
                  const isCompleted = isModuleCompleted(module.id);
                  const isCurrent = isModuleCurrent(module.id);
                  const isLocked = !studentProgress && index > 0;
                  
                  return (
                    <div
                      key={module.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isCompleted ? 'border-green-500 bg-green-50' :
                        isCurrent ? 'border-blue-500 bg-blue-50' :
                        isLocked ? 'border-gray-300 bg-gray-50 opacity-75' :
                        'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                            {getModuleIcon(module.type)}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">
                                {module.order}. {module.title}
                              </h4>
                              {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {isCurrent && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                              {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {module.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {module.duration}
                              </span>
                              {module.isRequired && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                  Obligatoire
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!isLocked && (
                            <>
                              {module.resourceUrl && (
                                <button
                                  onClick={() => window.open(module.resourceUrl, '_blank')}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                  <Play className="w-4 h-4" />
                                </button>
                              )}
                              
                              {!isCompleted && studentProgress && (
                                <button
                                  onClick={() => handleModuleComplete(module.id)}
                                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                                >
                                  Marquer comme terminé
                                </button>
                              )}
                            </>
                          )}
                          
                          {isLocked && (
                            <span className="text-sm text-gray-500">
                              Verrouillé
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Quiz ou projet */}
                      {module.quiz && !isLocked && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-900">
                                Quiz - {module.quiz.questions.length} questions
                              </span>
                              <span className="text-sm text-gray-600">
                                Note minimale: {module.quiz.passingScore}%
                              </span>
                            </div>
                            <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                              Commencer le quiz
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {module.project && !isLocked && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Code className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-900">
                                Projet pratique
                              </span>
                            </div>
                            <button className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm">
                              Voir le projet
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Logo size="medium" />
              <h1 className="text-xl font-bold text-gray-900">
                Formation Officielle CODEL
              </h1>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Bienvenue</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Cours disponibles
              </button>
              
              {user && (
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'progress'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Ma progression
                </button>
              )}
              
              {user && (
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'certificates'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-2" />
                  Certificats
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'courses' && (
          <div>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cours disponibles</p>
                    <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total étudiants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cours gratuits</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {courses.filter(course => course.price === 0).length}
                    </p>
                  </div>
                  <Unlock className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avec certificat</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {courses.filter(course => course.certificate).length}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Liste des cours */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Aucun cours officiel disponible pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>
                          {course.level}
                        </span>
                        {course.price === 0 ? (
                          <span className="text-green-600 font-medium">Gratuit</span>
                        ) : (
                          <span className="text-blue-600 font-medium">{course.price}€</span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {course.enrolledStudents}
                        </div>
                      </div>
                      
                      {course.certificate && (
                        <div className="flex items-center text-sm text-green-600 mb-4">
                          <Award className="w-3 h-3 mr-1" />
                          Certificat inclus
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {course.modules.length} modules
                        </div>
                        
                        <button
                          onClick={() => handleCourseSelect(course)}
                          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          {course.price === 0 ? 'S\'inscrire' : 'Voir détails'}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'progress' && user && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ma progression</h2>
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Vos cours en cours et progression apparaîtront ici</p>
            </div>
          </div>
        )}
        
        {activeTab === 'certificates' && user && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes certificats</h2>
            <div className="text-center py-12">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Vos certificats obtenus apparaîtront ici</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
