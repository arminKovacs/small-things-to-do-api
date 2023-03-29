import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UserDto } from 'src/types/dto/user-base.dto'

export type MockType<T> = {
  [P in keyof T]: jest.Mock<any>
}

export const createMockFunctions = <T>(...functionsToMock: (keyof T)[]) => {
  const functions = functionsToMock.reduce(
    (accumolator, currentValue) => ({
      ...accumolator,
      [currentValue]: jest.fn(),
    }),
    {},
  )

  return functions
}

export const mockUserDto: UserDto = {
  username: 'test@testmail.com',
  password: 'password',
  refreshToken: 'jwt.refresh.token',
}

let mongodb: MongoMemoryServer

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongodb = await MongoMemoryServer.create()
      const mongoUri = mongodb.getUri()
      return {
        uri: mongoUri,
        ...options,
      }
    },
  })

export const closeInMongoDbConnection = async () => {
  if (mongodb) await mongodb.stop()
}

export const mockGuard: CanActivate = {
  canActivate: (context: ExecutionContext) => {
    const now = new Date().toISOString()
    const req = context.switchToHttp().getRequest()
    req.user = {
      refreshToken: mockUserDto.refreshToken,
      sub: now,
      username: mockUserDto.username,
    }
    return true
  },
}
