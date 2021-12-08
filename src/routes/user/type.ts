import { ResponseFailed, ResponseSuccess, UserInfo } from "../../utils/type";

// POST api/user
export interface RegisterUserBody {
  name: string;
}

export type RegisterSuccess = ResponseSuccess<{
  userId: string;
}>

// GET api/user
export type GetUsersResponse = ResponseSuccess<{
  users: UserInfo[];
}>