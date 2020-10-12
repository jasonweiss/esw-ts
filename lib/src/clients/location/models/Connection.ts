import type { ComponentType } from '../../../models/ComponentType'
import type { Prefix } from '../../../models/params/Prefix'

const mkConnection = <T extends ConnectionType>(connectionType: T) => (
  prefix: Prefix,
  componentType: ComponentType
) => ({ connectionType, prefix, componentType })

export type ConnectionType = 'akka' | 'tcp' | 'http'

export type AkkaConnection = {
  connectionType: 'akka'
  prefix: Prefix
  componentType: ComponentType
}
export type HttpConnection = {
  connectionType: 'http'
  prefix: Prefix
  componentType: ComponentType
}
export type TcpConnection = {
  connectionType: 'tcp'
  prefix: Prefix
  componentType: ComponentType
}
export type Connection = AkkaConnection | TcpConnection | HttpConnection

export const AkkaConnection = mkConnection('akka')
export const HttpConnection = mkConnection('http')
export const TcpConnection = mkConnection('tcp')
