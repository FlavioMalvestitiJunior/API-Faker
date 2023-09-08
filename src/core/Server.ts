import express from 'express'
import { type Express } from 'express-serve-static-core'
import { type RequestFile, type Request, type Response, type ResponseCallback, type ProcessedRequest } from '../types/Requests'
import type * as http from 'http'

export class Server {
  private readonly app: Express = express()
  private readonly supportedMethods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE']
  private readonly port: number
  private readonly host: string
  private readonly routes: any = {}
  public server: http.Server | undefined

  constructor (port: number = 3030, host: string = '0.0.0.0') {
    this.port = port
    this.host = host
    this.app.use((req, res, next) => { this.mountResponse(req, res, next) })
  }

  public get ExpressServer (): http.Server | undefined {
    return this.server
  }

  public stopServer (): void {
    this.server?.close()
  }

  public startServer (): void {
    this.server = this.app.listen(this.port, this.host, () => {
      console.log(`server listening on ${this.host}:${this.port}`)
    })
  }

  public addPageNotFound (): void {
    console.log('adding 404 default response ')
    this.app.use('*', (req, res) => {
      res.status(404).send({ message: '404: Page not Found' })
    })
  }

  private mountResponse (req: any, res: any, next: any): void {
    const route = this.routes[req.originalUrl] ?? {}
    const mock: ProcessedRequest = route[req.method]

    if (!mock) {
      next()
    }

    void mock.callback(req).then((response: Response) => {
      res.status(response.statusCode).send(response.data)
    })
  }

  public async addRoute (route: RequestFile, callback?: ResponseCallback): Promise<boolean> {
    const request: Request = route.request
    const method: string | undefined = this.supportedMethods.find((supportedMethod) => supportedMethod === request.method)
    const finalCallback: ResponseCallback = callback ?? (async (request: any) => route.response)

    if (!method) {
      throw new Error(`Unsupported method: ${request.method} on Route: ${request.path}`)
    }
    const requestRoute: ProcessedRequest = {
      callback: finalCallback,
      requestRoute: route
    }

    const mockedMethods: any = this.routes[request.path] ?? {}
    mockedMethods[request.method] = requestRoute

    this.routes[request.path] = mockedMethods
    return true
  }
}
