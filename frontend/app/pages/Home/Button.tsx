//create a reusable button component, this can be applied for customUser
import { Transition } from '@headlessui/react';
import { Fragment, useId, useState } from 'react';

const Button = () => {
    const [show, setShow] = useState(false);  //create a react hook
    const [firstName, setFirstName] = useState(false);
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    return (
        <>
            <div className='mx-auto my-16 flex max max-w-md justify-start'>
                <button onClick={() => setShow(!show)}>Register</button> {/**Note: this needs to be changed later */}
            </div>
            <Transition.Root <show={show}>
                <BackgroundLayer /> {/*Note: This function is defined later as well */}
                <SlideOverLayer>
                    <h2 className='my-6 text-2xl font-bold'>Register</h2>
                    <div className='space-y-4'>
                        <FadeIn delay="delay-[300ms]"> {/*Note: The function for fade in is defined later*/}
                            <Input {}
                                label="First Name" /**This will serve as text placeholders */
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </FadeIn>
                        {/**Just as we made input for first name, we will need to make input for last name, email and possibillity phone number */}
                        <FadeIn delay="delay-[600ms]">
                            <Input 
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </FadeIn>
                        <FadeIn delay="delay-[800ms]">
                            <Input 
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}    
                            />
                        </FadeIn>
                        </div>
                        <div className='my-6'>
                            <FadeIn delay="delay - [900ms]">
                                <Button onClick={() => setShow(false)}>Close</Button>  {/**This will allow us to exit out of the popup window */}
                            </FadeIn>
                        </div> 
                </SlideOverLayer>
            </Transition.Root>
        </>
    )
}

//define the background layer component
const BackgroundLayer = () => {
    <Transition.Child
        enter="transition-opacity ease-in-out duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out-duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >

        <div className='fixed inset-0 bg-gray-500 opacity-75' />
    </Transition.Child>
}

const SlideOverLayer = ({children}) => {
    <Transition.Child
        as={Fragment}
        enter="transform transition ease-in-out duration-500"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-500 delay-100"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        >
            <div className='fixed inset-0 overflow-hidden'>
                <div className='absolute inset-0 overflow-hidden'>
                    <div className='pointer events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                        <div className='pointer-events-auto w-screen max-w-2xl'>
                            <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
                                <div className='px-4 sm:px-6'>{children}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition.Child>
}

const FadeIn = ({ delay, children }) => {
    <Transition.Child
        enter={`transition-all ease-in-out duration-700 ${delay}`}
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
        {children}
    </Transition.Child>
}

export default Button;