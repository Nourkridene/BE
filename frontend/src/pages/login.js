import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);  // Mode connexion ou inscription
  const [username, setUsername] = useState('');  // Nom d'utilisateur (inscription)
  const [email, setEmail] = useState('');        // Email (connexion et inscription)
  const [password, setPassword] = useState('');  // Mot de passe
  const [error, setError] = useState('');        // Message d'erreur
  const [successMessage, setSuccessMessage] = useState(''); // Message de succès après inscription
  const router = useRouter();

  // Fonction pour gérer la connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      router.push('/');  // Redirige vers la page d'accueil après connexion
    } catch (error) {
      setError('Identifiants incorrects.');
    }
  };

  // Fonction pour gérer l'inscription
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/register', {
        username,
        email,
        password,
      });
      
      // Vérifier la réponse du serveur
      console.log(response.data);

      // Si l'inscription est réussie
      setUsername('');
      setEmail('');
      setPassword('');
      setIsLogin(true);  // Basculer en mode connexion

      // Afficher un message de succès après inscription
      setSuccessMessage('Félicitations ! Votre compte a été créé avec succès.');
    } catch (error) {
      // Afficher une erreur détaillée
      console.error('Erreur lors de l\'inscription:', error);
      if (error.response) {
        setError(error.response.data.message || 'Erreur inconnue lors de l\'inscription.');
      } else {
        setError('Erreur inconnue. Veuillez réessayer.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">
        {isLogin ? 'Se connecter' : 'S\'inscrire'}
      </h1>

      {/* Message de succès après inscription */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      {/* Message d'erreur */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Formulaire de Connexion */}
      {isLogin ? (
        <form
          key="login-form"
          onSubmit={handleLoginSubmit}
          className="max-w-md mx-auto"
        >
          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off" // Désactiver l'auto-complétion
              required
            />
          </div>
          <div className="mb-4">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off" // Désactiver l'auto-complétion
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Se connecter
          </button>
        </form>
      ) : (
        /* Formulaire d'Inscription */
        <form
          key="signup-form"
          onSubmit={handleSignupSubmit}
          className="max-w-md mx-auto"
        >
          <div className="mb-4">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-4">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              autoComplete="off"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            S'inscrire
          </button>
        </form>
      )}

      {/* Bascule entre Connexion et Inscription */}
      <div className="mt-4 text-center">
        {isLogin ? (
          <p>
            Vous n'avez pas de compte ?{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsLogin(false)}
            >
              S'inscrire
            </span>
          </p>
        ) : (
          <p>
            Vous avez déjà un compte ?{' '}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsLogin(true)}
            >
              Se connecter
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
