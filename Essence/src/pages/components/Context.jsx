import React from "react";



const Context = (title="", desc="", className="") => {
    return (
        <>
        <div className={`context ${className}`} >
            <h1 className="context-title">{title}</h1>
            <hr/>
            <p className="context-desc">{desc}</p>
        </div>
        </>
    );
}

export default Context;