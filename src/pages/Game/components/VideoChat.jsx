import { useEffect, useRef, useState } from "react";
import { socket } from '../../../connection/socketio'
import Peer from 'simple-peer';
import '../css/VideoChat.css';

export const VideoChat = (props) => {

    const [stream, setStream] = useState();
    const [gettingCall, setGettingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [calling, setCalling] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);

    const userVid = useRef();
    const oppVid = useRef();
    const peerRef = useRef();

    useEffect(() => { 
        console.log(props.oppUserName) 
        console.log(props.oppId)},[props.oppId, props.oppUserName])

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })

            .then(stream => {
                setStream(stream);
                if (userVid.current) userVid.current.srcObject = stream;
            })

            .catch(err => console.log(err));

        socket.on('ringing', (data) => {
            setGettingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
            console.log('call from ' + data.userName + ' at ' + data.signal)
        });

    }, []);

    useEffect(() => {

        socket.on('end-call', () => {

            if (peerRef.current) peerRef.current.destroy();

            setStream(null);
            setGettingCall(false);
            setCaller('');
            setCallerSignal(null);
            setCalling(false);
            setCallAccepted(false);
        });

        return () => socket.off('end-call');

    });

    const call = () => {

        setCalling(true);

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', data => {
            console.log('calling user')
            socket.emit('call-user', { userToCall: props.oppId, signalData: data, from: socket.id})
        });

        peer.on('stream', stream => {
            console.log('adding video')
            if (oppVid.current) oppVid.current.srcObject = stream;
        });

        socket.on('call-accepted', signal => {
            setCallAccepted(true);
            console.log('i accepted')
            peer.signal(signal)
        });

        peerRef.current = peer;
    }

    const acceptCall = () => {

        setCallAccepted(true);
        setCalling(false);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });

        peer.on('signal', data => {
            console.log('accepting call')
            socket.emit('accept-call', { signal: data, to: caller });
        });

        peer.on('stream', stream => {
            console.log('adding video')
            oppVid.current.srcObject = stream;
        });

        console.log('signalling ' + callerSignal)
        peer.signal(callerSignal);

        peerRef.current = peer;
    }

    let view;

    if (callAccepted) {

        view = <video 
                    className='opp-video' 
                    ref={oppVid}
                    playsInline
                    autoPlay>
                </video>
    }

    else if (gettingCall) {

        view = (
        
        <div className="info">

            <h3>{props.oppUserName} is calling</h3>

            <button  className="btn" onClick={acceptCall}>
                <h3>Accept call</h3>
            </button>

        </div>)
    }

    else if (calling) {
        console.log(props.oppUserName)
        view = (

            <div className="info">

                <h3>Calling {props.oppUserName}...</h3>

            </div>

        )

    }

    else {

        view = (

            <button className="btn" onClick={() => call(props.oppId)}>

                <h3>Call {props.oppUserName}</h3>

            </button>

        )

    }

    return (

        <div className='videoContainer'>

            <div className="videos">

                <video 
                    className='video' 
                    ref={userVid}
                    playsInline
                    muted
                    autoPlay>
                </video>

                {view}

            </div>

        </div>

    );

}