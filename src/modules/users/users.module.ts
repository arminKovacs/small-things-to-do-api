import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/types/schemas/mongo/users.schema'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { Todo, TodoSchema } from 'src/types/schemas/mongo/todo.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MongoDatabaseService],
})
export class UsersModule {}
