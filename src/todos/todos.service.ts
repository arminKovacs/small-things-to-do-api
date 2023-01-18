import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MongoDatabaseService } from 'src/services/mongo-database/mongo-database.service'
import { dateChecker } from 'src/utilities/helper-functions'
import { TodoBaseBodyDto } from './types/dto/todo-base.dto'

@Injectable()
export class TodosService {
  constructor(private readonly databaseService: MongoDatabaseService) { }

  async create(todoBase: TodoBaseBodyDto, userId: string) {
    dateChecker(todoBase.dueDate)

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
          'Mongo database error while creating todo item.',
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
      .findTodo(todoId)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error while retrieving todo item.',
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

  async update(todoId: string, todoBase: TodoBaseBodyDto) {
    const originalTodo = await this.databaseService
      .findTodo(todoId)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error while retrieving todo item.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    if (!originalTodo) {
      throw new HttpException(
        `Todo item does not exist with id ${todoId}.`,
        HttpStatus.NOT_FOUND,
      )
    }

    dateChecker(todoBase.dueDate, originalTodo.creationDate)

    const result = await this.databaseService
      .updateTodo(todoBase, todoId)
      .catch((error) => {
        console.log(error)
        if (error.code === 11000) {
          throw new HttpException(
            'Todo item already exists with this title.',
            HttpStatus.CONFLICT,
          )
        }

        throw new HttpException(
          'Mongo database error while updating todo item.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    return result
  }

  async remove(todoId: string) {
    const result = await this.databaseService
      .deleteTodo(todoId)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error while retrieving todo item.',
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
}
