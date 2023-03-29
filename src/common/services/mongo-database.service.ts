import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  Todo,
  TodoDocument,
  TodoLeanDocument,
} from 'src/types/schemas/mongo/todo.schema'
import { TodoBaseBodyDto } from 'src/types/dto/todo-base.dto'
import {
  User,
  UserDocument,
  UserLeanDocument,
} from 'src/types/schemas/mongo/users.schema'
import { UserDto } from 'src/types/dto/user-base.dto'
import { UpdateUserDto } from 'src/types/dto/update-user.dto'

@Injectable()
export class MongoDatabaseService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createTodo(
    todoBase: TodoBaseBodyDto,
    owner: string,
  ): Promise<TodoLeanDocument> {
    const creationDate = new Date()
    const createdTodo = new this.todoModel({ ...todoBase, owner, creationDate })

    return await createdTodo.save()
  }

  async updateTodo(
    todoBase: TodoBaseBodyDto,
    todoId: string,
  ): Promise<TodoLeanDocument | null> {
    return await this.todoModel
      .findByIdAndUpdate(todoId, todoBase, {
        new: true,
      })
      .lean()
      .exec()
  }

  async findTodo(_id: string): Promise<TodoLeanDocument | null> {
    return await this.todoModel.findById(_id).lean().exec()
  }

  async findUsersTodo(owner: string): Promise<TodoLeanDocument[] | null> {
    return await this.todoModel.find({ owner }).lean().exec()
  }

  async deleteTodo(_id: string): Promise<TodoLeanDocument | null> {
    return await this.todoModel.findByIdAndDelete(_id).lean().exec()
  }

  async createUser(user: UserDto): Promise<UserLeanDocument> {
    const createdUser = new this.userModel(user)

    return await createdUser.save()
  }

  async deleteUser(username: string): Promise<UserLeanDocument | null> {
    return await this.userModel.findOneAndDelete({ username }).lean().exec()
  }

  async findUser(username: string): Promise<UserLeanDocument | null> {
    return await this.userModel.findOne({ username }).lean().exec()
  }

  async findUserById(_id: string): Promise<UserLeanDocument | null> {
    return await this.userModel.findById(_id).lean().exec()
  }

  async updateUser(
    userId: string,
    updatedUserDto: UpdateUserDto,
  ): Promise<UserLeanDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(userId, updatedUserDto, { new: true })
      .lean()
      .exec()
  }
}
