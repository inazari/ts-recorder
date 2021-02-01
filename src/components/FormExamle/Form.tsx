import React, {useState} from 'react'

export const Form = () => {

    const [email, setEmail] = useState<string>()

    const [] = useState('test')

    const handlerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {value} = e.target;
        setEmail(value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        alert(`thanks, email ${email} has been added to our mailing list `)
    }

    return <form onSubmit={handleSubmit}>
        <input type="text" onChange={handlerEmailChange}/>
        <button type='submit'>subscribe</button>
        <pre>
            {email}
        </pre>
    </form>
}
