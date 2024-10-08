import { Module } from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodosController } from './todos.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from '../../types/schemas/mongo/todo.schema'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { User, UserSchema } from 'src/types/schemas/mongo/users.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TodosController],
  providers: [TodosService, MongoDatabaseService],
})
export class TodosModule {}
