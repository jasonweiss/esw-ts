import * as E from 'fp-ts/lib/Either'
import * as D from 'io-ts/lib/Decoder'

export const requirement = (assertion: boolean, msg: string) => {
  if (!assertion) throw Error(`Requirement failed - ${msg}`)
}

export const extractHostPort = (uri: string) => {
  const [host, _port] = uri.split('/')[2].split(':')
  const port = parseInt(_port)
  return { host, port }
}

export const getOptionValue = <T>(option: T[] | T): T => {
  return Array.isArray(option) ? option[0] : option
}

export const getOrThrow = <A>(e: E.Either<D.DecodeError, A>): A =>
  E.getOrElse<D.DecodeError, A>((err) => {
    throw Error(D.draw(err))
  })(e)

export const getPostEndPoint = (uri: { port: number; host: string }) => {
  return `http://${uri.host}:${uri.port}/post-endpoint`
}
