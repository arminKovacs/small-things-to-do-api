import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { UserDto } from 'src/types/dto/user-base.dto'
import { createMockFunctions, MockType } from 'src/utilities/unit-test-helper-functions'
import { UsersService } from './users.service'

describe('UsersService', () => {
  let service: UsersService
  let databaseService: MockType<MongoDatabaseService>

  const username = 'John Test'
  const userId = '6391f0543d1e59d387b67f66'
  const refreshToken = 'jwt.refresh.token'
  const userDto: UserDto = {
    username,
    password: 'password',
    refreshToken
  }
  const retrievedUser = {
    _id: new Types.ObjectId(userId),
    ...userDto
  }
  const mockDatabaseService = createMockFunctions<MongoDatabaseService>(
    'createUser',
    'findUser',
    'findUserById',
    'updateUser'
  )

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MongoDatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    databaseService = module.get<MockType<MongoDatabaseService>>(MongoDatabaseService)
  })

  describe('Create', () => {
    it('should return user on successfull creation', async () => {
      databaseService.createUser.mockResolvedValue(retrievedUser)

      const result = await service.create(userDto)

      expect(result).toEqual(retrievedUser)
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.createUser.mockRejectedValue('Mongo error')

      await service.create(userDto).catch((error) => {
        expect(error.response).toBe('Mongo database error while creating user.')
        expect(error.status).toBe(500)
      })
    })
  })

  describe('Find user', () => {
    it('should return user on successfull search', async () => {
      databaseService.findUser.mockResolvedValue(retrievedUser)

      const result = await service.findUser(username)

      expect(result).toEqual(retrievedUser)
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.findUser.mockRejectedValue('Mongo error')

      await service.findUser(username).catch((error) => {
        expect(error.response).toBe('Mongo database error while retrieving user.')
        expect(error.status).toBe(500)
      })
    })
  })

  describe('Find user by id', () => {
    it('should return user on successfull search', async () => {
      databaseService.findUserById.mockResolvedValue(retrievedUser)

      const result = await service.findUserById(userId)

      expect(result).toEqual(retrievedUser)
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.findUser.mockRejectedValue('Mongo error')

      await service.findUser(username).catch((error) => {
        expect(error.response).toBe('Mongo database error while retrieving user.')
        expect(error.status).toBe(500)
      })
    })
  })

  describe('Update user', () => {
    it('should return user on successfull update', async () => {
      databaseService.updateUser.mockResolvedValue(retrievedUser)

      const result = await service.updateUser(userId, userDto)

      expect(result).toEqual(retrievedUser)
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.updateUser.mockRejectedValue('Mongo error')

      await service.updateUser(userId, userDto).catch((error) => {
        expect(error.response).toBe('Mongo database error while retrieving user.')
        expect(error.status).toBe(500)
      })
    })

    it('should throw error if user doesn not exist', async () => {
      databaseService.updateUser.mockResolvedValue(null)

      await service.updateUser(userId, userDto).catch((error) => {
        expect(error.response).toBe('User does not exist.')
        expect(error.status).toBe(404)
      })
    })
  })
})
