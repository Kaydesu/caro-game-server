import { v4 as uuid } from 'uuid';
import { AuthType, MemberRole, MQTTMessageTypes, UserInfo } from '../../utils/type';
import MQTTService from '../MQTTService';
import UserManager from '../UserManager';
import { User } from '../UserManager/User';
// const mqttService = require('../MQTTService');

export class Room {
  private _id: string;
  private _name: string;
  private _accessCode: number;
  private playTopic: string;
  private roomTopic: string;
  private chatTopic: string;
  private _owner: User | null;
  private users: Map<User | null, {
    authenticate: AuthType;
    role: MemberRole;
    score?: number;
    steps?: number;
  }>;
  private chat: {
    owner: string;
    text: string;
    timeStamp: number;
  }[]

  constructor(name: string, userId: string, roomId: string) {
    this._name = name;
    this._id = roomId;
    this._accessCode = Math.floor(100000 + Math.random() * 900000);
    this.playTopic = `play/${uuid().slice(0, 8)}`;
    this.chatTopic = `chat/${uuid().slice(0, 8)}`;
    this.roomTopic = `roomTopic/${this._name}`;
    this.users = new Map();
    this.chat = [];
    this._owner = UserManager.getById(userId) || null;

    Promise.all(MQTTService.sub([
      this.playTopic,
      this.chatTopic,
      this.roomTopic
    ])).then(() => {
      console.log('Room create success, subsribe to topics');
      this.handleMessage();
    }).catch(error => {
      console.log('Something went wrong');
    });
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get topics() {
    return {
      roomTopic: this.roomTopic,
      playTopic: this.playTopic,
      chatTopic: this.chatTopic,
    }
  }

  get owner() {
    return this._owner?.info;
  }

  get accessCode() {
    return this._accessCode;
  }

  get conversation() {
    return this.chat;
  }

  manualAccessCode(accessCode: number) {
    this._accessCode = accessCode;
  }

  checkUserExist(userId: string) {
    let existed = false;
    if (this.users.size > 0) {
      this.users.forEach((user, userInfo) => {
        if (userInfo?.id === userId) {
          existed = true;
        }
      })
    }
    return existed;
  }

  join(user: User, role: MemberRole = MemberRole.OBSERVER, accessCode?: number) {
    if (accessCode === undefined) {
      user.joinRoom(this._id);
      this.users.set(user, {
        authenticate: AuthType.HOST,
        role: role,
      });
      if (this.users.size === 0) this._owner = user;
      this.welcome(user.name);
      return true;
    } else {
      if (this._accessCode === accessCode) {
        user.joinRoom(this._id);
        this.users.set(user, {
          authenticate: AuthType.HOST,
          role: role,
        });
        if (this.users.size === 0) this._owner = user;
        this.welcome(user.name);
        return true;
      } else {
        return false;
      }
    }
  }

  left(user: User) {
    if (user) {
      console.log(user);
      user.leftRoom();
      this.users.delete(user);
      this.goodbye(user.name);
      if (user?.id === this.owner?.id) {
        this._owner = null;
        const nextOwner = this.users.entries().next().value[0];
        this._owner = nextOwner;
        console.log("Next owner: ", this.owner);
      }
    }
  }

  getUsersInfo(): UserInfo[] {
    const data: UserInfo[] = [];
    this.users.forEach((user, userInfo) => {
      if (userInfo) {
        data.push(userInfo?.info);
      }
    });
    return data;
  }

  welcome(userName: string) {
    this.notify(`Welcome ${userName} to ${this._name}`);
  }

  goodbye(userName: string) {
    this.notify(`${userName} has left the room`);
  }

  notify(message: string) {
    MQTTService.pub(this.roomTopic, {
      type: MQTTMessageTypes.NOTIFICATION,
      payload: {
        message: message
      },
    }).then(() => {
      console.log('Room notification success');
    });
  }

  handleMessage() {
    MQTTService.handleTopic([
      this.roomTopic,
      this.playTopic,
      this.chatTopic,
    ], (data: any, topic: string) => {
      switch (topic) {
        case this.roomTopic:
          console.log("Common room topic: ", data);
          break;
        case this.playTopic:
         
          break;
        case this.chatTopic:
          console.log("Common chat topic: ", data);
          this.chat.push({
            owner: data.userName,
            text: data.text,
            timeStamp: new Date().getTime(),
          })
          break;
      }
    });
  }
}