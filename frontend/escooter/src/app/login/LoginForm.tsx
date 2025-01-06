import React, { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Login } from '../api/login/route'; // Importera Login-funktionen

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const success = await Login(password, email); // Använd Login-funktionen
      console.log('Login success:', success);

      if (success) {
        console.log('Login successfuly');
        window.location.href = '/profile';
      } else {
        setErrorMessage('Something went wrong during login.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error('An error occurred:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/karlskrona.png"
            alt="Karlskrona city view"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>
        <div className="relative z-10 flex items-center justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-bold text-center mb-6 text-accent-2">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="loginformemail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control form-control-lg"
                />
                <label className="form-label" htmlFor="loginformemail">
                  Email
                </label>
              </div>

              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="loginformpassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-control form-control-lg"
                />
                <label className="form-label" htmlFor="loginformpassword">
                  Password
                </label>
              </div>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="d-flex justify-content-center mb-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </div>

              <div className="d-flex justify-content-center">
                <a href="/register" className="btn btn-link">
                  Create an account
                </a>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => signIn('github')}
                >
                  Sign in with GitHub
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;