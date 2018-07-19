import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

const Message = inject('chatStore')(observer(props => {
    let { from, userName, files, time, post: { description }, id } = props;
    return (
        <div
            className="messageContainer" style={(from === 'You') ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }}
        >
            <div className="message" style={(from === 'You') ? { borderBottomRightRadius: '0' } : { borderBottomLeftRadius: '0' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ marginRight: '20px' }}>{userName}</div>
                    <div>{time}</div>
                </div>

                <br />

                <div>{description}</div>

                {files !== undefined ? <a href={files.url} target="_blank"><img alt={files.url} src={files.url} /></a> : ''}

                <div className="message-buttons">
                    <button 
                        style={styles.edit}
                    >
                        Edit
                    </button>

                    <button
                        style={styles.delete}
                        onClick={() => props.chatStore.deletePost(id)} 
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )

}));

const styles = {
    edit: {
        background: 'transparent',
        border: 'none',
        color: 'black'
    },
    delete: {
        background: 'transparent',
        border: 'none',
        color: 'red'
    }
}

export default Message;