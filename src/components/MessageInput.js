import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { graphql, compose, withApollo} from 'react-apollo'
import gql from 'graphql-tag';

class MessageInput extends Component {
    state = {
        description: '',
        file: null,
        filesIds: '',
        userId: localStorage.getItem('userId')
    }

    handlePost = async () => {
        const {description, userId, filesIds} = this.state
        await this.props.createPostMutation({variables: {description, userId, filesIds}})
        this.setState({
            description: ''
        })
        this.props.refresh()
    }

    onFormSubmit = (e) => {
        // e.preventDefault();
        this.setState({ file: e.target.files[0] });
        const {file} = this.state;
        this.uploadFile(file);
        
        
        console.log(file)
	}

    uploadFile = (file) => {
        let data = new FormData();
        data.append('data', file);
        console.log(data)

        // this.props.fileUpload({variables: {data}})
      
        // use the file endpoint
        fetch('https://api.graph.cool/file/v1/cji3486nr3q4b0191ifdu8j6x', {
          method: 'POST',
          body: data,
          name: 'data',
        //   mode: "no-cors",
        }).then(response => {
            console.log('file upload response', response);
            return response.json()
        })
        .then(file => {
            const filesIds = file.id;
            console.log(file, filesIds);
            this.setState({
                filesIds
            });
            return filesIds;
        })
    }

    sendPost = async () => {
        
        //if (this.state.file !== null) {
            //await this.onFormSubmit()
        //}
        
        this.handlePost()
    }
    
    render() {
        return (
            <div style={styles.container}>
                <textarea
                    style={styles.textarea}
                    placeholder='Type your message here'
                    value={this.state.description}
                    onChange={e => this.setState({description: e.target.value})} />
                <form onSubmit={this.onFormSubmit}>
                    <input type="file" onChange={this.onFormSubmit} />
                    <button type='submit'>Upload</button>
                </form>
                
                <button 
                    style={styles.submitBtn} 
                    onClick={this.sendPost}>Send</button>
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
  mutation CreatePostMutation($userId: ID! ,$description: String!,$filesIds: [ID!]) {
    createPost(userId: $userId ,description: $description, filesIds: $filesIds ) {
      id
      description
      files{
          id
          url
      }
    }
  }
`;
// const UPLOAD_FILE_MUTATION = gql`
//   mutation UploadFile($file: String!) {
//     uploadFile(file: $file) {
//         url
//         id
//     }
// }
// `

const MessageInputWithMutation = compose(
    graphql(CREATE_POST_MUTATION, {name: 'createPostMutation'}),
    // graphql(UPLOAD_FILE_MUTATION, {name: 'fileUpload'}),

)(MessageInput)
export default withRouter(MessageInputWithMutation)