import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { TodosService } from './todos.service'
import { TodoBaseBodyDto } from '../../types/dto/todo-base.dto'
import { TodoLeanDocument } from '../../types/schemas/mongo/todo.schema'
import {
  createMockFunctions,
  MockType,
} from 'src/utilities/unit-test-helper-functions'

describe('TodosService', () => {
  let service: TodosService
  let databaseService: MockType<MongoDatabaseService>

  const now = new Date().toISOString()
  const oneDayFromNow = new Date(Date.now() + 86400000).toISOString()
  const username = 'test@testmail.com'
  const todoId = '6391f0543d1e59d387b67f66'
  const todoBase: TodoBaseBodyDto = {
    description: 'Take the trash from the kitchen to the trash compactor',
    title: 'Take out the trash',
    dueDate: oneDayFromNow,
  }
  const faultyTodoBase = {
    ...todoBase,
    dueDate: new Date(Date.now() - 86400000).toISOString(),
  }
  const testResponseDocument: TodoLeanDocument = {
    _id: new Types.ObjectId(todoId),
    title: 'Take out the trash',
    description: 'Take the trash from the kitchen to the trash compactor',
    owner: username,
    creationDate: now,
    dueDate: oneDayFromNow,
  }
  const mockDatabaseService = createMockFunctions<MongoDatabaseService>(
    'createTodo',
    'deleteTodo',
    'updateTodo',
    'findTodo',
    'findUsersTodo',
  )

  beforeEach(async () => {
    jest.restoreAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: MongoDatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile()

    service = module.get<TodosService>(TodosService)
    databaseService = module.get(MongoDatabaseService)
  })

  describe('Create', () => {
    it('should return todo on successfull creation', async () => {
      databaseService.createTodo.mockResolvedValue(testResponseDocument)

      const result = await service.create(todoBase, username)

      expect(result).toEqual(testResponseDocument)
    })

    it('should throw error due date is before creation date', async () => {
      await service.create(faultyTodoBase, username).catch((error) => {
        expect(error.response).toBe('Due date cannot be before creation date.')
        expect(error.status).toBe(409)
      })
    })

    it('should throw error if todo already exist with title', async () => {
      databaseService.createTodo.mockRejectedValue({ code: 11000 })

      await service.create(todoBase, username).catch((error) => {
        expect(error.response).toBe('Todo item already exists with this title.')
        expect(error.status).toBe(409)
      })
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.createTodo.mockRejectedValue('This is a mongo error')

      await service.create(todoBase, username).catch((error) => {
        expect(error.response).toBe(
          'Mongo database error while creating todo item.',
        )
        expect(error.status).toBe(500)
      })
    })
  })

  describe('Update', () => {
    it('should return todo on successfull update', async () => {
      databaseService.findTodo.mockResolvedValue(testResponseDocument)
      databaseService.updateTodo.mockResolvedValue(testResponseDocument)

      const result = await service.update(todoId, todoBase)

      expect(result).toEqual(testResponseDocument)
    })

    it('should throw error due date is before original creation date', async () => {
      databaseService.findTodo.mockResolvedValue(testResponseDocument)

      await service.update(todoId, faultyTodoBase).catch((error) => {
        expect(error.response).toBe('Due date cannot be before creation date.')
        expect(error.status).toBe(409)
      })
    })

    it('should throw error if todo already exists with title', async () => {
      databaseService.findTodo.mockResolvedValue(testResponseDocument)
      databaseService.updateTodo.mockRejectedValue({ code: 11000 })

      await service.update(todoId, todoBase).catch((error) => {
        expect(error.response).toBe('Todo item already exists with this title.')
        expect(error.status).toBe(409)
      })
    })

    it('should throw error on Mongo database error while retrieving todo', async () => {
      databaseService.findTodo.mockRejectedValue('This is a mongo error')

      await service.update(todoId, todoBase).catch((error) => {
        expect(error.response).toBe(
          'Mongo database error while retrieving todo item.',
        )
        expect(error.status).toBe(500)
      })
    })

    it('should throw error on Mongo database error while updating todo', async () => {
      databaseService.findTodo.mockResolvedValue(testResponseDocument)
      databaseService.updateTodo.mockRejectedValue('This is a mongo error')

      await service.update(todoId, todoBase).catch((error) => {
        expect(error.response).toBe(
          'Mongo database error while updating todo item.',
        )
        expect(error.status).toBe(500)
      })
    })
  })

  describe('Find users todos', () => {
    it('should return todo on successfull request', async () => {
      databaseService.findUsersTodo.mockResolvedValue([testResponseDocument])

      const result = await service.findAll(username)

      expect(result).toEqual([testResponseDocument])
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.findUsersTodo.mockRejectedValue('This is a mongo error')

      await service.findAll(username).catch((error) => {
        expect(error.response).toBe(
          'Mongo database error while retrieving todo items.',
        )
        expect(error.status).toBe(500)
      })
    })
  })

  describe('Find one', () => {
    it('should return todo on successfull request', async () => {
      databaseService.findTodo.mockResolvedValue(testResponseDocument)

      const result = await service.findOne(todoId)

      expect(result).toEqual(testResponseDocument)
    })

    it('should throw error if todo is not found', async () => {
      databaseService.findTodo.mockResolvedValue(null)

      await service.findOne(todoId).catch((error) => {
        expect(error.response).toBe(
          `Todo item does not exist with id ${todoId}.`,
        )
        expect(error.status).toBe(404)
      })
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.findTodo.mockRejectedValue('This is a mongo error')

      await service.findOne(todoId).catch((error) => {
        expect(error.response).toBe(
          'Mongo database error while retrieving todo item.',
        )
        expect(error.status).toBe(500)
      })
    })
  })

  describe('Delete', () => {
    it('should return deleted todo on successfull request', async () => {
      databaseService.deleteTodo.mockResolvedValue(testResponseDocument)

      const result = await service.remove(todoId)

      expect(result).toEqual(testResponseDocument)
    })

    it('should throw error if todo is not found', async () => {
      databaseService.deleteTodo.mockResolvedValue(null)

      await service.remove(todoId).catch((error) => {
        expect(error.response).toBe(
          `Todo item does not exist with id ${todoId}.`,
        )
        expect(error.status).toBe(404)
      })
    })

    it('should throw error on Mongo database error', async () => {
      databaseService.deleteTodo.mockRejectedValue('This is a mongo error')

      await service.remove(todoId).catch((error) => {
        expect(error.response).toBe(
          'Mongo database error while retrieving todo item.',
        )
        expect(error.status).toBe(500)
      })
    })
  })
})
