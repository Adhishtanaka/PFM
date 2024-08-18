import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';

const isTokenValid = async (): Promise<boolean> => {
    try {
        const response = await axios.get('http://localhost:3000/api/validate-token', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
    const location = useLocation();
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            const valid = await isTokenValid();
            setIsValid(valid);
        };
        checkToken();
    }, []);

    if (isValid === null) {
        return <div>Loading...</div>;
    }

    return isValid ? element : <Navigate to="/login" state={{ from: location }} />;
};

export default ProtectedRoute;