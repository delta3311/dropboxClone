import React, { useState } from "react";
import axios from "axios";

interface File {
    id: number;
    name: string;
    type: string;
    size: number;
    uploadTime: string;
}

interface FileListProps {
    files: File[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
    const [downloadComplete, setDownloadComplete] = useState<boolean>(false);

    const handleFileDownload = async (fileName: string) => {
        try {
            const response = await axios.get(
                `http://localhost:6969/api/files/download/${fileName}`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            setDownloadComplete(true);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download file");
        }
    };

    return (
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg border-l-4 border-green-600">
            <div className="flex items-center mb-4">
                <img src="/files.svg" alt="File List" className="w-10 h-10 mr-3" />
                <h3 className="text-3xl font-semibold text-gray-800">Uploaded Files</h3>
            </div>
            {files.length === 0 ? (
                <p className="text-gray-600 italic">No files uploaded yet.</p>
            ) : (
                <ul className="space-y-3">
                    {files.map((file) => (
                        <li
                            key={file.id}
                            className="flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-md transition-all"
                        >
                            <span className="text-lg text-gray-800 font-medium">{file.name}</span>
                            <button
                                onClick={() => handleFileDownload(file.name)}
                                className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-lg"
                            >
                                Download
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {downloadComplete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-10 shadow-xl w-3/4 max-w-xl text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Download Completed!
                        </h3>
                        <button
                            onClick={() => setDownloadComplete(false)}
                            className="bg-blue-600 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-700 transition shadow-lg"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileList;
