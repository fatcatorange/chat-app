import logo from './logo.svg';
import './App.css';
import React from 'react';
import ChatBoard from './ChatBoard';
import FindMatching from './FindMatching';
import StartChat from './StartChat';

function App() {

  const [chatting,setChatting] = React.useState(0) //0代表首頁 1代表尋找中 2代表正在聊
  let display
  if(chatting === 0)
  {
    display = <StartChat startFind = {()=>setChatting(1)}/>
  }
  else if(chatting === 1)
  {
    display = <FindMatching endFind = {()=>setChatting(0)} findMatch = {()=>setChatting(2)}/>
  }
  else
  {
    display = <ChatBoard/>
  }


  return (
    <main>
      {
        display
      }  
    </main>
  );
}

export default App;
