import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Welcome extends Component {
    render() {
        return(
            <div style={styles.container} className='container'>
                <h1 style={styles.title}>Welcome to Chat app!</h1>
                <Link style={styles.button} to='/chat'>Start chatting</Link>
            </div>
        )
    }
}

const styles = {
    container: {
        margin: '0 auto'
    },
    title: {
        textAlign: 'center'
    },
    button: {
        textAlign: 'center'
    }
}