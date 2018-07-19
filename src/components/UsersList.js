import React from 'react';
import { inject, observer } from 'mobx-react';

const UsersList = inject('chatStore')(observer(props => {
    return (
        <div className="users-list">
            {props.chatStore.users.map(user => (
                <div className="single-user" id={user.id} key={user.id}>
                    <div style={(user.id === localStorage.getItem('userId')) ? {backgroundColor:'green'} : {}} className="user-thumb"></div>
                    {user.name === localStorage.getItem('userName') ? <div>{user.name} - is You!</div> : user.name}
                </div>
            ))}
        </div>
    )
}));

export default UsersList;
