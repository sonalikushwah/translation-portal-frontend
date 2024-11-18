import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import '../App.css';
import { toast } from 'react-toastify';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false); // To toggle view
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            toast.error('Passwords do not match', {
                position: 'top-right',
                autoClose: 5000,
                closeButton: false,
            });
            return;
        }

        try {
            const response = await axios.post('/api/signup', { email, password });
            if (response.status === 201) {
                setSignupSuccess(true); // Show success message
                toast.success('Signup successful!', {
                    position: 'top-right',
                    autoClose: 5000,
                    closeButton: false,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Signup failed. Please try again.', {
                position: 'top-right',
                autoClose: 5000,
                closeButton: false,
            });
        }
    };

    if (signupSuccess) {
        return (
            <div className="signup-container">
                <h1>Signup Successful</h1>
                <p>You can now log in to your account.</p>
                <button
                    style={{
                        marginTop: '10px',
                        backgroundColor: '#6200ea',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/login')}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="signup-container">
            <h1>Signup</h1>
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default Signup;
