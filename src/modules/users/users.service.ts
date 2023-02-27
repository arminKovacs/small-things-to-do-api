import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { UpdateUserDto } from 'src/types/dto/update-user.dto'
import { UserDto } from 'src/types/dto/user-base.dto'

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: MongoDatabaseService) {}

  async create(user: UserDto) {
    const createdUser = await this.databaseService
      .createUser(user)
      .catch((error) => {
        console.log(error)

        throw new HttpException(
          'Mongo database error while creating user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    return createdUser
  }

  async findUser(username: string) {
    const querriedUser = await this.databaseService
      .findUser(username)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error while retrieving user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    return querriedUser
  }

  async findUserById(userId: string) {
    const querriedUser = await this.databaseService
      .findUserById(userId)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error while retrieving user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    return querriedUser
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.databaseService
      .updateUser(userId, updateUserDto)
      .catch((error) => {
        console.log(error)
        throw new HttpException(
          'Mongo database error while retrieving user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      })

    if (!updatedUser) {
      throw new HttpException(`User does not exist.`, HttpStatus.NOT_FOUND)
    }

    return updatedUser
  }
}
