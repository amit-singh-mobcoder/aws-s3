import { IUserRepository } from "@src/repositories/UserRepository";
import { CreateUserDto } from "@src/dto";
import { IUser } from "@src/model/UserModel";
import awsS3Service from "./aws/S3Service";
import { AwsS3FolderNames, RedisCachingPrefix } from "@src/constants";
import redisCachingService from "./redis/RedisCachingService";

export interface IUserService {
  createUser(data: CreateUserDto): Promise<IUser>;
  getUserById(id: string): Promise<IUser>;
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

  public async getUserById(id: string): Promise<IUser> {
    let user;

    const cacheUserObj = await redisCachingService.get(`${RedisCachingPrefix.user}:${id}`);
    if (cacheUserObj) {
      user = JSON.parse(cacheUserObj);
    } else {
      // case when user object not present in cache
      user = await this.userRepository.findById(id);
      if (!user) throw new Error(`User with id: ${id} does not exists`);
      await redisCachingService.set(`${RedisCachingPrefix.user}:${id}`, JSON.stringify(user), 3600); // cache user object for 1 hour
    }

    let avatarPresignedUrl = await redisCachingService.get(`${RedisCachingPrefix.presignedUrl}:${id}`);
    if (avatarPresignedUrl) {
      user.avatar = avatarPresignedUrl;
    } else {
      // case when avatar presigned url not present in cache
      avatarPresignedUrl = await awsS3Service.getFileUrlFromAws(user.avatar, 300);
      await redisCachingService.set(`${RedisCachingPrefix.presignedUrl}:${id}`, avatarPresignedUrl, 240); // cache url for 4 min
    }

    user.avatar = avatarPresignedUrl;
    return user;
  }
}
