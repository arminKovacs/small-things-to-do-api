import { Module } from '@nestjs/common'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { TodosModule } from './todos/todos.module'
import { AppConfigurationModule } from './infrastructure/configuration/app-configuration.module'
import { AppConfigurationService } from './infrastructure/configuration/app-configuration.service'

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
  ],
})
export class AppModule {}
