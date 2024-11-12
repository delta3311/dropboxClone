import React, { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
import FileList from "../components/FileList";
import axios from "axios";

interface File {
    id: number;
    name: string;
    type: string;
    size: number;
    uploadTime: string;
}

const Home = () => {
    const [files, setFiles] = useState < File[] > ([]);

    const fetchFiles = async () => {
        try {
            const response = await axios.get("http://localhost:6969/api/files");
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center py-10 px-5">
            <div className="flex items-center space-x-4 mb-10">
                <h1 className="text-5xl font-extrabold text-[#3a3deb]">Coolbox</h1>
                <img src="/dropbox-logo.svg" alt="Dropbox Logo" className="w-12 h-12" />
            </div>
            <FileUploader refreshFileList={fetchFiles} />
            <FileList files={files} />
        </div>
    );
};

export default Home;
