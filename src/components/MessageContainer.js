import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query, graphql, compose, withApollo } from 'react-apollo';

import MessageInput from './MessageInput';
import MessageWrap from './MessageWrap';

import { inject, observer } from 'mobx-react';

const getFormatedDate = (timestring) => {
    let ms, date, year, month, day, hours, minutes, seconds, formatedTime;

    ms = Date.parse(timestring);
    date = new Date(ms);

    year = date.getFullYear();
    month = ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    formatedTime = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    return formatedTime;
};

@inject("MainStore")
@observer
class MessageContainer extends Component {

    render() {
        
        return (
            <Query query={ALL_POSTS_QUERY} variables={{id: this.props.MainStore.roomId}}>

            {({ ...data, subscribeToMore }) => {
            
            const { data: {_allPostsMeta }} = data;
            
            return (
                <div style={styles.container}>

                    <div style={styles.roomHeader}>
                        <span>{this.props.MainStore.roomName}</span>
                        <span>{_allPostsMeta && _allPostsMeta.count+' posts'}</span>
                        <button>
                            Add users
                        </button>

                        <button>
                            Change name
                        </button>

                        <button onClick={() => {
                            this.props.deleteRoomMutation({variables: { id: this.props.MainStore.roomId}});
                            this.props.MainStore.changeRoom(this.props.MainStore.defaultRoomId, this.props.MainStore.defaultRoomName);
                        }}>
                            Delete conversation
                        </button>

                    </div>

                    <MessageWrap
                        {...data}
                        formatedDate={getFormatedDate}
                        refresh={() => data.refetch()}
                        styles={styles.messageBox}
                        subscribeToNewPosts={() => subscribeToMore({
                                document: POSTS_SUBSCRIPTION,
                                updateQuery: (prev, {subscriptionData}) => {
                                    const newPost = subscriptionData.data.Post.node;
                                    if (!subscriptionData.data) return prev;
                                    return Object.assign({}, prev, {
                                          allPosts: [newPost, ...prev.allPosts] 
                                      });
                                }
                        })} 
                    />
                    <MessageInput refresh={() => data.refetch()} />
                </div>
            )}}
            </Query>
        )
    }
}



const styles = {
    roomHeader: {
        padding: 10,
        outline: '1px solid aliceblue',
        color: 'gray',
        display: 'flex',
        justifyContent: 'space-between'
    },
    container: {
        padding: '20px',
        width: '83.5%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
    },
    messageBox: {
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column-reverse',
    }
}

const ALL_POSTS_QUERY = gql`
  query AllPostsQuery($id: ID!) {
    allPosts(filter: {
        room: {
          id: $id
        }
      }) {
      id
      description
      createdAt
      user{
          name
      }
      files{
          url
      }
    }
    _allPostsMeta(filter: {
        room: {
          id: $id
        }
      }) {
        count
      }
  }
`;

const POSTS_SUBSCRIPTION = gql`
  subscription {
    Post {
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

const MessageContainerWithMutation = compose(
    withApollo,
    graphql(DELETE_ROOM_MUTATION, {name: 'deleteRoomMutation'}),
)(MessageContainer)
export default withRouter(MessageContainerWithMutation)

//export default MessageContainer;