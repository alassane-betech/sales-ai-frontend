# ROADMAP - Dashboard par Organisation

## 🎯 Objectif

Transformer l'application en un système multi-organisations où chaque utilisateur peut accéder à plusieurs organisations et avoir un dashboard spécifique pour chacune.

## 🏗️ Architecture Globale

### Structure des Routes

```
/auth → /dashboard/organizations → /dashboard/[organizationId]
```

### Flux Utilisateur

1. **Connexion** → `/auth`
2. **Sélection Organisation** → `/dashboard/organizations`
3. **Dashboard Organisation** → `/dashboard/[organizationId]`

## 📁 Structure des Fichiers

### 1. Nouvelles Routes

```
app/
├── dashboard/
│   ├── organizations/
│   │   └── page.tsx          # Liste des organisations
│   ├── [organizationId]/
│   │   └── page.tsx          # Dashboard spécifique à l'org
│   └── page.tsx              # Redirection vers /organizations
```

### 2. Nouveaux Composants

```
components/
├── organizations/
│   ├── organization-list.tsx      # Liste des organisations
│   ├── organization-card.tsx      # Carte d'organisation
│   └── organization-selector.tsx  # Sélecteur d'org (header)
├── dashboard/
│   ├── organization-header.tsx    # Header avec info org
│   └── organization-sidebar.tsx   # Sidebar adaptée à l'org
```

### 3. Nouveaux Contexts

```
lib/
├── contexts/
│   └── organization-context.tsx   # Gestion de l'org active
├── types/
│   └── organization.ts            # Types TypeScript
└── api/
    └── organizations.ts           # Appels API organisations
```

## 🔧 Implémentation par Étapes

### Étape 1: Types et Interfaces

```typescript
// lib/types/organization.ts
interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  role: "owner" | "admin" | "member";
  createdAt: string;
  updatedAt: string;
}

interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}
```

### Étape 2: Context d'Organisation

```typescript
// lib/contexts/organization-context.tsx
interface OrganizationContextType {
  currentOrganization: Organization | null;
  userOrganizations: Organization[];
  setCurrentOrganization: (org: Organization) => void;
  refreshOrganizations: () => Promise<void>;
}
```

### Étape 3: API Organisations

```typescript
// lib/api/organizations.ts
export const getUserOrganizations = async (): Promise<Organization[]>
export const getOrganizationById = async (id: string): Promise<Organization>
export const createOrganization = async (data: CreateOrgData): Promise<Organization>
```

### Étape 4: Page Organisations

```typescript
// app/dashboard/organizations/page.tsx
- Récupération des organisations de l'utilisateur
- Affichage en grille avec cartes
- Bouton "Créer une organisation"
- Navigation vers le dashboard de l'org sélectionnée
```

### Étape 5: Dashboard par Organisation

```typescript
// app/dashboard/[organizationId]/page.tsx
- Récupération de l'ID depuis les paramètres
- Chargement des données de l'organisation
- Affichage du dashboard avec contexte de l'org
- Sidebar adaptée à l'organisation
```

### Étape 6: Composants Adaptés

```typescript
// components/dashboard/organization-header.tsx
- Nom et logo de l'organisation
- Sélecteur d'organisation (dropdown)
- Informations utilisateur

// components/dashboard/organization-sidebar.tsx
- Navigation adaptée à l'organisation
- Gestion des permissions selon le rôle
- Actions spécifiques à l'org
```

## 🔐 Gestion des Permissions

### Rôles et Permissions

- **Owner**: Accès complet + gestion des membres
- **Admin**: Accès complet + gestion des paramètres
- **Member**: Accès limité aux fonctionnalités de base

### Vérification des Permissions

```typescript
const canManageMembers = (role: string) => ["owner", "admin"].includes(role);
const canManageSettings = (role: string) => ["owner", "admin"].includes(role);
```

## 🚀 Avantages de cette Architecture

1. **Séparation Claire**: Chaque organisation a son propre espace
2. **Scalabilité**: Facile d'ajouter de nouvelles organisations
3. **Sécurité**: Isolation des données par organisation
4. **UX**: Navigation intuitive entre organisations
5. **Maintenance**: Code modulaire et réutilisable

## 📋 Checklist d'Implémentation

- [ ] Créer les types TypeScript
- [ ] Implémenter le context d'organisation
- [ ] Créer les routes dynamiques
- [ ] Implémenter l'API des organisations
- [ ] Créer la page de sélection d'organisation
- [ ] Adapter le dashboard existant
- [ ] Ajouter la gestion des permissions
- [ ] Tester la navigation entre organisations
- [ ] Optimiser les performances
- [ ] Ajouter la gestion d'erreurs

## 🔄 Migration des Données Existantes

1. **Dashboard Actuel**: Rediriger vers `/dashboard/organizations`
2. **Composants Existants**: Adapter pour utiliser le contexte d'organisation
3. **Navigation**: Ajouter le sélecteur d'organisation dans le header
4. **Sidebar**: Adapter selon l'organisation active

## 💡 Considérations Techniques

- **Performance**: Lazy loading des composants par organisation
- **Caching**: Mise en cache des données d'organisation
- **SEO**: Meta tags dynamiques selon l'organisation
- **Accessibilité**: Navigation clavier et lecteurs d'écran
- **Responsive**: Design adaptatif pour mobile et tablette
