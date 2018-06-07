import React, { Component } from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

class SideBar extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.getUsersQuery.allUsers !== nextProps.getUsersQuery.allUsers) {
          this.props.getUsersQuery.refetch()
        }
    }
    render() {
        return(
            <div style={styles.sidebar}>
                <h3>Users:</h3>
                {this.props.getUsersQuery.allUsers && this.props.getUsersQuery.allUsers.map(user => (
                    <div className="single-user" key={user.id}>
                        <div className="user-thumb"></div>
                    {user.name}
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

const SidebarWithGQL = graphql(GET_USERS_QUERY, {name: 'getUsersQuery',options: {
    fetchPolicy: 'network-only'
}})(SideBar);

export default SidebarWithGQL;