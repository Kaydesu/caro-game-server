export enum ERROR_CODES {
  NAME_TAKEN = 'NAME_TAKEN',
  USER_NOT_EXIST = 'USER_NOT_EXIST',
  ROOM_TAKEN = 'ROOM_TAKEN',
  ACCESS_CODE_INVALID = 'ACCESS_CODE_INVALID',
  ROOM_NOT_EXIST = 'ROOM_NOT_EXIST',
  USER_ALREADY_IN_ROOM = 'USER_ALREADY_IN_ROOM',
  USER_NOT_IN_ROOM = 'USER_NOT_IN_ROOM',
}

export const ERRORS = {
  'NAME_TAKEN': { errorCode: 1001, errorMessage: 'This name is already taken' },
  'USER_NOT_EXIST': { errorCode: 1002, errorMessage: 'This user is expired, please register a new one' },
  'ROOM_TAKEN': { errorCode: 2001, errorMessage: 'This room is already exist' },
  'ACCESS_CODE_INVALID': { errorCode: 2002, errorMessage: 'Your access code is not correct' },
  'ROOM_NOT_EXIST': { errorCode: 2003, errorMessage: 'Room is not existed' },
  'USER_ALREADY_IN_ROOM': { errorCode: 2003, errorMessage: 'This user is already in this room' },
  'USER_NOT_IN_ROOM': { errorCode: 2004, errorMessage: 'This user is not in in this room' }
}

export const LOBBY_TOPIC = 'lobby/caro-dual';

export const MQTTEvents = {
  'NEW_COMER': {code: 1001}
}