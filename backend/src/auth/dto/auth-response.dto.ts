export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}
