import { i18n } from '@lingui/core'
import { fr, en } from 'make-plural/plurals'

export const locales = {
  fr: 'Français',
  en: 'English',
}

export const defaultLocale = 'fr'

i18n.loadLocaleData({
  fr: { plurals: fr },
  en: { plurals: en },
})

// Initialize with default locale
i18n.activate(defaultLocale)

// Messages statiques
const messages = {
  fr: {
    // Navigation
    'Users': 'Utilisateurs',
    'Logout': 'Déconnexion',
    'Loading...': 'Chargement...',

    // Login
    'Welcome to Porotein Admin': 'Bienvenue sur Porotein Admin',
    'Enter your credentials to continue': 'Entrez vos identifiants pour continuer',
    'Username': 'Nom d\'utilisateur',
    'Your username': 'Votre nom d\'utilisateur',
    'Password': 'Mot de passe',
    'Your password': 'Votre mot de passe',
    'Sign in': 'Se connecter',
    'Invalid username or password': 'Nom d\'utilisateur ou mot de passe invalide',

    // Users
    'Add User': 'Ajouter un utilisateur',
    'Edit User': 'Modifier l\'utilisateur',
    'Delete User': 'Supprimer l\'utilisateur',
    'Restore User': 'Restaurer l\'utilisateur',
    'Activate User': 'Activer l\'utilisateur',
    'Deactivate User': 'Désactiver l\'utilisateur',
    'Resend Activation Email': 'Renvoyer l\'email d\'activation',
    'Reset Password': 'Réinitialiser le mot de passe',
    'Email': 'Email',
    'Status': 'Statut',
    'Actions': 'Actions',
    'Select All': 'Tout sélectionner',
    'Clear Selection': 'Effacer la sélection',
    'Bulk Actions': 'Actions groupées',
    'Delete Selected': 'Supprimer la sélection',
    'Activate Selected': 'Activer la sélection',
    'Deactivate Selected': 'Désactiver la sélection',
    'Password is required for new users': 'Le mot de passe est requis pour les nouveaux utilisateurs',
    'Error saving user': 'Erreur lors de la sauvegarde de l\'utilisateur',
    'User saved successfully': 'Utilisateur sauvegardé avec succès',
    'User deleted successfully': 'Utilisateur supprimé avec succès',
    'User restored successfully': 'Utilisateur restauré avec succès',
    'User activated successfully': 'Utilisateur activé avec succès',
    'User deactivated successfully': 'Utilisateur désactivé avec succès',
    'Activation email sent successfully': 'Email d\'activation envoyé avec succès',
    'Password reset email sent successfully': 'Email de réinitialisation de mot de passe envoyé avec succès',
    'Error': 'Erreur',
    'Success': 'Succès',
    'Active': 'Actif',
    'Inactive': 'Inactif',
    'Deleted': 'Supprimé',
    'No users found': 'Aucun utilisateur trouvé',
    'Search': 'Rechercher',
    'Sort by': 'Trier par',
    'Ascending': 'Croissant',
    'Descending': 'Décroissant',

    // User Table
    'Role': 'Rôle',
    'Created At': 'Créé le',
    'Created': 'Créé',
    'Last activation email': 'Dernier email d\'activation',
    'Last password reset': 'Dernière réinitialisation de mot de passe',
    'User deleted': 'Utilisateur supprimé',
    'Deleting...': 'Suppression en cours...',
    'Cancel': 'Annuler',
    'Admin': 'Administrateur',
    'User': 'Utilisateur',

    // User Actions
    'Edit user': 'Modifier l\'utilisateur',
    'You cannot delete your own account': 'Vous ne pouvez pas supprimer votre propre compte',
    'Are you sure you want to delete user {username}? This action cannot be undone.': 'Êtes-vous sûr de vouloir supprimer l\'utilisateur {username} ? Cette action ne peut pas être annulée.',
    'Update': 'Mettre à jour',
    'Create': 'Créer',

    // User Filters
    'Search users...': 'Rechercher des utilisateurs...',
    'Filter by role': 'Filtrer par rôle',
    'Filter by status': 'Filtrer par statut',
    'Start date': 'Date de début',
    'End date': 'Date de fin',
  },
  en: {
    // Navigation
    'Users': 'Users',
    'Logout': 'Logout',
    'Loading...': 'Loading...',

    // Login
    'Welcome to Porotein Admin': 'Welcome to Porotein Admin',
    'Enter your credentials to continue': 'Enter your credentials to continue',
    'Username': 'Username',
    'Your username': 'Your username',
    'Password': 'Password',
    'Your password': 'Your password',
    'Sign in': 'Sign in',
    'Invalid username or password': 'Invalid username or password',

    // Users
    'Add User': 'Add User',
    'Edit User': 'Edit User',
    'Delete User': 'Delete User',
    'Restore User': 'Restore User',
    'Activate User': 'Activate User',
    'Deactivate User': 'Deactivate User',
    'Resend Activation Email': 'Resend Activation Email',
    'Reset Password': 'Reset Password',
    'Email': 'Email',
    'Status': 'Status',
    'Actions': 'Actions',
    'Select All': 'Select All',
    'Clear Selection': 'Clear Selection',
    'Bulk Actions': 'Bulk Actions',
    'Delete Selected': 'Delete Selected',
    'Activate Selected': 'Activate Selected',
    'Deactivate Selected': 'Deactivate Selected',
    'Password is required for new users': 'Password is required for new users',
    'Error saving user': 'Error saving user',
    'User saved successfully': 'User saved successfully',
    'User deleted successfully': 'User deleted successfully',
    'User restored successfully': 'User restored successfully',
    'User activated successfully': 'User activated successfully',
    'User deactivated successfully': 'User deactivated successfully',
    'Activation email sent successfully': 'Activation email sent successfully',
    'Password reset email sent successfully': 'Password reset email sent successfully',
    'Error': 'Error',
    'Success': 'Success',
    'Active': 'Active',
    'Inactive': 'Inactive',
    'Deleted': 'Deleted',
    'No users found': 'No users found',
    'Search': 'Search',
    'Sort by': 'Sort by',
    'Ascending': 'Ascending',
    'Descending': 'Descending',

    // User Table
    'Role': 'Role',
    'Created At': 'Created At',
    'Created': 'Created',
    'Last activation email': 'Last activation email',
    'Last password reset': 'Last password reset',
    'User deleted': 'User deleted',
    'Deleting...': 'Deleting...',
    'Cancel': 'Cancel',
    'Admin': 'Admin',
    'User': 'User',

    // User Actions
    'Edit user': 'Edit user',
    'You cannot delete your own account': 'You cannot delete your own account',
    'Are you sure you want to delete user {username}? This action cannot be undone.': 'Are you sure you want to delete user {username}? This action cannot be undone.',
    'Update': 'Update',
    'Create': 'Create',

    // User Filters
    'Search users...': 'Search users...',
    'Filter by role': 'Filter by role',
    'Filter by status': 'Filter by status',
    'Start date': 'Start date',
    'End date': 'End date',
  },
}

export async function dynamicActivate(locale: string) {
  try {
    i18n.load(locale, messages[locale as keyof typeof messages])
    i18n.activate(locale)
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error)
  }
} 