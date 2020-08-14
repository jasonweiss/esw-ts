import { EventService } from '../../../src/clients/event'
import { mocked } from 'ts-jest/utils'
import { EventServiceImpl } from '../../../src/clients/event/Impl'
import { resolveGateway } from '../../../src/clients/gateway/ResolveGateway'
import { getPostEndPoint, getWebSocketEndPoint } from '../../../src/utils/Utils'
import { HttpTransport } from '../../../src/utils/HttpTransport'
import { WebSocketTransport } from '../../../src/utils/WebSocketTransport'
jest.mock('../../../src/clients/event/Impl')
jest.mock('../../../src/clients/gateway/ResolveGateway')
jest.mock('../../../src/utils/Utils')
const postMockEndpoint = mocked(getPostEndPoint)
const wsMockEndpoint = mocked(getWebSocketEndPoint)
const mockResolveGateway = mocked(resolveGateway)
const mockImpl = mocked(EventServiceImpl)

const postEndpoint = 'postEndpoint'
const wsEndpoint = 'wsEndpoint'
const uri = { host: '123', port: 1234 }
mockResolveGateway.mockResolvedValue(uri)
postMockEndpoint.mockReturnValue(postEndpoint)
wsMockEndpoint.mockReturnValue(wsEndpoint)
const eventServiceImpl = new EventServiceImpl(new HttpTransport(postEndpoint), () =>
  WebSocketTransport(wsEndpoint)
)
mockImpl.mockReturnValue(eventServiceImpl)

describe('Event Service Factory', () => {
  test('tt', async () => {
    const a = await EventService()

    expect(a).toEqual(eventServiceImpl)
    expect(mockResolveGateway).toBeCalledTimes(1)
    expect(postMockEndpoint).toBeCalledWith(uri)
    expect(wsMockEndpoint).toBeCalledWith(uri)
  })
})

afterAll(() => {
  jest.resetAllMocks()
})