import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'
import { AppConfigurationService } from 'src/infrastructure/configuration/app-configuration.service'
import { UserDto } from 'src/types/dto/user-base.dto'
import { UserLeanDocument } from 'src/types/schemas/mongo/users.schema'
import {
  createMockFunctions,
  MockType,
} from 'src/utilities/unit-test-helper-functions'
import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService
  let userService: MockType<UsersService>

  const userId = '6391f0543d1e59d387b67f66'
  const userInput: UserDto = {
    username: 'test@email.com',
    password: 'password',
  }
  const hashedPassword =
    '$2a$10$FTAkgbpT9V22RpHwsLnsFeQgo4P9ickwOWpNYjK2Ytf.F8/4KQ8.2'
  const retrievedUser: UserLeanDocument = {
    ...userInput,
    password: hashedPassword,
    refreshToken: 'jwt.refreshing.token',
    _id: new Types.ObjectId(userId),
  }
  const testResponseTokens = {
    accessToken: 'jwt.access.token',
    refreshToken: 'jwt.refresh.token',
  }
  const mockUserService = createMockFunctions<UsersService>(
    'create',
    'findUser',
    'updateUser',
  )

  beforeEach(async () => {
    jest.restoreAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: AppConfigurationService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get(UsersService)
  })

  describe('Signup', () => {
    it('should return jwt tokens if successful', async () => {
      userService.findUser.mockResolvedValue(null)
      userService.create.mockResolvedValue(retrievedUser)
      service.getTokens = jest
        .fn()
        .mockResolvedValue(Promise.resolve(testResponseTokens))

      const result = await service.signup(userInput)

      expect(result).toEqual(testResponseTokens)
    })

    it('should return error if user already registered', async () => {
      userService.findUser.mockResolvedValue(retrievedUser)

      await service.signup(userInput).catch((error) => {
        expect(error.response).toBe('User already exists.')
        expect(error.status).toBe(400)
      })
    })
  })

  describe('Signin', () => {
    it('should return jwt tokens if successful', async () => {
      userService.findUser.mockResolvedValue(retrievedUser)
      service.getTokens = jest
        .fn()
        .mockResolvedValue(Promise.resolve(testResponseTokens))

      const result = await service.signIn(userInput)

      expect(result).toEqual(testResponseTokens)
    })

    it("should return error if user didn't register before", async () => {
      userService.findUser.mockResolvedValue(null)

      await service.signIn(userInput).catch((error) => {
        expect(error.response).toBe('Wrong credentails or user does not exist.')
        expect(error.status).toBe(400)
      })
    })

    it("should return error if password is invalid", async () => {
      userService.findUser.mockResolvedValue({ ...retrievedUser, password: 'password' })

      await service.signIn(userInput).catch((error) => {
        expect(error.response).toBe('Wrong credentails or user does not exist.')
        expect(error.status).toBe(400)
      })
    })
  })
})
