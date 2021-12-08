import { v4 as uuid } from 'uuid';
import { AuthType, MemberRole, UserInfo } from '../../utils/type';
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
  }>

  constructor(name: string, userId: string, roomId: string) {
    this._name = name;
    this._id = roomId;
    this._accessCode = Math.floor(100000 + Math.random() * 900000);
    this.playTopic = `play/${uuid().slice(0, 8)}`;
    this.chatTopic = `chat/${uuid().slice(0, 8)}`;
    this.roomTopic = `roomTopic/${this._name}`;
    this.users = new Map();
    this._owner = UserManager.getById(userId) || null;

    // Promise.all([
    //   mqttService.sub(this.roomTopic),
    //   mqttService.sub(this.chatTopic),
    //   mqttService.sub(this.playTopic),
    // ]).then(() => {
    //   this.handleMessage();
    // }).catch(error => {
    //   console.log('Something went wrong');
    // })
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
      console.log(this.owner);
      return true;
    } else {
      if (this._accessCode === accessCode) {
        user.joinRoom(this._id);
        this.users.set(user, {
          authenticate: AuthType.HOST,
          role: role,
        });
        if (this.users.size === 0) this._owner = user;
        console.log(this.owner);
        return true;
      } else {
        return false;
      }
    }
  }

  left(user: User) {
    if (user) {
      user.leftRoom();
      this.users.delete(user);
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

  welcome(id: string) {
    // const user = UserManager.getById(id);
    // if (user) {
    //   this.notify(`Welcome ${user.name} to ${this._name}`);
    //   if (this.users.size === 0) {
    //     this.users.set(user, {
    //       authenticate: 'HOST',
    //       role
    //       score: 0,
    //       steps: 0,
    //     });
    //   } else {
    //     this.users.set(user, {
    //       authenticate: 'GUEST',
    //       score: 0,
    //       steps: 0,
    //     })
    //   }
    // }
  }

  goodbye(id: string) {
    const user = UserManager.getById(id);
    if (user) {
      this.notify(`${user.name} has left the room`);
      this.users.delete(user);
    }
  }

  notify(msg: string) {
    // mqttService.pub(this.roomTopic, {
    //   type: 'notification',
    //   message: msg,
    // }).then(() => {
    //   console.log('Room notification success');
    // });
  }

  handleMessage() {
    // mqttService.client.on('message', (topic, message) => {
    //   message = JSON.parse(message.toString())

    //   console.log('=============Receiving message:');
    //   console.log(topic, message);

    //   switch (message.type) {
    //     case 'START':
    //       this.notify(`${message.name} has started the game`);
    //       break;
    //     case 'PAUSE':
    //       this.notify(`${message.name} has paused the game`);
    //       break;
    //     case 'QUIT':
    //       this.notify(`${message.name} has left the room`);
    //       break;
    //   }
    // })
  }
}