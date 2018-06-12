import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import MessageInput from './MessageInput';
import Message from './Message';

const getFormatedDate = (timestring) => {
    let ms,date,year,month, day, hours, minutes, seconds, formatedTime;
    
    ms = Date.parse(timestring);
    date = new Date(ms);
    
    year = date.getFullYear();
    month = ((date.getMonth() + 1) < 10) ? '0'+ (date.getMonth() + 1) : date.getMonth() + 1;
    day = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
    hours = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
    minutes = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
    seconds = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
    
    formatedTime = `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    return formatedTime;
};

const MessageContainer = (props) => (
    <Query 
        query={ALL_POSTS_QUERY}
        pollInterval={1500}
    >
      {({ loading, error, data }) => {

        if (loading) return "Loading...";
        if (error) return `Error! ${error.message}`;

        return (
            <div style={styles.container}>
                <div style={{overflowY: 'scroll', display: 'block', height: '70vh', backgroundColor: 'aliceblue', borderRadius: '5px', marginBottom: '20px'}}>
                    <div style={styles.messageBox}>
                        {data.allPosts && data.allPosts.map(post => (
                            <Message
                                time={getFormatedDate(post.createdAt)}
                                from="You"
                                id={post.id}
                                key={post.id}
                                userName={post.user.name}
                                post={post}
                                files={post.files[0]}
                                refresh={() => this.props.allPostsQuery.refetch()}
                            />
                        ))}
                    </div>
                </div>
                <MessageInput refresh={() => this.props.allPostsQuery.refetch()} />
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
        // height: '70vh',
        // borderBottom: '1px solid gray',
        // marginBottom: '20px',
        // backgroundColor: 'aliceblue',
        padding: '10px',
        boxSizing: 'border-box',
        // borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column-reverse',
    }
}

const ALL_POSTS_QUERY = gql`
  query AllPostsQuery {
    allPosts(orderBy: createdAt_DESC) {
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



// const MessageContainerWithQuery = graphql(
//     ALL_POSTS_QUERY,{
//         name: 'allPostsQuery',
//         options: {
//             fetchPolicy: 'network-only',
//             pollInterval: 1000
//         },
//     }
// )(MessageContainer)

export default MessageContainer;