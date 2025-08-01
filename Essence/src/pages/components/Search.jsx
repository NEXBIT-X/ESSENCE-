import React, { useState } from "react";
import Icon from "./Icon";

const Search = ({ theme="black", placeholder="Search mosaics...", onSearch, className = "" }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setSearchValue("");
        if (onSearch) {
            onSearch("");
        }
    };

    return (
        <div className={`Search ${className}`}>
            <input 
                type="text" 
                placeholder={placeholder} 
                className="search-input"
                value={searchValue}
                onChange={handleSearch}
            />
            <button className="search-button">
                <Icon icon="search" fill={theme} className="search-icon" />
            </button>
            {searchValue && (
                <button className="search-clear" onClick={handleClear}>
                    <Icon icon="close" fill={theme} className="close-icon" />
                </button>
            )}
        </div>
    );
};

export default Search;

