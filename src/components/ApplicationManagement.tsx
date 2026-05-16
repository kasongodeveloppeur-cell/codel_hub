import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  MessageSquare, 
  UserCheck, 
  UserX,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { clsx } from 'clsx';
import { MembershipApplication } from '../types';
import { accessService } from '../services/accessService';
import { useAuth } from '../context/AuthContext';

interface ApplicationCardProps {
  application: MembershipApplication;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onRequestInfo: (id: string, info: string[]) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onApprove, 
  onReject, 
  onRequestInfo 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'APPROVED':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'REJECTED':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'NEEDS_INFO':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'NEEDS_INFO':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(application.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  const handleRequestInfo = () => {
    if (additionalInfo.trim()) {
      onRequestInfo(application.id, [additionalInfo]);
      setShowInfoModal(false);
      setAdditionalInfo('');
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
                {application.personalInfo.fullName}
              </h3>
              <div className={clsx(
                'px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1',
                getStatusColor(application.status)
              )}>
                {getStatusIcon(application.status)}
                {application.status}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                {application.contact.email}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" />
                {application.contact.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <GraduationCap className="w-4 h-4" />
                {application.universityInfo.university} - {application.universityInfo.department}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                {new Date(application.submittedAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-hub-border"
          >
            <div className="p-6 space-y-6">
              {/* Motivation */}
              <div>
                <h4 className="font-bold text-white mb-2">Motivation</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {application.motivation.reason}
                </p>
              </div>

              {/* Centres d'intérêt */}
              <div>
                <h4 className="font-bold text-white mb-2">Centres d'intérêt</h4>
                <div className="flex flex-wrap gap-2">
                  {application.motivation.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-brand-cyan/20 text-brand-cyan rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compétences */}
              {application.motivation.existingSkills.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-2">Compétences existantes</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.motivation.existingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-hub-surface/50 text-slate-300 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Disponibilité */}
              <div>
                <h4 className="font-bold text-white mb-2">Disponibilité</h4>
                <div className="flex flex-wrap gap-2">
                  {application.motivation.availability.map((availability) => (
                    <span
                      key={availability}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                    >
                      {availability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {application.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-hub-border">
                  <button
                    onClick={() => onApprove(application.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Approuver
                  </button>
                  
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    Refuser
                  </button>
                  
                  <button
                    onClick={() => setShowInfoModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Demander info
                  </button>
                </div>
              )}

              {/* Rejection Reason */}
              {application.status === 'REJECTED' && application.rejectionReason && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="font-bold text-red-400 mb-2">Raison du refus</h4>
                  <p className="text-red-300 text-sm">{application.rejectionReason}</p>
                </div>
              )}

              {/* Additional Info Requested */}
              {application.status === 'NEEDS_INFO' && application.additionalInfoRequested && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-bold text-blue-400 mb-2">Informations demandées</h4>
                  <ul className="list-disc list-inside text-blue-300 text-sm space-y-1">
                    {application.additionalInfoRequested.map((info, index) => (
                      <li key={index}>{info}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-hub-surface border border-hub-border rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Refuser la candidature</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Raison du refus *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan resize-none"
                  rows={4}
                  placeholder="Expliquez pourquoi vous refusez cette candidature..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReject}
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

      {/* Request Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-hub-surface border border-hub-border rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Demander des informations</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Informations demandées *
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full px-4 py-3 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan resize-none"
                  rows={4}
                  placeholder="Quelles informations supplémentaires sont nécessaires ?"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="flex-1 px-4 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRequestInfo}
                  disabled={!additionalInfo.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Demander
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ApplicationManagement: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const loadApplications = async () => {
    try {
      const apps = await accessService.getAllApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.universityInfo.university.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const handleApprove = async (applicationId: string) => {
    try {
      if (!user) return;
      
      await accessService.updateApplicationStatus(
        applicationId, 
        'APPROVED', 
        user.id
      );
      
      // Update user role
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        await accessService.updateUserRole(application.userId, 'MEMBER');
      }
      
      loadApplications();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleReject = async (applicationId: string, reason: string) => {
    try {
      if (!user) return;
      
      await accessService.updateApplicationStatus(
        applicationId, 
        'REJECTED', 
        user.id, 
        reason
      );
      
      loadApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleRequestInfo = async (applicationId: string, info: string[]) => {
    try {
      if (!user) return;
      
      await accessService.updateApplicationStatus(
        applicationId, 
        'NEEDS_INFO', 
        user.id, 
        undefined, 
        info
      );
      
      loadApplications();
    } catch (error) {
      console.error('Error requesting info:', error);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    needsInfo: applications.filter(app => app.status === 'NEEDS_INFO').length
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
        <h2 className="text-2xl font-bold text-white mb-2">Gestion des Candidatures</h2>
        <p className="text-slate-400">Examinez et gérez les demandes d'adhésion au club CODEL</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
          { label: 'En attente', value: stats.pending, color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
          { label: 'Approuvées', value: stats.approved, color: 'bg-green-500/20 text-green-500 border-green-500/30' },
          { label: 'Refusées', value: stats.rejected, color: 'bg-red-500/20 text-red-500 border-red-500/30' },
          { label: 'Info requise', value: stats.needsInfo, color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' }
        ].map((stat, index) => (
          <div key={index} className={clsx('p-4 rounded-lg border', stat.color)}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm">{stat.label}</div>
          </div>
        ))}
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
              placeholder="Rechercher par nom, email ou université..."
              className="w-full pl-10 pr-4 py-2 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
            />
          </div>
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filtrer par statut"
            className="pl-10 pr-4 py-2 bg-hub-surface/50 border border-hub-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan appearance-none"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvées</option>
            <option value="REJECTED">Refusées</option>
            <option value="NEEDS_INFO">Info requise</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestInfo={handleRequestInfo}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-hub-surface/50 rounded-lg border border-hub-border">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">
              {applications.length === 0 
                ? 'Aucune candidature pour le moment' 
                : 'Aucune candidature ne correspond à vos filtres'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement;
