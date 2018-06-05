import React, { Component } from 'react';

export default class SideBar extends Component {
    render() {
        return(
            <div style={styles.sidebar}>
                Sidebar
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
        backgroundColor: 'wheat'
    }
}