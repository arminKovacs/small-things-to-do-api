import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  HttpCode,
} from '@nestjs/common'
import { TodosService } from './todos.service'
import { TodoBaseDto } from './dto/todo-base.dto'
import { AjvValidationPipe } from './validation/AjvValidationPipe'
import { todoBaseBodySchema } from './schemas/todo-base.body.schema'
import { todoIdPathSchema } from './schemas/todo-id.path.schema'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new AjvValidationPipe({ body: todoBaseBodySchema }))
  create(@Body() todoBaseDto: TodoBaseDto) {
    return this.todosService.create(todoBaseDto)
  }

  @Get()
  findAll() {
    return this.todosService.findAll()
  }

  @Get(':todoId')
  @UsePipes(new AjvValidationPipe({ param: todoIdPathSchema }))
  findOne(@Param('userId') userId: string, @Param('todoId') todoId: string) {
    return this.todosService.findOne(userId, todoId)
  }

  @Patch(':todoId')
  @UsePipes(
    new AjvValidationPipe({
      body: todoBaseBodySchema,
      param: todoIdPathSchema,
    }),
  )
  update(@Param('todoId') todoId: string, @Body() todoBaseDto: TodoBaseDto) {
    return this.todosService.update(+todoId, todoBaseDto)
  }

  @Delete(':todoId')
  @UsePipes(new AjvValidationPipe({ param: todoIdPathSchema }))
  remove(@Param('todoId') todoId: string) {
    return this.todosService.remove(+todoId)
  }
}
