export interface userCredentials {
  username: string;
  password: string;
}

export interface JsonWebToken {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
  sessionID: string;
}
