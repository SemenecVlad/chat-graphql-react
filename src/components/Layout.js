import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import Welcome from './Welcome';
import SignIn from './auth/SignIn';
import Register from './auth/Register';
import ChatWindow from './ChatWindow';

export default class Layout extends Component {
    render() {
        return(
            <div className="app-container">
                <Header title="GraphQL Chat App" />
                <Switch>
                    <Route exact path='/' component={Welcome} />
                    <Route exact path='/signin' component={SignIn} />
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/chat' component={ChatWindow} />
                </Switch>
            </div>
        )
    }
}