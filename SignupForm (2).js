import { useState, useEffect } from "react"

import styles from "./SignupForm.module.css"

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

export function SignupForm({ onSubmit }) {
    const [submit, setSubmit] = useState({
        email: '',
        emailerror: false,
        pass: '',
        passerror: false,
        passconf: '',
        passconferror: false,
        terms: false,
        termserror: false,
        comms: false,
        commserror: undefined,
        showpw: false,
        showcpw: false
    });

    const handleSubmit = (e) => {
        if(allDataIsValid(submit)){
            onSubmit({ email: submit.email, password: submit.pass, passwordConfirmation: submit.passconf, acceptsTerms: submit.terms, acceptsCommunications: submit.comms });
        }
        checkForErrors(submit);
        e.preventDefault();
    }

    const allDataIsValid = (s) => {
        return (validateEmail(s.email) && checkPasswordStrength(s.pass) === 4 && s.pass === s.passconf && s.terms)
    }

    const checkForErrors = (s) => {
        setSubmit((s) => { 
        let nvs = {...s}
        if(!validateEmail(s.email))
        {
            nvs = { ...nvs, emailerror: true } 
        }
        if (validateEmail(s.email)) {
            nvs = { ...nvs, emailerror: false }
        }
        if (validateEmail(s.email)) {
            nvs = { ...nvs, emailerror: false }
        }
        if (validateEmail(s.email)) {
            nvs = { ...nvs, emailerror: false }
        }
        if (checkPasswordStrength(s.pass) !== 4) {
            nvs = { ...nvs, passerror: true }
        }
        if (checkPasswordStrength(s.pass) === 4) {
            nvs = { ...nvs, passerror: false }
        }
        if (s.pass !== s.passconf) {
            nvs = { ...nvs, passconferror: true }
        }
        if (s.pass !== s.passconf) {
            nvs = { ...nvs, passconferror: true }
        }
        if (s.pass === s.passconf) {
            nvs = { ...nvs, passconferror: false }
        }
        if (!s.terms) {
            nvs = { ...nvs, termserror: true }
        }
        if (s.terms) {
            nvs = { ...nvs, termserror: false }
        }
        if (!s.comms) {
            nvs = { ...nvs, commserror: true }
        }
        if (s.comms) {
            nvs = { ...nvs, commserror: false }
        }
        return nvs;
        })
    }

    const passErrorChecker = () => {
        if (submit.pass.length === 0) {
            return (
                <div data-testid="password-error">
                    Por favor introduza a sua password.
                </div>
            )
        }

        if (submit.pass.length < 8) {
            return (
                <div data-testid="password-error">
                    A sua password deve ter no mínimo 8 caracteres.
                </div>
            )
        }

        if (checkPasswordStrength(submit.pass) < 4) {
            return (
                <div data-testid="password-error">
                    A sua password deve ter pelo menos um número, uma mínuscula, uma maiúscula e um símbolo.
                </div>
            )
        }
        return true
    }

    const passConfErrorChecker = () => {
        if (submit.passconf.length === 0) {
            return (<div data-testid="passwordConfirmation-error">Por favor introduza novamente a sua password.</div>)
        }
        else if (submit.pass !== submit.passconf) {
            return (<div data-testid="passwordConfirmation-error">As passwords não coincidem.</div>)
        }
    }

    const emailErrorChecker = () => {
        if (submit.email.length === 0) {
            return (<div data-testid="email-error">Por favor introduza o seu endereço de email.</div>)
        }

        if (!validateEmail(submit.email)) {
            return (<div data-testid="email-error">Por favor introduza um endereço de email válido.</div>)
        }
    }

    const termsErrorChecker = () => {
        if (!submit.terms) {
            return (<div data-testid="acceptsTerms-error">Tem de aceitar os termos e condições para criar a sua conta.</div>)
        }
    }

    const commsErrorChecker = () => {
        if (!submit.comms) {
            return (<div data-testid="acceptsCommunications-error"></div>)
        }
    }

    useEffect (() => {
        checkForErrors(submit);
    },[]);

    return (
        <div>
            <div>
                <h1 className = {styles.signUpTitle}>Sign Up</h1>
                <form method="get" onSubmit={(e) => handleSubmit(e)}>
                    <div>
                        <label>
                            Email:
                            <input data-testid="email"
                                type="text"
                                onChange={(e) => { 
                                checkForErrors({ ...submit, email: e.target.value});
                                setSubmit((s) => { 
                                return { ...s, email: e.target.value}; }) }}
                            />
                            <span>{validateEmail(submit.email) && 'valid'}</span>
                            {submit.emailerror && emailErrorChecker()}
                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input data-testid="password"
                                type={submit.showpw ? "text" : "password"}
                                onChange={(e) => {
                                checkForErrors({ ...submit, pass: e.target.value});
                                setSubmit((s) => { return { ...s, pass: e.target.value}; }) }}
                            />
                            <button data-testid="password-toggle" type="button" onClick={() => { setSubmit((s) => {
                            return { ...s, showpw: !s.showpw }; }) }}>Show</button>
                            <span data-testid="password-strength">{checkPasswordStrength(submit.pass)}</span>
                            {submit.passerror && passErrorChecker()}
                        </label>
                    </div>
                    <div>
                        <label>
                            Confirm Password:
                            <input data-testid="passwordConfirmation"
                                type={submit.showcpw ? "text" : "password"} onChange={(e) => {
                                checkForErrors({ ...submit, passconf: e.target.value});
                                setSubmit((s) => { return { ...s, passconf: e.target.value}; }) }} />
                            <button data-testid="passwordConfirmation-toggle" type="button" onClick={() => { setSubmit((s) => { return { ...s, showcpw: !s.showcpw }; }) }}>Show</button>
                            <span>{(submit.pass === submit.passconf && checkPasswordStrength(submit.pass) === 4)}</span>
                            {submit.passconferror && passConfErrorChecker()}
                        </label>
                    </div>
                    <div>
                        <label>
                            Accept Terms:
                            <input data-testid="acceptsTerms"
                                type="checkbox" onChange={(e) => { 
                                checkForErrors({ ...submit, terms: e.target.checked});
                                setSubmit((s) => { return { ...s, terms: e.target.checked}; }) }} />
                            <span>{(!submit.terms) && '*'}</span>
                            {submit.termserror && termsErrorChecker()}
                        </label>
                    </div>
                    <div>
                        <label>
                            Accept Communication:
                            <input data-testid="acceptsCommunications"
                                type="checkbox" onChange={(e) => {
                                checkForErrors({ ...submit, comms: e.target.checked});
                                setSubmit((s) => { return { ...s, comms: e.target.checked}; }) }} />
                            {submit.commserror && commsErrorChecker()}
                        </label>
                    </div>
                    <button data-testid="submit" type="submit" value="Send">Send</button>
                </form>
            </div>
        </div>
    )
}