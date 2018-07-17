import React, { Component } from 'react';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import {graphql, compose, withApollo} from 'react-apollo';

class SideBar extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.getUsersQuery.allUsers !== nextProps.getUsersQuery.allUsers) {
          this.props.getUsersQuery.refetch()
        }
    }

    render() {
        return(
            <div style={styles.sidebar}>
                <h3>Rooms:</h3>
                {this.props.getRoomsQuery.allRooms && this.props.getRoomsQuery.allRooms.map(room => (
                    <div onClick={() => {
                            localStorage.setItem('roomId',room.id);
                            localStorage.setItem('roomName', room.name);
                            console.log("Room id: ", localStorage.getItem("roomId"));
                            console.log("Room name: ", localStorage.getItem("roomName"));
                            }}
                        className="single-user" key={room.id}
                    >
                        {room.name}
                    </div>
                ))}
                <h3>Users:</h3>
                {this.props.getUsersQuery.allUsers && this.props.getUsersQuery.allUsers.map(user => (
                    <div className="single-user" key={user.id}>
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
    }
}

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
    }})
)(SideBar)
export default withRouter(SidebarWithGQL)
