import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import '../App.css';
import { toast } from 'react-toastify';




const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.role === 'client') navigate('/my-files');
                else navigate('/admin-dashboard');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error('Invalid email or password', {
                    position: "top-right",
                    autoClose: 5000,
                    closeButton: false,
                });
            } else {
                toast.error('Something went wrong. Please try again later.', {
                    position: "top-center",
                    autoClose: 3000,
                    closeButton: false,
                });
            }
        }
    };


    return (
        <div className="login-container">
            <h1>Login</h1>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;
