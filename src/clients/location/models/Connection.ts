import { ComponentType } from 'models/ComponentType'
import { Prefix } from 'models/params/Prefix'

export interface Connection {
  readonly prefix: Prefix
  readonly componentType: ComponentType
  readonly connectionType: 'akka' | 'http' | 'tcp'
}

export class AkkaConnection implements Connection {
  readonly connectionType: 'akka' = 'akka'
  constructor(readonly prefix: Prefix, readonly componentType: ComponentType) {}
}

export class HttpConnection implements Connection {
  readonly connectionType: 'http' = 'http'
  constructor(readonly prefix: Prefix, readonly componentType: ComponentType) {}
}

export class TcpConnection implements Connection {
  readonly connectionType: 'tcp' = 'tcp'
  constructor(readonly prefix: Prefix, readonly componentType: ComponentType) {}
}