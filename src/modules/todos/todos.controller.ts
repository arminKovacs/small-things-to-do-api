import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common'
import { AjvValidationPipe } from 'src/common/pipes/AjvValidationPipe'
import { TodoBaseBodyDto } from '../../types/dto/todo-base.dto'
import { todoBaseBodySchema } from '../../types/schemas/json-schemas/todo-base.body.schema'
import { TodosService } from './todos.service'
import { todoIdPathSchema } from '../../types/schemas/json-schemas/todo-id.path.schema'
import { updateTodoBaseBodySchema } from '../../types/schemas/json-schemas/update-todo-base.body.schema'
import { AuthRequest } from 'src/types/auth-request'
import { AccessTokenGuard } from 'src/modules/auth/guards/access-token.guard'

@UseGuards(AccessTokenGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(201)
  create(
    @Body(new AjvValidationPipe(todoBaseBodySchema))
    todoBaseDto: TodoBaseBodyDto,
    @Request() req: AuthRequest,
  ) {
    const { username } = req.user
    return this.todosService.create(todoBaseDto, username)
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    const { username } = req.user
    return this.todosService.findAll(username)
  }

  @Get(':todoId')
  findOne(
    @Param('todoId', new AjvValidationPipe(todoIdPathSchema)) todoId: string,
  ) {
    return this.todosService.findOne(todoId)
  }

  @Patch(':todoId')
  update(
    @Param('todoId', new AjvValidationPipe(todoIdPathSchema)) todoId: string,
    @Body(new AjvValidationPipe(updateTodoBaseBodySchema))
    todoBase: TodoBaseBodyDto,
  ) {
    return this.todosService.update(todoId, todoBase)
  }

  @Delete(':todoId')
  @HttpCode(204)
  remove(
    @Param('todoId', new AjvValidationPipe(todoIdPathSchema)) todoId: string,
  ) {
    return this.todosService.remove(todoId)
  }
}
