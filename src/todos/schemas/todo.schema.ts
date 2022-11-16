import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Schema as SchemaClass } from "mongoose"

export type TodoDocument = HydratedDocument<Todo>

@Schema()
export class Todo {
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 30
    })
    title: string

    @Prop({ maxlength: 30 })
    description: string

    @Prop({ required: true })
    dueDate: SchemaClass.Types.Date

    @Prop({ required: true })
    creationDate: SchemaClass.Types.Date

    @Prop({ required: true })
    owner: string
}

export const TodoSchema = SchemaFactory.createForClass(Todo)
