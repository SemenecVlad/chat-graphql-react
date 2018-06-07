import React, { Component } from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

class Message extends Component {
    deletePost = async (id) => {
        await this.props.deletePostMutation({variables: {id}})
        console.log('Delete')
        this.props.refresh()
    }
    render() {
        let { from, id, userName, files, post: { description } } = this.props;
        return(
            <div onClick={()=> this.deletePost(id)} className="messageContainer" style={(from === 'You') ? {justifyContent: 'flex-end'} : {justifyContent: 'flex-start'}}>
                <div className="message" style={(from === 'You') ? {borderBottomRightRadius: '0'} : {borderBottomLeftRadius: '0'}}>
                    {description}
                    <br/><small>by {userName}</small>
                    {files !== undefined ? <img src={files.url} /> : ''}
                </div>
            </div>
        )
    }
}

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: ID!) {
    deletePost(id: $id ) {
      id
    }
  }
`;

const MessageWithMutation = graphql(
    DELETE_POST_MUTATION, 
    {name: 'deletePostMutation'}
)(Message);
    
export default MessageWithMutation;