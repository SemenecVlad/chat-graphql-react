import React from 'react';
import ReactDOM from 'react-dom';
//import ApolloClient from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import {gql} from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

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
})


// import ApolloClient, {createNetworkInterface} from 'apollo-client';
// import {gql} from 'graphql-tag';
// import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// const networkInterface = createNetworkInterface({
//     uri: 'https://api.graph.cool/simple/v1/cji3486nr3q4b0191ifdu8j6x' // Your GraphQL endpoint
// });
   
//    // Create WebSocket client
// const wsClient = new SubscriptionClient(`wss://subscriptions.us-west-2.graph.cool/v1/cji3486nr3q4b0191ifdu8j6x`, {
//     reconnect: true,
//     connectionParams: {
//         // Pass any arguments you want for initialization
//     }
// });
   
//    // Extend the network interface with the WebSocket
// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//     networkInterface,
//     wsClient
// );
   
//    // Finally, create your ApolloClient instance with the modified network interface
// const apolloClient = new ApolloClient({
//     networkInterface: networkInterfaceWithSubscriptions
// });




ReactDOM.render(<App client={client} />, document.getElementById('root'));
registerServiceWorker();
