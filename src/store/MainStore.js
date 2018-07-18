import { observable, action, computed } from 'mobx';
import React from 'react';

class MainStore {
    defaultRoomId = "cjjpigz0e17eo01354las7vgc";
    defaultRoomName = "general";
    @observable roomId = "cjjpigz0e17eo01354las7vgc";
    @observable roomName = "general";
    @action changeRoom = (roomId, roomName) => {
        this.roomId = roomId;
        this.roomName = roomName;
    }
}

const store = new MainStore();

export default store;