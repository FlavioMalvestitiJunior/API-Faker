import { type Request, type Response } from '../types/Requests'
import { describe, test, expect, afterAll } from 'vitest'
import testRequest from '../../src/requests/testRequest.json'
import testRequestArray from '../../src/requests/testRequestArray.json'
// import { execSync } from 'child_process'
import request from 'supertest'
import { Server } from './Server'
import { RouterLoader } from './RouterLoader'

describe('Server Integration tests', () => {
  const BASE_URL = 'http://localhost:3030'

  afterAll(() => {
    // execSync('docker-compose down')
  })

  test('check if server is importing and processing request mock file', async () => {
    const request: Request = testRequest.request
    const mockedResponse: Response = testRequest.response

    const url: string = `${BASE_URL}${request.path}`
    const response: any = await fetch(url, { method: request.method }).then(async (response) => await response.json())
    expect(response).toStrictEqual(mockedResponse.data)
  })

  test('check if server is importing and processing request mock file', async () => {
    const requestFromFile: Request = testRequest.request
    const mockedResponse: Response = testRequest.response
    const server = new Server()
    const loader = new RouterLoader(server)
    void await loader.loadRoutes()

    const res = await request(server.ExpressServer).get(requestFromFile.path)
    expect(res.statusCode).toBe(mockedResponse.statusCode)
  })
  test('check if server is importing and processing request mock file when it`s have an array of requests', async () => {
    const server = new Server()
    const loader = new RouterLoader(server)
    void await loader.loadRoutes()

    for (const testRequest of testRequestArray) {
      const requestFromFile: Request = testRequest.request
      const mockedResponse: Response = testRequest.response
      const res = await request(server.ExpressServer).get(requestFromFile.path)
      expect(res.statusCode).toBe(mockedResponse.statusCode)
    }
  })
})
