import { mocked } from 'ts-jest/utils'
import { EventKey, EventName } from '../../../src/clients/event'
import { EventServiceImpl } from '../../../src/clients/event/EventServiceImpl'
import { EventD } from '../../../src/clients/event/models/Event'
import { Subscribe, SubscribeWithPattern } from '../../../src/clients/event/models/WsCommand'
import {
  GatewayEventPostRequest,
  GatewayEventWsRequest
} from '../../../src/clients/gateway/models/Gateway'
import { Prefix, Subsystem } from '../../../src/models'
import { HttpTransport } from '../../../src/utils/HttpTransport'
import { Ws } from '../../../src/utils/Ws'
import { verify } from '../../helpers/JestMockHelpers'

jest.mock('../../../src/utils/Ws')
jest.mock('../../../src/utils/HttpTransport')

const prefix = new Prefix('ESW', 'eventComp')
const eventName = new EventName('offline')
const eventKeys = new Set<EventKey>([new EventKey(prefix, eventName)])
const subsystem: Subsystem = 'ESW'
const callback = () => ({})

const httpTransport: HttpTransport<GatewayEventPostRequest> = new HttpTransport('someUrl')
const ws: Ws<GatewayEventWsRequest> = new Ws('someUrl')
const mockWs = mocked(ws)
const eventServiceImpl = new EventServiceImpl(httpTransport, () => ws)

describe('Event Service', () => {
  test('should subscribe event without default parameters using websocket | ESW-318', () => {
    eventServiceImpl.subscribe(eventKeys, 1)(callback)

    verify(mockWs.subscribe).toBeCalledWith(new Subscribe([...eventKeys], 1), callback, EventD)
  })

  test('should subscribe event with default parameters using websocket | ESW-318', () => {
    eventServiceImpl.subscribe(eventKeys)(callback)

    verify(mockWs.subscribe).toBeCalledWith(new Subscribe([...eventKeys], 0), callback, EventD)
  })

  test('should pattern subscribe event using websocket | ESW-318', () => {
    eventServiceImpl.pSubscribe(subsystem, 1, '.*')(callback)

    verify(mockWs.subscribe).toBeCalledWith(
      new SubscribeWithPattern(subsystem, 1, '.*'),
      callback,
      EventD
    )
  })

  test('should pattern subscribe event with default parameters using websocket | ESW-318', () => {
    eventServiceImpl.pSubscribe(subsystem)(callback)

    verify(mockWs.subscribe).toBeCalledWith(
      new SubscribeWithPattern(subsystem, 0, '.*'),
      callback,
      EventD
    )
  })
})
afterEach(() => jest.clearAllMocks())
