import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);

    // Fetch files from the backend
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get("http://localhost:6969/api/files");
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleFileUpload = async (event) => {
        setLoading(true);
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("http://localhost:6969/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("File uploaded successfully!");
            fetchFiles(); // Refresh file list
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file");
        } finally {
            setLoading(false);
        }
    };

    const handleFileDownload = async (fileName) => {
        try {
            const response = await axios.get(
                `http://localhost:6969/api/files/download/${fileName}`,
                { responseType: "blob" }
            );

            // Create a URL for the downloaded file and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();

            // Show download completion popup
            setDownloadComplete(true);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download file");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10 px-5">
            {/* Dropbox Logo */}
            <div className="flex items-center space-x-4 mb-10">
                <h1 className="text-5xl font-extrabold text-[#3a3deb]">Coolbox</h1>
                <img
                    src="/dropbox-logo.svg"
                    alt="Dropbox Logo"
                    className="w-12 h-12"
                />
            </div>

            {/* File Upload Section */}
            <div className="bg-white shadow-xl rounded-lg p-8 mb-10 w-full max-w-lg border-l-4 border-blue-600">
                <div className="flex items-center mb-4">
                    <img
                        src="/upload-logo.svg"
                        alt="Upload"
                        className="w-6 h-6 mr-3"
                    />
                    <h3 className="text-3xl font-semibold text-gray-800">Upload a File</h3>
                </div>
                <div className="flex flex-col items-start">
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="w-full text-sm text-gray-800 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 p-2"
                    />
                    {loading && <p className="text-blue-600 font-semibold mt-4">Uploading...</p>}
                </div>
            </div>

            {/* File List Section */}
            <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg border-l-4 border-green-600">
                <div className="flex items-center mb-4">
                    <img
                        src="/files.svg"
                        alt="File List"
                        className="w-10 h-10 mr-3"
                    />
                    <h3 className="text-3xl font-semibold text-gray-800">Uploaded Files</h3>
                </div>
                {files.length === 0 ? (
                    <p className="text-gray-600 italic">No files uploaded yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {files.map((file, index) => (
                            <li
                                key={index}
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
            </div>

            {/* Download Completion Popup */}
            {downloadComplete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Download Completed
                        </h3>
                        <button
                            onClick={() => setDownloadComplete(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
