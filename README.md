# 🎵 Music Theory App

Une application web interactive pour apprendre et pratiquer la théorie musicale. Développée avec React, TypeScript et Tailwind CSS.

## ✨ Fonctionnalités

### 📚 Apprentissage
- **Gammes** : Major, Minor, Pentatonic, Blues, Dorian avec descriptions détaillées
- **Accords** : Triades, accords de 7ème avec inversions
- **Cadences** : Perfect, Plagal, Imperfect, Deceptive, Half avec analyse harmonique
- **Entraînement auditif** : Intervalles, accords, gammes, progressions

### 🎹 Pratique Interactive
- Piano virtuel 2 octaves avec touches blanches et noires
- Sélecteur de note racine (12 notes)
- Affichage des notes sur le piano
- Système de défis aléatoires
- Feedback immédiat avec bouton "Show Answer"

### 👂 Entraînement Auditif
- Quiz de 10 questions par type
- 4 catégories : intervalles, accords, gammes, progressions
- Système de score et pourcentages
- Conseils d'apprentissage pour chaque catégorie

### 📊 Suivi des Progrès
- Streak de jours consécutifs
- Pourcentage de complétion global
- Statistiques détaillées par catégorie
- Historique des activités récentes
- Scores d'entraînement auditif

## 🛠️ Technologies Utilisées

- **React 18** - Framework JavaScript
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn/ui** - Composants UI
- **Zustand** - Gestion d'état globale
- **React Router** - Navigation
- **Lucide React** - Icônes
- **Vite** - Build tool

## 🎨 Design System

### Couleurs
- **Primary** : `#086C93` (Teal Blue)
- **Secondary** : `#006699` (Dark Blue)
- **Background** : `#121212` (Dark)
- **Surface** : `#1E1E1E` (Dark Surface)

### Thème
- Design moderne sombre inspiré iOS/Linear/Notion
- Cards arrondies avec bordures subtiles
- Animations fluides et transitions douces
- Interface responsive mobile-first

## 🚀 Installation et Lancement

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd music-theory-app
```

2. **Installer les dépendances**

**Pour Mac M1/M2 (recommandé) :**
```bash
# Installer Bun si pas déjà fait
curl -fsSL https://bun.sh/install | bash

# Installer les dépendances
bun install
```

**Pour autres systèmes :**
```bash
npm install
```

3. **Lancer en développement**

**Avec Bun (M1/M2) :**
```bash
bun run dev
```

**Avec npm :**
```bash
npm run dev
```

4. **Build pour production**
```bash
npm run build
```

## 📱 Navigation

L'application utilise une navigation par onglets en bas d'écran :

- **Learn** (`/learn`) - Hub d'apprentissage avec toutes les catégories
- **Practice** (`/practice`) - Interface de pratique interactive
- **Ear Training** (`/ear-training`) - Entraînement auditif
- **Progress** (`/progress`) - Suivi des progrès et statistiques

## 🔗 Routes Disponibles

### Pages Principales
- `/` - Redirection vers Learn
- `/learn` - Hub d'apprentissage
- `/practice` - Interface de pratique
- `/ear-training` - Hub d'entraînement auditif
- `/progress` - Dashboard de progression

### Pages Détails
- `/scale/[id]` - Détails d'une gamme (ex: `/scale/major`)
- `/chord/[id]` - Détails d'un accord (ex: `/chord/minor7`)
- `/cadence/[id]` - Détails d'une cadence (ex: `/cadence/perfect`)
- `/ear-training/[type]` - Exercices auditifs (ex: `/ear-training/intervals`)

## 🎼 Données Musicales

### Gammes Supportées
- **Major** : 0,2,4,5,7,9,11 (W-W-H-W-W-W-H)
- **Minor** : 0,2,3,5,7,8,10 (W-H-W-W-H-W-W)
- **Pentatonic** : 0,2,4,7,9
- **Blues** : 0,3,5,6,7,10
- **Dorian** : 0,2,3,5,7,9,10

### Accords Supportés
- **Major** : 0,4,7
- **Minor** : 0,3,7
- **Diminished** : 0,3,6
- **Augmented** : 0,4,8
- **Major 7th** : 0,4,7,11
- **Dominant 7th** : 0,4,7,10
- **Minor 7th** : 0,3,7,10

### Cadences
- **Perfect** : V-I (résolution forte)
- **Plagal** : IV-I (cadence "Amen")
- **Imperfect** : I-V (attente)
- **Deceptive** : V-vi (résolution surprise)
- **Half** : I-V (demi-cadence)

## 🗂️ Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── ui/               # Composants UI Shadcn
│   ├── PianoKeyboard.tsx
│   ├── CircleOfFifths.tsx
│   ├── ScaleDisplay.tsx
│   ├── ChordDisplay.tsx
│   ├── ProgressBar.tsx
│   └── Navigation.tsx
├── pages/                # Pages de l'application
│   ├── Learn.tsx
│   ├── Practice.tsx
│   ├── EarTraining.tsx
│   ├── Progress.tsx
│   ├── ScaleDetail.tsx
│   ├── ChordDetail.tsx
│   ├── CadenceDetail.tsx
│   └── EarTrainingExercise.tsx
├── constants/            # Données musicales
│   └── musicTheory.ts
├── store/                # Gestion d'état
│   └── progressStore.ts
├── hooks/                # Hooks personnalisés
└── lib/                  # Utilitaires
```

## 💾 Persistance des Données

L'application utilise `localStorage` via Zustand pour sauvegarder :
- Progression des gammes et accords pratiqués
- Scores d'entraînement auditif
- Streak de jours consécutifs
- Statistiques globales

## 🎯 Fonctionnalités Clés

### Piano Virtuel
- 2 octaves (C4-B5)
- Touches blanches et noires interactives
- Highlight des notes selon le contexte
- Labels optionnels sur les touches

### Cercle des Quintes
- Représentation SVG interactive
- Cercle extérieur : tonalités majeures
- Cercle intérieur : relatives mineures
- Cliquable pour changer la tonique

### Système de Progression
- Suivi automatique des éléments pratiqués
- Calcul des streaks quotidiens
- Pourcentages de complétion
- Historique détaillé

## 🔧 Personnalisation

### Ajouter une Nouvelle Gamme
1. Éditer `src/constants/musicTheory.ts`
2. Ajouter la gamme dans `scaleTypes`
3. La gamme apparaîtra automatiquement dans l'interface

### Ajouter un Nouvel Accord
1. Éditer `src/constants/musicTheory.ts`
2. Ajouter l'accord dans `chordTypes`
3. L'accord sera disponible dans Practice et Learn

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🎵 Crédits

Développé avec ❤️ pour les passionnés de musique et de théorie musicale.

---

**Note** : Cette application est à des fins éducatives. Les fonctionnalités audio sont simulées (boutons "Play Sound" comme placeholders).
