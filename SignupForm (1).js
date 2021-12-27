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
        if (allDataIsValid(submit)) {
            onSubmit({ email: submit.email, password: submit.pass, passwordConfirmation: submit.passconf, acceptTerms: submit.terms, acceptCommunications: submit.comms });
        }
        else {
            checkForErrors(submit);
            e.preventDefault();
        }
    }

    const checkForErrors = (s) => {
        if (!validateEmail(s.email)) {
            setSubmit((s) => { return { ...s, emailerror: true } })
        }

        if (validateEmail(s.email)) {
            setSubmit((s) => { return { ...s, emailerror: false } })
        }

        if (checkPasswordStrength(s.pass) !== 4) {
            setSubmit((s) => { return { ...s, passerror: true } })
        }

        if (checkPasswordStrength(s.pass) === 4) {
            setSubmit((s) => { return { ...s, passerror: false } })
        }

        if (s.pass !== s.passconf) {
            setSubmit((s) => { return { ...s, passconferror: true } })
        }

        if (s.pass === s.passconf) {
            setSubmit((s) => { return { ...s, passconferror: false } })
        }

        if (!s.terms) {
            setSubmit((s) => { return { ...s, termserror: true } })
        }

        if (s.terms) {
            setSubmit((s) => { return { ...s, termserror: false } })
        }

        if (!s.comms) {
            setSubmit((s) => { return { ...s, commserror: true } })
        }

        if (s.comms) {
            setSubmit((s) => { return { ...s, commserror: false } })
        }
    }

    const allDataIsValid = (s) => {
        return (validateEmail(s.email) && checkPasswordStrength(s.pass) === 4 && s.pass === s.passconf && s.terms)
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
        if (passErrorChecker() === true) {
            if (submit.passconf.length === 0) {
                return (<div data-testid="passwordConfirmation-error">Por favor introduza novamente a sua password.</div>)
            }
            else if (submit.pass !== submit.passconf) {
                return (<div data-testid="passwordConfirmation-error">As passwords não coincidem.</div>)
            }
            return {}
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

    return (
        <div>
            <div>
                <h1>SignupForm</h1>
                <form method="get" onSubmit={(e) => handleSubmit(e)}>
                    <div>
                        <label>
                            Email:
                            <input data-testid="email"
                                type="text"
                                onChange={(e) => { setSubmit((s) => { return { ...s, email: e.target.value, emailerror: false }; }) }}
                            />
                            <span>{validateEmail(submit.email) && 'valid'}</span>

                        </label>
                    </div>
                    <div>
                        <label>
                            Password:
                            <input data-testid="password"
                                type={submit.showpw ? "text" : "password"}
                                onChange={(e) => { setSubmit((s) => { return { ...s, pass: e.target.value, passerror: false, passconferror: false }; }) }}
                            />
                            <button data-testid="password-toggle" type="button" onClick={() => { setSubmit((s) => { return { ...s, showpw: !s.showpw }; }) }}>Show</button>
                            <span data-testid="password-strength">{checkPasswordStrength(submit.pass)}</span>

                        </label>
                    </div>
                    <div>
                        <label>
                            Confirm Password:
                            <input data-testid="passwordConfirmation"
                                type={submit.showcpw ? "text" : "password"} onChange={(e) => { setSubmit((s) => { return { ...s, passconf: e.target.value, passconferror: false }; }) }} />
                            <button data-testid="passwordConfirmation-toggle" type="button" onClick={() => { setSubmit((s) => { return { ...s, showcpw: !s.showcpw }; }) }}>Show</button>
                            <span>{(submit.pass === submit.passconf && checkPasswordStrength(submit.pass) === 4)}</span>

                        </label>
                    </div>
                    <div>
                        <label>
                            Accept Terms:
                            <input data-testid="acceptsTerms"
                                type="checkbox" onChange={(e) => { setSubmit((s) => { return { ...s, terms: e.target.checked, termserror: false }; }) }} />
                            <span>{(!submit.terms) && '*'}</span>

                        </label>
                    </div>
                    <div>
                        <label>
                            Accept Communication:
                            <input data-testid="acceptsCommunications"
                                type="checkbox" onChange={(e) => { setSubmit((s) => { return { ...s, comms: e.target.checked, commserror: false }; }) }} />
                        </label>
                    </div>
                    <input data-testid="submit" type="submit" value="Send" />
                </form>
                <div>
                    {submit.emailerror && emailErrorChecker()}
                    {submit.passerror && passErrorChecker()}
                    {submit.passconferror && passConfErrorChecker()}
                    {submit.termserror && termsErrorChecker()}
                    {submit.commserror && commsErrorChecker()}
                </div>
            </div >
        </div >
    )
}