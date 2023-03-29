import { INestApplication } from '@nestjs/common/interfaces'
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'mongoose'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { TodoBaseBodyDto } from 'src/types/dto/todo-base.dto'
import {
  Todo,
  TodoLeanDocument,
  TodoSchema,
} from 'src/types/schemas/mongo/todo.schema'
import { User, UserSchema } from 'src/types/schemas/mongo/users.schema'
import {
  closeInMongoDbConnection,
  mockUserDto,
  mockGuard,
  rootMongooseTestModule,
} from 'src/utilities/unit-test-helper-functions'
import { AccessTokenGuard } from '../auth/guards/access-token.guard'
import { TodosController } from './todos.controller'
import { TodosService } from './todos.service'
import * as request from 'supertest'

describe('TodosController', () => {
  let app: INestApplication
  let connection: Connection
  let database: MongoDatabaseService

  const oneDayFromNow = new Date(Date.now() + 86400000).toISOString()
  const { username } = mockUserDto
  const todoBase: TodoBaseBodyDto = {
    description: 'Take the trash from the kitchen to the trash compactor',
    title: 'Take out the trash',
    dueDate: oneDayFromNow,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Todo.name, schema: TodoSchema },
          { name: User.name, schema: UserSchema },
        ]),
      ],
      controllers: [TodosController],
      providers: [TodosService, MongoDatabaseService],
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

  it('should be protected by jwt auth', () => {
    const guards = Reflect.getMetadata('__guards__', TodosController)
    const guard = new guards[0]()
    expect(guard).toBeInstanceOf(AccessTokenGuard)
  })

  describe('Create', () => {
    it('should return the created todo item', async () => {
      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(todoBase)
        .expect(201)

      expect.objectContaining<TodoLeanDocument>(response.body)
      await database.deleteTodo(
        (response.body as TodoLeanDocument)._id.toString(),
      )
    })

    it('should return error if wrong schema is sent as body', async () => {
      const response = await request(app.getHttpServer())
        .post('/todos')
        .send({ ...todoBase, extraField: 'test' })
        .expect(400)

      expect(response.body.message).toContain('Validation failed for body')
    })
  })

  describe("Find all user's todos", () => {
    it('should return all todo items', async () => {
      const createdTodo = await database.createTodo(
        { ...todoBase, title: 'new todo here' },
        username,
      )
      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200)

      expect.objectContaining<Array<TodoLeanDocument>>(response.body)
      expect(response.body.length).toBe(1)
      await database.deleteTodo(createdTodo._id.toString())
    })

    it("should return empty todo list if user hasn't created any yet", async () => {
      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200)

      expect(response.body.length).toBe(0)
    })
  })

  describe('Find todo by id', () => {
    it('should return todo item on success', async () => {
      const createdTodo = await database.createTodo(todoBase, username)
      const response = await request(app.getHttpServer())
        .get(`/todos/${createdTodo._id.toString()}`)
        .expect(200)

      expect.objectContaining<TodoLeanDocument>(response.body)
      await database.deleteTodo(createdTodo._id.toString())
    })

    it('should return error if wrong todo id schema in param', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos/123')
        .expect(400)

      expect(response.body.message).toContain('Validation failed for param')
    })
  })

  describe('Update todo by id', () => {
    it('should return todo item on success', async () => {
      const createdTodo = await database.createTodo(todoBase, username)
      const response = await request(app.getHttpServer())
        .patch(`/todos/${createdTodo._id.toString()}`)
        .send(todoBase)
        .expect(200)

      expect.objectContaining<TodoLeanDocument>(response.body)
      await database.deleteTodo(createdTodo._id.toString())
    })

    it('should return error if wrong todo id schema in param', async () => {
      const response = await request(app.getHttpServer())
        .patch('/todos/123')
        .send(todoBase)
        .expect(400)

      expect(response.body.message).toContain('Validation failed for param')
    })

    it('should return error if wrong schema in body', async () => {
      const response = await request(app.getHttpServer())
        .patch('/todos/123')
        .send({ ...todoBase, extraField: 'test' })
        .expect(400)

      expect(response.body.message).toContain('Validation failed for body')
    })
  })

  describe('Remove todo by id', () => {
    it('should return todo item on successful deletion', async () => {
      const createdTodo = await database.createTodo(todoBase, username)
      const response = await request(app.getHttpServer())
        .delete(`/todos/${createdTodo._id.toString()}`)
        .send(todoBase)
        .expect(204)

      expect.objectContaining<TodoLeanDocument>(response.body)
    })

    it('should return error if wrong todo id schema in param', async () => {
      const response = await request(app.getHttpServer())
        .delete('/todos/123')
        .send(todoBase)
        .expect(400)

      expect(response.body.message).toContain('Validation failed for param')
    })
  })
})
