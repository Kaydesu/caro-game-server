export class User {
  private _id: string;
  private _room: string;
  private _name: string;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._room = '';
  }

  get name() {
    return this._name;
  }
  get id() {
    return this._id;
  }

  get info() {
    return {
      id: this._id,
      name: this._name,
      room: this._room,
    }
  }

  joinRoom(id: string) {
    this._room = id;
  }

  leftRoom() {
    this._room = '';
  }
}