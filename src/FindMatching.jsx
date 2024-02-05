import React  from "react";
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

  React.useEffect(() => {
    const unsubscribe = onSnapshot(waitingListCollection, function (snapshot) {
        const waitingList = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        setWaitingList(waitingList)
        if(nowWaitID!="?")
        {
          console.log(nowWaitID)
          const findRef = doc(db,"waitingList",nowWaitID)
          getDoc(findRef)
          .then((findDoc)=>{
            if(findDoc.exists() === false)
            {
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
              props.findMatch()
            })
          })
          
          
        }

        
        
    })
    return unsubscribe
  }, [])

  


  function createNewChat() {
    const newChat = {
        body:{
          user1:"壯祖豪",
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
      nowWaitID = (newWaitRef.id)
      console.log("創建吉米了")
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