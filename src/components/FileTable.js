import styles from './FileTable.module.css';
import axios from '../services/api';
import { toast } from 'react-toastify';

const FileTable = ({ files, isAdmin = false }) => {
    const downloadTranslatedFile = async (fileId) => {
        try {
            const response = await axios.get(`/admin/download-translated-file/${fileId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });

            console.log('response', response)

            const disposition = response.headers['content-disposition'];
            let fileName = 'downloaded-file.jpg'; // Fallback name

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

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>Serial No.</th>
                    <th>From Language</th>
                    <th>To Language</th>
                    <th>TAT</th>
                    <th>Status</th>
                    <th>Translated File</th>
                </tr>
            </thead>
            <tbody>
                {files.map((file, index) => (
                    <tr key={file._id}>
                        <td>{index + 1}</td>
                        <td>{file.fromLanguage}</td>
                        <td>{file.toLanguage}</td>
                        <td>{file.tat}</td>
                        <td>{file.status}</td>
                        <td>
                            {file?.translatedFile ? <button className={styles.button} onClick={() => downloadTranslatedFile(file._id)}>Download</button> : 'Not ready'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default FileTable;
