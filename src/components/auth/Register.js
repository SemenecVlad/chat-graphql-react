import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
    state = {
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        error: ''
    }
    componentWillMount() {
        if (localStorage.getItem('token') !== null) {
            this.props.history.push('/chat')
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let { email, password, passwordConfirm, name } = this.state;
        if (password !== passwordConfirm) {
            this.setState({
                error: 'Passwords must be an equal! Try again!'
            });
            return;
        }
        await this.props.registerMutation({ variables: {
            email, password, name
        }}).then((data) => {
            console.log(data)
            this.props.history.push('/signin')
        }).catch((error) => {
            console.log("ЁБА...",error)
            this.setState({
                error: "Oops! User already exists with that information"
            })
        })
        // this.props.history.push('/chat')
        console.log(name, email, password)
    }

    render() {
        let { email, password, passwordConfirm, name, error } = this.state;
        return (
            <div className='container'>
                <h2 style={{textAlign: 'center'}}>Register User</h2>
                <form style={{width: '25%', margin: '0 auto'}} onSubmit={this.handleSubmit}>
                    <div>
                        <label className='input-label' htmlFor="name">Name:</label>
                        <input className='input-field' onChange={e => this.setState({name: e.target.value, error: ''})} value={name} name="name" autoComplete='name' type="text" placeholder="Your Name..." required />
                    </div>
                    <div>
                        <label className='input-label' htmlFor="email">Email:</label>
                        <input className='input-field' onChange={e => this.setState({email: e.target.value, error: ''})} value={email} name="email" autoComplete='email' type="email" placeholder="Your Email..." required/>
                    </div>
                    <div>
                        <label className='input-label' htmlFor="password">Password:</label>
                        <input className='input-field' onChange={e => this.setState({password: e.target.value})} value={password} autoComplete='current-password' name="password" type="password" placeholder="Your Password..." required/>
                    </div>
                    <div>
                        <label className='input-label' htmlFor="password">Confirm Password:</label>
                        <input className='input-field' onChange={e => this.setState({passwordConfirm: e.target.value})} value={passwordConfirm} autoComplete='current-password' name="password" type="password" placeholder="Your Password..." required/>
                    </div>
                    <button className='input-submit' type='submit'>Create Account</button>
                </form>
                { error ? <div className='form-error'>{error}</div> : ''}
            </div>
        )
    }
}

const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $password: String!, $name: String!) {
        createUser(name:$name,authProvider: {email: {email: $email, password: $password}})
        {
            email
            name
            password
        }
    }
`;

const RegisterWithGQL = graphql(REGISTER_MUTATION, {name: 'registerMutation'})(Register)
export default RegisterWithGQL;