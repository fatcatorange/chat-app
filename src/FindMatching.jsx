import React  from "react";
import waitImg from "./image/pepe-wait.gif"
import { waitingListCollection,chatCollection, db } from "./firebase"
import {
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    getDoc
} from "firebase/firestore"

export default function FindMatching(props)
{

  const[waiting,setWaitingList] = React.useState([])
  const[nowChatID,setNowChatID] = React.useState()

  let init = 0;
  let nowWaitID = "?";

  React.useEffect(() => { //開始等待
    const unsubscribe = onSnapshot(waitingListCollection, function (snapshot) {
        const waitingList = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        setWaitingList(waitingList)
        if(nowWaitID!=="?")
        {
          console.log(nowWaitID)
          const findRef = doc(db,"waitingList",nowWaitID)
          getDoc(findRef)
          .then((findDoc)=>{
            if(findDoc.exists() === false)
            {
              props.setUserID(1)
              console.log("開始跟吉米聊天!")
              props.findMatch()
            }
          })
        }
        if(init === 0 && waitingList.length === 0)
        {
          init++;
          createNewChat()
          console.log()
        }
        else if(waitingList.length >= 1 && init === 0)
        {
          init++;
          const match = waitingList[0].chatID;
          const delID = waitingList[0].id;
          const docRef = doc(db,"chatList",match)
          const delRef = doc(db,"waitingList",delID)
          
          getDoc(docRef)
          .then((docSnap) => {
            console.log(docSnap)
            deleteDoc(delRef)
            .then((docSnap)=>{
              console.log("配對到吉米了")
              props.setUserID(2)
              props.setChatRoom(match)
              props.findMatch()
            })
          })
          
          
        }

        
        
    })
    return unsubscribe
  }, [])

  


  function createNewChat() {
    const newChat = {
      chatContent:[],
      user:2
    }
    addDoc(chatCollection, newChat)
    .then((newChatRef) => {
      setNowChatID(newChatRef.id)
      createNewWait(newChatRef.id)
    })
    
    
  }
  const [waitID,setWaitID] = React.useState()

  function createNewWait(chatID){
    const newWait ={
      chatID: chatID
    }
    addDoc(waitingListCollection, newWait)
    .then((newWaitRef) =>{
      nowWaitID = (newWaitRef.id)
      console.log("創建吉米了"+nowWaitID)
      setWaitID(()=>(nowWaitID))
      props.setChatRoom(chatID)
    })
  }

  function endFind(){
    console.log(waitID)
    const delRef = doc(db,"waitingList",waitID)
    deleteDoc(delRef)
    .then(console.log("刪掉等待列"))
    const delChatRef = doc(db,"chatList",nowChatID)
    deleteDoc(delChatRef)
    .then(console.log("刪掉聊天室"))
    props.endFind();
  }
  
  React.useEffect(() => {
    const handleWindowClose = (event) => {
      console.log(nowChatID)
      const delRef = doc(db,"waitingList",waitID)
      deleteDoc(delRef)
      .then(console.log("刪掉等待列"))
      const delChatRef = doc(db,"chatList",nowChatID)
      deleteDoc(delChatRef)
      .then(console.log("刪掉聊天室"))
      
      
    };

    window.removeEventListener('beforeunload', handleWindowClose);
    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [nowChatID,waitID]);
  
    
    return (
        <div className='background'>
          <div className="title">
            HUSH HUB
          </div>
          <img src={waitImg} className="wait-image" />
          <button className='start-button' onClick={endFind}>
            不找了
          </button>
        </div>
    )
}