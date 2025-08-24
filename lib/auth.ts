import axios from "axios";
import Cookies from "js-cookie";

// Configuration d'axios avec l'URL de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.baseURL = API_BASE_URL;

// Types pour la réponse de l'API
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Configuration des cookies
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
};

// Configuration des cookies pour les données utilisateur
const USER_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
};

// Fonction de connexion
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post("/auth/login", {
      email: email,
      password: password,
    });

    const { access_token, refresh_token, user } = response.data;

    // Stocker les tokens dans les cookies
    Cookies.set("access_token", access_token, COOKIE_OPTIONS);
    Cookies.set("refresh_token", refresh_token, COOKIE_OPTIONS);

    // Stocker les informations utilisateur dans les cookies aussi
    Cookies.set("user", JSON.stringify(user), USER_COOKIE_OPTIONS);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction de déconnexion
export const logout = () => {
  // Supprimer tous les cookies
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("user");

  // Rediriger vers la page de connexion
  window.location.href = "/auth";
};

// Fonction pour obtenir le token d'accès
export const getAccessToken = (): string | undefined => {
  return Cookies.get("access_token");
};

// Fonction pour obtenir le token de rafraîchissement
export const getRefreshToken = (): string | undefined => {
  return Cookies.get("refresh_token");
};

// Fonction pour obtenir les informations utilisateur
export const getUser = (): User | null => {
  const userStr = Cookies.get("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return !!getAccessToken() && !!getRefreshToken();
};

// Configuration d'axios pour inclure automatiquement le token d'accès
export const setupAxiosInterceptors = () => {
  // Intercepteur pour ajouter le token d'accès aux requêtes
  axios.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur pour gérer les erreurs 401 et renouveler le token
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            const response = await axios.post("/auth/refresh", {
              refresh_token: refreshToken,
            });

            const { access_token, refresh_token } = response.data;
            Cookies.set("access_token", access_token, COOKIE_OPTIONS);
            Cookies.set("refresh_token", refresh_token, COOKIE_OPTIONS);

            // Retenter la requête originale avec le nouveau token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          // Si le refresh échoue, déconnecter l'utilisateur
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
