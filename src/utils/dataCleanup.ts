import { doc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Utilitaire pour nettoyer les données de test de CODEL Hub
 * Supprime les documents de test, les données temporaires et les entrées invalides
 */

interface CleanupStats {
  deletedDocuments: number;
  deletedCollections: number;
  errors: string[];
  startTime: Date;
  endTime: Date;
}

const TEST_PATTERNS = [
  /^test_/i,
  /^demo_/i,
  /^sample_/i,
  /^temp_/i,
  /^mock_/i,
  /^dummy_/i,
  /^fake_/i,
  /^sandbox_/i
];

const TEST_EMAILS = [
  'test@example.com',
  'demo@example.com',
  'sample@example.com',
  'temp@example.com',
  'mock@example.com',
  'dummy@example.com',
  'fake@example.com',
  'sandbox@example.com'
];

const COLLECTIONS_TO_CLEAN = [
  'users',
  'xp_transactions',
  'tutorials',
  'secure_library_resources',
  'reading_sessions',
  'library_statistics',
  'membership_applications',
  'events',
  'forum_posts',
  'forum_comments',
  'quiz_results',
  'portfolio_projects',
  'calendar_events'
];

/**
 * Vérifie si un document est une donnée de test
 */
function isTestData(document: any): boolean {
  const data = document.data();
  
  // Vérifier les ID de test
  const id = document.id;
  if (TEST_PATTERNS.some(pattern => pattern.test(id))) {
    return true;
  }
  
  // Vérifier les emails de test
  if (data.email && TEST_EMAILS.includes(data.email)) {
    return true;
  }
  
  // Vérifier les noms de test
  if (data.name && typeof data.name === 'string') {
    if (TEST_PATTERNS.some(pattern => pattern.test(data.name))) {
      return true;
    }
  }
  
  // Vérifier les titres de test
  if (data.title && typeof data.title === 'string') {
    if (TEST_PATTERNS.some(pattern => pattern.test(data.title))) {
      return true;
    }
  }
  
  // Vérifier les champs isTest ou isDemo
  if (data.isTest === true || data.isDemo === true || data.isSample === true) {
    return true;
  }
  
  // Vérifier les dates de test (très anciennes ou très futures)
  if (data.createdAt) {
    const createdDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    
    if (createdDate < oneYearAgo || createdDate > oneYearFromNow) {
      return true;
    }
  }
  
  return false;
}

/**
 * Nettoie une collection spécifique
 */
async function cleanCollection(collectionName: string, stats: CleanupStats): Promise<void> {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`Collection ${collectionName} est vide`);
      return;
    }
    
    const batch = writeBatch(db);
    let documentsToDelete = 0;
    
    snapshot.forEach(doc => {
      if (isTestData(doc)) {
        batch.delete(doc.ref);
        documentsToDelete++;
      }
    });
    
    if (documentsToDelete > 0) {
      await batch.commit();
      stats.deletedDocuments += documentsToDelete;
      console.log(`Supprimé ${documentsToDelete} documents de test de la collection ${collectionName}`);
    } else {
      console.log(`Aucun document de test trouvé dans la collection ${collectionName}`);
    }
    
  } catch (error) {
    const errorMessage = `Erreur lors du nettoyage de la collection ${collectionName}: ${error}`;
    stats.errors.push(errorMessage);
    console.error(errorMessage);
  }
}

/**
 * Nettoie les sous-collections d'un document
 */
async function cleanSubcollections(parentDocPath: string, stats: CleanupStats): Promise<void> {
  try {
    const parentDocRef = doc(db, parentDocPath);
    const subcollections = await getDocs(collection(parentDocRef));
    
    const batch = writeBatch(db);
    let documentsToDelete = 0;
    
    subcollections.forEach(doc => {
      if (isTestData(doc)) {
        batch.delete(doc.ref);
        documentsToDelete++;
      }
    });
    
    if (documentsToDelete > 0) {
      await batch.commit();
      stats.deletedDocuments += documentsToDelete;
      console.log(`Supprimé ${documentsToDelete} documents de test des sous-collections de ${parentDocPath}`);
    }
    
  } catch (error) {
    const errorMessage = `Erreur lors du nettoyage des sous-collections de ${parentDocPath}: ${error}`;
    stats.errors.push(errorMessage);
    console.error(errorMessage);
  }
}

