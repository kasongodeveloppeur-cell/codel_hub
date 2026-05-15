import React, { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  MapPin, 
  Calendar, 
  Link as LinkIcon,
  ShieldCheck,
  Camera,
  ChevronRight,
  User,
  Bell,
  Code,
  CreditCard,
  Mail,
  Briefcase,
  Terminal,
  Cpu,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';

export default function Profile() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState(user?.geminiApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    handle: user?.handle || '',
    skills: user?.skills?.join(', ') || '',
    tools: user?.tools?.join(', ') || '',
    platforms: user?.platforms?.join(', ') || '',
    bio: user?.bio || '',
    notificationPreferences: {
      securityAlerts: user?.notificationPreferences?.securityAlerts ?? true,
      projectUpdates: user?.notificationPreferences?.projectUpdates ?? true,
    }
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  React.useEffect(() => {
    if (user) {
      setApiKey(user.geminiApiKey || '');
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        handle: user.handle || '',
        skills: user.skills?.join(', ') || '',
        tools: user.tools?.join(', ') || '',
        platforms: user.platforms?.join(', ') || '',
        bio: user.bio || '',
        notificationPreferences: {
          securityAlerts: user.notificationPreferences?.securityAlerts ?? true,
          projectUpdates: user.notificationPreferences?.projectUpdates ?? true,
        }
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsUpdating(true);
    setFeedback(null);
    try {
      await updateUserProfile(user.id, {
        name: profileData.name,
        email: profileData.email,
        handle: profileData.handle,
        skills: profileData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        tools: profileData.tools.split(',').map(s => s.trim()).filter(s => s !== ''),
        platforms: profileData.platforms.split(',').map(s => s.trim()).filter(s => s !== ''),
        bio: profileData.bio,
        notificationPreferences: profileData.notificationPreferences,
      });
      setFeedback({ type: 'success', msg: 'Core Configuration Synchronized.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setFeedback({ type: 'error', msg: 'Update Failed. Connection Lost.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateApiKey = async () => {
    if (!user) return;
    setIsUpdating(true);
    setFeedback(null);
    try {
      await updateUserProfile(user.id, { geminiApiKey: apiKey });
      setFeedback({ type: 'success', msg: 'Protocol synchronized successfully.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error('Failed to update API key:', error);
      setFeedback({ type: 'error', msg: 'Transmission failed. Check security logs.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!user || !window.confirm('Are you sure you want to revoke this API key? AI features will stop working.')) return;
    setIsUpdating(true);
    setFeedback(null);
    try {
      await updateUserProfile(user.id, { geminiApiKey: '' });
      setApiKey('');
      setFeedback({ type: 'success', msg: 'Protocol revoked. Secure erasure complete.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      setFeedback({ type: 'error', msg: 'Revocation failed.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-[1px] bg-brand-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
             <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em]">Node Identity // Authorization</span>
           </div>
           <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none mb-6">
             Identity <span className="text-slate-500">Parameters</span>
           </h1>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl">
             Configure your digital signature, transmission protocols and security clearances.
           </p>
        </div>
        <div className="flex gap-4">
          <button 
            className="hub-button-secondary py-3 px-8 border-hub-border hover:border-slate-600 disabled:opacity-50"
            onClick={() => user && setProfileData({
              name: user.name || '',
              email: user.email || '',
              handle: user.handle || '',
              skills: user.skills?.join(', ') || '',
              tools: user.tools?.join(', ') || '',
              platforms: user.platforms?.join(', ') || '',
              bio: user.bio || '',
              notificationPreferences: {
                securityAlerts: user.notificationPreferences?.securityAlerts ?? true,
                projectUpdates: user.notificationPreferences?.projectUpdates ?? true,
              }
            })}
            disabled={isUpdating}
          >
            Revert
          </button>
          <button 
            className="hub-button-primary bg-brand-cyan text-hub-bg border-none shadow-[0_0_20px_rgba(0,242,255,0.3)] py-3 px-8 disabled:opacity-50"
            onClick={handleSaveProfile}
            disabled={isUpdating}
          >
            {isUpdating ? 'Synchronizing...' : 'Save Cluster'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
           <section className="hub-card p-10 relative overflow-hidden bg-hub-surface/40">
              <div className="absolute top-0 left-0 w-32 h-32 bg-brand-cyan/5 blur-[50px] rounded-full" />
              <div className="relative z-10 flex items-center gap-4 mb-10 pb-6 border-b border-hub-border">
                <div className="p-3 bg-hub-bg rounded-xl border border-hub-border text-brand-cyan">
                   <User className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight leading-none mb-1">Human Protocol</h3>
                   <span className="text-[10px] font-mono text-slate-500 uppercase">Personal Core Configuration</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <div className="space-y-3 group">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Operator Name</label>
                      <Terminal className="w-3 h-3 text-slate-700 group-focus-within:text-brand-cyan" />
                   </div>
                   <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="hub-input w-full h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-white font-mono" 
                   />
                </div>
                <div className="space-y-3 group">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Uplink Address</label>
                      <Mail className="w-3 h-3 text-slate-700 group-focus-within:text-brand-cyan" />
                   </div>
                   <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="hub-input w-full h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-white font-mono" 
                   />
                </div>
                <div className="space-y-3 group">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Node Assignment</label>
                      <Cpu className="w-3 h-3 text-slate-700" />
                   </div>
                   <input 
                      type="text" 
                      value={user?.clubRole} 
                      disabled 
                      className="hub-input w-full h-12 bg-hub-bg/20 border-hub-border opacity-50 cursor-not-allowed text-brand-cyan font-mono" 
                   />
                </div>
                <div className="space-y-3 group">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Handle // Sigil</label>
                      <MapPin className="w-3 h-3 text-slate-700 group-focus-within:text-brand-cyan" />
                   </div>
                   <input 
                      type="text" 
                      value={profileData.handle}
                      onChange={(e) => setProfileData(prev => ({ ...prev, handle: e.target.value }))}
                      className="hub-input w-full h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-white font-mono" 
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 relative z-10">
                <div className="space-y-3 group">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Compétences</label>
                      <Code className="w-3 h-3 text-slate-700 group-focus-within:text-brand-cyan" />
                   </div>
                   <textarea 
                      value={profileData.skills}
                      onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="React, TypeScript, Rust..."
                      className="hub-input w-full h-24 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-white font-mono text-xs py-3" 
                   />
                </div>
                <div className="space-y-3 group">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Outils</label>
                      <Briefcase className="w-3 h-3 text-slate-700 group-focus-within:text-brand-cyan" />
                   </div>
                   <textarea 
                      value={profileData.tools}
                      onChange={(e) => setProfileData(prev => ({ ...prev, tools: e.target.value }))}
                      placeholder="VS Code, Docker, Git..."
                      className="hub-input w-full h-24 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-white font-mono text-xs py-3" 
                   />
                </div>
                <div className="space-y-3 group">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Plateformes</label>
                      <Cpu className="w-3 h-3 text-slate-700 group-focus-within:text-brand-cyan" />
                   </div>
                   <textarea 
                      value={profileData.platforms}
                      onChange={(e) => setProfileData(prev => ({ ...prev, platforms: e.target.value }))}
                      placeholder="Vercel, AWS, Google Cloud..."
                      className="hub-input w-full h-24 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-white font-mono text-xs py-3" 
                   />
                </div>
              </div>

              <div className="mt-10 space-y-3 relative z-10">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">Integrity Memo // Identity Biography</label>
                <textarea 
                  className="hub-input w-full min-h-[120px] py-4 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-white" 
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Neural architect focusing on distributed swarm intelligence..."
                />
              </div>
           </section>

            <section className="hub-card p-10 bg-hub-surface/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 blur-[50px] rounded-full" />
              <div className="relative z-10 flex items-center gap-4 mb-10 pb-6 border-b border-hub-border">
                <div className="p-3 bg-hub-bg rounded-xl border border-hub-border text-brand-magenta">
                   <Bell className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight leading-none mb-1">Alert Vectors</h3>
                   <span className="text-[10px] font-mono text-slate-500 uppercase">Transmission Preference Settings</span>
                </div>
              </div>
              <div className="space-y-8 relative z-10">
                {[
                  { 
                    id: 'securityAlerts' as const,
                    label: 'Security Breaches', 
                    desc: 'Notify on unauthorized login attempts or root changes.', 
                    enabled: profileData.notificationPreferences.securityAlerts, 
                    color: 'brand-magenta' 
                  },
                  { 
                    id: 'projectUpdates' as const,
                    label: 'Deployment Status', 
                    desc: 'Sync updates on relay nodes and production deployments.', 
                    enabled: profileData.notificationPreferences.projectUpdates, 
                    color: 'brand-cyan' 
                  },
                ].map(pref => (
                  <div key={pref.label} className="flex items-center justify-between group">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-glow-white transition-all">{pref.label}</h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">{pref.desc}</p>
                    </div>
                    <button 
                      onClick={() => setProfileData(prev => ({
                        ...prev,
                        notificationPreferences: {
                          ...prev.notificationPreferences,
                          [pref.id]: !prev.notificationPreferences[pref.id]
                        }
                      }))}
                      className={clsx(
                        "w-12 h-6 transition-all relative rounded-full border",
                        pref.enabled ? `bg-${pref.color}/20 border-${pref.color}/50` : "bg-hub-bg border-hub-border"
                      )}
                    >
                      <motion.div 
                        animate={{ x: pref.enabled ? 24 : 4 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={clsx(
                          "absolute top-1 w-3.5 h-3.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]",
                          pref.enabled ? `bg-${pref.color}` : "bg-slate-700"
                        )} 
                      />
                    </button>
                  </div>
                ))}
              </div>
           </section>

           <section className="hub-card p-10 bg-hub-surface/40 overflow-hidden relative border-t-2 border-brand-cyan/30 shadow-[0_0_30px_rgba(0,242,255,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 blur-[50px] rounded-full" />
              <div className="relative z-10 flex items-center gap-4 mb-10 pb-6 border-b border-hub-border">
                <div className="p-3 bg-hub-bg rounded-xl border border-hub-border text-brand-cyan shadow-[0_0_15px_rgba(0,242,255,0.1)]">
                   <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                   <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight leading-none mb-1">Cœur AI Protocol</h3>
                   <span className="text-[10px] font-mono text-slate-500 uppercase">Clé d'Intégration Gemini Cloud</span>
                </div>
                <div className="ml-auto">
                   <div className={clsx(
                     "px-3 py-1 rounded-full border text-[8px] font-mono uppercase tracking-[0.2em]",
                     user?.geminiApiKey ? "bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald" : "bg-brand-magenta/10 border-brand-magenta/30 text-brand-magenta"
                   )}>
                     {user?.geminiApiKey ? 'Liaison Active' : 'Hors Ligne'}
                   </div>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-4 group">
                   <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2">
                         <Key className="w-3 h-3 text-slate-500" />
                         <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Master Access Token</label>
                         <a 
                           href="https://aistudio.google.com/app/apikey" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-slate-600 hover:text-brand-cyan transition-colors"
                           title="Obtenez votre clé API sur Google AI Studio. Elle permet au club d'activer les fonctionnalités d'intelligence artificielle personnalisées pour votre node."
                         >
                           <HelpCircle className="w-3 h-3" />
                         </a>
                      </div>
                      <button 
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="flex items-center gap-2 text-[9px] font-mono text-slate-500 hover:text-brand-cyan transition-all uppercase group/eye"
                      >
                        {showApiKey ? 'Masquer' : 'Révéler'}
                        {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                   </div>
                   
                   <div className="flex flex-col sm:flex-row gap-4">
                     <div className="relative flex-1">
                       <input 
                          type={showApiKey ? "text" : "password"} 
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Saisissez votre clé Gemini..."
                          className="hub-input w-full h-14 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-brand-cyan font-mono pr-12 transition-all placeholder:text-slate-800" 
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <ShieldCheck className={clsx("w-4 h-4 transition-colors", apiKey ? "text-brand-emerald" : "text-slate-800")} />
                       </div>
                     </div>

                     <div className="flex gap-2 h-14">
                       <button 
                         onClick={handleUpdateApiKey}
                         disabled={isUpdating || apiKey === (user?.geminiApiKey || '')}
                         className="flex-1 sm:flex-none px-6 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                         title="Mettre à jour la clé"
                       >
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <RefreshCw className={clsx("w-4 h-4", isUpdating && "animate-spin")} />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest sm:hidden lg:block">Sync</span>
                          </div>
                       </button>

                       <button 
                         onClick={handleRevokeApiKey}
                         disabled={!user?.geminiApiKey || isUpdating}
                         className="flex-1 sm:flex-none px-6 bg-brand-magenta/10 hover:bg-brand-magenta/20 border border-brand-magenta/30 text-brand-magenta rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                         title="Révoquer la clé"
                       >
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest sm:hidden lg:block">Revoke</span>
                          </div>
                       </button>
                     </div>
                   </div>

                   <p className="text-[9px] text-slate-600 font-mono uppercase px-1 italic">
                     * Cette clé est stockée localement dans votre nœud utilisateur chiffré. Elle est indispensable pour les transmissions assistées par l'Intelligence Artificielle.
                   </p>

                   {feedback && (
                     <motion.div 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       className={clsx(
                         "text-[10px] font-mono uppercase tracking-widest px-4 py-3 border-l-2 flex items-center gap-3",
                         feedback.type === 'success' ? "text-brand-emerald border-brand-emerald bg-brand-emerald/5" : "text-brand-magenta border-brand-magenta bg-brand-magenta/5"
                       )}
                     >
                       <div className={clsx("w-1 h-1 rounded-full animate-pulse", feedback.type === 'success' ? "bg-brand-emerald" : "bg-brand-magenta")} />
                       {feedback.msg}
                     </motion.div>
                   )}
                </div>
              </div>
           </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <section className="hub-card p-10 flex flex-col items-center text-center relative overflow-hidden bg-hub-bg/40">
            <div className="absolute inset-0 cyber-grid opacity-10" />
            <div className="w-44 h-44 rounded-2xl mb-8 border border-hub-border relative group overflow-hidden bg-hub-surface p-1 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 rounded-xl" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-brand-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Camera className="w-6 h-6 text-white text-glow-white" />
                  </div>
               </div>
            </div>
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter mb-2">{user?.name}</h3>
            <div className="flex items-center gap-2 mb-10">
               <Calendar className="w-3 h-3 text-brand-cyan" />
               <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Registered 2023.01.15</p>
            </div>
            <div className="w-full space-y-4 relative z-10">
               <button className="hub-button-secondary w-full py-4 text-[10px] font-mono border-hub-border hover:border-brand-cyan/50 hover:text-brand-cyan bg-hub-surface-alt/20">Update Signature</button>
               <button className="text-[10px] font-mono text-brand-magenta uppercase tracking-widest hover:text-glow-magenta transition-all mt-4 block mx-auto py-2">Erase Identity</button>
            </div>
          </section>

          <section className="hub-card p-8 bg-hub-surface-alt/10 border-t-2 border-brand-cyan">
             <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-8">NODE_LINKS_ENCRYPTED</h3>
             <div className="space-y-6">
                {[
                  { icon: Github, label: 'GitHub', username: 'alexriv24', connected: true, color: 'brand-cyan' },
                  { icon: Linkedin, label: 'LinkedIn', username: 'arivera-dev', connected: false, color: 'brand-emerald' }
                ].map(social => (
                  <div key={social.label} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                       <social.icon className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-tight group-hover:text-white transition-colors">{social.label}</span>
                    </div>
                    {social.connected ? (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand-emerald/10 border border-brand-emerald/20 rounded">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                         <span className="text-[9px] font-mono text-brand-emerald uppercase font-bold tracking-widest">Connect</span>
                      </div>
                    ) : (
                      <button className="text-[10px] font-mono text-slate-600 uppercase tracking-widest hover:text-brand-cyan transition-colors">UPLINK_NODE</button>
                    )}
                  </div>
                ))}
             </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
