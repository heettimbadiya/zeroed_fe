import React, { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Dialog from '../../component/Dialog'

const VideoUploader = ({ defaultVideo, onVideoUpload }) => {
  const [videoSrc, setVideoSrc] = useState(null)
  const mediaRecorderRef = useRef(null)
  const [recording, setRecording] = useState(false)
  const [stream, setStream] = useState(null)
  const videoRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (defaultVideo) {
      setVideoSrc(process.env.REACT_APP_FILE_URL + '/' + defaultVideo)
    }
  }, [defaultVideo])

  const openDialog = () => setIsOpen(true)
  const closeDialog = () => setIsOpen(false)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    onVideoUpload(file)
    closeDialog()
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'video/*',
    onDrop,
  })

  const startRecording = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setStream(newStream)
      mediaRecorderRef.current = new MediaRecorder(newStream)

      const chunks = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const file = new File([blob], 'recorded-video.webm', {
          type: 'video/webm',
        })
        const url = URL.createObjectURL(blob)
        setVideoSrc(url)
        onVideoUpload(file) // Pass the actual File object
        newStream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setRecording(true)
      setIsOpen(false)

      // Set the video element to show the live stream
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Error accessing media devices.', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div>
      <Dialog isOpen={isOpen} onClose={closeDialog} title="Upload video">
        <div className="flex gap-x-2 justify-between items-center">
          <div
            {...getRootProps({ className: 'dropzone' })}
            className="bg-blue px-4 py-2 text-white rounded cursor-pointer"
          >
            <input {...getInputProps()} name="video" />
            <div>Select video</div>
          </div>
          <div
            onClick={startRecording}
            disabled={recording}
            className="bg-blue px-4 py-2 text-white rounded cursor-pointer"
          >
            Start Recording
          </div>
        </div>
      </Dialog>

      <div
        onClick={openDialog}
        className="border border-gray-400 border-b-2 focus:border-b-4 focus:border-b-blue rounded mt-1 px-2 py-2.5 w-full cursor-pointer"
      >
        Record video
      </div>

      <div className="mt-2">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="600"
          style={{ display: recording ? 'block' : 'none' }} // Hide when not recording
        />
        {!recording && videoSrc && (
          <div>
            <video controls src={videoSrc} width="600" />
          </div>
        )}
      </div>

      <div className="flex gap-x-1 mt-1">
        {recording && (
          <div
            onClick={stopRecording}
            disabled={!recording}
            className="bg-blue text-xs px-2 py-2 text-white rounded cursor-pointer"
          >
            Stop Recording
          </div>
        )}
        {stream && recording && (
          <div
            onClick={toggleFullscreen}
            disabled={!stream}
            className="bg-blue text-xs px-2 py-2 text-white rounded cursor-pointer"
          >
            Toggle Fullscreen
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoUploader
