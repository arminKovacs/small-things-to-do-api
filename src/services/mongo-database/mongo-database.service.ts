import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TodoBaseBodyDto } from 'src/todos/types/dto/todo-base.dto'
import { Todo, TodoDocument } from 'src/todos/types/schemas/mongo/todo.schema'

@Injectable()
export class MongoDatabaseService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async createTodo(todoBase: TodoBaseBodyDto, owner: string): Promise<Todo> {
    const creationDate = new Date()
    const createdTodo = new this.todoModel({ ...todoBase, owner, creationDate })

    return await createdTodo.save()
  }

  async findUsersTodo(_id: string): Promise<Todo | null> {
    const todo = await this.todoModel.findById({ _id }).lean().exec()

    return todo
  }
}
