import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as SchemaClass } from 'mongoose'
import isEmail from 'validator/lib/isEmail'

export type UserDocument = HydratedDocument<User>

@Schema({ versionKey: false })
export class User {
  @Prop({ email: { validate: [isEmail, 'invalid email'] } })
  userName: string

  @Prop()
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User).index(
  { userName: 1 },
  { unique: true },
)
