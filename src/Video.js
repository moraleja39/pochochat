import "./Video.scss"
import {bind} from "@react-rxjs/core";
import ChatService from "./ChatService";
import {useEffect} from "react";

const [useVideos] = bind(ChatService.videos$.asObservable())

export default function Video() {

    const [videos] = useVideos()

    useEffect(() => {
        console.log(videos)
    }, [videos])

    return(

        <div className='Video'>

        </div>

    )
}
