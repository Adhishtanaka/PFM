import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const fetchItem = async (type: string, id: string) => {
  const token = localStorage.getItem('accessToken');
  const { data } = await axios.get(`http://localhost:3000/api/${type}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const assignMoney = async ({ type, id, amount }: { type: string; id: string; amount: number }) => {
  const token = localStorage.getItem('accessToken');
  await axios.post('http://localhost:3000/api/assign-money', {
    type,
    id,
    amount,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const AssignMoney: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(0);

  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', type, id],
    queryFn: () => fetchItem(type!, id!),
  });

  const mutation = useMutation({
    mutationFn: assignMoney,
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboard']);
      navigate('/');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading item.</div>;

  const handleAssign = () => {
    if (amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    mutation.mutate({ type: type!, id: id!, amount });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Assign Money to {type?.charAt(0).toUpperCase() + type?.slice(1)}</h1>
      <p className="text-lg mb-2">{item.name}</p>
      <p className="text-lg mb-4">Total Available: ${item.price.toFixed(2)}</p>
      <label htmlFor="amount" className="block mb-2 text-sm font-medium">Amount to Assign:</label>
      <input
        id="amount"
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        className="border border-gray-300 rounded px-3 py-1 mb-4 w-full"
      />
      <button
        onClick={handleAssign}
        className="bg-blue-300 text-black px-4 py-2 rounded"
        disabled={mutation.isLoading}
      >
        Assign Money
      </button>
    </div>
  );
};

export default AssignMoney;
