import React, { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Dialog from '../../component/Dialog'
import { ErrorMessage } from 'formik'

const VideoUploader = ({ defaultVideo, onVideoUpload }) => {
  const [videoSrc, setVideoSrc] = useState(null)
  const [videoError, setVideoError] = useState('')
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
  const closeDialog = () => {
    setVideoError('') // Clear error when dialog is closed
    setIsOpen(false)
  }

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]

    // Validate video type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/webm']
    if (!validTypes.includes(file.type)) {
      setVideoError(
        'Invalid video type. Please upload an MP4, AVI, MOV, or WEBM file.',
      )
      return
    }

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
            className="bg-primary px-4 py-2 text-white rounded cursor-pointer"
          >
            <input {...getInputProps()} name="video" />
            <div>Select video</div>
          </div>
          <div
            onClick={startRecording}
            disabled={recording}
            className="bg-primary px-4 py-2 text-white rounded cursor-pointer"
          >
            Start Recording
          </div>
        </div>
        {/* Display error message if any */}
        {videoError && (
          <div className="text-xs text-red-500 ml-1 mt-1">{videoError}</div>
        )}
      </Dialog>

      <div
        onClick={openDialog}
        className="border border-text-border border-b-4 focus:border-b-4 focus:border-primary outline-none rounded-lg mt-1 px-2 py-3 pr-10 w-full cursor-pointer"
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
            className="bg-primary text-xs px-2 py-2 text-white rounded cursor-pointer"
          >
            Stop Recording
          </div>
        )}
        {stream && recording && (
          <div
            onClick={toggleFullscreen}
            disabled={!stream}
            className="bg-primary text-xs px-2 py-2 text-white rounded cursor-pointer"
          >
            Toggle Fullscreen
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoUploader
