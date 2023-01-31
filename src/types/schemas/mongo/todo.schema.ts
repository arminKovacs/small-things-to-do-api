import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as SchemaClass, Types } from 'mongoose'

export type TodoDocument = HydratedDocument<Todo>
export type TodoLeanDocument = Todo & { _id: Types.ObjectId }

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
  dueDate: string

  @Prop({
    required: true,
    type: SchemaClass.Types.Date,
  })
  creationDate: string

  @Prop({ required: true })
  owner: string
}

export const TodoSchema = SchemaFactory.createForClass(Todo).index(
  { title: 1 },
  { unique: true },
)
