import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigurationService {
  private readonly _connectionString: string
  private readonly _jwtSecretString: string

  get connectionString(): string {
    return this._connectionString
  }
  get jwtSecretString(): string {
    return this._jwtSecretString
  }

  constructor(private readonly _configService: ConfigService) {
    this._connectionString = this._getEnvConnectionStringFromFile()
    this._jwtSecretString = this._getEnvJwtSecretStringFromFile()
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

  private _getEnvJwtSecretStringFromFile(): string {
    const jwtSecret = this._configService.get<string>('JWT_SECRET')

    if (!jwtSecret) {
      throw new Error('No JWT string has been provided in the .env file.')
    }

    return jwtSecret
  }
}
