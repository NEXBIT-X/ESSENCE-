import React,{useState} from "react";



const Button = ({ text, onClick, className = '', ...props }) => {
    return (
        <button className={`btn ${className}`} onClick={onClick} {...props}>
           {text}
        </button>
    );
}

export default Button;