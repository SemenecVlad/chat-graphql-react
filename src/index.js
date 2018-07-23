import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import gql from 'graphql-tag';
import graphql from 'mobx-apollo';
import { extendObservable, observable, action } from 'mobx';
import { Provider } from 'mobx-react';

import './index.css';
import App from './App';
import Modal from 'react-modal';
import registerServiceWorker from './registerServiceWorker';


// import MainStore from './store/MainStore';

Modal.setAppElement("#root");

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

const ALL_POSTS_QUERY = gql`
  query AllPostsQuery($id: ID!) {
    allPosts(filter: {
        room: {
          id: $id
        }
      }, orderBy: createdAt_ASC) {
      id
      description
      createdAt
      user{
          name
      }
      files{
          url
      }
    },
    _allUsersMeta(filter: {
        rooms_some: {
          id: $id
        }
      }
      ) {
        count
      }
  }
`;

const GET_USERS_NOT_ROOM_MEMBERS = gql`
    query getUsersByRoom($roomId: ID){
    allUsers(filter: {
      rooms_none: {
        id: $roomId
      }
    }) {
      id
      name
    }
  }
`;

const GET_USERS_QUERY = gql`
    query getAllUsers {
        allUsers{
            name
            id
        }
    }
`;

const GET_ROOMS_QUERY = gql`
    query getAllRooms {
        allRooms {
            id
            name
            _usersMeta {
                count
            }
            _postsMeta {
                count
            }
        }
    } 
`;

const GET_ROOMS_BY_USER = gql`
    query getRoomsByUser($currentUserID: ID!) {
        allRooms(filter: {
            users_some: {
                id: $currentUserID
            }
        }) {
            id
            name
            _usersMeta {
                count
            }
            _postsMeta {
                count
            }
        }
    }
`

const ROOMS_SUBSCRIPTION = gql`
  subscription {
    Room {
        mutation
        node {
          id
          name
          users {
            id
            name
            email
          }
        }
        previousValues {
          id
        }
    }
  }
`;

export const POSTS_SUBSCRIPTION = gql`
  subscription($roomId: ID!) {
    Post(filter: {
        node: {
            room: {
                id: $roomId
            }
        }
    }) {
        mutation
        node {
          description
          createdAt
          id
          room {
              name
              id
          }
          user {
            name
          }
          files {
            url
          }
        }
        previousValues {
          id
        }
    }
  }
`;

const DELETE_ROOM_MUTATION = gql`
  mutation DeleteRoom($id: ID!) {
      deleteRoom(id: $id) {
          name
      }
  }
`;


const CREATE_ROOM_MUTATION = gql`
    mutation createRoom($name: String!, $usersIds: [ID!]) {
        createRoom(name: $name, usersIds: $usersIds) {
            id
            name
        }
    }
`

const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($userId: ID! ,$description: String!,$filesIds: [ID!], $roomId: ID!) {
    createPost(userId: $userId ,description: $description, filesIds: $filesIds, roomId: $roomId ) {
      id
      description
      files{
          id
          url
      }
    }
  }
`;

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: ID!) {
    deletePost(id: $id ) {
      id
    }
  }
`;

const REGISTER_MUTATION = gql`
    mutation Register($email: String!, $password: String!, $name: String!) {
        createUser(name:$name,authProvider: {email: {email: $email, password: $password}}, roomsIds: "cjjpigz0e17eo01354las7vgc")
        {
            email
            name
            password
        }
    }
`;

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

const LEAVE_ROOM_MUTATION = gql`
    mutation removeUserFromRoom($userId: ID!, $roomId: ID!) {
    removeFromRoomOnUser(usersUserId:$userId, roomsRoomId:$roomId) {
      roomsRoom {
        name
        id
      }
      usersUser {
        name
        id
      }
    }
  }
`;

const ADD_USER_IN_ROOM_MUTATION = gql`
  mutation addUserToRoom($userId: ID!, $roomId: ID!) {
  addToRoomOnUser(usersUserId: $userId, roomsRoomId: $roomId) {
    roomsRoom {
      name
    }
    usersUser {
      name
    }
  }
}
`;

// Mobx store

