import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TodoBaseBodyDto } from './dto/todo-base.dto'
import { Todo, TodoDocument } from './schemas/todo.schema'

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) { }

  create(createTodoDto: TodoBaseBodyDto) {
    return 'This action adds a new todo'
  }

  findAll(userId: string) {
    return `This action returns all todos for user ${userId}`
  }

  findOne(userId: string, todoId: string) {
    return `This action returns a #${todoId} todo for user ${userId}`
  }

  update(id: string, todoBaseDto: TodoBaseBodyDto) {
    return `This action updates a #${id} todo`
  }

  remove(id: string) {
    return `This action removes a #${id} todo`
  }
}
