import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

export const client = new ApolloClient({
    uri: 'https://api.graph.cool/simple/v1/cjhujp4fe1a1x0149hkdroall'
});


ReactDOM.render(<App client={client} />, document.getElementById('root'));
registerServiceWorker();
