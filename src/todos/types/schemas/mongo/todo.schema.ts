import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as SchemaClass } from 'mongoose'

export type TodoDocument = HydratedDocument<Todo>

@Schema({ versionKey: false })
export class Todo {
  @Prop({
    required: true,
    minlength: 3,
    maxlength: 30,
  })
  title: string

  @Prop({ maxlength: 300 })
  description: string

  @Prop({
    required: true,
    type: SchemaClass.Types.Date,
  })
  dueDate: Date

  @Prop({
    required: true,
    type: SchemaClass.Types.Date,
  })
  creationDate: Date

  @Prop({ required: true })
  owner: string
}

export const TodoSchema = SchemaFactory.createForClass(Todo).index(
  { title: 1 },
  { unique: true },
)
