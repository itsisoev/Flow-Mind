import {IUser} from "./user.model";

export interface IAuth {
  message: string;
  user: IUser;
  token: string;
}

export interface IDecodedToken {
  uuid: string;
  username: string;
  exp: number;
  iat: number;
}

