import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript'
import {FiSend} from 'react-icons/fi'
import toast from 'react-hot-toast';

function CodeRoom({socket}) {
    // const [socket, setSocket] = useState(null);
    const sessionId = sessionStorage.getItem("session_id")
    const userName = sessionStorage.getItem("userName")
    const [code, setCode] = useState('');
    const [version, setVersion] = useState(0);
    const codeMirrorRef = useRef();
  
    useEffect(() => {
     
  
  
      socket.on('update', (data) => {
        setCode(data.code);
      });
  
    }, []);
  
    useEffect(() => {
      if (codeMirrorRef.current) {
        const editor = CodeMirror(codeMirrorRef.current, {
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
          lineWrapping: true,
          
          value: code,
        });
  
        editor.on('change', (cm) => {
          const value = cm.getValue();
          setCode(value);
  
          if (socket) {
            socket.emit('update', { code: value, version });
          }
        });
        editor.setSize('100%', '70%');
      }
    }, [codeMirrorRef, socket, version]);
  
   const handleSaveVersion = async () => {
    try {
      const response = await fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ code }),
      });
      const data = await response.json();
  
      if (data.status === 'success') {
        alert('Code version saved successfully!');
      } else {
        alert('Error saving code version: ' + data.message);
      }
    } catch (error) {
      alert('Error saving code version: ' + error.message);
    }
  };
  
  const handleLoadVersion = async () => {
    const id = prompt('Enter the ID of the code version you want to load:');
  
    if (id === null || id.trim() === '') {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/load/${id}`);
      const data = await response.json();
  
      if (data.status === 'success') {
        setCode(data.code);
        setVersion(parseInt(id));
        alert('Code version loaded successfully!');
      } else {
        alert('Error loading code version: ' + data.message);
      }
    } catch (error) {
      alert('Error loading code version: ' + error.message);
    }
  };
  const [chatMessages, setChatMessages] = useState([]);
  const messageInputRef = useRef();

  useEffect(() => {
   


    socket.on('code_updated', (data) => { // listen for code_updated events from the server
      setCode(data.code); // update the code with changes made by other users
    });
    socket.on('chat_message', (data) => { // listen for chat_message events from the server
      console.log("oh my goash")
      if(data.sessionId === sessionId){
        console.log("fuckit")
        newMessages = [...chatMessages,data.message]
        setChatMessages(newMessages); 
      }
     // update the chat with the new message
    });

   
  }, [JSON.parse(sessionStorage.getItem("sesssionId"))]);

  useEffect(() => {
    if (codeMirrorRef.current) {
      const editor = CodeMirror(codeMirrorRef.current, {
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true,
        lineWrapping: true,
        value: code,
      });

      editor.on('change', (cm) => {
        const value = cm.getValue();
        setCode(value); // update the code locally

        if (socket) {
          socket.emit('code_updated', { code: value, sessionId : sessionId }); // emit a code_updated event to the server
        }
      });
    }
  }, [codeMirrorRef, socket, JSON.parse(sessionStorage.getItem("sesssionId"))]);

  const handleSendMessage = () => {
    const message = {
      content :  messageInputRef.current.value,
      datetime : (new Date( )).toISOString(),
      userName : userName
     
    };
    if (message.content.trim() !== '') {
      socket.emit('chat_message', { message, sessionId : sessionId }); // emit a chat_message event to the server
      messageInputRef.current.value = '';
    }else{
      toast.error("Empty  not supported ") 
    }
  };
    return (
      <div className="overflow-hidden h-screen bg-gray-100 py-6 flex flex-col justify-start sm:py-12">
          <h1 className="text-4xl font-bold text-center mb-4">Online Code Editor :<span className='text-blue-500 ml-2' >{sessionStorage.getItem("session_id")}</span> </h1>

     {/* Main Layout */}
     <div className='flex h-[40rem]  gap-x-4' >
        {/* CodeBox */}
        <div className='h-full flex flex-col rounded bg-white w-3/4' >
            {/* Acrtions Buttons */}
      
              {/* Code Editor */}
              <div className="mt-5 h-[15rem]">
                <div ref={codeMirrorRef} className="rounded-lg shadow-md  w-full"></div>
              </div>
                <div className="flex items-center mt-4 justify-center space-x-5">
                <button
                  onClick={handleSaveVersion}
                  className="border-2 border-indigo-400 w-1/3 py-3 text-center text-black hover:text-white font-semibold rounded-lg hover:bg-indigo-400"
                >
                  Save Version
                </button>
               
              </div>
        </div>


                {/* Chat Box */}

        <div className='h-full rounded flex-col flex mr-2 bg-white w-1/4 p-3' >
            <h1 className='text-center font-semibold ' >Chat</h1>
            {/* Message Box */}
            <div className='flex-1 overflow-y-scroll flex-col flex gap-y-4 bg-gray-100 p-3' >
              { chatMessages.map((message,index)=> (
                      <div className={`min-h-auto rounded flex-col ${message.userName === userName? "self-end" : message.userName} flex bg-white max-w-[85%] p-3`} >
                  <h1 className='text-blue-400'>{message.userName === userName? "you" : message.userName}</h1>
                  <p className='text-gray-500'>{message.content}</p>
                  <h1 className='self-end italic'>{message.datetime.split("T")[1].substring(0,5)}</h1>

                </div>
              ))}
            
            </div>

            {/* input */}
            <div className='w-full flex items-center gap-x-2 h-10 ' >
            <input ref={messageInputRef} className='border-b-2  border-green-400 bg-gray-50 outline-none px-2 flex-1 h-[2.5rem]' />
            <div onClick={()=>handleSendMessage()} className='h-8 w-8 bg-purple-500 cursor-pointer items-center justify-center flex rounded-md hover:bg-fuchsia-700' >
            <FiSend color="white" />    
             </div>
            </div>
        </div>
     </div>
      </div>
    );
  };


export default CodeRoom