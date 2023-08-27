import React, { useState } from 'react'

function Signup(props) {

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:6000/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        const json = await response.json()
        console.log(json);
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className='form'>
            <form onSubmit={handleSubmit} id='form' action="">
                <h2>Create Account</h2>
                <div className="input">
                    <label htmlFor="">Enter Your Name</label>
                    <input value={credentials.name} onChange={onChange} type="text" name="name" id="name" />
                    <label htmlFor="">Enter Your Email</label>
                    <input value={credentials.email} onChange={onChange} type="email" name="email" id="email" />
                    <label htmlFor="">Enter Your Password</label>
                    <div>
                        <input value={credentials.password} onChange={onChange} type="password" name="password" id="password" />
                        <i onClick={props.seePass} className="far fa-eye" id="togglePassword" style={{ marginLeft: '-30px', cursor: 'pointer' }}></i>
                    </div>
                </div>
                <button type="submit">Sign up</button>
            </form>
        </div>
    )
}

export default Signup