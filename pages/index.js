import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react'

import Ghantaghar from '../assets/svg/ghantaghar.js';
import Clouds from "../assets/svg/clouds.js";
import Tree from '../assets/svg/tree';
import Moon from "../assets/svg/moon";
import { MdNotificationsActive, MdNotificationsOff, MdRadio, MdPlayCircleFilled, MdPauseCircleFilled } from "react-icons/md";
import SajhaBus from '../assets/svg/sajha_bus';

export async function getStaticProps() {
  const date = await getTime();
  let nightMode = false;
  const {tf_hours, display_time} = date;

  if(tf_hours>18 || tf_hours<6){
    nightMode = true
  }

  return {
    props: {
      display_time: display_time,
      nightMode
    },
  }
}

function getTime(){
    var nepal_time = new Date().toLocaleString("en-US", {timeZone: "Asia/Kathmandu"});
    var date = new Date(nepal_time);
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var tf_hours = date.getHours();
    
    var am = tf_hours>12?false:true;
    var hours = tf_hours;
    if(hours === 0 || hours > 12){
      hours = Math.abs(tf_hours - 12);
    }

    const display_time = `${hours}:${minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}${am?"AM":"PM"}`
    
    return {
      date,
      hours,
      minutes,
      seconds,
      tf_hours,
      display_time
    }
}

export default function Home(props) {
  const [displayTime, setDisplayTime] = useState(props.display_time)
  const [width, setWidth] = useState(720);
  const [height, setHeight] = useState(1024);
  const [nightMode, setNightMode] = useState(props.nightMode);
  const [isMute, setIsMute ] = useState(false);
  const [stream, setStream] = useState(false);
  const [sound] = useState(typeof Audio !== "undefined" && new Audio("/ghantaghar.wav"));
  const [radioNepal] = useState(typeof Audio !== "undefined" && new Audio("http://103.69.126.230:8000/stream"));

  useEffect(()=>{
    const timer = setInterval(() => {
      rotateHands();
      },1000)
    return () => {
      clearInterval(timer)
    }
  },[])

  useEffect(()=>{
    const timer = setTimeout(() => {
      rotateHands();
      },200)
    return () => {
      clearTimeout(timer)
    }
  },[])

  const playSound = (hours)=>{
    let count = 0;
    const timer = setInterval(() => {
      if(count<hours){
        sound.play();
        count+=1;
      } else {
        clearInterval(timer)
      }
      },2200)
    return () => {
      clearInterval(timer)
    }
  }

  const rotateHands=async()=>{
    const date = await getTime();
    const {hours, tf_hours, minutes, seconds, display_time} = date;
    if(tf_hours>18 || tf_hours<6){
      setNightMode(true)
    } else {
      setNightMode(false)
    }
    
    const total_minutes = (minutes * 60) + seconds;
    const total_hours = (hours * 3600) + minutes;
    if(minutes === 0 && seconds === 0) {
      playSound(hours)
    }
    
    setDisplayTime(display_time)

    document.getElementById('second').setAttribute('transform', 'rotate(-'+360*(seconds/60)+',178,276)');
    document.getElementById('minute').setAttribute('transform', 'rotate(-'+360*(total_minutes/3600)+',178,276)');
    document.getElementById('hour').setAttribute('transform', 'rotate(-'+360*(total_hours/43200)+',178,276)');
  }

  const muteUnmute=()=>{
    if(isMute){
      sound.muted = false
      setIsMute(false)
    } else {
      sound.muted = true
      setIsMute(true)
    }
  }

  const streamRadio=()=>{
    if(stream){
      radioNepal.pause()
      setStream(false)
    } else {
      radioNepal.play()
      setStream(true)
    }
  }

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    useEffect(() => {
      handleWindowSizeChange();
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

  let isMobile = (width <= 768);

  return (
    <div className={styles.container}>
      <Head>
        <title>{`Ghantaghar | ${displayTime}`}</title>
        <meta name="description" content={`GhantaGhar is the first public tower clock in Nepal, situated at the heart of the capital city of Kathmandu. It shows current Nepal Standard Time. It's ${displayTime} in Nepal.`} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="https://ghantaghar.org/images/ghantaghar.png" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PNKJSY9N98"></script>
        <script dangerouslySetInnerHTML={
          { __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());

          gtag('config', 'G-PNKJSY9N98');`
        }}
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.App}>
          <div  style={{position: 'absolute', display: 'flex', justifyContent: 'space-around', flexDirection: 'row', color: "#fff", width: 60, cursor: 'pointer', zIndex: 11111, right: 10, top: 10}}>
            <div alt="Radio Nepal" onClick={streamRadio} style={{position: 'relative'}}>
              <div style={{position: 'absolute', color:"#9a785f", right: 4, bottom: 3.8}}>
                {!stream? <MdPlayCircleFilled size={15} />: <MdPauseCircleFilled size={15} />}
              </div>
              <MdRadio  size={23} />
            </div>
            <div onClick={muteUnmute}>
              {isMute? 
                <MdNotificationsOff size={25} /> : 
                <MdNotificationsActive size={25} />
              }
            </div>
          </div>
          <Ghantaghar width={width} height={height} isMobile={isMobile} nightMode={nightMode} />
          <Clouds width={width} isMobile={isMobile} nightMode={nightMode} style={{zIndex: -1, position: 'absolute', left: 0}} />
          <Tree isMobile={isMobile} />
          {/* {nightMode && <Moon />} */}
          <SajhaBus />
          <div className={styles.road} style={{backgroundImage: "url(/images/road1.jpg)"}} />
        </div>
      </main>
    </div>
  )
}
