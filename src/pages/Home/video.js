import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Dialog from "../../component/Dialog";
import toast from "react-hot-toast";
import { ErrorMessage } from "formik";

const VideoUploader = ({
                           defaultVideo,
                           onVideoUpload,
                           defaultSecondaryVideo,
                           onSecondaryVideoUpload,
                           data,
                       }) => {
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [secondaryVideo, setSecondaryVideo] = useState(null);
    const [videoError, setVideoError] = useState("");

    const [showInstruction, setShowInstruction] = useState(false);
    const [instructionType, setInstructionType] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);

    useEffect(() => {
        if (defaultVideo) setRecordedVideo(defaultVideo);
    }, [defaultVideo]);

    useEffect(() => {
        if (defaultSecondaryVideo) setSecondaryVideo(defaultSecondaryVideo);
    }, [defaultSecondaryVideo]);

    const closeInstructionDialog = () => setShowInstruction(false);

    const proceedWithUpload = () => {
        setShowInstruction(false);
        instructionType === "primary" ? setIsOpen(true) : setIsSecondaryOpen(true);
    };

    const openInstructionDialog = (type) => {
        setInstructionType(type);
        proceedWithUpload();
    };

    const closePrimaryDialog = () => setIsOpen(false);
    const closeSecondaryDialog = () => setIsSecondaryOpen(false);

    const handleFileUpload = (file, type) => {
        const validTypes = ["video/mp4", "video/avi", "video/mov", "video/webm"];

        if (!validTypes.includes(file.type)) {
            setVideoError("Invalid video type.");
            return;
        }

        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = url;

        video.onloadedmetadata = () => {
            const { videoWidth, videoHeight } = video;

            if (videoHeight <= videoWidth) {
                toast.error("Invalid file type.");
                URL.revokeObjectURL(url);
                return;
            }

            setVideoError("");
            if (type === "recorded") {
                setRecordedVideo(url);
                onVideoUpload(file);
            } else {
                setSecondaryVideo(url);
                onSecondaryVideoUpload(file);
            }

            closePrimaryDialog();
            closeSecondaryDialog();
        };
    };

    const handleSelectVideo = async (e, type) => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "Videos",
                        accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv"] },
                    },
                ],
                multiple: false,
            });

            const file = await fileHandle.getFile();
            handleFileUpload(file, type);
        } catch (error) {
            console.log("File selection canceled or not supported", error);
        }
    };

    const renderVideoBlock = (videoSrc, type) => (
        <div className="relative w-full">
            {/* Icon button in top-right */}
            {(!videoSrc || type !== "secondary_video") && (
                <div
                    onClick={(e) => handleSelectVideo(e, type)}
                    className="absolute top-2 right-2 w-10 h-10 bg-white border border-black rounded-full flex items-center justify-center cursor-pointer transition-all z-10"
                    title={videoSrc ? "Edit Video" : "Add Video"}
                >
                    <Icon icon={videoSrc ? "mdi:pencil" : "mdi:plus"} className="text-xl"/>
                </div>
            )}

            {videoSrc ? (
                <video controls src={videoSrc} className="w-full rounded-md shadow-md"/>
            ) : (
                <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                    No {type === "recorded" ? "Primary" : "Secondary"} Video
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full pt-2">
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Primary Video */}
                <div className="flex flex-col items-center">
                    {renderVideoBlock(recordedVideo, "recorded")}
                    <ErrorMessage
                        name="video"
                        component="div"
                        className="text-xs text-red-500 ml-1 mt-1"
                    />
                </div>

                {/* Secondary Video */}
                {data && (
                    <div className="flex flex-col items-center">
                        {renderVideoBlock(secondaryVideo, "secondary_video")}
                    </div>
                )}
            </div>

            {videoError && <div className="text-xs text-red-500 mt-2">{videoError}</div>}

            {/* Dialogs */}
            <Dialog isOpen={showInstruction} onClose={closeInstructionDialog} title="Instructions" hideCloseButton={true}>
                <div className="flex justify-end gap-2 mt-4">
                    <button className="bg-primary text-white px-4 py-2 rounded" onClick={proceedWithUpload}>
                        Proceed
                    </button>
                </div>
            </Dialog>

            <Dialog isOpen={isOpen} onClose={closePrimaryDialog} title="Upload Primary Video">
                <div
                    className="bg-primary px-4 py-2 text-white rounded cursor-pointer text-center"
                    onClick={(e) => handleSelectVideo(e, "recorded")}
                >
                    Select Primary Video
                </div>
                {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}
            </Dialog>

            <Dialog isOpen={isSecondaryOpen} onClose={closeSecondaryDialog} title="Upload Secondary Video">
                <div
                    className="bg-primary px-4 py-2 text-white rounded cursor-pointer text-center"
                    onClick={(e) => handleSelectVideo(e, "secondary_video")}
                >
                    Select Secondary Video
                </div>
                {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}
            </Dialog>
        </div>
    );
};

export default VideoUploader;
