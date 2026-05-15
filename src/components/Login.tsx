import React from 'react';
import { LogIn, Shield, Cpu, Terminal } from 'lucide-react';
import { signInWithPopup, googleProvider, auth } from '../lib/firebase';
import { motion } from 'motion/react';

export default function Login() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Don't show noise for cancelled popups
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        console.error('Login failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hub-bg flex items-center justify-center p-6 relative overflow-hidden selection:bg-brand-cyan/20 selection:text-brand-cyan">
      {/* Background FX */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-magenta/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="hub-card p-12 bg-hub-surface-alt/40 border-hub-border backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-brand-cyan/30 rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-brand-magenta/30 rounded-bl-3xl pointer-events-none" />

          <div className="flex justify-center mb-10 relative">
             <div className="w-24 h-24 bg-hub-bg rounded-3xl flex items-center justify-center border-2 border-brand-cyan shadow-[0_0_20px_rgba(0,242,255,0.2)] group hover:rotate-12 transition-transform duration-500">
                <Terminal className="w-12 h-12 text-brand-cyan text-glow-cyan" />
             </div>
             <div className="absolute -top-2 -right-2 p-2 bg-brand-magenta rounded-lg shadow-lg">
                <Shield className="w-4 h-4 text-white" />
             </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-display font-black text-white tracking-tighter uppercase mb-3">
              CODEL<span className="text-brand-magenta text-glow-magenta">_</span>HUB
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
               <div className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
               <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">Liaison Grille Requise</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Initialisez votre connexion à la grille d'intelligence centralisée. Accédez aux actifs stratégiques et collaborez avec les nœuds opérateurs décentralisés.
            </p>
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-16 bg-white hover:bg-brand-cyan disabled:bg-slate-200 disabled:cursor-not-allowed transition-all duration-300 rounded-2xl flex items-center justify-center gap-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white group-hover:bg-brand-cyan group-disabled:bg-slate-200 transition-colors" />
            <div className="relative z-10 flex items-center gap-4">
               {isLoading ? (
                 <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
               ) : (
                 <img src="https://www.google.com/favicon.ico" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
               )}
               <span className="text-[11px] font-mono font-black text-black uppercase tracking-widest">
                 {isLoading ? 'Connexion...' : 'Autoriser via Google'}
               </span>
            </div>
          </button>

          <p className="mt-10 text-[9px] font-mono text-slate-600 uppercase tracking-widest leading-loose text-center">
            EN CONNECTANT VOTRE NŒUD, VOUS ACCEPTEZ LES <br/>
            <span className="text-slate-400 hover:text-brand-cyan cursor-pointer transition-colors">PROTOCOLES DE GRILLE</span> & <span className="text-slate-400 hover:text-brand-magenta cursor-pointer transition-colors">CONFIDENTIALITÉ_VAL_01</span>
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex justify-between items-center px-4">
           <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-7 h-7 rounded-full border-2 border-hub-bg bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" className="w-full h-full object-cover grayscale" />
                   </div>
                 ))}
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">1 310 Opérateurs Actifs</span>
           </div>
           <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-brand-emerald" />
              <span className="text-[10px] font-mono text-brand-emerald uppercase">v2.4.2-PROD</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
