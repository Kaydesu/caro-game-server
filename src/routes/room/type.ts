import { MemberRole, ResponseSuccess, RoomInfo, Topics, UserInfo } from "../../utils/type";

// POST api/room
export interface CreateRoomBody {
  name: string;
  userId: string;
}

export type CreateRoomSuccess = ResponseSuccess<null>;

// GET api/room
export type GetRoomsResponse = ResponseSuccess<{
  rooms: RoomInfo[],
}>;

// POST api/room/join/:roomId
export interface JoinRoomBody {
  accessCode: number;
  role: MemberRole;
  userId: string;
}

export type JoinRoomSuccess = ResponseSuccess<{
  users: UserInfo[];
  topics: Topics | null,
}>;

//POST api/room/left:roomId
export interface LeftRoomBody {
  userId: string;
}

export type LeftRoomSuccess = ResponseSuccess<{
  topics: Topics | null;
}>;
