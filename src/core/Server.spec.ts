import { type Request, type Response } from '../types/Requests'
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import testRequest from '../../src/test/requests/test/testRequest.json'
import testRequestWithParameter from '../../src/test/requests/test/testRequestWithParameter.json'
import testRequestArray from '../../src/test/requests/test/testRequestArray.json'
import request from 'supertest'
import { Server } from './Server'
import { RouterLoader } from './RouterLoader'

describe('Server Integration tests', () => {
  let server: Server
  let routerLoader: RouterLoader

  beforeEach(async () => {
    server = new Server()
    routerLoader = new RouterLoader(server)
    void await routerLoader.loadRoutes('./src/test')
  })

  afterEach(() => {
    server.stopServer()
  })

  test('check if server is importing and processing request mock file', async () => {
    const requestFromFile: Request = testRequest.request
    const mockedResponse: Response = testRequest.response
    const res = await request(server.ExpressServer).get(requestFromFile.path)
    expect(res.statusCode).toBe(mockedResponse.statusCode)
    expect(res.body).toStrictEqual(mockedResponse.data)
  })

  test('Check if requests with parameter are being rightly processed', async () => {
    const requestFromFile: Request = testRequestWithParameter.request
    const mockedResponse: Response = testRequestWithParameter.response
    const res = await request(server.ExpressServer).get(requestFromFile.path)
    expect(res.statusCode).toBe(mockedResponse.statusCode)
    expect(res.body).toStrictEqual(mockedResponse.data)
  })

  test('check if server is importing and processing request mock file when it`s have an array of requests', async () => {
    for (const testRequest of testRequestArray) {
      const requestFromFile: Request = testRequest.request
      const mockedResponse: Response = testRequest.response
      const res = await request(server.ExpressServer).get(requestFromFile.path)
      expect(res.statusCode).toBe(mockedResponse.statusCode)
      expect(res.body).toStrictEqual(mockedResponse.data)
    }
  })

  test('Test 404 default response when route is not found', async () => {
    const res = await request(server.ExpressServer).get('/404')
    expect(res.statusCode).toBe(404)
    expect(res.body).toStrictEqual({ message: '404: Page not Found' })
  })

  test('Error by wrong method', async () => {
    routerLoader = new RouterLoader(server)
    const fileWithWrongMethod: string[] = ['./src/test/requestsWithError/testErrorUnsupportedMethod.json']
    const loadedRoutes: boolean = await routerLoader.loadRoutes(undefined, fileWithWrongMethod)
    expect(loadedRoutes).toBe(false)
  })
})
