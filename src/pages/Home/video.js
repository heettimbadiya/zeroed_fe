import React, {useState, useRef, useEffect} from "react";
import {useDropzone} from "react-dropzone";
import Dialog from "../../component/Dialog";

const VideoUploader = ({defaultVideo, onVideoUpload, defaultSecondaryVideo, onSecondaryVideoUpload, data}) => {
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [secondaryVideo, setSecondaryVideo] = useState(null);
    const [videoError, setVideoError] = useState("");

    const [showInstruction, setShowInstruction] = useState(false);
    const [instructionType, setInstructionType] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);


    useEffect(() => {
        if (defaultVideo) {
            setRecordedVideo(process.env.REACT_APP_FILE_URL + "/" + defaultVideo);
        }
    }, [defaultVideo]);

    useEffect(() => {
        if (defaultSecondaryVideo) {
            setSecondaryVideo(process.env.REACT_APP_FILE_URL + "/" + defaultSecondaryVideo);
        }
    }, [defaultSecondaryVideo]);

    const openInstructionDialog = (type) => {
        setInstructionType(type);
        setShowInstruction(true);
    };

    const closeInstructionDialog = () => setShowInstruction(false);

    const proceedWithUpload = () => {
        setShowInstruction(false);
        if (instructionType === "primary") {
            setIsOpen(true);
        } else {
            setIsSecondaryOpen(true);
        }
    };

    const closePrimaryDialog = () => setIsOpen(false);
    const closeSecondaryDialog = () => setIsSecondaryOpen(false);

    const handleFileUpload = (file, type) => {
        const validTypes = ["video/mp4", "video/avi", "video/mov", "video/webm"];

        if (!validTypes.includes(file.type)) {
            setVideoError("Invalid video type. Please upload MP4, AVI, MOV, or WEBM.");
            return;
        }

        const url = URL.createObjectURL(file);
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

    const handleSelectVideo = async (e,type) => {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "Videos",
                        accept: {
                            "video/*": [".mp4", ".mov", ".avi", ".mkv"]
                        }
                    }
                ],
                multiple: false
            });

            const file = await fileHandle.getFile();
            handleFileUpload(file,type);
        } catch (error) {
            console.log("File selection canceled or not supported", error);
        }
    };
    return (
        <div className="w-full">
            <div className="flex justify-between items-center gap-4 mt-2">
                <div
                    onClick={() => openInstructionDialog("primary")}
                    className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg px-4 py-3 w-1/2 text-center cursor-pointer"
                >
                    Primary Video
                </div>
                {data && (
                    <div
                        onClick={() => openInstructionDialog("secondary")}
                        className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg px-4 py-3 w-1/2 text-center cursor-pointer"
                    >
                        Secondary Video
                    </div>
                )}
            </div>

            <Dialog isOpen={showInstruction} onClose={closeInstructionDialog} title="Instructions" hideCloseButton={true}>
                <p className="text-sm">
                    <strong>Hi, here are a few things to keep in mind while recording your video:</strong>
                </p>
                <ul className="text-sm space-y-2">
                    <li>📷 <strong>Use a good quality camera:</strong> A smartphone or webcam with at least HD (720p)
                        resolution ensures sharp, professional-looking video.
                    </li>
                    <li>💡 <strong>Lighting is key:</strong> Natural light is great, but soft artificial lighting works
                        too. Avoid backlighting to prevent shadows.
                    </li>
                    <li>🖼️ <strong>Keep your background clean:</strong> A neutral or professional setup looks best.
                        Avoid clutter and distractions.
                    </li>
                    <li>📹 <strong>Use a stable setup:</strong> Place your camera on a steady surface or tripod for
                        smooth, professional framing.
                    </li>
                    <li>👔 <strong>Dress appropriately:</strong> Wear attire that aligns with your industry, whether
                        business casual or formal.
                    </li>
                    <li>🎯 <strong>Position yourself properly:</strong> Keep the camera at eye level, maintain good
                        posture, and make direct eye contact.
                    </li>
                    <li>🎙️ <strong>Ensure clear audio:</strong> Record in a quiet space and use an external microphone
                        if available to minimize background noise.
                    </li>
                    <li>📜 <strong>Practice makes perfect:</strong>
                        <ul className="list-disc pl-5">
                            <li>Rehearse a few times before recording to feel comfortable.</li>
                            <li>Use notes instead of a full script to sound natural.</li>
                            <li>Record a test clip and adjust lighting, audio, and positioning as needed.</li>
                        </ul>
                    </li>
                    <li>😊 <strong>Show confidence:</strong> Smile, maintain positive body language, and be engaging.
                    </li>
                    <li>⏳ <strong>Keep it concise:</strong> Aim for 1-2 minutes to deliver a strong, impactful message.
                    </li>
                </ul>

                <p className="mt-4 text-sm"><strong>Let’s structure your video for a great first impression:</strong>
                </p>

                <div className="mt-2 space-y-4">
                    <div>
                        <h3 className="font-semibold">👋 Introduction (10-15 seconds)</h3>
                        <p>🗣️ Start with a warm introduction and introduce yourself confidently.</p>
                        <p><strong>Example:</strong> "Hi, my name is [Your Name], and I’m a [Your Profession/Industry]."
                        </p>
                        <p>🗣️ Mention key experience or education to highlight your relevance.</p>
                        <p><strong>Example:</strong> "I have [X years] of experience in [Industry/Field]."</p>
                        <p>"I recently graduated with a [Degree] from [University]."</p>
                    </div>

                    <div>
                        <h3 className="font-semibold">🚀 Key Highlights (30-45 seconds)</h3>
                        <p>🗣️ Showcase key skills and accomplishments that make you stand out.</p>
                        <p><strong>Example:</strong></p>
                        <ul className="list-disc pl-5">
                            <li>"I specialize in [Skill 1, Skill 2, Skill 3]."</li>
                            <li>"At [Company], I successfully [Achievement]."</li>
                            <li>"I recently completed [Course/Certification] and worked on [Project]."</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold">🎯 Closing & Call to Action (15-20 seconds)</h3>
                        <p>🗣️ Wrap up with enthusiasm and invite engagement.</p>
                        <p><strong>Example:</strong></p>
                        <ul className="list-disc pl-5">
                            <li>"I’m excited about roles in [Industry/Field] and eager to contribute my skills."</li>
                            <li>"I’d love to connect and discuss how I can add value to your team."</li>
                            <li>"Thank you for your time, and I look forward to connecting!"</li>
                        </ul>
                    </div>
                </div>

                <p className="mt-4 text-sm"><strong>🎬 Final Tips:</strong></p>
                <ul className="text-sm list-disc pl-5 space-y-2">
                    <li>✔️ Practice a few times before recording to build confidence.</li>
                    <li>✔️ Keep your tone friendly, professional, and engaging.</li>
                    <li>✔️ Most importantly, be yourself! Authenticity helps you stand out.</li>
                </ul>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="bg-primary text-white px-4 py-2 rounded" onClick={proceedWithUpload}>
                        Proceed
                    </button>
                </div>
            </Dialog>

            <Dialog isOpen={isOpen} onClose={closePrimaryDialog} title="Upload Primary Video">
                <div className="flex gap-x-2 justify-between items-center">
                    <div className="bg-primary px-4 py-2 text-white rounded cursor-pointer">
                        <div
                            className="bg-primary px-4 py-2 text-white rounded cursor-pointer"
                            onClick={(e) => handleSelectVideo(e,'recorded')}
                        >
                            Select Primary Video
                        </div>
                    </div>
                </div>
                {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}
            </Dialog>

            {/* Secondary Video Dialog */}
            <Dialog isOpen={isSecondaryOpen} onClose={closeSecondaryDialog} title="Upload Secondary Video">
                <div className="bg-primary px-4 py-2 text-white rounded cursor-pointer" onClick={(e) => handleSelectVideo(e,'secondary_video')}>
                    Select Secondary Video
                </div>
            </Dialog>

            {/* Video Previews */}
            <div className="mt-4 flex gap-4">
                {recordedVideo && (
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold">Recorded Video</h3>
                        <video controls src={recordedVideo} className="w-full rounded-md shadow-md"/>
                    </div>
                )}
                {secondaryVideo && (
                    <div className="w-1/2">
                        <h3 className="text-lg font-semibold">Secondary Video</h3>
                        <video controls src={secondaryVideo} className="w-full rounded-md shadow-md"/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUploader;
