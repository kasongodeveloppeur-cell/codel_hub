import { 
  ShieldCheck, 
  Search, 
  MoreVertical, 
  CheckCircle2,
  ChevronRight,
  Cpu,
  Activity,
  UserCog,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { AppUser } from '../types';
import { getAllUsers, updateUserProfile } from '../services/userService';
import { notificationService } from '../services/notificationService';

export default function Security() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: AppUser['clubRole']) => {
    setUpdatingId(userId);
    try {
      await updateUserProfile(userId, { clubRole: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, clubRole: newRole } : u));
      
      // Trigger notification
      const user = users.find(u => u.id === userId);
      notificationService.notifySecurityAlert(
        'Ajustement d\'Accréditation',
        `Le protocole d'accès pour l'utilisateur ${user?.name || userId} a été reconfiguré. Nouveau Rôle: ${newRole}.`
      );
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roles: AppUser['clubRole'][] = ['Président', 'Vice-Président', 'Secrétaire', 'Comptable', 'Superviseur', 'Membre'];

  return (
    <div className="relative space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-brand-cyan animate-pulse" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-brand-magenta animate-pulse delay-700" />
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-brand-cyan/20" />
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-brand-magenta/20" />
      </div>

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 relative">
        <div className="relative">
           {/* Corner accent */}
           <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-brand-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
           
           <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-[1px] bg-brand-magenta shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
             <span className="text-[10px] font-mono text-brand-magenta uppercase tracking-[0.4em] font-bold">Protocole de Registre // Coffre de Sécurité</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter leading-none mb-6 group">
             Accès & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-magenta group-hover:animate-pulse">Identité</span>
           </h1>
           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl border-l border-hub-border pl-6 py-2">
             Supervisez les protocoles d'accès autorisés et gérez les signatures d'identité cryptographiques pour la grille collective.
           </p>
        </div>
        <div className="flex gap-10">
           <div className="space-y-1 text-right group cursor-default">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block transition-colors group-hover:text-brand-cyan">IDs_Actifs</span>
              <div className="text-4xl font-display font-black text-brand-cyan transition-transform group-hover:scale-110 origin-right text-glow-cyan">{users.length}</div>
           </div>
           <div className="space-y-1 text-right group cursor-default">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block transition-colors group-hover:text-white">Nœuds_Grille</span>
              <div className="text-4xl font-display font-black text-white transition-transform group-hover:scale-110 origin-right">1 310</div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Member Registry */}
          <div className="hub-card border-none overflow-hidden bg-hub-surface/40 relative">
            {/* Top scanning line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-pulse" />
            
            <div className="p-6 sm:p-10 border-b border-hub-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-hub-surface-alt/10">
              <div>
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight leading-none mb-1 text-glow-white">Registre Humain</h2>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Journal d'Autorisation Opérateur</span>
                  <div className="flex gap-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-brand-cyan/40 rounded-full" />)}
                  </div>
                </div>
              </div>
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-cyan transition-colors" />
                <input 
                  type="text" 
                  placeholder="Identifier par nom ou node_ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hub-input w-full pl-12 h-12 bg-hub-bg/50 border-hub-border focus:border-brand-cyan text-sm font-mono tracking-tight"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-cyan group-focus-within:w-full transition-all duration-500 shadow-[0_0_10px_#00f2ff]" />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px] relative custom-scrollbar">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-hub-bg/20 backdrop-blur-sm z-20">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
                    <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest animate-pulse">Lecture de la base de données...</span>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-hub-surface-alt/40 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-hub-border">
                    <tr>
                      <th className="px-10 py-5 font-bold">Opérateur // <span className="text-brand-cyan">Signature</span></th>
                      <th className="px-10 py-5 font-bold">Accréditation & Rôle</th>
                      <th className="px-10 py-5 font-bold">État d'Intégrité</th>
                      <th className="px-10 py-5 text-right font-bold">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredUsers.map((member) => (
                      <tr key={member.id} className="border-b border-hub-border/30 hover:bg-brand-cyan/[0.03] transition-colors group">
                        <td className="px-10 py-8 relative">
                          {/* Row hover indicator */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#00f2ff]" />
                          
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-hub-bg border border-hub-border overflow-hidden shrink-0 group-hover:border-brand-cyan transition-all group-hover:shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                              <img src={member.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all scale-110 group-hover:scale-100" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <div className="text-white font-bold uppercase text-base group-hover:text-glow-cyan transition-all tracking-tight">{member.name}</div>
                              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mt-1 opacity-60">NODE_ADR: <span className="group-hover:text-slate-400">{member.id.substring(0, 8)}...</span></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="relative inline-block w-48">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              {updatingId === member.id ? <Loader2 className="w-3 h-3 text-brand-cyan animate-spin" /> : <UserCog className="w-3 h-3 text-brand-cyan/50" />}
                            </div>
                            <select
                              value={member.clubRole || 'Membre'}
                              onChange={(e) => handleRoleChange(member.id, e.target.value as AppUser['clubRole'])}
                              disabled={updatingId === member.id}
                              className="w-full h-10 pl-10 pr-4 bg-hub-bg/50 border border-hub-border rounded-lg text-[10px] font-mono text-white uppercase tracking-widest focus:border-brand-cyan focus:outline-none appearance-none transition-all hover:bg-hub-bg cursor-pointer disabled:opacity-50 ring-1 ring-transparent hover:ring-brand-cyan/20"
                            >
                              {roles.map(role => (
                                <option key={role} value={role} className="bg-hub-surface text-white">{role}</option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                             <div className="relative">
                                <div className={clsx(
                                  "w-2 h-2 rounded-full",
                                  member.status === 'Active' ? 'bg-brand-emerald animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 
                                  member.status === 'Expired' ? 'bg-brand-magenta shadow-[0_0_12px_rgba(217,70,239,0.8)]' : 'bg-slate-700'
                                )} />
                                {member.status === 'Active' && (
                                  <div className="absolute inset-0 rounded-full border border-brand-emerald animate-ping opacity-50" />
                                )}
                             </div>
                             <span className={clsx(
                                "text-[10px] font-mono uppercase tracking-widest font-black",
                                member.status === 'Active' ? 'text-brand-emerald' : 
                                member.status === 'Expired' ? 'text-brand-magenta text-glow-magenta' : 'text-slate-500'
                             )}>{member.status === 'Active' ? 'VÉRIFIÉ' : member.status === 'Expired' ? 'EXPIRÉ' : member.status}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button className="p-2 text-slate-700 hover:text-brand-cyan hover:scale-110 transition-all">
                             <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-10 bg-hub-surface-alt/10 flex justify-center border-t border-hub-border">
              <button 
                onClick={fetchUsers}
                className="flex items-center gap-3 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] group hover:text-brand-cyan transition-colors"
              >
                Actualiser le registre
                <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          <section className="hub-card p-10 bg-hub-surface border-none shadow-2xl relative overflow-hidden ring-1 ring-hub-border cyber-border-gradient">
             <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                <ShieldCheck className="w-24 h-24 text-brand-cyan" />
             </div>
             
             {/* Corner accent */}
             <div className="absolute top-0 right-0 w-12 h-12">
               <div className="absolute top-0 right-0 w-[2px] h-full bg-brand-cyan/40" />
               <div className="absolute top-0 right-0 w-full h-[2px] bg-brand-cyan/40" />
             </div>

             <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-10 relative z-10 font-bold flex items-center gap-2">
               <div className="w-2 h-2 bg-brand-cyan animate-pulse" />
               Maître d'Accès
             </h3>
             
             <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-44 h-44 bg-hub-bg border-2 border-hub-border mb-8 flex items-center justify-center relative group overflow-hidden rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                   <div className="absolute inset-0 cyber-grid opacity-20" />
                   <div className="absolute inset-0 bg-brand-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   {/* Scanning background block */}
                   <div className="grid grid-cols-4 gap-3 relative z-10 opacity-60">
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                        <div key={i} className={clsx("w-3 h-3 border border-brand-cyan/40", i % 3 === 0 && "bg-brand-cyan/60")} />
                      ))}
                   </div>
                   
                   {/* Centered Lock Icon or specific cyber element */}
                   <div className="absolute inset-0 flex items-center justify-center text-brand-cyan opacity-20 group-hover:opacity-100 transition-opacity scale-150 group-hover:scale-100 duration-700">
                      <Cpu className="w-20 h-20" />
                   </div>

                   <div className="absolute w-full h-[2px] bg-brand-cyan/60 shadow-[0_0_20px_#00f2ff] animate-scanline top-0 z-20" />
                </div>
                <h4 className="text-2xl font-display font-black text-white uppercase tracking-tight mb-4 text-glow-white">Générer Protocole</h4>
                <p className="text-xs text-slate-400 mb-10 leading-relaxed font-medium uppercase tracking-tight">Synchronisez votre signature matérielle physique avec le coffre central pour un accès de proximité fluide.</p>
                <button className="hub-button-primary bg-brand-cyan text-hub-bg border-none shadow-[0_0_25px_rgba(0,242,255,0.5)] w-full py-5 text-[10px] font-black tracking-[0.2em] hover:bg-white hover:text-brand-cyan transition-all active:scale-95">REGEN_LINK_TOKEN</button>
             </div>
          </section>

          <section className="hub-card p-10 bg-hub-surface-alt/10 border-hub-border/30">
             <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-10 flex items-center gap-3 font-bold">
               <Activity className="w-3 h-3 text-brand-magenta animate-pulse" />
               Journaux de Validation
             </h3>
             <div className="space-y-8 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-brand-emerald via-hub-border to-brand-magenta opacity-30" />
                {[
                  { user: 'Alex R.', type: 'ACCORDÉ', time: '2M', color: 'text-brand-emerald', icon: <CheckCircle2 className="w-3 h-3" /> },
                  { user: 'Jordan S.', type: 'TERMINÉ', time: '15M', color: 'text-brand-magenta', icon: <Activity className="w-3 h-3" /> },
                  { user: 'Sam L.', type: 'ACCORDÉ', time: '42M', color: 'text-brand-emerald', icon: <CheckCircle2 className="w-3 h-3" /> }
                ].map((log, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                     <div className={clsx(
                       "w-3.5 h-3.5 rounded-full mt-1 shrink-0 z-10 border-2 border-hub-bg transition-all group-hover:scale-125 flex items-center justify-center overflow-hidden", 
                       log.color === 'text-brand-emerald' ? 'bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-brand-magenta shadow-[0_0_10px_rgba(217,70,239,0.5)]'
                     )}>
                        <div className="text-[8px] text-hub-bg font-black">{log.icon}</div>
                     </div>
                     <div className="flex-1">
                        <div className={clsx("text-xs font-bold uppercase tracking-tight transition-all", log.color === 'text-brand-emerald' ? 'text-white' : 'text-slate-300')}>
                          {log.user} // <span className={log.color}>{log.type}</span>
                        </div>
                        <div className="text-[9px] text-slate-600 mt-1 uppercase font-mono tracking-widest leading-none">T+{log.time} // NODE_ALPHA_03</div>
                     </div>
                  </div>
                ))}
             </div>
             <button className="w-full text-center text-[10px] font-mono text-brand-cyan/60 uppercase tracking-widest mt-12 hover:text-white transition-colors flex items-center justify-center gap-2">
               <div className="w-4 h-[1px] bg-brand-cyan/40" />
               RÉCUP_HISTORIQUE
               <div className="w-4 h-[1px] bg-brand-cyan/40" />
             </button>
          </section>
        </div>
      </div>
    </div>
  );
}
