import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MongoDatabaseService } from 'src/services/mongo-database/mongo-database.service'
import { TodoBaseBodyDto } from './types/dto/todo-base.dto'

@Injectable()
export class TodosService {
  constructor(private readonly databaseService: MongoDatabaseService) {}

  async create(todoBase: TodoBaseBodyDto, userId: string) {
    const createdTodo = await this.databaseService
      .createTodo(todoBase, userId)
      .catch((error) => {
        console.log(error)
        if (error.code === 11000) {
          throw new HttpException(
            'Todo item already exists with this title.',
            HttpStatus.CONFLICT,
          )
        }

        throw new HttpException(
          'Mongo database error.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    return createdTodo
  }

  findAll(userId: string) {
    return `This action returns all todos for user ${userId}`
  }

  async findOne(todoId: string) {
    const result = await this.databaseService
      .findUsersTodo(todoId)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    if (!result) {
      throw new HttpException(
        `Todo item does not exist with id ${todoId}.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return result
  }

  update(id: string, todoBaseDto: TodoBaseBodyDto) {
    return `This action updates a #${id} todo`
  }

  remove(id: string) {
    return `This action removes a #${id} todo`
  }
}
