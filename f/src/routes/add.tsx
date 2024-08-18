import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const AddItem: React.FC = () => {
    const navigate = useNavigate();
    const { type } = useParams<{ type: string }>();

    const initialState = {
        name: '',
        price: 0,
        frequency: type || '',
        deadline: '',
    };

    const [formData, setFormData] = useState(initialState);


    const mutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('accessToken');
            const url = `http://localhost:3000/api/add-${type}`;
            return axios.post(url, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            navigate('/');
        },
        onError: (error) => {
            console.error("Failed to add item", error);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
    <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Add {type?.charAt(0).toUpperCase() + type?.slice(1)}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            {type === 'expense' && (
                <>
                    

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Frequency</label>
                        <select
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="one-time">One-time</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </>
            )}

            {type === 'income' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Frequency</label>
                    <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Select Frequency</option>
                        <option value="one-time">One-time</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            )}

            {type === 'goal' && (
                <>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </>
            )}

            <button
                type="submit"
                className="w-full bg-blue-300 text-black font-semibold py-2 px-4 rounded-md"
                disabled={mutation.isLoading}
            >
               Add
            </button>
        </form>
    </div>
);
}
export default AddItem