import { Module } from '@nestjs/common'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { TodosModule } from './modules/todos/todos.module'
import { AppConfigurationModule } from './infrastructure/configuration/app-configuration.module'
import { AppConfigurationService } from './infrastructure/configuration/app-configuration.service'
import { UsersModule } from './modules/users/users.module'

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
    TodosModule,
    UsersModule,
  ],
})
export class AppModule {}
