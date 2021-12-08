import { Request, Response } from 'express';

export type ApiRequest<T, P = {}> = Request<P, {}, T>;
export type ApiResponse<S> = Response<S> & Response<ResponseFailed>;

export interface ResponseSuccess<T> {
  status: 'success';
  data: T;
}

export interface ResponseFailed {
  status: 'error';
  error: {
    errorCode: number;
    errorMessage: string;
  };
}

export enum MemberRole {
  PLAYER = 'PLAYER',
  OBSERVER = 'OBSERVER',
};

export enum AuthType {
  HOST = 'HOST',
  GUEST = 'GUEST',
}

export interface RoomInfo {
  id: string;
  name: string;
  owner: UserInfo | null;
}

export interface UserInfo {
  id: string;
  name: string;
  room: string;
}

export interface Topics {
  roomTopic: string;
  chatTopic: string;
  playTopic: string;
}
