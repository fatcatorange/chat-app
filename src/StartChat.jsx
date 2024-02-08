import React  from "react";

export default function StartChat(props)
{
    return (
        <div className='background'>
          <div className="title">
            HUSH HUB
          </div>
          <button className='start-button' onClick={props.startFind}>
            開始聊天
          </button>
        </div>
    )
}