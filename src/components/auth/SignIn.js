import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class SignIn extends Component {
    state = {
        email: '',
        password: '',
        error: ''
    }
    componentWillMount() {
        if (localStorage.getItem('token') !== null) {
            this.props.history.push('/chat')
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let { email, password } = this.state;
        await this.props.signInMutation({ variables: {
            email, password
        }}).then(({data: { signinUser: { token, user: {id, name } }}}) => {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', id);
            localStorage.setItem('userName', name);
            this.props.history.push('/chat')
            console.log(name,id,token)
        }).catch(error => {
            this.setState({
                error: 'No user found with that information'
            })
        });
        
        console.log(this.state.email, this.state.password)
    }

    render() {
        let { email, password, error } = this.state;
        return (
            <div className='container'>
                <h2 style={{textAlign:'center'}}>Sign In</h2>
                <form style={{
                    width: '25%',
                    margin: '0 auto',
                    textAlign: 'center'
                    }}
                    onSubmit={this.handleSubmit}>
                    <div>
                        <label className="input-label" htmlFor="email">Email:</label>
                        <input className="input-field" onChange={e => this.setState({email: e.target.value, error: ''})} value={email} name="email" type="email" placeholder="Your Email..." />
                    </div>
                    <div>
                        <label className="input-label" htmlFor="password">Password:</label>
                        <input className="input-field" onChange={e => this.setState({password: e.target.value, error: ''})} value={password} name="password" type="password" placeholder="Your Password..." />
                    </div>
                    <button className='input-submit'>Sign In</button>
                </form>
                {(error !== '') ? <div className='form-error'>{error}</div> : ''}
            </div>
        )
    }
}

const SIGN_IN_MUTATION = gql`
    mutation SignIn($email: String!, $password: String!) {
        signinUser(email: { email: $email, password: $password }) {
            token
            user{
                id
                name
            }
        }
    }
`;

const SignInWithGQL = graphql(SIGN_IN_MUTATION, {name: 'signInMutation'})(SignIn)
export default SignInWithGQL;