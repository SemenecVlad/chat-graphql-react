import React, { Component } from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { createBrowserHistory } from 'history';

import { Router, Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <ApolloProvider client={this.props.client}>
        <Router history={history}>
          <Layout />
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
