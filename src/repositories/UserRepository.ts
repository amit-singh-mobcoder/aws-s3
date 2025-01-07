import { IUser, userModel } from "@src/model/UserModel";
import { CreateUserDto } from "@src/dto";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(data: CreateUserDto): Promise<IUser>;
  findById(id: string):Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await userModel.findOne({ email });
  }

  async create(data: CreateUserDto): Promise<IUser> {
    return await userModel.create({
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return await userModel.findById(id);
  }
}
