import React, { useRef, useState } from 'react'
import CodeImg from '../assets/Code.png'
import io from 'socket.io-client';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
function HomeScreen({socket}) {
  const Navigate = useNavigate()
    const handleCreateSession = () => {
   // connect to the server
        socket.emit('create_session'); // send a create_session event to the server
        socket.on('session_created', (data) => { // listen for a session_created event from the server
          const userName = prompt("enter your username")
          sessionStorage.setItem('userName', userName)
            sessionStorage.setItem('session_id', data.sessionId) // set the session ID received from the server
            sessionStorage.setItem('isCreator', true ) // set the session ID received from the server
            
          Navigate("/code")
        });
      };
      const handleJoinSession = () => {
   // connect to the server
        socket.emit('join_session', SessionInputRef.current.value); // send the session ID to the server
        socket.on('session_joined', (data) => { // listen for a session_joined event from the server
          if (data.error) {
            toast.error("Session not found ") // display the error message if the session doesn't exist
          } else {
            const userName = prompt("enter your username")
            sessionStorage.setItem('session_id', data.sessionId) // set the session ID received from the server
            sessionStorage.setItem('userName', userName) // set the session ID received from the server
            sessionStorage.setItem('isCreator', false )  // set the session ID received from the server
            console.log(`session with id ${data.sessionId} has been joined`)
          Navigate("/code")
          }
        });
      };
      const SessionInputRef = useRef(null)
  return (
    <div className='h-screen font-[poppins] p-4 flex flex-col  md:grid md:grid-cols-2' >
        
        {/* Information relative to the platform and the connection */}
            <div className='h-full  items-start flex-col gap-y-6 pt-10 capitalize  justify-center p-4 flex'>
                <h1 className='text-2xl font-semibold'>Welcome to your <span className='text-blue-500'>online collaboration code</span>  </h1>
                <p className='text-gray-500 tracking-tighter '>
                An online collaborative code editor is a web-based tool that allows multiple users to write and edit code simultaneously in real-time. This type of tool is particularly useful for remote teams or pair programming scenarios, where multiple people need to work together on the same codebase. Collaborative code editors typically include features such as syntax highlighting, version control, and chat functionality, to facilitate communication and collaboration between users. Some examples of popular collaborative code editors include VS Code Live Share, CodePen, and CodeSandbox. These tools can be used for a wide range of programming languages and frameworks, making them a valuable tool for developers of all levels and backgrounds.
                </p>
                <div className='flex  flex-col md:flex-row h-20  gap-x-6 w-full items-center' >
                    {/* Create a create boutton sesssion */}
                    <div onClick={handleCreateSession} className='h-12 w-48 cursor-pointer items-center justify-center flex hover:bg-purple-700 bg-purple-500 rounded-lg' >
                        <p  className='text-white'> Create a session</p>
                    </div>
                    <h1>Or</h1>
                    {/* Join an  current   sesssion */}
                    <div className='flex flex-col md:flex-row items-center w-[27rem] gap-x-4    '>
                        <input ref={SessionInputRef} className='border-b-2 border-green-400 bg-gray-50 outline-none px-2 flex-1 h-[2.5rem]' />
                    <div onClick={handleJoinSession} className='h-12 w-48 cursor-pointer items-center justify-center flex hover:bg-purple-700 bg-purple-500 rounded-lg' >
                        <p  className='text-white'> Join a session</p>
                    </div>
                    </div>
               
                </div>
            </div>
        {/* Image */}
        <div className='h-full items-center justify-center flex '>
            <img src={CodeImg} />
        </div>

    </div>
  )
}

export default HomeScreen