import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'mobx-react';
import MainStore from './store/MainStore';

const httpLink = new HttpLink({
    uri: 'https://api.graph.cool/simple/v1/cji3486nr3q4b0191ifdu8j6x'
});

const wsLink = new WebSocketLink({
    uri: 'wss://subscriptions.us-west-2.graph.cool/v1/cji3486nr3q4b0191ifdu8j6x',
    options: {
        reconnect: true
    }
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});


const Root = (
    <Provider MainStore={MainStore}>
        <App client={client} />
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
