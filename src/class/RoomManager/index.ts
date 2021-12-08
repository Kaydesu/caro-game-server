import { Room } from "./Room";
import { v4 as uuid } from "uuid";
import { MemberRole, RoomInfo } from "../../utils/type";
import UserManager from "../UserManager";
import { ERROR_CODES } from "../../utils/constants";

class RoomManager {
  private _rooms: Map<string, Room>;
  constructor() {
    this._rooms = new Map();
    this._rooms.set('defaultRoom', new Room('Default', 'admin', 'defaultRoom'));
    this._rooms.get('defaultRoom')?.manualAccessCode(123456);
  }

  createRoom(name: string, userId: string) {
    return new Promise<number>((resolve, reject) => {
      if (UserManager.getById(userId)) {
        const id = uuid();
        const room = new Room(name, userId, id);
        this._rooms.set(id, room)
        resolve(room.accessCode);
      } else {
        reject();
      }
    })
  }

  join(userId: string, role: MemberRole, roomId: string, accessCode: number) {
    return new Promise((resolve, reject) => {
      const user = UserManager.getById(userId);
      if (user) {
        let success;
        const room = this.getRoom(roomId);
        switch (role) {
          case MemberRole.PLAYER:
            success = room?.join(user, role, accessCode);
            break;
          case MemberRole.OBSERVER:
            success = room?.join(user, role);
            break;
          default:
            success = false;
        }
        success ? resolve('success') : reject(ERROR_CODES.ACCESS_CODE_INVALID);
      } else {
        reject(ERROR_CODES.USER_NOT_EXIST);
      }
    })
  }

  left(userId: string, roomId: string) {
    return new Promise((resolve, reject) => {
      const room = this.getRoom(roomId);
      if (!room?.checkUserExist(userId)) {
        reject(ERROR_CODES.USER_NOT_IN_ROOM);
      } else {
        const user = UserManager.getById(userId);
        user && room?.left(user);
        resolve("success");
      }
    });
  }

  checkRoomName(name: string) {
    const rooms = this.getRooms().map(roomInfo => roomInfo.name);
    if (rooms.includes(name)) {
      return true;
    }
    return false;
  }

  getRoom(id: string) {
    return this._rooms.get(id);
  }

  getRooms(): RoomInfo[] {
    const data: RoomInfo[] = [];
    this._rooms.forEach((room) => {
      data.push({
        id: room.id,
        name: room.name,
        owner: room.owner || null,
      })
    })
    return data;
  }

  getRoomInfo() {

  }
}

export default new RoomManager();