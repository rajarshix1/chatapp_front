import Image from 'next/image'
import { Inter } from 'next/font/google'
import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })
const socket = io('http://localhost:3010');


export default function Chatroom() {
const [userName, setUserName] = useState()
const [roomId, setRoomId] = useState()
const [joined, setJoined] = useState(false)
const [allMessage, setAllMessage] = useState([])
const [message, setMessage] = useState('')
const sendMessage = async (e) =>{
    e.preventDefault()
    console.log('inside sendmessage');
    socket.emit('message', {roomName: roomId, userName: userName, message: message})
    setAllMessage(prevMessages => [...prevMessages, [`Me : ${message}`]]);

}
const joinRoom = () => {
    setJoined(true)
    socket.emit('joinRoom', roomId);
  };
// useEffect(() => {
//     joinRoom()
// }, [])


useEffect(() => {
    console.log(1);
    socket.on('message', data => {
        console.log(2);
        setAllMessage(prevMessages => [...prevMessages, [`${data[0]} : ${data[1]}`]]);
      });
}, [])

const chatboxRef = useRef(null);

useEffect(() => {
  // Scroll to the bottom of the chatbox whenever new messages are added
  if (chatboxRef.current) {
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }
}, [allMessage]);


  return (
  <div className='h-screen'>
    <h1 className=' bg-sky-600 text-white text-center text-3xl p-2'>Chat Room</h1>
   {!joined && (
    <div className='flex flex-row w-full'>
    <input className='border-2 border-rose-700 text-3xl m-2 p-2 w-full ' placeholder='Enter your name' onChange={(e)=>setUserName(e.target.value)}/>
    <input className='border-2 border-rose-700 text-3xl m-2 p-2 w-full ' placeholder='Enter room id' onChange={(e)=>setRoomId(e.target.value)}/>
    <button className='border-2 border-sky-900 text-3xl m-2 p-2 rounded-2xl w-40 hover:bg-sky-900 hover:text-white' onClick={(e)=>joinRoom(e)}>Join</button>
  </div>
   )}
   {joined && (
    <>
     <div className=' bg-scroll m-2 border-2 border-rose-700 h-[70%] overflow-hidden'>
      <ul ref={chatboxRef} className='h-full overflow-y-scroll'>
      {allMessage && allMessage.map((e,i)=>(
        <li key={i}>
            {e}
        </li>
      ))}
      </ul>
    </div>
    <div className='flex flex-row w-full'>
      <textarea className='border-2 border-rose-700 text-3xl m-2 p-2 w-full ' onChange={(e)=>setMessage(e.target.value)}/>
      <button className='border-2 border-sky-900 text-3xl m-2 p-2 rounded-2xl w-40 hover:bg-sky-900 hover:text-white' onClick={(e)=>sendMessage(e)}>SEND</button>
    </div>
    </>
   )

   }
  </div>
  )
}
