import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import isEmail from 'validator/lib/isEmail'

export type UserDocument = HydratedDocument<User>
export type UserLeanDocument = User & { _id: Types.ObjectId }

@Schema({ versionKey: false })
export class User {
  @Prop({ email: { validate: [isEmail, 'invalid email'] }, required: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop()
  refreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User).index(
  { username: 1 },
  { unique: true },
)
