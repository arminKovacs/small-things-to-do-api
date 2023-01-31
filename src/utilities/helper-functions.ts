import { HttpException, HttpStatus } from '@nestjs/common'

export const dateChecker = (dueDate: string, creationDate?: string): void => {
  if (
    new Date(dueDate) < (creationDate ? new Date(creationDate) : new Date())
  ) {
    throw new HttpException(
      `Due date cannot be before creation date.`,
      HttpStatus.CONFLICT,
    )
  }
}
