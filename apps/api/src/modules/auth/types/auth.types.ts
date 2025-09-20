export interface RequestWithUser extends Request {
  user: UserWithoutPassword;
}
