import router, { useRouter } from "next/router";

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
    const router = useRouter(); //an useful React hook that allows for modification of href to direct pages dynamically based on certain interactions, in this case, upon the button being clciked, user is to be redirected to the appropriate homepage --> think of this as a double linked list

    const handleClick = {loginButtonIndex: number} => {
        router.push(LoginButton[loginButtonIndex].route);
    };

function handleClick(index: number): void {
    throw new Error("Function not implemented.");
}

    return (  //this is where the HTML rendering occurs
        <div>
            <h1>Homepage</h1>
            <ul>
                {LoginButton.map((loginButton, index) => (
                    <li key={loginButton.label}>
                        <button onClick={() => handleClick(index)}>
                            {/**Continue here */}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    )
}

