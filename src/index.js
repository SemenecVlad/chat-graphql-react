import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

export const client = new ApolloClient({
    uri: 'https://api.graph.cool/simple/v1/cji3486nr3q4b0191ifdu8j6x'
});


ReactDOM.render(<App client={client} />, document.getElementById('root'));
registerServiceWorker();
