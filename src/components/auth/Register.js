import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class Register extends Component {
    state = {
        email: '',
        password: '',
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
        let { email, password, name } = this.state;
        await this.props.registerMutation({ variables: {
            email, password, name
        }}).then((data) => {
            console.log(data)
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
        let { email, password, name, error } = this.state;
        return (
            <div className='container'>
                <h2>Register User</h2>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <div><label htmlFor="name">Name:</label></div>
                        <input onChange={e => this.setState({name: e.target.value, error: ''})} value={name} name="name" autoComplete='name' type="text" placeholder="Your Name..." required />
                    </div>
                    <div>
                        <div><label htmlFor="email">Email:</label></div>
                        <input onChange={e => this.setState({email: e.target.value, error: ''})} value={email} name="email" autoComplete='email' type="email" placeholder="Your Email..." required/>
                    </div>
                    <div>
                        <div><label htmlFor="password">Password:</label></div>
                        <input onChange={e => this.setState({password: e.target.value})} value={password} autoComplete='current-password' name="password" type="password" placeholder="Your Password..." required/>
                    </div>
                    <button>Create Account</button>
                </form>
                { error ? <div>{error}</div> : ''}
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