# Configuration des Variables d'Environnement

## 📋 Variables Requises

Créez un fichier `.env.local` à la racine de votre projet avec les variables suivantes :

```bash
# Configuration de l'API
NEXT_PUBLIC_API_URL=http://localhost:4000

# Configuration de l'authentification (optionnel)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## 🔧 Variables Disponibles

### `NEXT_PUBLIC_API_URL`

- **Description** : URL de base de votre API backend
- **Valeur par défaut** : `http://localhost:4000`
- **Exemple** : `https://api.votreapp.com`

### `NEXTAUTH_SECRET` (optionnel)

- **Description** : Clé secrète pour NextAuth.js
- **Utilisation** : Génération de tokens sécurisés

### `NEXTAUTH_URL` (optionnel)

- **Description** : URL de base de votre application
- **Valeur par défaut** : `http://localhost:3000`

## 🚀 Démarrage Rapide

1. **Copiez le fichier d'exemple** :

   ```bash
   cp .env.example .env.local
   ```

2. **Modifiez les valeurs** selon votre configuration

3. **Redémarrez votre serveur** de développement

## ⚠️ Important

- Le fichier `.env.local` est automatiquement ignoré par Git
- Les variables commençant par `NEXT_PUBLIC_` sont exposées côté client
- Les autres variables sont uniquement côté serveur
- Redémarrez toujours votre serveur après modification des variables d'environnement

## 🔍 Vérification

Le système affichera un avertissement dans la console si des variables requises sont manquantes, mais utilisera les valeurs par défaut.
