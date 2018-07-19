import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import UsersList from './UsersList';
import RoomsList from './RoomsList';

@inject('chatStore')
@observer
class SideBar extends Component {

    state = {
        newRoomInputVisible: false,
        newRoomName: '',
    }

    addNewRoom = () => {
        this.props.chatStore.createRoom(this.state.newRoomName, [localStorage.getItem('userId')]);
        this.setState({
            newRoomName: '',
            newRoomInputVisible: false
        })
    }

    renderRoomInput = () => {
        if(this.state.newRoomInputVisible) {
            return (
            <div>
                <input 
                    onChange={(e) => this.setState({newRoomName: e.target.value})}
                    type="text" value={this.state.newRoomName}
                    placeholder="Type room name..."
                />
                <button onClick={this.addNewRoom}>Create</button>
            </div>
            )
        } 
        
    }

    render() {
        return(
            <div style={styles.sidebar}>

                <div style={styles.sidebarRoomsHead}>
                    <h3>Rooms:</h3>
                    <button onClick={() => this.setState(prevState => ({newRoomInputVisible: !prevState.newRoomInputVisible}))}>Add new</button>
                </div>

                {this.renderRoomInput()}

                <RoomsList />
                
                <h3>Users:</h3>
                <UsersList />
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


export default SideBar;
