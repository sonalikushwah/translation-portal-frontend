import React, { useState, useEffect } from 'react';
import '../App.css';
import { toast } from 'react-toastify';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileId, setSelectedFileId] = useState(null);
    const [loadingFileId, setLoadingFileId] = useState(null);
    const navigate = useNavigate();
    const fetchFiles = async () => {
        try {
            const response = await axios.get('/admin/files', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await response?.data || [];
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Error fetching files', {
                position: "top-right",
                autoClose: 5000,
                closeButton: false,
            });
        }
    };
    useEffect(() => {

        fetchFiles();
    }, []);

    const downloadFile = async (fileId) => {
        try {
            const response = await axios.get(`/admin/download/${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });

            console.log('response', response)

            const disposition = response.headers['content-disposition'];
            let fileName = 'downloaded-file.jpg';

            // Extract file name from 'Content-Disposition' header if present
            if (disposition && disposition.includes('filename')) {
                const matches = disposition.match(/filename="(.+)"/);
                if (matches && matches[1]) fileName = matches[1];
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Use dynamic name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Something went wrong. Please try again later.', {
                position: "top-center",
                autoClose: 3000,
                closeButton: false,
            });
        }
    };

    const downloadTranslatedFile = async (fileId) => {
        try {
            const response = await axios.get(`/admin/download-translated-file/${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });

            console.log('response', response)

            const disposition = response.headers['content-disposition'];
            let fileName = 'downloaded-file.jpg';

            if (disposition && disposition.includes('filename')) {
                const matches = disposition.match(/filename="(.+)"/);
                if (matches && matches[1]) fileName = matches[1];
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Something went wrong. Please try again later.', {
                position: "top-center",
                autoClose: 3000,
                closeButton: false,
            });
        }
    };

    const handleFileChange = (fileId, event) => {
        setSelectedFile(event.target.files[0]);
        setSelectedFileId(fileId);
    };

    const uploadFile = async () => {
        if (!selectedFile || !selectedFileId) {
            toast.error('Please select a file to upload.', {
                position: "top-right",
                autoClose: 5000,
                closeButton: false,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await axios.post(`/admin/upload-translated-file/${selectedFileId}`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            toast.success('Translated file uploaded successfully', {
                position: "top-right",
                autoClose: 5000,
                closeButton: false,
            });
            fetchFiles(); // Refresh file list
        } catch (error) {
            toast.error('Something went wrong. Please try again later.', {
                position: "top-center",
                autoClose: 3000,
                closeButton: false,
            });
        }
    };

    const sendEmail = async (fileId) => {
        setLoadingFileId(fileId);
        try {
            await axios.post(`/admin/send-email/${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            toast.success('Email sent successfully!', {
                position: "top-right",
                autoClose: 5000,
                closeButton: false,
            });
        }
        catch {
            toast.error('Something went wrong. Please try again later.', {
                position: "top-center",
                autoClose: 3000,
                closeButton: false,
            });
        } finally {
            setLoadingFileId(null); // Stop loading
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


    return (
        <div className='dashboard-container'>
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Serial No.</th>
                        <th>Client Email</th>
                        <th>Download File</th>
                        <th>Upload Translate </th>
                        <th>Send Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr key={file._id}>
                            <td>{index + 1}</td>
                            <td>{file.uploadedBy?.email}</td>
                            <td>
                                <button onClick={() => downloadFile(file._id)}>Download</button>
                            </td>
                            <td>
                                {file.translatedFile ? (
                                    <>
                                        <span>File Uploaded</span> &nbsp;
                                        <button onClick={() => downloadTranslatedFile(file._id)}>Download</button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(file._id, e)}
                                        /> &nbsp;
                                        <button onClick={uploadFile}>Upload</button>
                                    </>
                                )}
                            </td>
                            <td>
                                {loadingFileId === file._id ? (
                                    <span>Sending...</span>
                                ) : (
                                    <button onClick={() => sendEmail(file._id)}>Send Email</button>
                                )}
                            </td>
                            <td>{file.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >

    );
};

export default AdminDashboard;
