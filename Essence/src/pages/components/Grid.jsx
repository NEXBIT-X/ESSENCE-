import React from "react";



const Grid=({ children, className = '', ...props }) => {
 
    return (
        <>
        <div className={`grid ${className}`} {...props} >
        {children}
        </div>
        </>
    );
}

export default Grid;