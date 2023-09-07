import express from 'express'
import { type Express } from 'express-serve-static-core'
import { type RequestFile, type Request, type Response, type ResponseCallback } from '../types/Requests'
import type * as http from 'http'

export class Server {
  private readonly app: Express = express()
  private readonly supportedMethods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE']
  private readonly port: number
  private readonly host: string
  public server: http.Server | undefined

  constructor (port: number = 3030, host: string = '0.0.0.0') {
    this.port = port
    this.host = host
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

  private mountResponse (mockedResponse: Response, callback: ResponseCallback): any {
    return async (request: any, response: any) => {
      const callbackResponse: Response = await callback(request)
      const finalResponse: Response = callbackResponse || mockedResponse

      response.status(finalResponse.statusCode).send(finalResponse.data)
    }
  }

  public async addRoute (route: RequestFile, callback?: ResponseCallback): Promise<boolean> {
    const request: Request = route.request
    const method: string | undefined = this.supportedMethods.find((supportedMethod) => supportedMethod === request.method)
    const finalCallback: ResponseCallback = callback ?? (async (request: any) => route.response)

    if (!method) {
      throw new Error(`Unsupported method: ${request.method} on Route: ${request.path}`)
    }
    const expressMethod: string = request.method.toLowerCase()

    this.app[expressMethod as keyof typeof this.app](request.path, this.mountResponse(route.response, finalCallback))
    return true
  }
}
