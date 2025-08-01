import React, { useState, useEffect } from "react";

const Cursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const moveCursor = (e) => {
            setPos({ x: e.clientX - 50, y: e.clientY - 50 });
        };

        document.body.addEventListener('mousemove', moveCursor);

        return () => {
            document.body.removeEventListener('mousemove', moveCursor);
        };
    }, []);

    return (
        <div className="cursor">
            <div className="blur" style={{
                position: 'fixed',
                top: pos.y + 'px',
                left: pos.x + 'px',
                filter: 'blur(30px)',
                fontSize: '2em',
                color: 'white',
                transition: 'top 0.1s ease, left 0.1s ease', // Added transition for smooth movement
            }}>N30</div>
        </div>
    );
}

export default Cursor;