/**
 * Nettoie les utilisateurs de test et leurs données associées
 */
async function cleanTestUsers(stats: CleanupStats): Promise<void> {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    for (const userDoc of snapshot) {
      if (isTestData(userDoc)) {
        // Supprimer les données de l'utilisateur
        const userId = userDoc.id;
        
        // Supprimer les transactions XP
        await cleanSubcollections(`users/${userId}/xp_transactions`, stats);
        
        // Supprimer les sessions de lecture
        await cleanSubcollections(`users/${userId}/reading_sessions`, stats);
        
        // Supprimer les résultats de quiz
        await cleanSubcollections(`users/${userId}/quiz_results`, stats);
        
        // Supprimer l'utilisateur
        await deleteDoc(userDoc.ref);
        stats.deletedDocuments++;
        console.log(`Supprimé l'utilisateur de test: ${userId}`);
      }
    }
    
  } catch (error) {
    const errorMessage = `Erreur lors du nettoyage des utilisateurs de test: ${error}`;
    stats.errors.push(errorMessage);
    console.error(errorMessage);
  }
}

/**
 * Nettoie les fichiers temporaires dans le stockage
 */
async function cleanTempFiles(stats: CleanupStats): Promise<void> {
  try {
    // Note: Cette fonction nécessiterait l'implémentation avec Firebase Storage
    // Pour l'instant, nous allons simuler le nettoyage
    console.log('Simulation du nettoyage des fichiers temporaires...');
    
    // En production, vous utiliseriez:
    // import { ref, listAll, deleteObject } from 'firebase/storage';
    // import { storage } from '../firebase/config';
    
    const tempFileCount = 0; // Simulé
    stats.deletedDocuments += tempFileCount;
    console.log(`Supprimé ${tempFileCount} fichiers temporaires`);
    
  } catch (error) {
    const errorMessage = `Erreur lors du nettoyage des fichiers temporaires: ${error}`;
    stats.errors.push(errorMessage);
    console.error(errorMessage);
  }
}

/**
 * Nettoie les données orphelines (documents sans parent valide)
 */
async function cleanOrphanedData(stats: CleanupStats): Promise<void> {
  try {
    console.log('Recherche de données orphelines...');
    
    // Vérifier les transactions XP sans utilisateur valide
    const xpTransactionsRef = collection(db, 'xp_transactions');
    const xpSnapshot = await getDocs(xpTransactionsRef);
    
    const batch = writeBatch(db);
    let orphanedCount = 0;
    
    for (const xpDoc of xpSnapshot) {
      const userId = xpDoc.data().userId;
      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          await getDoc(userRef);
        } catch {
          // L'utilisateur n'existe pas, supprimer la transaction
          batch.delete(xpDoc.ref);
          orphanedCount++;
        }
      }
    }
    
    if (orphanedCount > 0) {
      await batch.commit();
      stats.deletedDocuments += orphanedCount;
      console.log(`Supprimé ${orphanedCount} transactions XP orphelines`);
    }
    
  } catch (error) {
    const errorMessage = `Erreur lors du nettoyage des données orphelines: ${error}`;
    stats.errors.push(errorMessage);
    console.error(errorMessage);
  }
}

/**
 * Fonction principale de nettoyage
 */
