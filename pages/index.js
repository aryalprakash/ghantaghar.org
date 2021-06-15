import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react'

import Ghantaghar from '../assets/svg/ghantaghar.js';
import Clouds from "../assets/svg/clouds.js";
import Tree from '../assets/svg/tree';

export default function Home() {
  const [displayTime, setDisplayTime] = useState("");
  const [width, setWidth] = useState(720);
  const [height, setHeight] = useState(1024);
  
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
        new Audio("/ghantaghar.wav").play();
        count+=1;
      } else {
        clearInterval(timer)
      }
      },2200)
    return () => {
      clearInterval(timer)
    }
  }

  const rotateHands=()=>{
    var nepal_time = new Date().toLocaleString("en-US", {timeZone: "Asia/Kathmandu"});
    var date = new Date(nepal_time);
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();
    var am = true;
    if(hours > 12){ 
      hours = hours - 12;
      am = false;
    }
    
    const total_minutes = (minutes * 60) + seconds;
    const total_hours = (hours * 3600) + minutes;
    if(minutes === 0) {
      playSound(hours)
    }
    
    const display_time = `${hours}:${minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}${am?"AM":"PM"}`
    setDisplayTime(display_time)
    
    document.getElementById('second').setAttribute('transform', 'rotate(-'+360*(seconds/60)+',178,276)');
    document.getElementById('minute').setAttribute('transform', 'rotate(-'+360*(total_minutes/3600)+',178,276)');
    document.getElementById('hour').setAttribute('transform', 'rotate(-'+360*(total_hours/43200)+',178,276)');
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
      </Head>

      <main className={styles.main}>
        <div className={styles.App}>
          <Ghantaghar width={width} height={height} isMobile={isMobile}  />
          <Clouds width={width} isMobile={isMobile} style={{zIndex: -1, position: 'absolute', left: 0}} />
          <Tree isMobile={isMobile} />
          <div className={styles.road} style={{backgroundImage: "url(/images/road1.jpg)"}} />
        </div>
      </main>
    </div>
  )
}
