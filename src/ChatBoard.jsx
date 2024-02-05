import React  from "react";
import './ChatBoard.css';

export default function ChatBoard()
{
    const [inputValue,changeInputValue] = React.useState("")

    function changeInput(event){
        changeInputValue(event.target.value)
        console.log(event.target.value)
    }

    return (
        <div>
            <div className="display-panel">

            </div>
            <div className="user-input-space">
                <textarea
                    type = "text"
                    id="nowInput"
                    value = {inputValue}
                    onChange = {changeInput}
                    className="input-field"
                />
               <button className="submit-text">
                送出
               </button>
            </div>
        </div>
    )
}