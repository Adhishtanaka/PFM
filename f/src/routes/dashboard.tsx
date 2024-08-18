import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ListItem from '../components/List';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            const { data } = await axios.get('http://localhost:3000/api/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const { user, total } = data;

    const handleUpdate = (item: any, type: string) => {
        navigate(`/assign/${type}/${item._id}`);
    };

    const handleDelete = async (item: any, type: string) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete ${item.name}?`);
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/api/delete-${type}/${item._id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                });
                queryClient.invalidateQueries(['dashboard']);
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item. Please try again.');
            }
        }
    };

    const handleAdd = (type: string) => {
        navigate(`/add/${type}`);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                <p className="text-lg">Total Saving: ${total}</p>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Expenses</h2>
                    <button
                        onClick={() => handleAdd('expense')}
                        className="bg-gray-200 text-black px-4 py-1 rounded"
                    >
                        +
                    </button>
                </div>
                {user.expenses.length > 0 ? (
                    user.expenses.map((expense) => (
                        <ListItem
                            key={expense._id}
                            item={expense}
                            type="expense"
                            onUpdate={() => handleUpdate(expense, 'expense')}
                            onDelete={() => handleDelete(expense, 'expense')}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">Nothing added yet</p>
                )}
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Incomes</h2>
                    <button
                        onClick={() => handleAdd('income')}
                        className="bg-gray-200 text-black px-4 py-1 rounded"
                    >
                        +
                    </button>
                </div>
                {user.incomes.length > 0 ? (
                    user.incomes.map((income) => (
                        <ListItem
                            key={income._id}
                            item={income}
                            type="income"
                            onUpdate={() => handleUpdate(income, 'income')}
                            onDelete={() => handleDelete(income, 'income')}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">Nothing added yet</p>
                )}
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Goals</h2>
                    <button
                        onClick={() => handleAdd('goal')}
                        className="bg-gray-200 text-black px-4 py-1 rounded"
                    >
                        +
                    </button>
                </div>
                {user.goals.length > 0 ? (
                    user.goals.map((goal) => (
                        <ListItem
                            key={goal._id}
                            item={goal}
                            type="goal"
                            onUpdate={() => handleUpdate(goal, 'goal')}
                            onDelete={() => handleDelete(goal, 'goal')}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">Nothing added yet</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
