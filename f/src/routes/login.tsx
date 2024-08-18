import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {

  const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const schema = joi.object({
        password: joi.string().min(8).messages({'string.min': 'Password must be at least 8 characters long'})
    })

    const mutation = useMutation({
        mutationFn: async (User: { email: string; password: string }) => {
            const response = await axios.post('http://localhost:3000/api/login', User);
            return response.data;
    },
    onSuccess: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/');
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An error occurred';
          alert(errorMessage);
      } else {
          alert('An unexpected error occurred');
      }
  },
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = schema.validate({password});
        if(!error){
            const hashedPassword = cryptoJS.SHA256(password).toString();
            mutation.mutate({ email, password: hashedPassword });
            setEmail('');
            setPassword('');
         }else{
          const errorMessages = error.details.map(detail => detail.message).join('\n');
          alert(errorMessages);
         }}

         return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 rounded-lg">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-300 text-black rounded-md shadow-sm"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        );
      };
      
      export default Login;