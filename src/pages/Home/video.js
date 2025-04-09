import React, { useState, useEffect } from "react";
import Dialog from "../../component/Dialog";
import toast from "react-hot-toast";
import {ErrorMessage} from "formik";

const VideoUploader = ({
                           defaultVideo,
                           onVideoUpload,
                           defaultSecondaryVideo,
                           onSecondaryVideoUpload,
                           data
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
            setVideoError("Invalid video type. ");

            return;
        }

        const url = URL.createObjectURL(file);
        const video = document.createElement("video");

        video.preload = "metadata";
        video.src = url;

        video.onloadedmetadata = () => {
            const { videoWidth, videoHeight } = video;

            if (videoHeight <= videoWidth) {
                // setVideoError("Only portrait videos are allowed.");
                toast.error("Invalid file type. ");
                URL.revokeObjectURL(url); // clean up
                return;
            }

            setVideoError(""); // clear error
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
                        accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv"] }
                    }
                ],
                multiple: false
            });

            const file = await fileHandle.getFile();
            handleFileUpload(file, type);
        } catch (error) {
            console.log("File selection canceled or not supported", error);
        }
    };

    return (
        <div className="lg:w-1/7 sm:w-1/2 pt-2">
            <div className="flex justify-between items-center gap-4 mt-2">
                <div className={'w-[100%]'}>
                    <div
                        onClick={(e) => handleSelectVideo(e, "recorded")}
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 rounded-lg py-3 w-1/2 text-center cursor-pointer"
                    >
                        {recordedVideo ? "Edit Primary Video" : "Add Primary Video"}
                    </div>
                    <ErrorMessage
                        name={'video'}
                        component="div"
                        className="text-xs text-red-500 ml-1 mt-1"
                    />
                </div>

                {data && !secondaryVideo && (
                    <div
                        onClick={(e) => handleSelectVideo(e, "secondary_video")}
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 rounded-lg py-3 w-1/2 text-center cursor-pointer"
                    >
                        Add Secondary Video
                    </div>
                )}
            </div>

            {/* Instructions Dialog */}
            <Dialog isOpen={showInstruction} onClose={closeInstructionDialog} title="Instructions" hideCloseButton={true}>
                {/* ... (instruction content remains unchanged) ... */}
                <div className="flex justify-end gap-2 mt-4">
                    <button className="bg-primary text-white px-4 py-2 rounded" onClick={proceedWithUpload}>
                        Proceed
                    </button>
                </div>
            </Dialog>

            {/* Primary Video Upload Dialog */}
            <Dialog isOpen={isOpen} onClose={closePrimaryDialog} title="Upload Primary Video">
                <div
                    className="bg-primary px-4 py-2 text-white rounded cursor-pointer text-center"
                    onClick={(e) => handleSelectVideo(e, "recorded")}
                >
                    Select Primary Video
                </div>
                {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}
            </Dialog>

            {/* Secondary Video Upload Dialog */}
            <Dialog isOpen={isSecondaryOpen} onClose={closeSecondaryDialog} title="Upload Secondary Video">
                <div
                    className="bg-primary px-4 py-2 text-white rounded cursor-pointer text-center"
                    onClick={(e) => handleSelectVideo(e, "secondary_video")}
                >
                    Select Secondary Video
                </div>
                {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}
            </Dialog>

            {/* Video Previews */}
            <div className="mt-4 flex gap-4">
                {recordedVideo && (
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold">Primary Video</h3>
                        <video controls src={recordedVideo} className="w-full rounded-md shadow-md" />
                    </div>
                )}
                {secondaryVideo && (
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold">Secondary Video</h3>
                        <video controls src={secondaryVideo} className="w-full rounded-md shadow-md" />
                    </div>
                )}
            </div>
            {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}

        </div>
    );
};

export default VideoUploader;
