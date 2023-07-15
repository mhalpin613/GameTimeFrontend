import { useEffect, useRef, useState } from "react";
import '../css/VideoChat.css';

export const VideoChat = () => {

    const [stream, setStream] = useState();

    const userVid = useRef(null);
    const oppVid = useRef(null);

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })

            .then((stream) => {
                if (userVid.current && oppVid.current) {
                userVid.current.srcObject = stream;
                oppVid.current.srcObject = stream;
                setStream(stream)
                }
            })

            .catch((error) => {
                console.error('Failed to access webcam:', error);
            });

    }, []);

    return (

        <div className='videoContainer'>

            <div className="videos">

                {<video 
                    className='video' 
                    ref={userVid}
                    playsInline
                    muted
                    autoPlay>
                </video>}

                {<video 
                    className='video' 
                    ref={oppVid}
                    playsInline
                    muted
                    autoPlay>
                </video>}

            </div>

            <div className="btns">

                <button className="call">Call</button>
                {stream && <button className="end">End Call</button>}

            </div>

        </div>

    );

}