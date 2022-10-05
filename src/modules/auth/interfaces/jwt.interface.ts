export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  jwtid?: string;
}
