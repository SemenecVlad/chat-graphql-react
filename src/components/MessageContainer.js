import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query, graphql, compose, withApollo } from 'react-apollo';

import MessageInput from './MessageInput';
import MessageWrap from './MessageWrap';

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

const MessageContainer = ({id}) => (
    <Query query={ALL_POSTS_QUERY} variables={{id}}>

      {({ ...data, subscribeToMore }) => {
        return (
            <div style={styles.container}>
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
  );

const styles = {
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


export default MessageContainer;