import { IUserRepository } from "@src/repositories/UserRepository";
import { CreateUserDto } from "@src/dto";
import { IUser } from "@src/model/UserModel";
import awsS3Service from "./aws/S3Service";
import { AwsS3FolderNames } from "@src/constants";

export interface IUserService {
  createUser(data: CreateUserDto): Promise<IUser>;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async createUser(data: CreateUserDto): Promise<IUser> {
    const isExists = await this.userRepository.findByEmail(data.email);
    if (isExists) {
      throw new Error("User with email already exists.");
    }
    if (typeof data.file == "undefined") throw new Error("file is undefined");

    const filename = data.file.filename;
    const key = `${AwsS3FolderNames.avatars}/${filename}`;
    data.avatar = key;

    // upload file to bucket in folder /avatars
    await awsS3Service.uploadFileToS3(key, data.file);
    const user = await this.userRepository.create(data);
    return user;
  }
}
