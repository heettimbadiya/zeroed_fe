import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Dialog from "../../component/Dialog";

const VideoUploader = ({ defaultVideo, onVideoUpload, defaultSecondaryVideo, onSecondaryVideoUpload,data }) => {
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [secondaryVideo, setSecondaryVideo] = useState(null);
  const [videoError, setVideoError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

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

  const openPrimaryDialog = () => setIsOpen(true);
  const openSecondaryDialog = () => setIsSecondaryOpen(true);

  const closePrimaryDialog = () => setIsOpen(false);
  const closeSecondaryDialog = () => setIsSecondaryOpen(false);

  const onDrop = (acceptedFiles, type) => {
    const file = acceptedFiles[0];
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

  const { getRootProps: getPrimaryProps, getInputProps: getPrimaryInput } = useDropzone({
    accept: "video/*",
    onDrop: (files) => onDrop(files, "recorded"),
  });

  const { getRootProps: getSecondaryProps, getInputProps: getSecondaryInput } = useDropzone({
    accept: "video/*",
    onDrop: (files) => onDrop(files, "secondary"),
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => chunks.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const file = new File([blob], "recorded-video.webm", { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        onVideoUpload(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsOpen(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing media devices.", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    }
  };

  return (
      <div className="w-full">
        {/* Video Upload & Recording Buttons */}
        <div className="flex justify-between items-center gap-4 mt-2">
          <div
              onClick={openPrimaryDialog}
              className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg px-4 py-3 w-1/2 text-center cursor-pointer"
          >
            Record Video
          </div>
          {data && <div
              onClick={openSecondaryDialog}
              className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg px-4 py-3 w-1/2 text-center cursor-pointer"
          >
            Secondary Video
          </div>}
        </div>

        {/* Primary Video Dialog */}
        <Dialog isOpen={isOpen} onClose={closePrimaryDialog} title="Upload or Record Primary Video">
          <div className="flex gap-x-2 justify-between items-center">
            <div {...getPrimaryProps()} className="bg-primary px-4 py-2 text-white rounded cursor-pointer">
              <input {...getPrimaryInput()} name="primary-video" />
              <div>Select Primary Video</div>
            </div>
            <div onClick={startRecording} disabled={isRecording} className="bg-primary px-4 py-2 text-white rounded cursor-pointer">
              Start Recording
            </div>
          </div>
          {videoError && <div className="text-xs text-red-500 mt-1">{videoError}</div>}
        </Dialog>

        {/* Secondary Video Dialog */}
        <Dialog isOpen={isSecondaryOpen} onClose={closeSecondaryDialog} title="Upload Secondary Video">
          <div {...getSecondaryProps()} className="bg-primary px-4 py-2 text-white rounded cursor-pointer">
            <input {...getSecondaryInput()} name="secondary-video" />
            <div>Select Secondary Video</div>
          </div>
        </Dialog>

        {/* Video Previews */}
        <div className="mt-4 flex gap-4">
          {recordedVideo && (
              <div className="w-1/2">
                <h3 className="text-lg font-semibold">Recorded Video</h3>
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

        {/* Recording Controls */}
        <div className="flex justify-center mt-2">
          {isRecording && (
              <div onClick={stopRecording} className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer">
                Stop Recording
              </div>
          )}
        </div>
      </div>
  );
};

export default VideoUploader;
