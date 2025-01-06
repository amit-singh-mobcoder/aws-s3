export interface CreateUserDto {
  name: string;
  email: string;
  avatar: string;
  file?: Express.Multer.File;
}
