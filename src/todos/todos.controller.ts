import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { AjvValidationPipe } from '../pipes/AjvValidationPipe'
import { TodoBaseBodyDto } from './types/dto/todo-base.dto'
import { UserIdAndTodoIdPathDto } from './types/dto/user-and-todo-id.path.dto'
import { UserIdPathDto } from './types/dto/user-id-path.dto'
import { todoBaseBodySchema } from './types/schemas/json-schemas/todo-base.body.schema'
import { userAndTodoIdPathSchema } from './types/schemas/json-schemas/user-and-todo-id.path.schema'
import { userIdPathSchema } from './types/schemas/json-schemas/user-id.path.schema'
import { TodosService } from './todos.service'

@Controller('users/:userId/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(201)
  create(
    @Param(new AjvValidationPipe(userIdPathSchema)) params: UserIdPathDto,
    @Body(new AjvValidationPipe(todoBaseBodySchema))
    todoBaseDto: TodoBaseBodyDto,
  ) {
    return this.todosService.create(todoBaseDto, params.userId)
  }

  @Get()
  findAll(
    @Param(new AjvValidationPipe(userIdPathSchema)) params: UserIdPathDto,
  ) {
    return this.todosService.findAll(params.userId)
  }

  @Get(':todoId')
  findOne(
    @Param(new AjvValidationPipe(userAndTodoIdPathSchema))
    params: UserIdAndTodoIdPathDto,
  ) {
    return this.todosService.findOne(params.todoId)
  }

  @Patch(':todoId')
  update(
    @Param(new AjvValidationPipe(userAndTodoIdPathSchema))
    params: UserIdAndTodoIdPathDto,
    @Body(new AjvValidationPipe(todoBaseBodySchema)) todoBase: TodoBaseBodyDto,
  ) {
    return this.todosService.update(params.todoId, todoBase)
  }

  @Delete(':todoId')
  remove(
    @Param(new AjvValidationPipe(userAndTodoIdPathSchema))
    params: UserIdAndTodoIdPathDto,
  ) {
    return this.todosService.remove(params.todoId)
  }
}
