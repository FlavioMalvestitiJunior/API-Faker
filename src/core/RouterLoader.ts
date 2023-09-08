import path from 'path'
import { type Server } from './Server'
import { readdirSync } from 'fs'
import { type RequestFileModule, type RequestFile } from '../types/Requests'

export class RouterLoader {
  private readonly server: Server

  constructor(server: Server) {
    this.server = server
  }

  private requestRootDir(rootDir?: string): string {
    const file = require.main ?? { filename: `${process.cwd()}/src/index.ts` }
    const root: string = rootDir ?? `${path.dirname(file.filename)}/requests`
    return root
  }

  public getRequestsMock(path: string): string[] {
    const entries = readdirSync(path, { withFileTypes: true })

    const mocks: string[] = entries.reduce((mocks: string[], entry) => {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        mocks.push(`${path}/${entry.name}`)
      }

      return mocks
    }, [])

    entries.forEach((entry) => {
      if (entry.isDirectory()) {
        const folderModules = this.getRequestsMock(`${path}/${entry.name}`)
        mocks.push(...folderModules)
      }
    })

    return mocks
  }

  public async loadRoutes(rootDir?: string, filesToLoad?: string[]): Promise<boolean> {
    try {
      const requestFilePath: string[] = this.getRequestsMock(`${this.requestRootDir(rootDir)}`)
      const routeFiles: string[] = filesToLoad ?? requestFilePath
      const requestsFromFile: Array<Promise<RequestFile>> = []

      for (const path of routeFiles) {
        const mockedRequestFile: RequestFileModule = await import(path)
        const mockedRequest: RequestFile | RequestFile[] = mockedRequestFile.default
        const requests: RequestFile[] = Array.isArray(mockedRequest) ? mockedRequest : [mockedRequest]

        for (const request of requests) {
          void await this.server.addRoute(request)
          console.log('adding Route: ', request.request.path)
          requestsFromFile.push(Promise.resolve(request))
        }
      }

      this.server.startServer()
      this.server.addPageNotFound()

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
