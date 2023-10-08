'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LoginButton {
    label: string;
    route: string;
}
//depending on the button the user chooses, the user will be directed to the appropriate page, each page needs to be designed sligtly differently
const LoginButton: LoginButton[] = [
    {
        label: "Administrator Login",
        route: "frontend/app/pages/admin/adminLogin.tsx", //points to the adminLogin page
    },
    {
        label: "Corporate Login",
        route: "frontend/app/pages/corporate/corporateLogin.tsx"  //points to the corporate login page
    },
    {  
        label: "Regular Login",
        route: "frontend/app/pages/regular/regularLogin.tsx"  //points to the regular user login page
    },
];

//note: React.FC is a type that ships with React's typescript types. It represents the type of a functional component, which is the building block of most modern React apps

const Homepage: React.FC = () => {
    const router = useRouter();
    const handleClick = (Index: number) => {  //note: needed to change the parameter values from {Index:number}
        router.push(LoginButton[Index].route);
    };
    return (  //this is where the HTML rendering occurs
        <div>
            <h1>Homepage</h1>
            <ul>
                {LoginButton.map((loginButton, index) => (
                    <li key={loginButton.label}>
                        <button onClick={() => handleClick(index)}>
                            {loginButton.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Homepage;

//look into the following tutorial for button animation using next.js and tailwindcss: https://markustripp.medium.com/animations-with-tailwind-css-c47534e57a18

