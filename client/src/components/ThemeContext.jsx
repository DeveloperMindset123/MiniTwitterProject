import { createContext } from 'react';
import '../styles/theme.css';  //css file for designing the toggle functionalities for light vs dark mode


export const themes = {
    dark: "",
    light: "white-content",
};


export const ThemeContext = createContext({
    theme: themes.dark,
  changeTheme: () => {},
});
