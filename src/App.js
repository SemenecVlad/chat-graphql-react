import React, { Component } from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { createBrowserHistory } from 'history';

import { Router, Route, Switch } from 'react-router-dom';

import Layout from './components/Layout';

const history = createBrowserHistory();

// const ExchangeRates = () => (
//   <Query
//     query={gql`
//       {
//         rates(currency: "USD") {
//           currency
//           rate
//         }
//       }
//     `}
//   >
//     {
//       ({loading, error, data, refetch }) => {
//         if (loading) return <p>Loading</p>;
//         if (error) return <p>Error: :(</p>;
        
//         return data.rates.map(({ currency, rate }) => (
//           <div key={currency}>

//             <p>{`${currency}: ${rate}`}</p>
//           </div>
//         ));
//       }
//     }
//   </Query>
// )

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
