import React from "react";
import Dialog from "../../component/Dialog";

import introAudio from "../../sample/Tips on how to record record.mp3";
import recordAudio from "../../sample/Tips on Intro Video Format.mp3";

const VideoSampleModal = ({ isOpen, onClose }) => {
    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Sample Video & Audio">
            <div className="space-y-4">

                {/* Sample Video Section */}
                <div>
                    <h3 className="text-sm font-semibold">Sample Video</h3>
                    <video controls width="100%">
                        <source
                            src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Sample Audio Section */}
                <div>
                    <h3 className="text-sm font-semibold">Sample Audio</h3>

                    <audio controls>
                        <source src={introAudio} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>

                    <audio controls className="mt-2">
                        <source src={recordAudio} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                </div>

            </div>
        </Dialog>
    );
};

export default VideoSampleModal;
