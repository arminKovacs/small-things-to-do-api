import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'
import { MongoDatabaseService } from 'src/services/mongo-database/mongo-database.service'
import { TodosService } from './todos.service'
import { TodoBaseBodyDto } from './types/dto/todo-base.dto'
import { Todo, TodoDocument } from './types/schemas/mongo/todo.schema'

describe('TodosService', () => {
  let service: TodosService
  let databaseService: MongoDatabaseService

  const now = new Date()
  const oneDayFromNow = new Date(Date.now() + 86400000)
  const userId = 'test@testmail.com'
  const todoId = '6391f0543d1e59d387b67f66'
  const todoBase: TodoBaseBodyDto = {
    description: 'Take the trash from the kitchen to the trash compactor',
    title: 'Take out the trash',
    dueDate: oneDayFromNow.toISOString()
  }
  const testResponseDocument = {
    _id: new Types.ObjectId(todoId),
    title: 'Take out the trash',
    description: 'Take the trash from the kitchen to the trash compactor',
    owner: userId,
    creationDate: now,
    dueDate: oneDayFromNow,
  } as TodoDocument
  const mockDatabase = {
    createTodo: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        MongoDatabaseService,
        {
          provide: getModelToken(Todo.name),
          useValue: mockDatabase
        }
      ],
    }).compile()

    service = module.get<TodosService>(TodosService)
    databaseService = module.get<MongoDatabaseService>(MongoDatabaseService)
  })

  describe('Create', () => {
    it('should return a todo on successfull creation', async () => {
      jest.spyOn(databaseService, 'createTodo').mockResolvedValue(testResponseDocument)

      const result = await service.create(todoBase, userId)

      expect(result).toEqual(testResponseDocument)
    })

    it('should throw error if todo already exist with title', async () => {
      jest.spyOn(databaseService, 'createTodo').mockRejectedValue(({ code: 11000 }))

      await service.create(todoBase, userId).catch(error => {
        expect(error.response).toBe('Todo item already exists with this title.')
        expect(error.status).toBe(409)
      })
    })

    it('should throw error on Mongo database error', async () => {
      jest.spyOn(databaseService, 'createTodo').mockRejectedValue('This is a mongo error')

      await service.create(todoBase, userId).catch(error => {
        expect(error.response).toBe('Mongo database error.')
        expect(error.status).toBe(500)
      })
    })

  })

  describe('Find one', () => {
    it('should return a todo on successfull request', async () => {
      jest.spyOn(databaseService, 'findUsersTodo').mockResolvedValue(testResponseDocument)

      const result = await service.findOne(todoId)

      expect(result).toEqual(testResponseDocument)
    })

    it('should throw error if todo is not found', async () => {
      jest.spyOn(databaseService, 'findUsersTodo').mockResolvedValue(null)

      await service.findOne(todoId).catch(error => {
        expect(error.response).toBe(`Todo item does not exist with id ${todoId}.`)
        expect(error.status).toBe(404)
      })
    })

    it('should throw error on Mongo database error', async () => {
      jest.spyOn(databaseService, 'createTodo').mockRejectedValue('This is a mongo error')

      await service.create(todoBase, userId).catch(error => {
        expect(error.response).toBe('Mongo database error.')
        expect(error.status).toBe(500)
      })
    })
  })
})
