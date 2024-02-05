import React  from "react";

export default function FindMatching(props)
{
    setTimeout(props.findMatch,1000)
    return (
        <div className='background'>
          <button className='start-button' onClick={props.endFind}>
            不找了
          </button>
        </div>
    )
}