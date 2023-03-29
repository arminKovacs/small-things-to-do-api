import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { config } from 'dotenv'
import helmet from 'helmet'

async function bootstrap() {
  config()
  const app = await NestFactory.create(AppModule, { logger: console })
  app.use(helmet())
  await app.listen(3001)
}
bootstrap()
