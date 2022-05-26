import "./Video.scss"
import {bind, Subscribe} from "@react-rxjs/core";
import ChatService from "./ChatService";
import {useEffect, useRef} from "react";

const [useVideos] = bind(ChatService.videoStreams$)

function Video({ id, stream, name, mute = false }) {

    const videoEl = useRef()

    useEffect(() => {
        videoEl.current.srcObject = stream
        if (mute) {
            videoEl.current.muted = true
        }
    }, [stream, mute])

    useEffect(() => {
        videoEl.current.addEventListener('loadedmetadata', () => {
            videoEl.current.play()
        })
    }, [])

    return (
        <div className='video-container'>
            <video ref={videoEl}></video>
            <span className="name">{ name }</span>
        </div>
    )

}

function VideoList() {
    const videos = useVideos()

    useEffect(() => {
        console.log(videos)
    }, [videos])

    return (
        videos.length === 0 ? <></> :
            <div className='Video'>
                { videos.map(v => <Video stream={v.stream} name={v.name} id={v.id} mute={!!v.isSelfVideo} key={v.id} />) }
            </div>
    )
}


export default function VideoChats() {


    return(
        <Subscribe>
            <VideoList />
        </Subscribe>
    )
}
