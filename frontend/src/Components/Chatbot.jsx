import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IoMdSend, IoMdClose } from "react-icons/io";

const Chatbot = ({ close, subjects }) => {
  const [selected, setSelected] = useState("");
  const [selectedId, setSelectedId] = useState('')
  console.log(subjects)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = localStorage.getItem('token')

  console.log(messages)
  const handleMessageSend = async () => {
    console.log(messages);
    setMessages(prev => [...prev, { sender: "user", text: input }]);
    const res = await fetch('http://localhost:8000/llm/generate_chat/', {
      method: 'POST',
      headers: { "authorization": `token ${token}`, "Content-Type": "application/json", },
      body: JSON.stringify({ prompt: input, id: selectedId })
    })
    const response = await res.json()
    if (response) {
      setMessages(prev => [...prev, { sender: "bot", text: response }])
    }
    console.log(response)
    setInput("");
  };

  const closeChat = () => {
    close();
  };
  return (
    <div className="absolute right-0 bottom-0 flex flex-col bg-blue-100 m-3 w-[40%] p-3 rounded-lg">
      <div className="chat-popup">
        <div className="flex items-center justify-between w-full">
          <div className="chat-header text-xl font-semibold">Ask AI</div>

          <Dropdown>
            <Dropdown.Toggle className="bg-blue-100 text-blue-900 border-none">
              {selected ? selected : "Subjects"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                subjects.map((subject) => (
                  <Dropdown.Item onClick={() => {
                    setSelected(subject.name)
                    setSelectedId(subject.id)
                  }}>
                    {subject.name}
                  </Dropdown.Item>))
              }

            </Dropdown.Menu>
          </Dropdown>

          <IoMdClose
            onClick={() => closeChat()}
            size={30}
            className="cursor-pointer"
          />
        </div>
        <div className="chat-body bg-white h-[50vh] rounded-xl mt-2 mb-2 flex flex-col gap-3 overflow-y-auto p-3">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div key={idx} className="chat-message">
                {msg.sender === "user" ? (
                  <div className=" text-white text-right">
                    <p className="bg-slate-300 p-2 rounded-lg inline-block">
                      {msg.text}
                    </p>
                  </div>
                ) : (
                  <div className=" text-white text-left">
                    <p className="bg-blue-500 p-2 rounded-lg inline-block">
                      {msg.text}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="chat-placeholder">No messages yet</div>
          )}
        </div>
        <hr />
        <div className="chat-footer flex items-center mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleMessageSend()}
            className="p-2 mr-2 w-full rounded-lg"
          />
          <IoMdSend
            onClick={handleMessageSend}
            size={30}
            className="cursor-pointer"
          ></IoMdSend>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
