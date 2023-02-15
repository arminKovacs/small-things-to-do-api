import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MongoDatabaseService } from 'src/services/mongo-database/mongo-database.service'
import { UserDto } from 'src/types/dto/user-base.dto'

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: MongoDatabaseService) {}

  async create(user: UserDto) {
    const createdUser = await this.databaseService
      .createUser(user)
      .catch((error) => {
        console.log(error)
        if (error.code === 11000) {
          throw new HttpException(
            'User already exists with this email.',
            HttpStatus.CONFLICT,
          )
        }

        throw new HttpException(
          'Mongo database error while creating user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    return createdUser
  }

  async findUser(userName: string) {
    const querriedUser = await this.databaseService
      .findUser(userName)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error while retrieving user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    if (!querriedUser) {
      throw new HttpException(
        `Wrong email or user does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return querriedUser
  }
}
