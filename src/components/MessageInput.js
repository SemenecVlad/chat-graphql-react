import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { graphql, compose, withApollo} from 'react-apollo'
import gql from 'graphql-tag';

class MessageInput extends Component {
    state = {
        description: '',
        file: null,
        filesIds: 'cjia6p4gu091u0156homvbqtt',
        userId: localStorage.getItem('userId'),
        loading: false
    }

    handlePost = async () => {
        const {description, userId, filesIds} = this.state
        await this.props.createPostMutation({variables: {description, userId, filesIds}}).catch(err => console.log('[POST ERROR]',err))
        this.setState({
            description: '',
            loading: false
        })

    }

    uploadFile = () => {
        let file = this.state.file;
        
        if (file !== null) {
            let data = new FormData();
            data.append('data', file);
            this.setState({
                loading: true
            });
            //console.log(data)
            fetch('https://api.graph.cool/file/v1/cji3486nr3q4b0191ifdu8j6x', {
                method: 'POST',
                body: data,
                name: 'data'
            }).then(response => {
                console.log('file upload response', response);
                return response.json();
            })
            .then(file => {
                const filesIds = file.id;
                console.log(file, filesIds);
                this.setState({
                    filesIds
                });
                return filesIds;
            }).then(() => {
                this.handlePost();
                this.setState({
                    filesIds: 'cjia6p4gu091u0156homvbqtt',
                    file: null,
                    loading: false
                })
                console.log('[POST SENDED]-state- :', this.state.file)
            }).catch(err => console.log('[ERROR]', err))
        } else {
            // if file not selected in file input then set filesIds value to the default,
            // and get the default 1px line image from storage
            this.setState({
                filesIds: 'cjia6p4gu091u0156homvbqtt'
            });
            this.handlePost();
            // this.props.refresh();
        }
    }

    onChange = e => {
        this.setState({
            file: e.target.files[0]
        });
    }
    
    render() {
        return (
            <div style={styles.container}>
                <textarea
                    style={styles.textarea}
                    placeholder='Type your message here'
                    value={this.state.description}
                    onChange={e => this.setState({description: e.target.value})} />

                <input type="file" onChange={this.onChange} />
                
                <button 
                    style={styles.submitBtn} 
                    onClick={this.uploadFile}
                    disabled={(this.state.description || (this.state.file !== null)) ? '' : 'disabled'}
                    >{this.state.loading ? 'Loading...' : 'Send'}</button>
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

const MessageInputWithMutation = compose(
    withApollo,
    graphql(CREATE_POST_MUTATION, {name: 'createPostMutation'})
)(MessageInput)
export default withRouter(MessageInputWithMutation)