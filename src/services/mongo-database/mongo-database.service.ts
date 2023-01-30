import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Todo, TodoDocument } from 'src/types/schemas/mongo/todo.schema'
import { TodoBaseBodyDto } from 'src/types/dto/todo-base.dto'

type TodoReturnType = Todo & { _id: Types.ObjectId }

@Injectable()
export class MongoDatabaseService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) { }

  async createTodo(
    todoBase: TodoBaseBodyDto,
    owner: string,
  ): Promise<TodoReturnType> {
    const creationDate = new Date()
    const createdTodo = new this.todoModel({ ...todoBase, owner, creationDate })

    return await createdTodo.save()
  }

  async updateTodo(
    todoBase: TodoBaseBodyDto,
    todoId: string,
  ): Promise<TodoReturnType | null> {
    return await this.todoModel.findByIdAndUpdate(todoId, todoBase, {
      new: true,
    }).lean().exec()
  }

  async findTodo(_id: string): Promise<TodoReturnType | null> {
    const todo = await this.todoModel.findById(_id).lean().exec()

    return todo
  }

  async findUsersTodo(owner: string): Promise<TodoReturnType[] | null> {
    const todos = await this.todoModel.find({ owner }).lean().exec()

    return todos
  }

  async deleteTodo(_id: string): Promise<TodoReturnType | null> {
    return await this.todoModel.findByIdAndDelete(_id).lean().exec()
  }


}
