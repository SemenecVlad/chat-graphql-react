import React, { Component } from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

import MessageInput from './MessageInput';
import Message from './Message';

class MessageContainer extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.allPostsQuery.allPosts !== nextProps.allPostsQuery.allPosts) {
          this.props.allPostsQuery.refetch()
        }
    }
    
    render() {
        return(
            <div style={styles.container}>
                <div style={styles.messageBox}>
                {this.props.allPostsQuery.allPosts && this.props.allPostsQuery.allPosts.map(post => (
                    <Message
                        from="You"
                        id={post.id}
                        key={post.id}
                        post={post}
                        refresh={() => this.props.allPostsQuery.refetch()}
                    />
                ))}
                </div>
                <MessageInput refresh={() => this.props.allPostsQuery.refetch()} />
            </div>
        )
    }
}

const styles = {
    container: {
        padding: '20px',
        width: '83.5%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
    },
    messageBox: {
        height: '70vh',
        // borderBottom: '1px solid gray',
        marginBottom: '20px',
        backgroundColor: 'aliceblue',
        padding: '10px',
        boxSizing: 'border-box',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column-reverse',
    }
}

const ALL_POSTS_QUERY = gql`
  query AllPostsQuery {
    allPosts(orderBy: createdAt_DESC) {
      id
      description
    }
  }
`;



const MessageContainerWithQuery = graphql(
    ALL_POSTS_QUERY,{
        name: 'allPostsQuery',
        options: {
            fetchPolicy: 'network-only',
            pollInterval: 5000
        },
    }
)(MessageContainer)

export default MessageContainerWithQuery;