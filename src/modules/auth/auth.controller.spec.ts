import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mongoose'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { AuthController } from './auth.controller'
import {
  closeInMongoDbConnection,
  mockGuard,
  mockUserDto,
  rootMongooseTestModule,
} from 'src/utilities/unit-test-helper-functions'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from 'src/types/schemas/mongo/todo.schema'
import { User, UserSchema } from 'src/types/schemas/mongo/users.schema'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { AppConfigurationModule } from 'src/infrastructure/configuration/app-configuration.module'
import { JwtModule } from '@nestjs/jwt'
import { AppConfigurationService } from 'src/infrastructure/configuration/app-configuration.service'
import * as request from 'supertest'

describe('AuthController', () => {
  let app: INestApplication
  let connection: Connection
  let database: MongoDatabaseService

  const { username, password } = mockUserDto

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Todo.name, schema: TodoSchema },
          { name: User.name, schema: UserSchema },
        ]),
        UsersModule,
        PassportModule,
        AppConfigurationModule,
        JwtModule.registerAsync({
          imports: [AppConfigurationModule],
          inject: [AppConfigurationService],
          useFactory: (appConfigService: AppConfigurationService) => ({
            secret: appConfigService.jwtSecretString,
            signOptions: { expiresIn: '15m' },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtStrategy,
        RefreshTokenStrategy,
        MongoDatabaseService,
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue(mockGuard)
      .compile()

    database = module.get<MongoDatabaseService>(MongoDatabaseService)
    connection = await module.get(getConnectionToken())
    app = module.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await connection.close()
    await closeInMongoDbConnection()
  })

  describe('Signup', () => {
    it('should return tokens on success', async () => {
      const response = await request(app.getHttpServer())
        .post('/signup')
        .send({ username, password })
        .expect(201)

      expect(response.text).toContain('accessToken')
      expect(response.text).toContain('refreshToken')

      await database.deleteUser(username)
    })
  })
})