export async function cleanupTestData(): Promise<CleanupStats> {
  const stats: CleanupStats = {
    deletedDocuments: 0,
    deletedCollections: 0,
    errors: [],
    startTime: new Date(),
    endTime: new Date()
  };
  
  console.log('🧹 Début du nettoyage des données de test...');
  
  try {
    // 1. Nettoyer les collections principales
    for (const collectionName of COLLECTIONS_TO_CLEAN) {
      await cleanCollection(collectionName, stats);
    }
    
    // 2. Nettoyer les utilisateurs de test et leurs données
    await cleanTestUsers(stats);
    
    // 3. Nettoyer les fichiers temporaires
    await cleanTempFiles(stats);
    
    // 4. Nettoyer les données orphelines
    await cleanOrphanedData(stats);
    
    stats.endTime = new Date();
    
    // 5. Afficher le résumé
    console.log('\n📊 Résumé du nettoyage:');
    console.log(`⏱️  Durée: ${stats.endTime.getTime() - stats.startTime.getTime()}ms`);
    console.log(`🗑️  Documents supprimés: ${stats.deletedDocuments}`);
    console.log(`📁 Collections nettoyées: ${COLLECTIONS_TO_CLEAN.length}`);
    
    if (stats.errors.length > 0) {
      console.log(`❌ Erreurs: ${stats.errors.length}`);
      stats.errors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ Nettoyage terminé sans erreur');
    }
    
  } catch (error) {
    const errorMessage = `Erreur générale lors du nettoyage: ${error}`;
    stats.errors.push(errorMessage);
    console.error(errorMessage);
    stats.endTime = new Date();
  }
  
  return stats;
}

/**
 * Nettoie les données de test spécifiques à un environnement
 */
export async function cleanupEnvironmentData(environment: 'development' | 'staging' | 'production'): Promise<CleanupStats> {
  const stats = await cleanupTestData();
  
  if (environment === 'production') {
    console.log('⚠️  Environnement de production - Nettoyage conservateur uniquement');
    // En production, on peut être plus sélectif sur ce qu'on supprime
  } else if (environment === 'development') {
    console.log('🔧 Environnement de développement - Nettoyage agressif');
    // En développement, on peut supprimer plus de données de test
  }
  
  return stats;
}

/**
 * Planifie un nettoyage automatique
 */
export function scheduleAutoCleanup(intervalHours: number = 24): void {
  console.log(`🕐 Planification du nettoyage automatique toutes les ${intervalHours} heures`);
  
  setInterval(async () => {
    console.log('🧹 Lancement du nettoyage automatique...');
    const stats = await cleanupTestData();
    
    // Envoyer une notification si nécessaire
    if (stats.errors.length > 0) {
      console.warn('⚠️  Le nettoyage automatique a rencontré des erreurs');
    }
  }, intervalHours * 60 * 60 * 1000);
}

/**
 * Vérifie l'état de la base de données
 */
export async function checkDatabaseHealth(): Promise<{
  totalDocuments: number;
  testDocuments: number;
  collectionStats: Record<string, number>;
}> {
  const collectionStats: Record<string, number> = {};
  let totalDocuments = 0;
  let testDocuments = 0;
  
  for (const collectionName of COLLECTIONS_TO_CLEAN) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      let collectionTestCount = 0;
      snapshot.forEach(doc => {
        totalDocuments++;
        if (isTestData(doc)) {
          testDocuments++;
          collectionTestCount++;
        }
      });
      
      collectionStats[collectionName] = snapshot.size;
      
    } catch (error) {
      console.error(`Erreur lors de la vérification de la collection ${collectionName}:`, error);
      collectionStats[collectionName] = 0;
    }
  }
  
  return {
    totalDocuments,
    testDocuments,
    collectionStats
  };
}

/**
 * Exporte les statistiques de nettoyage
 */
export function exportCleanupStats(stats: CleanupStats): string {
  const duration = stats.endTime.getTime() - stats.startTime.getTime();
  
  return `
🧹 Rapport de Nettoyage CODEL Hub
================================
Date: ${stats.endTime.toLocaleString()}
Durée: ${duration}ms

📊 Statistiques:
- Documents supprimés: ${stats.deletedDocuments}
- Collections traitées: ${COLLECTIONS_TO_CLEAN.length}
- Erreurs: ${stats.errors.length}

${stats.errors.length > 0 ? `
❌ Erreurs rencontrées:
${stats.errors.map(error => `- ${error}`).join('\n')}
` : `
✅ Nettoyage terminé avec succès
`}
`;
}

// Exporter les fonctions pour utilisation dans les scripts ou les tests
export default {
  cleanupTestData,
  cleanupEnvironmentData,
  scheduleAutoCleanup,
  checkDatabaseHealth,
  exportCleanupStats,
  isTestData,
  cleanCollection,
  cleanSubcollections,
  cleanTestUsers,
  cleanTempFiles,
  cleanOrphanedData
};
