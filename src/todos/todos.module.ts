import { Module } from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from '../types/schemas/mongo/todo.schema'
import { MongoDatabaseService } from 'src/services/mongo-database/mongo-database.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService, MongoDatabaseService],
})
export class TodosModule { }
