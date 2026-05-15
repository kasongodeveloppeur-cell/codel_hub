import React, { useState } from 'react';
import { X, Terminal, Code, Cpu, ExternalLink, Activity, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ProjectModal({ isOpen, onClose, onSuccess }: ProjectModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    status: 'LIVE' as 'LIVE' | 'BUSY' | 'STABLE' | 'PAUSED',
    progress: 10,
    githubUrl: '',
    liveUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await projectService.createProject({
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        status: formData.status,
        progress: formData.progress,
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl
      }, user.id);
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-hub-bg/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="hub-card w-full max-w-2xl bg-hub-surface p-0 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,1)] border border-hub-border"
        >
          {/* Header */}
          <div className="p-8 border-b border-hub-border flex items-center justify-between bg-hub-surface-alt/20">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                <Code className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Initialiser un Nouveau Projet</h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Registre d'actifs du Collectif</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">Titre de l'Actif</label>
                <div className="relative group">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-brand-cyan" />
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    placeholder="CyberShield_v1.0"
                    className="hub-input w-full pl-12 h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">État de Déploiement</label>
                <div className="relative group">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-brand-cyan" />
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                    className="hub-input w-full pl-12 h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-sm font-mono appearance-none"
                  >
                    <option value="LIVE">LIVE</option>
                    <option value="BUSY">BUSY</option>
                    <option value="STABLE">STABLE</option>
                    <option value="PAUSED">PAUSED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">Description Technique</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                placeholder="Détaillez les objectifs de la mission et l'architecture logicielle associée..."
                className="hub-input w-full min-h-[100px] py-4 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">Balises (virgules)</label>
                <div className="relative group">
                   <Code className="absolute left-4 top-4 w-4 h-4 text-slate-700 group-focus-within:text-brand-cyan" />
                   <input 
                      value={formData.tags}
                      onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))}
                      placeholder="React, TypeScript, Rust..."
                      className="hub-input w-full pl-12 h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-sm font-mono"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1 px-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Intégrité (%)</label>
                  <span className="text-xs font-mono text-brand-cyan">{formData.progress}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={formData.progress}
                  onChange={(e) => setFormData(p => ({ ...p, progress: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-hub-bg rounded-lg appearance-none cursor-pointer accent-brand-cyan border border-hub-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">Répertoire_Source (URL)</label>
                 <div className="relative group">
                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-brand-cyan" />
                    <input 
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(p => ({ ...p, githubUrl: e.target.value }))}
                      placeholder="https://github.com/club/repo"
                      className="hub-input w-full pl-12 h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-xs font-mono"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">Uplink_Direct (URL)</label>
                 <div className="relative group">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-brand-cyan" />
                    <input 
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData(p => ({ ...p, liveUrl: e.target.value }))}
                      placeholder="https://project.grid.live"
                      className="hub-input w-full pl-12 h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-xs font-mono"
                    />
                 </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="hub-button-secondary flex-1 py-4 uppercase font-black tracking-widest border-hub-border hover:border-slate-500 transition-all"
              >
                ANNULER_OPS
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="hub-button-primary flex-1 py-4 bg-brand-cyan text-hub-bg border-none shadow-[0_0_20px_rgba(0,242,255,0.4)] uppercase font-black tracking-widest hover:bg-white hover:text-brand-cyan transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'SÉQUENCE_D\'ACCÈS...' : 'VALIDER_PROJET'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
