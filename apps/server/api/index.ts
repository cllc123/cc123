// eslint-disable-next-line antfu/no-import-dist
import { app } from "../dist/server"

export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit("request", req, res)
}