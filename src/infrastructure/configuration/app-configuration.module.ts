import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppConfigurationService } from './app-configuration.service'

@Module({
  exports: [AppConfigurationService],
  imports: [ConfigModule.forRoot()],
  providers: [AppConfigurationService],
})
export class AppConfigurationModule {}
