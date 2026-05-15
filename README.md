<div align="center">
  <!-- Logo CODEL PROGRAMMATION -->
  <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; border-radius: 20px; margin: 20px 0;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
      <div style="position: relative; width: 80px; height: 80px;">
        <div style="background: #1a1a1a; border-radius: 12px; padding: 15px; box-shadow: 0 0 30px rgba(251,146,60,0.5); position: relative;">
          <div style="display: flex; align-items: center;">
            <div style="width: 30px; height: 40px; border: 4px solid #fb923c; border-radius: 8px 0 0 8px; border-right: none;"></div>
            <div style="position: absolute; right: -8px; top: 8px;">
              <div style="width: 20px; height: 25px; border: 2px solid #22c55e; border-radius: 4px; position: relative;">
                <div style="position: absolute; inset: 2px; top: 2px; height: 8px; background: #4ade80; border-radius: 2px;"></div>
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: #22c55e; border-radius: 0 0 2px 2px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 style="color: #22c55e; font-size: 2.5rem; font-weight: bold; margin: 0; line-height: 1;">CODEL</h1>
        <h2 style="color: #fb923c; font-size: 2.5rem; font-weight: bold; margin: 0; line-height: 1; margin-top: -10px;">PROGRAMMATION</h2>
      </div>
    </div>
  </div>
  
  <h1 style="color: #333; margin-bottom: 10px;">🚀 CODEL Hub - Community Of Developers & Learners</h1>
  <p style="color: #666; font-size: 1.2rem; max-width: 800px; margin: 0 auto;">Platforme collaborative d'apprentissage pour étudiants développeurs avec bibliothèque numérique, tutoriels et système de gamification</p>
</div>

## 🌟 Fonctionnalités Principales

### 📚 CODEL Library - Bibliothèque Numérique Intelligente
- 🔎 **Recherche intelligente** avec scoring de pertinence
- 📖 **Lecteur PDF intégré** avec marque-pages et progression
- 🗂 **10 catégories** organisées (Programmation, Mobile, Web, IA, etc.)
- ⭐ **Favoris personnels** et téléchargement hors ligne
- 📥 **Support multi-formats** (PDF, ePub, Vidéo, Documentation)

### 🎬 CODEL Academy - Plateforme Tutoriels
- 📤 **Upload vidéo** avec miniature et ressources
- ❤️ **Interactions communautaires** (likes, commentaires, notations)
- 🏅 **Système de récompenses créateurs** avec 4 badges progressifs
- 📊 **Statistiques créateurs** et suivi de progression
- 🎓 **Formation officielle** du club avec modules et certificats

### 🎯 Système de Gamification
- 🏆 **8 badges CODEL** (Débutant, Contributeur, Mentor, etc.)
- 💰 **Points de motivation** pour chaque activité
- 📈 **Classement** des membres les plus actifs
- 🎖️ **Récompenses** pour contributions exceptionnelles

### 🎨 Interface Moderne
- 🌓 **Mode sombre/clair** adaptable
- 📱 **Design responsive** pour tous les écrans
- 🔍 **Filtres avancés** par catégorie, type, difficulté
- ⚡ **Performances optimisées** avec chargement intelligent

## 🛠 Stack Technique

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Lucide Icons
- **Backend**: Firebase Auth + Firestore
- **PDF**: React PDF Viewer
- **QR Codes**: QR Code Generation
- **Build**: Optimisé pour production

## 🚀 Déploiement

### Prérequis
- Node.js 18+
- Compte Firebase
- Compte Vercel (pour le déploiement)

### Installation
```bash
# Cloner le repository
git clone https://github.com/votre-username/codel-hub.git
cd codel-hub

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Firebase
```

### Développement Local
```bash
npm run dev
# L'application sera disponible sur http://localhost:3000
```

### Build pour Production
```bash
npm run build
# Les fichiers build seront dans le dossier `dist/`
```

### Déploiement sur Vercel
1. Connecter votre repository GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Déployer automatiquement

## 🔧 Configuration

### Variables d'Environnement
```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_domaine
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_GEMINI_API_KEY=votre_gemini_key
VITE_APP_URL=https://votre-domaine.vercel.app
```

### Structure du Projet
```
src/
├── components/          # Composants React
│   ├── Logo.tsx        # Logo CODEL PROGRAMMATION
│   ├── LibraryPage.tsx # Page principale de la bibliothèque
│   ├── PDFReader.tsx   # Lecteur PDF intégré
│   ├── TutorialUpload.tsx # Upload de tutoriels
│   └── OfficialTraining.tsx # Formation officielle
├── services/           # Services métier
│   ├── libraryService.ts # Service bibliothèque
│   ├── academyService.ts # Service academy
│   ├── gamificationService.ts # Service gamification
│   └── qrCodeService.ts # Service QR codes
├── context/            # Contextes React
├── lib/               # Utilitaires
├── types.ts           # Types TypeScript
└── data.ts           # Données mock
```

## 🎯 Philosophie

> *"Chaque étudiant peut devenir : Apprenant → Contributeur → Mentor"*

CODEL Hub incarne cette vision en offrant :
- **Parcours d'apprentissage** fluide et progressif
- **Reconnaissance** des contributions individuelles
- **Communauté** active et collaborative
- **Accès universel** aux connaissances

## 📊 Statistiques du Projet

- 📁 **29 fichiers** modifiés
- 📝 **7,031 lignes** de code
- 🏗️ **Architecture** modulaire et scalable
- 🎨 **Design** moderne et accessible
- ⚡ **Performance** optimisée

## 🤝 Contribuer

1. Fork le repository
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Firebase** pour l'infrastructure backend
- **Vercel** pour l'hébergement
- **React** et **TypeScript** pour l'écosystème frontend
- **TailwindCSS** pour le design
- **Toute la communauté CODEL** 🚀

---

<div align="center">
  <p style="color: #666; font-style: italic;">Made with ❤️ by CODEL Community</p>
</div>
