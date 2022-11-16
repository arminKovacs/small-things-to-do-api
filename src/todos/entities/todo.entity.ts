export class Todo<T extends Date | string> {
  id: string
  title: string
  description: string
  dueDate: T
  creationDate: T
  owner: string
}
