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

@Injectable()
export class MongoDatabaseService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

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
    const todo = await this.todoModel.findById(_id).lean().exec()

    return todo
  }

  async findUsersTodo(owner: string): Promise<TodoLeanDocument[] | null> {
    const todos = await this.todoModel.find({ owner }).lean().exec()

    return todos
  }

  async deleteTodo(_id: string): Promise<TodoLeanDocument | null> {
    return await this.todoModel.findByIdAndDelete(_id).lean().exec()
  }

  async createUser(user: UserDto): Promise<UserLeanDocument> {
    const createdUser = new this.userModel(user)

    return await createdUser.save()
  }

  async findUser(_id: string): Promise<UserLeanDocument | null> {
    const user = await this.userModel.findById(_id).lean().exec()

    return user
  }
}
