import React from 'react';

const Icon = ({ icon="", fill = 'white', className = '' }) => {
    switch(icon){
        case  'search':
            return(
                <div className={`icon ${className}`}>
                <svg width="50px" height="50px" viewBox="0 0 25.00 25.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 11.1455C5.49956 8.21437 7.56975 5.69108 10.4445 5.11883C13.3193 4.54659 16.198 6.08477 17.32 8.79267C18.4421 11.5006 17.495 14.624 15.058 16.2528C12.621 17.8815 9.37287 17.562 7.3 15.4895C6.14763 14.3376 5.50014 12.775 5.5 11.1455Z" stroke={fill} stroke-width="1.175" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.989 15.4905L19.5 19.0015" stroke={fill} stroke-width="1.175" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </div>
            )
            break;
        case 'close':
            return(
                <div className={`icon ${className}`}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_SM"> <path id="Vector" d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16" stroke={fill} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                </div>
            )
            break;
        
        case 'home':
            return(
                <div className={`icon ${className}`}>
                  <img src="/home.svg" alt="Home Icon" />
                </div>
            )
            break;
        case 'mosaic':
            return(
                <div className={`icon ${className}`}>
                    <img src="/mosaic.svg" alt="Mosaic Icon" />
                </div>
            )
            break;
        default:
            return null;
}
};

export default Icon;