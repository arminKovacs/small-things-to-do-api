import { Inject, Injectable } from '@nestjs/common'
import { MongoDatabaseService } from 'src/services/mongo-database/mongo-database.service'
import { TodoBaseBodyDto } from './dto/todo-base.dto'

@Injectable()
export class TodosService {
  constructor(private readonly databaseService: MongoDatabaseService) { }

  create(createTodoDto: TodoBaseBodyDto, userId: string) {
    const createdTodo = this.databaseService.createTodo(createTodoDto, userId)
    return createdTodo
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
