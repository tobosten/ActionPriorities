import React, { createContext, useState } from 'react';

export const ColorModeContext = createContext(null)

export const ProjectContextProvider = ({ children }) => {

    const [darkMode, setDarkMode] = useState(true)

    return (
        <ColorModeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ColorModeContext.Provider>
    )
}