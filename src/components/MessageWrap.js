import React, { Component } from 'react';
import Message from './Message';

export default class MessageWrap extends Component {
    componentDidMount() {
        this.props.subscribeToNewPosts();
    }
    //componentDidUpdate(prevProps) {
        //if (prevProps.data.allPosts !== this.props.data.allPosts) {
        //    this.props.refresh()
      //  }
    //}
    render() {
        const { styles, formatedDate } = this.props;
        if(this.props.data === undefined){
            return <div>Loading...</div>
        }
        return (
            <div style={{overflowY: 'scroll', display: 'block', height: '70vh', backgroundColor: 'aliceblue', borderRadius: '5px', marginBottom: '20px'}}>
                <div style={styles} >
                        {this.props.data.allPosts && this.props.data.allPosts.map(post => (
                            <Message
                                time={formatedDate(post.createdAt)}
                                from="You"
                                id={post.id}
                                key={post.id}
                                userName={post.user.name}
                                post={post}
                                files={post.files[0]}
                            />
                        ))}
                </div>
            </div>
        )
    }
}
