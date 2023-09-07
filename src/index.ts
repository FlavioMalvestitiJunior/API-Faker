/* eslint-disable no-new */
import { Server } from './core/Server'
import { RouterLoader } from './core/RouterLoader'

const port: number = process.env.FAKER_PORT !== undefined ? Number(process.env.FAKER_PORT) : 3030
const host: string | undefined = process.env.FAKER_HOST !== undefined ? '0.0.0.0' : process.env.FAKER_HOST

const server: Server = new Server(port, host)
const loader = new RouterLoader(server)

void loader.loadRoutes()
