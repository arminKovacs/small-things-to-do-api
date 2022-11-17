import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TodoBaseDto } from './dto/todo-base.dto'
import { Todo, TodoDocument } from './schemas/todo.schema'

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  create(createTodoDto: TodoBaseDto) {
    return 'This action adds a new todo'
  }

  findAll() {
    return `This action returns all todos`
  }

  findOne(userId: string, todoId: string) {
    return `This action returns a #${todoId} todo for user ${userId}`
  }

  update(id: number, todoBaseDto: TodoBaseDto) {
    return `This action updates a #${id} todo`
  }

  remove(id: number) {
    return `This action removes a #${id} todo`
  }
}