const chatStore = new class {
    constructor() {
        extendObservable(this, {
            get allPosts() {
                return graphql({
                    client,
                    query: ALL_POSTS_QUERY,
                    variables: {
                        id: (this.roomId ? this.roomId : this.defaultRoomId)
                    },
                    fetchPolicy: "network-only",
                })
            },
            get postsError() {
                return (this.allPosts.error && this.allPosts.error.message) || null;
            },
            get postsLoading() {
                return this.allPosts.loading;
            },
            get posts() {
                return (this.allPosts.data && this.allPosts.data.allPosts) || [];
            },
            get postsCount() {
                return (this.allPosts.data && this.allPosts.data._allUsersMeta) || [];
            },
            get allUsers() {
                return graphql({
                    client,
                    query: GET_USERS_QUERY
                });
            },
            get usersError() {
                return (this.allUsers.error && this.allUsers.error.message) || null;
            },
            get usersLoading() {
                return this.allUsers.loading;
            },
            get users() {
                return (this.allUsers.data && this.allUsers.data.allUsers) || [];
            },
            get AllusersNotRoomMembers() {
                return graphql({
                    client,
                    query: GET_USERS_NOT_ROOM_MEMBERS,
                    variables: {
                        roomId: this.roomId
                    }
                });
            },
            get usersNotRoomMembers() {
                return (this.AllusersNotRoomMembers.data && this.AllusersNotRoomMembers.data.allUsers) || [];
            },
            get usersNotRoomMembersLoading() {
                return (this.AllusersNotRoomMembers.loading);
            },
            get allRooms() {
                return graphql({
                    client,
                    query: GET_ROOMS_BY_USER,
                    variables: {
                        currentUserID: this.currentUserID
                    }
                });
            },
            get roomsError() {
                return (this.allRooms.error && this.allRooms.error.message) || null;
            },
            get roomsLoading() {
                return this.allRooms.loading;
            },
            get rooms() {
                return (this.allRooms.data && this.allRooms.data.allRooms) || [];
            }
        });

        this.subscribe('allRooms', 'Room', ROOMS_SUBSCRIPTION);
    }

    currentUserID = localStorage.getItem('userId');

    @action subscribe = (prop, node, document) => this[prop].ref.subscribeToMore({
        document,
        updateQuery: (current, { subscriptionData }) => {
            const prev = current[prop];
            const next = subscriptionData.data[node];
            console.log(next.mutation);
            console.log(prev)

            if (next.mutation === 'CREATED') {
                return { [prop]: prev.concat([next.node])}
            }
                
            if (next.mutation === 'UPDATED') {
                const updated = prev.slice();
                const index = updated.findIndex(({id}) => id === next.node.id );
                updated[index] = next.node;
                return { [prop]: updated};
            }

            if (next.mutation === 'DELETED') {
                return {
                    [prop]: prev.filter(({id}) => id !== next.previousValues.id)
                }
            }
        }
    });

    @action subscribePosts = (prop, node, document, roomId) => this[prop].ref.subscribeToMore({
        document,
        variables: {
            roomId
        },
        updateQuery: (current, { subscriptionData }) => {
            const prev = current[prop];
            const next = subscriptionData.data[node];
            console.log(next.mutation);
            console.log(prev)
            if (!subscriptionData) {
                return { [prop]: prev };
            }

            if (next.mutation === 'CREATED') {
                return { [prop]: prev.concat([next.node])}
            }
                
            if (next.mutation === 'UPDATED') {
                const updated = prev.slice();
                const index = updated.findIndex(({id}) => id === next.node.id );
                updated[index] = next.node;
                return { [prop]: updated};
            }

            if (next.mutation === 'DELETED') {
                return {
                    [prop]: prev.filter(({id}) => id !== next.previousValues.id)
                }
            }
        }
    });

    @action addUserInRoom = (userId, roomId) => client.mutate({
        mutation: ADD_USER_IN_ROOM_MUTATION,
        variables: { userId, roomId },
        refetchQueries: [
            { 
                query: GET_ROOMS_QUERY
            }
        ]
    }).catch(error => console.log(error));

    @action leaveRoom = (userId, roomId) => client.mutate({
        mutation: LEAVE_ROOM_MUTATION,
        variables: { userId, roomId },
        refetchQueries: [
            { 
                query: GET_ROOMS_QUERY
            }
        ]
    }).catch(error => console.log(error));

    @action signIn = (email, password) => client.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { email, password }
    }).catch(error => console.log(error));

    @action register = (email, password, name) => client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { email, password, name }
    }).catch(error => console.log(error));

    @action createPost = (userId, description, filesIds, roomId) => client.mutate({
        mutation: CREATE_POST_MUTATION,
        variables: { userId, description, filesIds, roomId },
        // updateQueries: {
        //     query: ALL_POSTS_QUERY,
        //     variables: { id: roomId }
        // }
        //--!!!!!-- TODO: Remove refetch... it must correct work without it, but works only with first room(update UI),
        // in other rooms UI doesn't updates, only when manually refresh browser, you can see changes
        // refetchQueries: [
        //     { 
        //         query: ALL_POSTS_QUERY,
        //         variables: { id: this.roomId}
        //     }
        // ]
    }).catch(error => console.log(error));

    @action deletePost = id => client.mutate({
        mutation: DELETE_POST_MUTATION,
        variables: { id }
    }).catch(error => console.log(error));

    @action createRoom = (name, usersIds) => client.mutate({
        mutation: CREATE_ROOM_MUTATION,
        variables: { name, usersIds },
        //--!!!!!-- TODO: Remove refetch... it must correct work without it, but works only with first room(update UI),
        // in other rooms UI doesn't updates, only when manually refresh browser, you can see changes
        refetchQueries: [
            { 
                query: GET_ROOMS_QUERY
            }
        ]
    }).catch(error => console.log(error));

    @action deleteRoom = id => client.mutate({
        mutation: DELETE_ROOM_MUTATION,
        variables: { id }
    }).catch(error => console.log(error));
    
    @observable roomId = "";
    @observable roomName = "";
    defaultRoomId = "cjjpigz0e17eo01354las7vgc";
    defaultRoomName = "general";

    @action changeRoom = (roomId, roomName) => {
        this.roomId = roomId;
        this.roomName = roomName;
    }
}();

const Root = (
    <Provider {...{ chatStore}}>
        <App client={client} />
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
