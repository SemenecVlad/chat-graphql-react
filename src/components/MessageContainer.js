import React, { Component } from 'react';

import MessageInput from './MessageInput';
import Message from './Message';

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

@inject("chatStore")
@observer
class MessageContainer extends Component {

    state = {
        editRoom: false,
        newRoomName: this.props.chatStore.roomName
    }
    
    renderRoomButtons = () => {
        const { deleteRoom, changeRoom, roomId, defaultRoomId, defaultRoomName } = this.props.chatStore;

        if (roomId !== defaultRoomId) {
            return (
                <div>
                    <button>
                        Add users
                    </button>

                    <button>
                        Change name
                    </button>

                    <button>
                        Leave Room
                    </button>

                    <button onClick={() => {
                        deleteRoom(roomId);
                        changeRoom(defaultRoomId, defaultRoomName);
                    }}>
                        Delete conversation
                    </button>
                </div>
            )
        }
    }

    render() {
        const { posts, postsCount, deleteRoom, changeRoom, defaultRoomId, defaultRoomName, roomName, roomId } = this.props.chatStore;
        return (
                <div style={styles.container}>

                    <div style={styles.roomHeader}>
                    
                        {this.state.editRoom ?
                        <div>
                            <input 
                                value={this.state.newRoomName}
                                type="text"
                                onChange={(e) => this.setState({
                                    newRoomName: e.target.value
                                })}
                            />
                            <button onClick={() => console.log(this.state.newRoomName)}>Change</button>
                        </div> :
                        <span>{roomName}</span>
                        }


                        <span>{postsCount.count +' users'}</span>
                        
                        {this.renderRoomButtons()}

                    </div>

                    <div style={styles.messageBox}>
                        <div style={{overflowY: 'scroll', display: 'block', height: '70vh', backgroundColor: 'aliceblue', borderRadius: '5px', marginBottom: '20px'}}>
                            <div style={styles} >
                                {posts.map(post => (
                                <Message
                                    time={getFormatedDate(post.createdAt)}
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
                    </div>

                    <MessageInput />
                </div>
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
        flex: 1,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
    },
    messageBox: {
        padding: '10px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    }
}

export default MessageContainer;