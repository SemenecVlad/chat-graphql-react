import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import {graphql, compose, withApollo} from 'react-apollo';
import { inject, observer} from 'mobx-react';

@inject('MainStore')
@observer
class SideBar extends Component {

    state = {
        newRoomInputVisible: false,
        newRoomName: '',
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.getUsersQuery.allUsers !== nextProps.getUsersQuery.allUsers) {
          this.props.getUsersQuery.refetch()
        }
    }

    addNewRoom = () => {
        this.props.createRoom({variables: { name: this.state.newRoomName, usersIds: [localStorage.getItem('userId')]}})
    }

    render() {
        return(
            <div style={styles.sidebar}>

                <div style={styles.sidebarRoomsHead}>
                    <h3>Rooms:</h3>
                    <button onClick={() => this.setState(prevState => ({newRoomInputVisible: !prevState.newRoomInputVisible}))}>Add new</button>
                </div>

                {this.state.newRoomInputVisible && 
                    (<div>
                        <input 
                            onChange={(e) => this.setState({newRoomName: e.target.value})}
                            type="text" value={this.state.newRoomName}
                            placeholder="Type room name..."
                        />
                        <button onClick={this.addNewRoom}>Create</button>
                    </div>)
                }

                {this.props.getRoomsQuery.allRooms && this.props.getRoomsQuery.allRooms.map(room => (
                    <div onClick={() => {
                            this.props.MainStore.changeRoom(room.id, room.name);
                            console.log(this.props.MainStore.roomId)
                        }}
                        className="single-user" key={room.id}
                    >
                        {room.name}
                    </div>
                ))}
                <h3>Users:</h3>
                {this.props.getUsersQuery.allUsers && this.props.getUsersQuery.allUsers.map(user => (
                    <div className="single-user" id={user.id} key={user.id}>
                        <div style={(user.id === localStorage.getItem('userId')) ? {backgroundColor:'green'} : {}} className="user-thumb"></div>
                    {user.name === localStorage.getItem('userName') ? <div>{user.name} - is You!</div> : user.name}
                    </div>
                ))}
            </div>
        )
    }
}

const styles = {
    sidebar: {
        width: '300px',
        height: '92.5vh',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#d4e0ea'
    },
    sidebarRoomsHead: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
    }
}

const CREATE_ROOM_MUTATION = gql`
    mutation createRoom($name: String!, $usersIds: [ID!]) {
        createRoom(name: $name, usersIds: $usersIds) {
            id
            name
        }
    }
`

const GET_USERS_QUERY = gql`
    query getAllUsers {
        allUsers{
            name
            id
        }
    }
`;

const GET_ROOMS_QUERY = gql`
    query getAllRooms {
        allRooms {
            id
            name
            _usersMeta {
                count
            }
            _postsMeta {
                count
            }
        }
    } 
`;



const SidebarWithGQL = compose(
    withApollo,
    graphql(
        GET_USERS_QUERY, {name: 'getUsersQuery',options: {
        fetchPolicy: 'network-only'
    }}),
    graphql(
        GET_ROOMS_QUERY, {name: 'getRoomsQuery',options: {
        fetchPolicy: 'network-only'
    }}),
    graphql(
        CREATE_ROOM_MUTATION, {name: 'createRoom'}
    )
)(SideBar)
export default withRouter(SidebarWithGQL)
