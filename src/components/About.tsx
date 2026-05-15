import React from 'react';
import { motion } from 'motion/react';
import { Info, Target, Users, BookOpen, Shield, Code, Cpu, Terminal } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Développement",
      description: "Apprenez les technologies les plus demandées : React, Node.js, Go, Rust et plus encore."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Cybersécurité",
      description: "Des ateliers pratiques sur la sécurité offensive et défensive, CTF et cryptographie."
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "IA & Data",
      description: "Explorez le monde de l'apprentissage automatique et de l'analyse de données massives."
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Systèmes & DevOps",
      description: "Maîtrisez Linux, Docker, Kubernetes et l'automatisation des infrastructures."
    }
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden border border-hub-border">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
            alt="Club Coding" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-hub-bg via-hub-bg/60 to-transparent" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full"
          >
            <Info className="w-3 h-3 text-brand-cyan" />
            <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest font-bold">À Propos du Club</span>
          </motion.div>
          
          <h1 className="text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
            Forgeons le <span className="text-brand-cyan shadow-neon-blue">Futur</span> Numérique
          </h1>
          <p className="max-w-2xl text-slate-400 font-medium text-lg italic">
            "Plus qu'un club, une communauté de passionnés dédiée à l'excellence technologique et au partage de connaissances."
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="hub-card p-10 bg-hub-surface/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 blur-[50px] rounded-full group-hover:bg-brand-cyan/10 transition-colors" />
          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 bg-hub-bg rounded-xl border border-hub-border flex items-center justify-center text-brand-cyan">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Notre Mission</h2>
            <p className="text-slate-400 leading-relaxed font-medium">
              Notre mission est de démocratiser l'accès aux technologies de pointe et de fournir un environnement stimulant où chaque membre peut développer ses compétences techniques, collaborer sur des projets innovants et se préparer aux défis du monde professionnel.
            </p>
          </div>
        </section>

        <section className="hub-card p-10 bg-hub-surface/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-magenta/5 blur-[50px] rounded-full group-hover:bg-brand-magenta/10 transition-colors" />
          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 bg-hub-bg rounded-xl border border-hub-border flex items-center justify-center text-brand-magenta">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Notre Vision</h2>
            <p className="text-slate-400 leading-relaxed font-medium">
              Nous aspirons à devenir le hub technologique de référence au sein de notre communauté, en formant des leaders techniques capables d'innover et de résoudre des problèmes complexes grâce à la technologie. Nous croyons en la force du collectif et de l'open-source.
            </p>
          </div>
        </section>
      </div>

      {/* Pillars */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px bg-hub-border flex-1" />
          <h3 className="text-sm font-mono text-slate-500 uppercase tracking-[0.3em] font-bold">Nos Piliers Technologiques</h3>
          <div className="h-px bg-hub-border flex-1" />
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="hub-card p-8 bg-hub-bg/40 border-hub-border hover:border-brand-cyan/50 transition-all group"
            >
              <div className="w-12 h-12 bg-hub-surface rounded-lg border border-hub-border flex items-center justify-center text-slate-400 group-hover:text-brand-cyan group-hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all mb-6">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">{feature.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-mono">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="hub-card p-12 bg-hub-surface/20 border border-hub-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <p className="text-4xl font-display font-black text-white">500+</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Membres Actifs</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-display font-black text-brand-cyan">150+</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ateliers Animés</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-display font-black text-brand-magenta">45</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Projets Open Source</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-display font-black text-white">12</p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Partenaires Tech</p>
          </div>
        </div>
      </section>
    </div>
  );
}
