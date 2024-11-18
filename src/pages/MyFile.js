import FileUpload from '../components/FileTable';
import FileTable from '../components/FileTable';
import { useEffect, useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyFiles = ({ isAdmin = false }) => {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const fetchFiles = async () => {
        try {
            const response = await axios.get('/client/files', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setFiles(response.data);
        }
        catch {
            toast.error('Something went wrong. Please try again later.', {
                position: "top-center",
                autoClose: 3000,
                closeButton: false,
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        toast.success('You have been logged out.', {
            position: "top-right",
            autoClose: 3000,
            closeButton: false,
        });
        navigate('/login'); // Redirect to login page
    };

    useEffect(() => {
        fetchFiles();
    }, [isAdmin]);
    return (
        <div className='dashboard-container'>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
            <h1>My Files</h1>
            <div className="file-upload-container">
                <FileUpload fetchFiles={fetchFiles} />
            </div>
            <div className="file-table-container">
                <FileTable files={files} />
            </div>
        </div>)

};

export default MyFiles;
