import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigurationService {
  private readonly _connectionString: string

  get connectionString(): string {
    return this._connectionString
  }

  constructor(private readonly _configService: ConfigService) {
    this._connectionString = this._getEnvConnectionStringFromFile()
  }

  private _getEnvConnectionStringFromFile(): string {
    const connectionString =
      this._configService.get<string>('MONGODB_CONNECTION')

    if (!connectionString) {
      throw new Error(
        'No connection string has been provided in the .env file.',
      )
    }

    return connectionString
  }
}
