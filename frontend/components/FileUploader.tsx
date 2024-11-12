import React, { useState } from "react";
import axios from "axios";

interface FileUploaderProps {
    refreshFileList: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ refreshFileList }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

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
            setUploadComplete(true);
            refreshFileList();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-xl rounded-lg p-8 mb-10 w-full max-w-lg border-l-4 border-blue-600">
            <div className="flex items-center mb-4">
                <img src="/upload-logo.svg" alt="Upload" className="w-6 h-6 mr-3" />
                <h3 className="text-3xl font-semibold text-gray-800">Upload a File</h3>
            </div>
            <input
                type="file"
                onChange={handleFileUpload}
                className="w-full text-sm text-gray-800 border border-gray-400 rounded-lg cursor-pointer bg-gray-50 p-2"
            />
            {loading && <p className="text-blue-600 font-semibold mt-4">Uploading...</p>}

            {/* Upload Completion Popup */}
            {uploadComplete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 shadow-xl w-1/2 max-w-xl text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            File Uploaded Successfully!
                        </h3>
                        <button
                            onClick={() => setUploadComplete(false)}
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

export default FileUploader;
