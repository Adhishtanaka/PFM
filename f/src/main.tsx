import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './index.css'
import Login from './routes/login.tsx'
import Register from './routes/register.tsx'
import Dashboard from './routes/dashboard.tsx'
import Error from './routes/error.tsx';
import ProtectedRoute from './routes/protected_route.tsx';
import AddItem from './routes/add.tsx';
import AssignMoney from './routes/assign.tsx';

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: (<ProtectedRoute element={<Dashboard />} />)
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/Register",
    element: <Register/>,
  },
  {
    path: "/add/:type",
    element: (
      <ProtectedRoute element={<AddItem />} />
    ),
  },
  {
    path: "/assign/:type/:id",
    element: <ProtectedRoute element={<AssignMoney />}/>
  },
  {
    path: "*",
    element: <Error/>
  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
