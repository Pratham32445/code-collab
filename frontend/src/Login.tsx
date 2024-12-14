import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import axios from "axios";
import e from 'express';
import { useState } from 'react';

const Login = () => {
    const [auth, setAuth] = useState({
        email: "",
        password: ""
    });
    const signUp = async () => {
        const res = await axios.post("http://localhost:3001/api/v1/user/signup", { email: auth.email, password: auth.password }, { withCredentials: true });
        console.log(res);
    }
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <p>Signup</p>
                <Input onChange={(e) => setAuth({ ...auth, email: e.target.value })} type='email' placeholder='Email' />
                <Input onChange={(e) => setAuth({ ...auth, password: e.target.value })} type="password" placeholder='Password' />
                <Button onClick={signUp}>Signup</Button>
            </div>
        </div>
    )
}

export default Login