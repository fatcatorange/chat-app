import React  from "react";
import { waitingListCollection,chatCollection, db } from "./firebase"
import {
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    setDoc
} from "firebase/firestore"

export default function FindMatching(props)
{

  const[waiting,setWaitingList] = React.useState([])
  const[nowChatID,setNowChatID] = React.useState()
  const[nowWaitID,setNowWaitID] = React.useState()
  const[init,setInit] = React.useState("false")

  React.useEffect(() => {
    const unsubscribe = onSnapshot(waitingListCollection, function (snapshot) {
        const waitingList = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        setWaitingList(waitingList)
    })
    return unsubscribe
  }, [])

  React.useEffect(()=>{
    if((!waiting || waiting.length === 0) && (!nowWaitID) )
    {
      createNewChat();
      setInit(true)
    }
  },[waiting])


  function createNewChat() {
    const newChat = {
        body:{
          user1:"",
          user2:""
        }
    }
    addDoc(chatCollection, newChat)
    .then((newChatRef) => {
      setNowChatID(newChatRef.id)
      createNewWait(newChatRef.id)
    })
    
    
  }

  function createNewWait(chatID){
    const newWait ={
      chatID: chatID
    }
    addDoc(waitingListCollection, newWait)
    .then((newWaitRef) =>{
      setNowWaitID(newWaitRef.id)
    })
  }

  
    
    return (
        <div className='background'>
          <button className='start-button' onClick={props.endFind}>
            不找了
          </button>
        </div>
    )
}