import { describe, test, expect, beforeAll } from 'vitest'
import { Server } from './Server'
import { RouterLoader } from './RouterLoader'

describe('Router unit tests', () => {
  let server: Server
  let routerLoader: RouterLoader

  beforeAll(async () => {
    server = new Server()
    routerLoader = new RouterLoader(server)
  })

  test('Request importer is able to navigate inside requests dir and find files', async () => {
    const requestsPath: string = `${process.cwd()}/src/test/requests`
    const files: string[] = routerLoader.getRequestsMock(requestsPath)
    const expectedFiles: string[] = ['healthCheck.json', 'testRequest.json', 'testRequestArray.json']

    for (const file of files) {
      const expectedFile: string = expectedFiles.find((expf) => file.endsWith(expf)) ?? 'notFound'
      const expression: RegExp = new RegExp(`^.*/${expectedFile}`)
      expect(file).toMatch(expression)
    }
  })

  test('Fail to load Routes by an invalid file', async () => {
    const fileToLoad: string[] = ['./src/test/requestsWithError/testErrorLoad.json']
    const rootDir: string | undefined = undefined
    const loadedRoutes: boolean = await routerLoader.loadRoutes(rootDir, fileToLoad)
    expect(loadedRoutes).toBe(false)
  })
})
