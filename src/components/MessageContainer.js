import React, { Component } from 'react';

import MessageInput from './MessageInput';
import Message from './Message';

import Modal from 'react-modal';
import Loader from 'react-loader-spinner';
import {POSTS_SUBSCRIPTION} from '../queries';

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

    componentDidMount() {
        this.unsubscribe = this.props.chatStore.subscribePosts('allPosts', 'Post', POSTS_SUBSCRIPTION, this.props.chatStore.roomId);
    }

    

    componentWillReceiveProps({roomId}) {
        if(this.unsubscribe) {
            this.unsubscribe()
        }
        
        this.unsubscribe = this.props.chatStore.subscribePosts('allPosts', 'Post', POSTS_SUBSCRIPTION, this.props.chatStore.roomId);
    }

    componentWillUnmount() {
        if(this.unsubscribe) {
            this.unsubscribe()
        }
    }

    state = {
        editRoom                : false,
        newRoomName             : '',
        modalIsOpen             : false
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    }

    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    showLoader = (size) => {
        return (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                <Loader type="Puff" color="rgb(225, 0, 152)" height={size} width={size} />
            </div>
        )
    }
    
    renderRoomButtons = () => {
        const {
            leaveRoom,
            deleteRoom,
            changeRoom,
            roomId,
            defaultRoomId,
            defaultRoomName,
            currentUserID
        } = this.props.chatStore;

        console.log(this.props.chatStore.roomName);

        if (roomId !== defaultRoomId && roomId !== '') {
            return (
                <div>
                    <button className="default-button mr-15" onClick={() => this.openModal()}>
                        Add users
                    </button>

                    <button className="default-button mr-15" onClick={() => this.setState(
                        prevState => ({editRoom: !prevState.editRoom}))}
                    >
                        Change name
                    </button>

                    <button className="default-button mr-15" onClick={() => {
                        leaveRoom(currentUserID, roomId);
                        changeRoom(defaultRoomId, defaultRoomName);
                    }}>
                        Leave Room
                    </button>

                    <button className="default-button" onClick={() => {
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
        const { 
            posts,
            postsCount,
            roomName,
            defaultRoomName,
            usersNotRoomMembers,
            usersNotRoomMembersLoading,
            updateRoomNameMutation,
            roomId,
            changeRoomName
        } = this.props.chatStore;
        
        return (
                <div style={styles.container}>

                    <div style={styles.roomHeader}>
                    
                        {this.state.editRoom
                        ? <div>
                            <input
                                style={styles.smallInput}
                                placeholder={this.props.chatStore.roomName}
                                value={this.state.newRoomName}
                                type="text"
                                onChange={(e) => this.setState({
                                    newRoomName: e.target.value
                                })}
                            />
                            <button
                                className="default-button ml-15"
                                onClick={() => {
                                    console.log(this.state.newRoomName);
                                    updateRoomNameMutation(this.state.newRoomName, roomId);
                                    changeRoomName(this.state.newRoomName);
                                    this.setState({
                                        newRoomName:"",
                                        // roomName:
                                        editRoom:false
                                    });
                                    
                                }}
                            >
                                Change
                            </button>
                        </div>
                        : <span>{roomName ? roomName : defaultRoomName}</span>
                        }

                        <span>{postsCount.count +' users'}</span>
                        
                        {this.renderRoomButtons()}

                    </div>

                    <div style={styles.messageBox}>
                    
                        <div style={{overflowY: 'scroll', display: 'block', height: '70vh', backgroundColor: 'aliceblue', borderRadius: '5px', marginBottom: '20px'}}>
                            
                            {(this.props.chatStore.postsLoading) && this.showLoader(50)}
                            
                            <div style={styles} >
                                {posts.map(post => (
                                <Message
                                    time={getFormatedDate(post.createdAt)}
                                    from={localStorage.getItem("token") ? "You": "Other"}
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

                    <Modal
                        isOpen={this.state.modalIsOpen}
                        contentLabel="Add Users"
                        style={customStyles}
                    >
                        <div style={styles.userModalHeader}>
                            <h3 style={{margin: 0}}>Add users to Room:</h3>
                            <button
                                style={styles.userModalClose}
                                onClick={this.closeModal}
                            >
                                <span style={styles.userModalCloseIcon}>+</span>

                            </button>
                        </div>

                        {usersNotRoomMembersLoading && this.showLoader(30)}
                        
                        <div style={styles.userModalList}>{usersNotRoomMembers.map(user => {
                            return(
                                <div className="modal-add-users" id={user.id} key={user.id}>
                                    {user.name}
                                    <button 
                                        style={styles.userModalSubmit}
                                        onClick={() => {
                                            this.props.chatStore.addUserInRoom(user.id, this.props.chatStore.roomId).then(
                                                console.log('User added '+ user.name)
                                            )
                                        }}
                                    >
                                        Add User
                                    </button>
                                </div>
                            )
                        })}</div>
                        <br/>
                        
                    </Modal>
                </div>
            )
        }
    }



const styles = {
    roomHeader: {
        padding                 : 10,
        outline                 : '1px solid aliceblue',
        color                   : 'gray',
        display                 : 'flex',
        justifyContent          : 'space-between'
    },
    container: {
        padding                 : '20px',
        flex                    : 1,
        boxSizing               : 'border-box',
        display                 : 'flex',
        flexDirection           : 'column'
    },
    smallInput: {
        padding: 5,
        border: '1px solid lightgrey',
        borderRadius: 5,
        boxSizing: 'border-box'
    },
    messageBox: {
        padding                 : '10px',
        boxSizing               : 'border-box',
        display                 : 'flex',
        flexDirection           : 'column',
    },
    userModalList: {
        height                  : '400px',
        overflowY               : 'scroll'
    },
    userModalHeader: {
        display                 : 'flex',
        justifyContent          : 'space-between',
        alignItems              : 'flex-start',
        marginBottom            : 10
    },
    userModalClose: {
        borderRadius            : '50%',
        width                   : 20,
        height                  : 20,
        border                  : 'none',
        position                : 'relative',
        background              : 'rgb(225, 0, 152)'
    },
    userModalCloseIcon: {
        position                : 'absolute',
        top                     : 3,
        left                    : 6,
        color                   : 'white',
        fontWeight              : 'bold',
        transform               : 'rotate(45deg)'
    },
    userModalFooter: {
        display                 : 'flex',
        justifyContent          : 'flex-end'
    },
    userModalSubmit: {
        border                  : 'none',
        background              : 'rgb(225, 0, 152)',
        color                   : 'white',
        padding                 : '5px',
        cursor                  : 'pointer'
    }
}

const customStyles = {
    content : {
        top                     : '40%',
        left                    : '50%',
        right                   : 'auto',
        bottom                  : 'auto',
        marginRight             : '-50%',
        transform               : 'translate(-50%, -50%)',
        width                   : '500px',
      
    }
};

export default MessageContainer;