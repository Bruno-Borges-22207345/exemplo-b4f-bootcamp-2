import { useState } from "react"

function validateEmail(email) {
    const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return EMAIL_REGEX.test(email)
}

function checkPasswordStrength(password) {
    if (password.length < 8) return 0;
    const regexes = [
        /[a-z]/,
        /[A-Z]/,
        /[0-9]/,
        /[~!@#$%^&*)(+=._-]/
    ]
    return regexes
        .map(re => re.test(password))
        .reduce((score, t) => t ? score + 1 : score, 0)
}

export function SignupForm({onSubmit}) {
    const [submit, setSubmit] = useState({email: '', emailerror: false, pass: '', passerror: false, passconf: '', passconferror: false, terms: false, termserror: false, comms: false, showpw: false, showcpw: false});
    const handleSubmit = (e) => {
        if(allDataIsValid(submit)){
            return submit;
        }
        else{
            e.preventDefault();
            checkForErrors(submit);
        }
    }

    const checkForErrors = (s) => {
        if(!validateEmail(s.email)){
            setSubmit((s)=> {return {...s, emailerror: true}})
        }

        if(validateEmail(s.email)){
            setSubmit((s)=> {return {...s, emailerror: false}})
        }

        if(checkPasswordStrength(s.pass)!==4){
            setSubmit((s)=> {return {...s, passerror: true}})
        }

        if(checkPasswordStrength(s.pass)===4){
            setSubmit((s)=> {return {...s, passerror: false}})
        }

        if(s.pass!==s.passconf){
            setSubmit((s)=> {return {...s, passconferror: true}})
        }

        if(s.pass===s.passconf){
            setSubmit((s)=> {return {...s, passconferror: false}})
        }

        if(!s.terms){
            setSubmit((s)=> {return {...s, termserror: true}})
        }

        if(s.terms){
            setSubmit((s)=> {return {...s, termserror: false}})
        }
    }

    const allDataIsValid = (s) => {
        return (validateEmail(s.email) && checkPasswordStrength(s.pass)===4 && s.pass === s.passconf && s.terms)
    }

    const passConfErrorChecker = () => {
        if(submit.passconf.length === 0)
        {
            return <div>Por favor introduza novamente a sua password.</div>
        }
        else if(submit.pass !== submit.passconf)
        {
            return <div>As passwords nao coincidem.</div>
        }
        
    }

    return (
        <div>
            <div>
                <h1>SignupForm</h1>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div>
                        <label>
                            Email:
                            <input data-testid = "email"
                                type="text"
                                onChange={(e) => {setSubmit((s)=> {return {...s, email: e.target.value};})}}
                            required />
                            <span>{validateEmail(submit.email) && 'valid'}</span>
                            {submit.emailerror && <div>Por favor introduza um endereco de email valido.</div>}
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input data-testid = "password"
                                type={submit.showpw ? "text" : "password"}
                                onChange={(e) => {setSubmit((s)=> {return {...s, pass: e.target.value};})}}
                            required/>
                            <button data-testid = "password-toggle" type = "button" onClick={() => {setSubmit((s)=> {return {...s, showpw: !s.showpw};})}}>Show</button>
                            <span>Strength: {checkPasswordStrength(submit.pass)}</span>
                            {submit.passerror && <div>Por favor introduza a sua password.</div>}
                        </label>
                    </div>
                    <div>
                        <label>
                            Confirm Password:
                            <input data-testid = "passwordConfirmation"
                            type={submit.showcpw ? "text" : "password"} onChange={(e) => {setSubmit((s)=> {return {...s, passconf: e.target.value};})}} required/>
                            <button data-testid = "passwordConfirmation-toggle" type = "button" onClick={() => {setSubmit((s)=> {return {...s, showcpw: !s.showcpw};})}}>Show</button>
                            <span>{(submit.pass === submit.passconf && checkPasswordStrength(submit.pass) === 4) && 'the passwords match'}</span>
                            {submit.passconferror && passConfErrorChecker()}
                        </label>
                    </div>
                    <div>
                        <label>
                            Accept Terms:
                            <input type="checkbox" onChange={(e) => {setSubmit((s)=> {return {...s, terms: e.target.checked};})}} required/>
                            <span>{(!submit.terms) && '*'}</span>
                        </label>
                    </div>
                    <div>
                        <label>
                            Accept Communication:
                            <input type="checkbox" onChange={(e) => {setSubmit((s)=> {return {...s, comms: e.target.checked};})}} />
                        </label>
                    </div>
                    <input data-testid = "submit" type="submit" value="Send" />
                </form>
            </div>
        </div>
    )
}