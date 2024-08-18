import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import joi from 'joi';
import axios from 'axios';
import cryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';


const Register: React.FC = () => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');

  const navigate = useNavigate();
  
  const schema = joi.object({
    password: joi.string().min(8).messages({'string.min': 'Password must be at least 8 characters long'}),
    confirmPassword: joi.any().equal(joi.ref('password')).required().messages({'any.only': 'Passwords do not match'}),
    dateOfBirth: joi.date().max('now').messages({'date.max': 'Date of Birth cannot be in the future'}),
    })

    const mutation = useMutation({
      mutationFn: (newUser: { name: string; email: string; password: string; dateOfBirth: string }) => {
        return axios.post('http://localhost:3000/api/register', newUser);
    }});

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = schema.validate({ password, confirmPassword, dateOfBirth});
    if(!error){
        const hashedPassword = cryptoJS.SHA256(password).toString();
        mutation.mutate({ name, email, password: hashedPassword, dateOfBirth });
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setDateOfBirth('');
        navigate('/login');
    }else{
      const errorMessages = error.details.map(detail => detail.message).join('\n');
      alert(errorMessages);
    }}

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg p-8 rounded-lg">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-300 text-black rounded-md shadow-sm"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Register;