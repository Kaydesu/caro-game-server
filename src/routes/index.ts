import room from './room';
import user from './user';

export const routes = [
  {
    path: 'room/',
    router: room,
  },
  {
    path: 'user/',
    router: user,
  }
]