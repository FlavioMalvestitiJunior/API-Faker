import path from 'path'
import { type Server } from './Server'
import { readdirSync } from 'fs'
import { type RequestFile } from '../types/Requests'

export class RouterLoader {
  private readonly server: Server

  constructor (server: Server) {
    this.server = server
  }

  private cliRootDir (): string {
    const file = require.main ?? { filename: `${process.cwd()}/dist/index.js` }
    const root: string = path.dirname(file.filename)
    return root
  }

  private getRequestsMock (path: string): string[] {
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

  public async loadRoutes (): Promise<boolean> {
    try {
      const requestFilePath: string[] = this.getRequestsMock(`${this.cliRootDir()}/requests`)

      const requests: Array<Promise<RequestFile>> = requestFilePath.map(async (path: string) => {
        const request: RequestFile = await import(path)
        void await this.server.addRoute(request)
        console.log('adding Route: ', request.request.path)
        return request
      })

      await Promise.all(requests).then(() => {
        this.server.startServer()
      }).then(() => { this.server.addPageNotFound() })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
