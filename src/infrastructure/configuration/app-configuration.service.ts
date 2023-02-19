import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigurationService {
  private readonly _connectionString: string
  private readonly _jwtSecretString: string
  private readonly _jwtRefreshSecretString: string

  get connectionString(): string {
    return this._connectionString
  }
  get jwtSecretString(): string {
    return this._jwtSecretString
  }
  get jwtRefreshSecretString(): string {
    return this._jwtRefreshSecretString
  }

  constructor(private readonly _configService: ConfigService) {
    this._connectionString = this.getEnvConnectionStringFromFile()
    this._jwtSecretString = this.getEnvJwtSecretStringFromFile()
    this._jwtRefreshSecretString = this.getEnvJwtRefreshSecretStringFromFile()
  }

  private getEnvConnectionStringFromFile(): string {
    const connectionString =
      this._configService.get<string>('MONGODB_CONNECTION')

    if (!connectionString) {
      throw new Error(
        'No connection string has been provided in the .env file.',
      )
    }

    return connectionString
  }

  private getEnvJwtSecretStringFromFile(): string {
    const jwtSecret = this._configService.get<string>('JWT_SECRET')

    if (!jwtSecret) {
      throw new Error('No JWT string has been provided in the .env file.')
    }

    return jwtSecret
  }

  private getEnvJwtRefreshSecretStringFromFile(): string {
    const jwtRefreshSecret =
      this._configService.get<string>('JWT_REFRESH_SECRET')

    if (!jwtRefreshSecret) {
      throw new Error(
        'No JWT refresh string has been provided in the .env file.',
      )
    }

    return jwtRefreshSecret
  }
}
