# Comparaison des Couleurs - Calendar vs Dashboard

## Vue d'ensemble

Ce document compare les couleurs utilisées dans la page `calendar/[eventId]` avec celles utilisées dans le reste de l'application (notamment le dashboard).

## Palette de couleurs Calendar/[eventId]

### Backgrounds

- **Background principal** : `bg-gradient-to-br from-[#18181B] via-[#1a1a1d] to-[#202023]`
- **Container principal** : `bg-[#1E1E21]`
- **Section gauche** : `bg-[#1E1E21]`
- **Section droite** : `bg-[#232327]`
- **Footer** : `bg-[#1E1E21]`
- **Cards/Containers** : `bg-[#1E1E21]`
- **Inputs** : `bg-[#18181B]`

### Textes

- **Texte principal** : `text-white`
- **Texte secondaire** : `text-[#9D9DA8]`
- **Placeholders** : `placeholder:text-gray-400`

### Bordures

- **Bordures principales** : `border-[#232327]`
- **Bordures accent** : `border-[#007953]/20`
- **Bordures inputs** : `border-[#007953]/20`

### Boutons

- **Bouton principal** : `bg-[#007953] hover:bg-[#00a86b]`
- **Bouton secondaire** : `border-[#007953]/30 text-[#007953] hover:bg-[#007953]/20`
- **Bouton outline** : `border-[#007953]/30 text-white hover:bg-[#007953]/20`

### Accents

- **Couleur principale** : `#007953` (vert foncé)
- **Couleur hover** : `#00a86b` (vert plus clair)
- **Icônes de succès** : `text-[#007953]`

## Palette de couleurs Dashboard

### Backgrounds

- **Background principal** : `bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900`
- **Sidebar** : `bg-white/5 backdrop-blur-md`
- **Cards** : `bg-white/5 backdrop-blur-md`
- **Inputs** : `bg-white/10`

### Textes

- **Texte principal** : `text-white`
- **Texte secondaire** : `text-gray-400`
- **Texte muted** : `text-gray-300`

### Bordures

- **Bordures principales** : `border-white/10`
- **Bordures inputs** : `border-white/20`

### Boutons

- **Bouton principal** : `bg-green-main hover:bg-green-light` (utilise les couleurs du thème)
- **Bouton secondaire** : `border-green-main text-green-main hover:bg-green-main hover:text-white`
- **Bouton outline** : `border-white/20 text-white hover:bg-white/10`

### Accents

- **Couleur principale** : `green-main` (#22c55e)
- **Couleur hover** : `green-light` (#4ade80)
- **Couleur dark** : `green-dark` (#16a34a)

## Différences principales

### 1. Système de couleurs

- **Calendar** : Utilise des couleurs hexadécimales hardcodées (`#18181B`, `#1E1E21`, `#007953`)
- **Dashboard** : Utilise le système de couleurs Tailwind configuré (`dark-900`, `green-main`, `white/5`)

### 2. Backgrounds

- **Calendar** : Gradients avec des tons très sombres et spécifiques
- **Dashboard** : Utilise des backgrounds avec transparence et blur (`white/5 backdrop-blur-md`)

### 3. Couleurs d'accent

- **Calendar** : Vert foncé `#007953` / `#00a86b`
- **Dashboard** : Vert plus vif `#22c55e` / `#4ade80`

### 4. Approche des containers

- **Calendar** : Couleurs de fond opaques et fixes
- **Dashboard** : Effet glassmorphism avec transparence

### 5. Cohérence

- **Calendar** : Palette isolée, pas réutilisable
- **Dashboard** : Utilise le système de design cohérent de l'app

## Recommandations pour l'harmonisation

### Option 1: Adopter le système Calendar partout

- Remplacer `green-main` par `#007953`
- Remplacer `green-light` par `#00a86b`
- Adopter les backgrounds sombres spécifiques
- Utiliser les couleurs hexadécimales hardcodées

### Option 2: Adopter le système Dashboard partout

- Remplacer les couleurs hardcodées par les variables Tailwind
- Adopter l'effet glassmorphism
- Utiliser le système de couleurs cohérent

### Option 3: Créer un nouveau système hybride

- Garder les couleurs sombres du Calendar
- Adopter la transparence du Dashboard
- Créer de nouvelles variables CSS pour les couleurs Calendar

## Impact sur l'expérience utilisateur

### Calendar (actuel)

- ✅ Ambiance très sombre et moderne
- ✅ Contraste élevé
- ❌ Incohérent avec le reste de l'app
- ❌ Couleurs non réutilisables

### Dashboard (actuel)

- ✅ Cohérent dans toute l'app
- ✅ Effet glassmorphism moderne
- ✅ Système de couleurs maintenable
- ❌ Moins de contraste que le Calendar

## Conclusion

Le Calendar utilise une palette de couleurs plus sombre et contrastée que le reste de l'application. Pour une expérience utilisateur cohérente, il serait recommandé d'harmoniser les deux approches, soit en adoptant le système Calendar partout, soit en adaptant le Calendar au système Dashboard existant.
