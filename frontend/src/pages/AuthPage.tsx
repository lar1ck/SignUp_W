import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border shadow rounded-lg">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${isLoginMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsLoginMode(true)}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded ${!isLoginMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsLoginMode(false)}
        >
          Signup
        </button>
      </div>

      {isLoginMode ? <LoginForm /> : <SignupForm />}
    </div>
  );
};

export default AuthPage;
