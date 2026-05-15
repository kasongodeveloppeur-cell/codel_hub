import { 
  GraduationCap, 
  Search, 
  Play, 
  ChevronRight, 
  Clock, 
  Download,
  BookOpen,
  PieChart,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  Code,
  Zap,
  Terminal,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { educationService } from '../services/educationService';
import { LearningPath, Module } from '../types';
import { MOCK_MODULES, MOCK_PATH } from '../data';
import { useAuth } from '../context/AuthContext';

export default function Education() {
  const { isAdmin } = useAuth();
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          await educationService.initEducation(MOCK_PATH, MOCK_MODULES);
        }
        const availablePaths = await educationService.getLearningPaths();
        setPaths(availablePaths);
        
        if (availablePaths.length > 0) {
          const pathModules = await educationService.getModules(availablePaths[0].id);
          setModules(pathModules);
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const featuredPath = paths[0] || MOCK_PATH;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest animate-pulse">Accès aux Archives Savoir...</span>
      </div>
    );
  }
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[1px] bg-brand-cyan" />
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.4em]">Academy of Code // Curriculum</span>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter leading-none">
            Maîtrisez le <span className="text-brand-cyan shadow-neon-blue">Stack</span>
          </h1>
        </div>
        <div className="relative w-full lg:w-[420px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-cyan transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher ressources, modules, ateliers..." 
            className="hub-input w-full pl-12 h-14 bg-hub-surface/50"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-hub-border bg-hub-bg text-[10px] text-slate-500 font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-hub-border bg-hub-bg text-[10px] text-slate-500 font-mono">F</kbd>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Featured Course */}
        <div className="xl:col-span-3">
          <div className="hub-card h-full flex flex-col lg:flex-row relative group overflow-hidden border-t-2 border-brand-cyan">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/5 blur-[100px] rounded-full" />
             
             <div className="flex-1 p-8 lg:p-12 relative z-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full mb-6">
                  <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-bold">Bootcamp Actif</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-display font-black text-white mb-6 leading-none tracking-tighter uppercase group-hover:text-glow-cyan transition-all">
                  Sécurité Offensive<br/>& Capture The Flag 
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                  Apprenez les bases de l'exploitation de binaires et du reverse engineering pour dominer les prochaines compétitions CTF.
                </p>
                
                <div className="flex flex-col gap-4 w-full max-w-[320px] mb-10 p-4 bg-hub-bg/50 border border-hub-border rounded-xl">
                   <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 uppercase tracking-widest font-mono">Progression Globale</span>
                     <span className="text-brand-cyan font-bold">68%</span>
                   </div>
                   <div className="h-1.5 bg-hub-surface-alt w-full rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "68%" }}
                        className="h-full bg-brand-cyan shadow-[0_0_10px_rgba(0,242,255,0.5)]" 
                     />
                   </div>
                   <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                     <span>5/8 MODULES</span>
                     <span>12h 45m RESTANT</span>
                   </div>
                </div>

                <div className="flex gap-4">
                  <button className="hub-button-primary">Reprendre le Projet</button>
                  <button className="hub-button-secondary">Ressources</button>
                </div>
             </div>

             <div className="w-full lg:w-[320px] relative overflow-hidden bg-hub-surface border-l border-hub-border">
                <img 
                  src="https://picsum.photos/seed/flutter/600/1200" 
                  alt="Flutter" 
                  className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hub-surface via-transparent to-transparent" />
             </div>
          </div>
        </div>

        {/* Challenge Widget */}
        <div className="hub-card p-8 border-t-2 border-brand-magenta relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4">
             <Award className="w-6 h-6 text-brand-magenta opacity-20" />
           </div>
           
           <div className="flex items-center gap-2 mb-8">
             <div className="p-2 bg-brand-magenta/10 rounded-lg">
                <Zap className="w-5 h-5 text-brand-magenta" />
             </div>
             <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Objectif Quotidien</span>
           </div>

           <h3 className="text-2xl font-display font-bold text-white mb-4 leading-tight uppercase">Challenge Algorithmique</h3>
           <p className="text-sm text-slate-400 leading-relaxed mb-6">
             Optimisez ce script Python en utilisant des "list comprehensions" pour réduire la complexité temporelle.
           </p>

           <div className="bg-hub-bg border border-hub-border p-4 rounded-lg font-mono text-[11px] text-brand-emerald mb-8 overflow-hidden relative">
             <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand-magenta/20" />
             <pre><code>{`def process(data):\n  res = []\n  for x in data:\n    if x > 10:\n      res.append(x * 2)\n  return res`}</code></pre>
           </div>
           
           <button className="hub-button-secondary w-full group-hover:border-brand-magenta/50">Résoudre le Problème</button>
           <p className="text-[10px] text-center text-slate-600 mt-4 font-mono">+200 XP DISPONIBLE</p>
        </div>
      </div>

      {/* Roadmaps */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">Hubs de Compétences</h2>
            <p className="text-sm text-slate-500 mt-2">Parcours spécialisés conçus pour la maîtrise par rôle.</p>
          </div>
          <button className="hub-button-ghost py-1 px-4 border border-hub-border text-[10px]">Voir tous les Hubs</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 hub-card group cursor-pointer relative overflow-hidden h-[340px]">
            <img 
              src={featuredPath.thumbnail} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hub-bg via-hub-bg/20 to-transparent" />
            <div className="relative z-10 p-10 h-full flex flex-col justify-end">
              <div className="flex gap-2 mb-4">
                 <span className="px-2 py-1 bg-brand-magenta/20 border border-brand-magenta/50 text-[9px] font-mono text-brand-magenta uppercase tracking-widest backdrop-blur-sm shadow-[0_0_8px_rgba(217,70,239,0.2)]">TENDANCE</span>
                 <span className="px-2 py-1 bg-brand-cyan/20 border border-brand-cyan/50 text-[9px] font-mono text-brand-cyan uppercase tracking-widest backdrop-blur-sm shadow-[0_0_8px_rgba(0,242,255,0.2)]">INTELLIGENCE</span>
              </div>
              <h3 className="text-4xl font-display font-black text-white tracking-tighter uppercase">{featuredPath.title}</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md line-clamp-2">{featuredPath.description}</p>
              <div className="mt-6 flex items-center gap-3">
                 <div className="flex -space-x-2">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full border-2 border-hub-bg bg-slate-800" />
                   ))}
                 </div>
                 <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{featuredPath.enrolled}+ INSCRITS</span>
              </div>
            </div>
          </div>

            {[
              { title: 'Infrastructures Cloud', desc: 'Maîtrisez AWS, Docker et l\'orchestration Kubernetes pour vos projets.', icon: Terminal, color: 'brand-cyan', modules: 12 },
              { title: 'Cyber-Défense', desc: 'Apprenez l\'ethical hacking et les stratégies de défense industrielle avancées.', icon: ShieldCheck, color: 'brand-magenta', modules: 8 }
            ].map((item, i) => (
            <div key={i} className={clsx(
              "hub-card p-8 flex flex-col justify-between group cursor-pointer transition-all border-t-2",
              i === 0 ? "hover:border-brand-cyan/50 border-t-brand-cyan" : "hover:border-brand-magenta/50 border-t-brand-magenta"
            )}>
              <div className={clsx(
                "w-14 h-14 bg-hub-surface flex items-center justify-center rounded-xl mb-10 transition-transform group-hover:scale-110",
                i === 0 ? "text-brand-cyan" : "text-brand-magenta"
              )}>
                 <item.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="mt-10 flex items-center justify-between pt-6 border-t border-hub-border">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{item.modules} MODULES</span>
                <ChevronRight className="w-5 h-5 text-slate-700 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Module List */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-6">
             <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight mb-8">Modules en Cours</h2>
             {modules.map((mod) => (
                <div key={mod.id} className="hub-card flex items-center gap-8 p-6 hover:bg-hub-surface-alt/30 transition-all group cursor-pointer border-l-2 border-l-transparent hover:border-l-brand-cyan">
                   <div className="w-16 h-16 bg-hub-bg flex items-center justify-center shrink-0 rounded-lg group-hover:shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-all">
                      <span className="text-xl font-black text-brand-cyan opacity-40 group-hover:opacity-100 transition-opacity">{mod.icon}</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-bold text-white uppercase tracking-tight truncate leading-none">{mod.title}</h4>
                        <Play className="w-5 h-5 text-slate-700 group-hover:text-brand-cyan transition-colors" />
                      </div>
                      <div className="flex items-center gap-6 text-[10px] font-mono text-slate-500 uppercase">
                        <span className="text-brand-emerald">INSTRUCTEUR: {mod.instructor}</span>
                        <span>•</span>
                        <span>{mod.duration}</span>
                      </div>
                      <div className="mt-4 h-1 bg-hub-bg w-full rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${mod.progress}%` }}
                           className="h-full bg-brand-cyan group-hover:bg-brand-cyan group-hover:glow-cyan transition-all" 
                        />
                      </div>
                   </div>
                </div>
             ))}
          </div>

          <div className="xl:col-span-4 space-y-8">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight mb-8">Succès</h2>
            <div className="hub-card p-10 flex flex-col items-center text-center border-t-2 border-t-brand-emerald relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-brand-emerald/5 blur-[60px] rounded-full" />
              
              <div className="w-24 h-24 bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald flex items-center justify-center mb-8 rotate-12 transition-transform hover:rotate-0 duration-500">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-display font-black text-white mb-2 uppercase tracking-tighter">Full-Stack Engineer</h3>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-8">Vérification: CODEL-CF-4829</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                 {['REACT', 'NODE', 'REDIS'].map(tag => (
                   <span key={tag} className="px-2 py-1 bg-hub-bg border border-hub-border text-[9px] font-mono text-slate-500 uppercase tracking-widest">{tag}</span>
                 ))}
              </div>
              <button className="hub-button-primary w-full">Partager Dossier</button>
            </div>

            <div className="hub-card p-6 flex items-center gap-6 grayscale opacity-40 hover:opacity-60 transition-all cursor-wait border-dashed">
              <div className="p-3 bg-hub-surface-alt rounded-lg">
                <Award className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">Architecte Sécurité</h4>
                <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase">850 XP REQUIS</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
