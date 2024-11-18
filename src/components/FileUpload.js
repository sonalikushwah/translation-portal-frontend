import { useState } from 'react';
import axios from '../services/api';
import styles from './FileUpload.module.css';
import { toast } from 'react-toastify';

const FileUpload = ({ fetchFiles }) => {
    const [file, setFile] = useState(null);
    const [fromLanguage, setFromLanguage] = useState('');
    const [toLanguage, setToLanguage] = useState('');
    const [tat, setTat] = useState('');

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fromLanguage', fromLanguage);
        formData.append('toLanguage', toLanguage);
        formData.append('tat', tat);

        try {
            await axios.post('/client/upload', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            toast.success('File uploaded successfully', {
                position: "top-right",
                autoClose: 5000,
                closeButton: false,
            });

            setFile(null);
            document.getElementById('fileInput').value = '';
            setFromLanguage('');
            setToLanguage('');
            setTat('');

            fetchFiles(); // Refresh file list
        } catch (error) {
            toast.error('Error uploading file', {
                position: "top-right",
                autoClose: 5000,
                closeButton: false,
            });
        }
    };
    const isFormValid = file && fromLanguage && toLanguage && tat;

    return (
        <div className={styles.container}>
            <input
                id="fileInput"
                type="file"
                className={styles.input}
                onChange={(e) => setFile(e.target.files[0])}
            />
            <input
                type="text"
                placeholder="From Language"
                className={styles.input}
                value={fromLanguage}
                onChange={(e) => setFromLanguage(e.target.value)}
            />
            <input
                type="text"
                placeholder="To Language"
                className={styles.input}
                value={toLanguage}
                onChange={(e) => setToLanguage(e.target.value)}
            />
            <input
                type="text"
                placeholder="TAT"
                className={styles.input}
                value={tat}
                onChange={(e) => setTat(e.target.value)}
            />
            <button className={isFormValid ? styles.button : styles.buttonD} onClick={handleUpload} disabled={!isFormValid}>
                Upload
            </button>
        </div>
    );
};

export default FileUpload;
