import React  from "react";
import './ChatBoard.css';
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
import {chatCollection, db } from "./firebase"

export default function ChatBoard(props)
{
    const [inputValue,changeInputValue] = React.useState("")
    const [chatContent,setChatContent] = React.useState([])
    const [userCount,setUserCount] = React.useState(2)
    
    const displayContent = chatContent.map((data,index)=>{
        if(data.id == 3)
        {
            return (<div key = {"content-" + index} className="content-container">
                <div>
                    {data.content}
                </div>
            </div>)
        }
        return (<div key = {"content-" + index} className="content-container">
            {(props.userID === data.id)?
            <div className="user-content">
                {data.content}
            </div>
            :
            <div className="other-content">
                {data.content}
            </div>}
        </div>)
    })

    React.useEffect(() => {
        const docRef = doc(db,"chatList",props.chatRoomID)
        const unsubscribe = onSnapshot(docRef, function (snapshot) {
            if(snapshot.exists())
            {
                const chatContentArr = snapshot.data().chatContent
                setChatContent(chatContentArr)
                setUserCount(snapshot.data().user)
                console.log(chatContentArr)
            }
        })
        return unsubscribe
    }, [])

    React.useEffect(()=>{
        const container = document.getElementById("display-panel")
        if (container) {
            container.scrollTop = container.scrollHeight;
          }
        
    },[chatContent])
    

    function changeInput(event){
        changeInputValue(event.target.value)
        console.log(event.target.value)
    }

    function backToStart()
    {
        if(userCount === 1)
        {
            const docRef = doc(db, "chatList", props.chatRoomID);
            deleteDoc(docRef)
            .then(() => {
                console.log("Document successfully written!");
                props.backToStart();
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
        else
        {
            const docRef = doc(db, "chatList", props.chatRoomID);
            const newData = {
                chatContent:chatContent,
                user:1
            }
            setDoc(docRef, newData)
            .then(() => {
                console.log("Document successfully written!");
                props.backToStart();
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
    }

    function sendMessage(){
        if(inputValue === "")
        {
            return
        }
        const docRef = doc(db,"chatList",props.chatRoomID)
        getDoc(docRef)
        .then((data) => {
            let nowChat = data.data().chatContent
            nowChat.push({id:props.userID,content:inputValue})
            setDoc(docRef,{chatContent:nowChat},{merge:true})
            changeInputValue("")
        })
        
    }

    React.useEffect(function(){
        if(userCount === 1)
        {
            const docRef = doc(db,"chatList",props.chatRoomID)
            getDoc(docRef)
            .then((data) => {
                let nowChat = data.data().chatContent
                nowChat.push({id:3,content:"他離開了 去找別人聊吧"})
                setDoc(docRef,{chatContent:nowChat},{merge:true})
            })
        }
    },[userCount])

    React.useEffect(() => {

    
        window.addEventListener('beforeunload', backToStart);
    
        return () => {
          window.removeEventListener('beforeunload', backToStart);
        };
      }, [userCount,chatContent]);

    return (
        <div className="display-container">
            <button className="back-to-start" onClick={backToStart}>
                不跟他聊了
            </button>
            <div className="display-panel" id="display-panel" >
                {(displayContent.length>0) && displayContent}
            </div>
            <div className="user-input-space">
                <textarea
                    type = "text"
                    id="nowInput"
                    value = {inputValue}
                    onChange = {changeInput}
                    className="input-field"
                />
               <button className="submit-text" onClick={sendMessage}>
                送出
               </button>
            </div>
        </div>
    )
}