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
import { TodoIdPathDto } from './types/dto/todo-id.path.dto'
import { todoBaseBodySchema } from './types/schemas/json-schemas/todo-base.body.schema'
import { TodosService } from './todos.service'
import { todoIdPathSchema } from './types/schemas/json-schemas/todo-id.path.schema'
import { updateTodoBaseBodySchema } from './types/schemas/json-schemas/update-todo-base,body.schema'

@Controller('/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Post()
  @HttpCode(201)
  create(
    @Body(new AjvValidationPipe(todoBaseBodySchema))
    todoBaseDto: TodoBaseBodyDto,
  ) {
    //TODO retrieve email from JWT token instead of hardcoding
    return this.todosService.create(todoBaseDto, 'test@testmail.com')
  }

  @Get()
  findAll() {
    //TODO retrieve email from JWT token instead of hardcoding
    return this.todosService.findAll('test@testmail.com')
  }

  @Get(':todoId')
  findOne(
    @Param(new AjvValidationPipe(todoIdPathSchema))
    params: TodoIdPathDto,
  ) {
    return this.todosService.findOne(params.todoId)
  }

  @Patch(':todoId')
  update(
    @Param(new AjvValidationPipe(todoIdPathSchema)) params: TodoIdPathDto,
    @Body(new AjvValidationPipe(updateTodoBaseBodySchema)) todoBase: TodoBaseBodyDto,
  ) {
    return this.todosService.update(params.todoId, todoBase)
  }

  @Delete(':todoId')
  @HttpCode(204)
  remove(
    @Param(new AjvValidationPipe(todoIdPathSchema))
    params: TodoIdPathDto,
  ) {
    return this.todosService.remove(params.todoId)
  }
}
