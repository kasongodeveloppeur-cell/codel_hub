import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Star,
  Shield,
  Zap,
  Heart,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isAvailable: boolean;
  onClick?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, isAvailable, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={isAvailable ? onClick : undefined}
      className={clsx(
        'relative p-6 rounded-xl border transition-all duration-300 cursor-pointer',
        isAvailable 
          ? 'bg-hub-surface/50 border-hub-border hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)]' 
          : 'bg-hub-surface/20 border-hub-border/30 opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx(
          'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
          isAvailable ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-700/30 text-slate-500'
        )}>
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className={clsx(
            'font-bold text-lg mb-2',
            isAvailable ? 'text-white' : 'text-slate-500'
          )}>
            {title}
          </h3>
          <p className={clsx(
            'text-sm',
            isAvailable ? 'text-slate-400' : 'text-slate-600'
          )}>
            {description}
          </p>
          
          {!isAvailable && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
              <Shield className="w-3 h-3" />
              <span>Réservé aux membres</span>
            </div>
          )}
          
          {isAvailable && (
            <div className="mt-3 flex items-center gap-2 text-brand-cyan">
              <ChevronRight className="w-4 h-4" />
              <span className="text-sm">Explorer</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface GuestModeProps {
  onJoinAsGuest: () => void;
  onApplyForMembership: () => void;
  onLogin: () => void;
}

export const GuestMode: React.FC<GuestModeProps> = ({ 
  onJoinAsGuest, 
  onApplyForMembership, 
  onLogin 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const availableFeatures = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Présentation du Club',
      description: 'Découvrez CODEL, notre mission, nos valeurs et notre équipe.',
      isAvailable: true,
      action: 'about'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Événements Ouverts',
      description: 'Consultez nos événements publics et ateliers ouverts à tous.',
      isAvailable: true,
      action: 'events'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Tutoriels Gratuits',
      description: 'Accédez à une sélection de tutoriels gratuits pour commencer.',
      isAvailable: true,
      action: 'tutorials'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Publications Publiques',
      description: 'Explorez nos publications et articles de blog publics.',
      isAvailable: true,
      action: 'publications'
    }
  ];

  const restrictedFeatures = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Projets Étudiants',
      description: 'Accédez aux projets internes des membres du club.',
      isAvailable: false
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Bibliothèque Complète',
      description: 'Explorez notre collection complète de ressources.',
      isAvailable: false
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Communauté Privée',
      description: 'Rejoignez les discussions et forums membres.',
      isAvailable: false
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Formations Exclusives',
      description: 'Accédez aux formations et cours réservés aux membres.',
      isAvailable: false
    }
  ];

  const benefits = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: 'Apprentissage Accéléré',
      description: 'Accédez à des ressources exclusives et des formations de qualité'
    },
    {
      icon: <Users className="w-5 h-5 text-brand-cyan" />,
      title: 'Réseau Professionnel',
      description: 'Connectez-vous avec d\'autres développeurs passionnés'
    },
    {
      icon: <Award className="w-5 h-5 text-purple-500" />,
      title: 'Projets Concrets',
      description: 'Participez à des projets réels et développez votre portfolio'
    },
    {
      icon: <Heart className="w-5 h-5 text-red-500" />,
      title: 'Soutien Continu',
      description: 'Bénéficiez de l\'accompagnement de mentors et de la communauté'
    }
  ];

  return (
    <div className="min-h-screen bg-hub-bg text-slate-200">
      {/* Header */}
      <header className="bg-hub-surface/80 backdrop-blur-md border-b border-hub-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CODEL</h1>
                <p className="text-xs text-slate-400">Community Of Developers & Learners</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={onJoinAsGuest}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Explorer comme invité
              </button>
              <button
                onClick={onApplyForMembership}
                className="px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/80 transition-colors"
              >
                Demander l'adhésion
              </button>
              <button
                onClick={onLogin}
                className="px-4 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors"
              >
                Connexion membre
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-hub-border bg-hub-surface/90"
            >
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => { onJoinAsGuest(); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 text-slate-300 hover:text-white transition-colors text-left"
                >
                  Explorer comme invité
                </button>
                <button
                  onClick={() => { onApplyForMembership(); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/80 transition-colors"
                >
                  Demander l'adhésion
                </button>
                <button
                  onClick={() => { onLogin(); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  Connexion membre
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Bienvenue sur <span className="text-brand-cyan">CODEL</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
                La plateforme collaborative pour étudiants développeurs. 
                Explorez, apprenez et grandissez avec notre communauté.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={onJoinAsGuest}
                className="group px-8 py-4 bg-hub-surface/50 border border-hub-border text-white rounded-xl hover:border-brand-cyan/50 hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all duration-300 flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Explorer comme invité
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onApplyForMembership}
                className="group px-8 py-4 bg-gradient-to-r from-brand-cyan to-brand-purple text-white rounded-xl hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all duration-300 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Demander l'adhésion
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onLogin}
                className="px-8 py-4 border border-hub-border text-white rounded-xl hover:bg-hub-surface/50 transition-all duration-300"
              >
                Connexion membre
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Available Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Ce que vous pouvez explorer</h3>
            <p className="text-slate-400">Découvrez nos fonctionnalités accessibles sans inscription</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {availableFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Restricted Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-hub-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Resserves aux membres</h3>
            <p className="text-slate-400">Devenez membre pour débloquer ces fonctionnalités exclusives</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {restrictedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Pourquoi rejoindre CODEL ?</h3>
            <p className="text-slate-400">Les avantages de devenir membre de notre communauté</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-hub-surface/50 border border-hub-border rounded-xl p-6 hover:border-brand-cyan/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  {benefit.icon}
                  <h4 className="font-bold text-white">{benefit.title}</h4>
                </div>
                <p className="text-sm text-slate-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={onApplyForMembership}
              className="group px-8 py-4 bg-gradient-to-r from-brand-cyan to-brand-purple text-white rounded-xl hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Users className="w-5 h-5" />
              Rejoindre CODEL maintenant
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-hub-border bg-hub-surface/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan to-brand-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">CODEL</h4>
              <p className="text-xs text-slate-400">Community Of Developers & Learners</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 CODEL. Tous droits réservés. | 
            <button onClick={onApplyForMembership} className="text-brand-cyan hover:underline ml-1">
              Devenir membre
            </button>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GuestMode;
