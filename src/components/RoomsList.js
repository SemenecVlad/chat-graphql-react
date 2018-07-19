import React from 'react';
import { inject, observer } from 'mobx-react';

const RoomsList = inject('chatStore')(observer(props => {
    if (props.chatStore.roomsLoading) {
        return <div>Loading...</div>
    }
    console.log(props.chatStore.currentUserID)
    return (
        <div className="rooms-list">
            {props.chatStore.rooms.map(room => (
                <div onClick={() => {
                    props.chatStore.changeRoom(room.id, room.name);
                    console.log(props.chatStore.roomId)
                    }}
                    className="single-user" key={room.id}
                >
                    {room.name}
                </div>
            ))}
        </div>
    )
}));

export default RoomsList;
