import React from 'react';

type Item = {
    _id: string;
    name: string;
    price: number;
    amountSaved?: number;
    deadline?: Date;
};

type ListItemProps = {
    item: Item;
    type: 'goal' | 'expense' | 'income';
    onUpdate: (item: Item) => void;
    onDelete: (item: Item, type: 'goal' | 'expense' | 'income') => void;
};

const ListItem: React.FC<ListItemProps> = ({ item, type, onUpdate, onDelete }) => {
    const { name, price, amountSaved, deadline } = item;
    const progress = amountSaved && price ? (amountSaved / price) * 100 : 0;
    const marginTop = type === 'income' ? 'mt-3' : '';

    return (
        <div className="mb-3 p-3 border border-gray-300 rounded-md">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm">
    {type !== 'income' && `Amount: $${price.toFixed(2)} | Assigned Amount: ${(amountSaved || 0).toFixed(2)} | `}
    {type === 'income' && `Amount: $${price.toFixed(2)}`}
    {type === 'goal' && `Deadline: ${deadline ? new Date(deadline).toLocaleDateString() : 'N/A'}`}
</p>

            {type !== 'income' && (
                <div className="mt-2">
                    <div className="relative h-1.5 bg-gray-200 rounded-full">
                        <div
                            className="absolute top-0 left-0 h-1.5 bg-blue-300 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs mt-1 text-right text-gray-600">{Math.round(progress)}%</p>
                </div>
            )}
            <div className={`${marginTop}`}>
                {type !== 'income' && (
                    <button onClick={() => onUpdate(item)} className="bg-blue-300 text-black text-sm px-3 py-1 rounded mr-2">
                        Assign Money
                    </button>
                )}
                <button
                    onClick={() => onDelete(item, type)}
                    className="bg-red-300 text-black text-sm px-3 py-1 rounded"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ListItem;