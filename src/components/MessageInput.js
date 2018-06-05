import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { graphql} from 'react-apollo'
import gql from 'graphql-tag';

class MessageInput extends Component {
    state = {
        description: ''
    }
    handlePost = async () => {
        const {description} = this.state
        await this.props.createPostMutation({variables: {description}})
        this.setState({
            description: ''
        })
        this.props.refresh()
    }
    
    render() {
        return (
            <div style={styles.container}>
                <textarea
                    style={styles.textarea}
                    placeholder='Type your message here'
                    value={this.state.description}
                    onChange={e => this.setState({description: e.target.value})} />
                <button 
                    style={styles.submitBtn} 
                    onClick={this.handlePost}>Send</button>
            </div>
        )
    }
}

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    textarea: {
        width: '90%',
        height: '100px',
        borderRadius: '5px',
        padding: '10px',
        borderColor: '#e4eef7'
    },
    submitBtn: {
        width: '8%',
        border: 'none',
        backgroundColor: 'rgb(225, 0, 152)',
        color: 'white',
        borderRadius: '5px',
        boxSizing: 'border-box',
        fontSize: '18px',
        cursor: 'pointer'
    }
}



const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($description: String!) {
    createPost(description: $description ) {
      id
      description
    }
  }
`

const MessageInputWithMutation = graphql(CREATE_POST_MUTATION, {name: 'createPostMutation'})(MessageInput)
export default withRouter(MessageInputWithMutation)