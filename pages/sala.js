import { ref, set, onValue, remove } from "firebase/database"
import { db } from "../components/chatFirebase/ChatOptionAPI"
import { useEffect, useState } from 'react'
import { Messages } from '../components/showMessages'
import { Username } from '../components/username'

const dataUser = {
    "name": "",
    "message": "",
    "id": null,
    "host": false
}

const detailsVideo = {
    "currentTime": 0,
    "duration" : 0,
    "volume" : 100,
    "pause" : true,
    "end": false
}

let loadVideo;
let timeInterval;

export default function SalaVideo({ room = null }) {

    const userdb = ref(db, `${room}`)
    const [allMessages, setAllMessages] = useState([])
    const [mess, setMess] = useState(dataUser)
    const [endVideo, setEndVideo] = useState(false)
    const [username, setUsername] = useState(false)
    let showMess = null
    let names = ""
    let codeValid = room !== null ? room.substring(2, 13) : null
    
    if(allMessages[0]){
        showMess = allMessages[0]["chat"] ? Object.values(allMessages[0]["chat"]) : null
        names = allMessages[0]["members"] ? Object.keys(allMessages[0]["members"]) : ""
    }

    if(allMessages[0] && !dataUser.host){
        detailsVideo.pause = allMessages[0].details ? allMessages[0].details.pause : true
        detailsVideo.volume = allMessages[0].details ? allMessages[0].details.volume : 50
        detailsVideo.currentTime = allMessages[0].details ? allMessages[0].details.currentTime : 0
        detailsVideo.duration = allMessages[0].details ? allMessages[0].details.duration : 0
        detailsVideo.end = allMessages[0].details ? allMessages[0].details.end : false
    }

    function handleChange(e){
        setMess({
            ...mess,
            [e.target.name] : e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        if(/^ *$/.test(mess.name)) return console.error("Err")
        mess.id = Date.now()
        writeUserData(mess)
        setMess(dataUser)
    }

    function writeUserData({ id, name, message, host }){
        set(ref(db, `${room}/chat/${id- 1}`), {
            name,
            message,
            id,
            host
        })
    }

    function writeDetailsVideo({ currentTime, duration, volume, pause, end }){
        set(ref(db, `${room}/details`), {
            currentTime,
            duration,
            volume,
            pause,
            end,
        })
    }

    useEffect(() => {
        onValue(userdb, (snapshot) => {
            const dataMessages = snapshot.val()
            if(dataMessages === null) return setAllMessages([])
            setAllMessages([...allMessages, dataMessages])
        })
        
        if(!window.YT){
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";

            window.onYouTubeIframeAPIReady = loadVideo;

            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); 
        }
    }, [])
    
    loadVideo = () =>{
        let player;
        player = new YT.Player('ytplayer', {
            height: '480',
            width: '100%',
            videoId: `${codeValid}`,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { 'modestbranding': 0,'enablejsapi': 1, 'origin': window.location.host },
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            }
        });
        
        function onPlayerReady(event) {
            event.target.pauseVideo()
            timeInterval = setInterval(()=>{
                onPlayer(event)
            },999)
        }

        function onPlayer(event){
            if(dataUser.host){
                detailsVideo.volume = event.target.getVolume()
                detailsVideo.currentTime = event.target.getCurrentTime()
                detailsVideo.duration = event.target.getDuration()
                if(detailsVideo.currentTime === detailsVideo.duration && detailsVideo.currentTime > 0){
                    detailsVideo.end = true
                }
                writeDetailsVideo(detailsVideo)
            }else{
                event.target.setVolume(detailsVideo.volume)

                if(detailsVideo.currentTime !== 0) Math.floor(event.target.getCurrentTime()-detailsVideo.currentTime) >= -4 ? "" : event.target.seekTo(detailsVideo.currentTime)
                if(detailsVideo.currentTime !== 0) Math.floor(event.target.getCurrentTime()-detailsVideo.currentTime) >= 2 ? event.target.seekTo(detailsVideo.currentTime) : ""
                
                if(!detailsVideo.pause){
                    event.target.playVideo()
                }else{
                    event.target.pauseVideo()
                }
            }

            if(detailsVideo.end){
                clearInterval(timeInterval)
                dataUser.host = false
                setTimeout(()=>{
                    setEndVideo(true)
                    remove(userdb)
                }, 120000)
            }
        }

        function onPlayerStateChange(event) {
            if(dataUser.host && event.data === YT.PlayerState.PLAYING){
                detailsVideo.pause = false
                //console.log("Corriendo")
            }
            else if(dataUser.host && detailsVideo.pause === false){
                detailsVideo.pause = true
                //console.log("En Pause")
            }else{
                if(detailsVideo.pause === true){
                    event.target.pauseVideo()
                }
            }
        }
    }

    return ( 
        <>
            <section id='sectionCODE' className="code">
                <h3 id='hola'>Code: {room} {dataUser.host && "// Eres el HOST"}</h3>
            </section>

            <div id="ytplayer"></div>

            <section id='sectionSHOWMESSAGES' className="showMessages">
                <ul className="list-group listMessages">
                    {showMess !== null && showMess.map(el => <Messages key={el.id} data={el} />)}
                </ul>
            </section>
            {!endVideo &&
            <section id='sectionCHAT' className="chat">
                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <div className="container text-center">
                    <div className="row">
                        <div className="col">
                            <input type="text" name='message' className="form-control" id="ControlInputChat" value={mess.message} onChange={handleChange}/>
                        </div>
                        <div className="col">
                        {username &&
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        }
                        {!username && 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Nickname
                            </button>
                        }
                        </div>
                    </div>
                </div>
                </div>
                </form>
            </section>
            }

            {!username && <Username dataUser={dataUser} data={mess} setData={setMess} setUsername={setUsername} names={names} room={room} />}
        </>
    )
}