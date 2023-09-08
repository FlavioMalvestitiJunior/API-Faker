export interface Request {
  path: string
  method: string | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE'
}

export interface Response {
  statusCode: number
  data: any
}

export interface RequestFile {
  plugin: string
  request: Request
  response: Response
}

export interface RequestFileModule {
  default: RequestFile | RequestFile[]
}

export interface ProcessedRequest {
  requestRoute: RequestFile
  callback: ResponseCallback
}

export type ResponseCallback = (expressRequest: any) => Promise<Response>
