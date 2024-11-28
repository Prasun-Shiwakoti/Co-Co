import React, { useState } from 'react'
import { IoMdSend } from "react-icons/io";


const Chatbot = (show) => {

    const [messages, setMessages] = useState([]);

    const handleMessageSend = () => {

    }
    return (
        <div className='absolute right-0 bottom-0 flex flex-col bg-blue-100 m-3 w-[40%]' >
            <div>

            </div>
            <div className='flex items-center'>
                <input type="text" placeholder='Enter your prompt' className='p-2 border w-[90%]' />
                <IoMdSend size={30} onClick={handleMessageSend} />
            </div>
        </div>
    )
}

export default Chatbot