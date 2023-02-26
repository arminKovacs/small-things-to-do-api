export type MockType<T> = {
  [P in keyof T]: jest.Mock<any>
}

export const createMockFunctions = <T>(...functionsToMock: (keyof T)[]) => {
  const functions = functionsToMock.reduce(
    (accumolator, currentValue) => ({
      ...accumolator,
      [currentValue]: jest.fn(),
    }),
    {},
  )

  return functions
}
