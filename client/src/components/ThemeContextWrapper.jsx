/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ThemeContext, themes } from './ThemeContext';  //we have defined them in the same branch so the import statement varies slghtly from the tutorial
import '../styles/theme.css';

export default function ThemeContextWrapper(props) {
    const [theme, setTheme] = useState(themes.dark); //by default the theme will be dark

    function changeTheme(theme) {  //the function that changes themes using useState hook in react
        setTheme(theme);
    }

    useEffect(() => {
        switch (theme) {  //switch statements --> alternative to conditional statements
            case themes.light:
                document.body.classList.add('white-content');
                break;
            
            case themes.dark:
                document.body.classList.remove('white-content');
                break;
            } //this will handle how content is displayed in light vs dark mode       
    }, [theme]);

    return (
        <ThemeContext.Provider value={{theme: theme, changeTheme: changeTheme}}>
            {props.children}  {/**Disabled props validation errors for the entire file */}
        </ThemeContext.Provider>
    )
}

//understanding react hooks: Hooks are a new addition in React 16.8 and allows for the uses of useState and other react features without the need to write a class, the useEffect hooks lets us perform side effects in function components


//something to note in regards to the difference between export default  function and export function --> They are both two ways to export code from a javascript module. Export default is used to export a single value as the default export, while export with named exports is used to export multiple values as named exports
