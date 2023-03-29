import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { TodosModule } from './modules/todos/todos.module'
import { AppConfigurationModule } from './infrastructure/configuration/app-configuration.module'
import { AppConfigurationService } from './infrastructure/configuration/app-configuration.service'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { LoggerMiddleware } from './common/middleware/logger.middleware'

@Module({
  imports: [
    AppConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigurationService],
      useFactory: (appConfigService: AppConfigurationService) => {
        const options: MongooseModuleOptions = {
          uri: appConfigService.connectionString,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
        return options
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TodosModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
