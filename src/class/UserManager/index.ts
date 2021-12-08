import { User } from "./User";
import { v4 as uuid } from "uuid";
import { UserInfo } from "../../utils/type";

class UserManager {
  private users: Map<string, User>
  constructor() {
    this.users = new Map();
    this.users.set('admin', new User('admin', 'Admin'));
  }

  addUser(name: string): User | undefined {
    const id = uuid();
    this.users.set(id, new User(id, name));
    return this.users.get(id);
  }

  getUsers(): UserInfo[] {
    const data: UserInfo[] = [];
    this.users.forEach(user => {
      data.push(user.info)
    });
    return data;
  }

  getById(id: string): User | undefined {
    return this.users.get(id);
  }

  checkUserExist(name: string): boolean {
    let bool = false;
    this.users.forEach(user => {
      if (user.name === name) {
        bool = true;
      }
    })
    return bool;
  }
}

export default new UserManager();