import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport/dist'
import { AppConfigurationModule } from 'src/infrastructure/configuration/app-configuration.module'
import { AppConfigurationService } from 'src/infrastructure/configuration/app-configuration.service'
import { UsersModule } from 'src/modules/users/users.module'
import { UsersService } from 'src/modules/users/users.service'
import { Todo, TodoSchema } from 'src/types/schemas/mongo/todo.schema'
import { User, UserSchema } from 'src/types/schemas/mongo/users.schema'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './auth.controller'
import { MongoDatabaseService } from 'src/services/mongo-database/mongo-database.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    AppConfigurationModule,
    JwtModule.registerAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigurationService],
      useFactory: (appConfigService: AppConfigurationService) => ({
        secret: appConfigService.jwtSecretString,
        signOptions: { expiresIn: '60s' },
      }),
    }),
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy, MongoDatabaseService],
  controllers: [AuthController],
})
export class AuthModule { }
