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
import { AuthController } from './auth.controller'
import { MongoDatabaseService } from 'src/common/services/mongo-database.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler/dist/throttler.guard'

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
        signOptions: { expiresIn: '15m' },
      }),
    }),
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    RefreshTokenStrategy,
    MongoDatabaseService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
