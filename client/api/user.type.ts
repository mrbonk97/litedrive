export type UpdateUserPayload = {
  oldPassword: string;
  newPassword: string;
};

export type DeleteUserPayload = {
  password: string;
};
