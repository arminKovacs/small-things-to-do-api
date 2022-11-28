import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TodoBaseBodyDto } from 'src/todos/dto/todo-base.dto'
import { Todo, TodoDocument } from 'src/todos/schemas/mongo/todo.schema'

@Injectable()
export class MongoDatabaseService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) { }

  async createTodo(todoBase: TodoBaseBodyDto, userId: string): Promise<Todo> {
    const creationDate = new Date()

    return await this.todoModel.create({
      ...todoBase,
      owner: userId,
      creationDate
    })
  }
}
