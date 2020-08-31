import 'whatwg-fetch'
import { Option } from '../../src'
import { SequencerService, StepList } from '../../src/clients/sequencer'
import { ComponentId, Prefix, SequenceCommand, Setup, SubmitResponse } from '../../src/models'
import { getToken } from '../utils/auth'
import { startServices, stopServices } from '../utils/backend'

jest.setTimeout(90000)

const eswTestPrefix = Prefix.fromString('ESW.test')
const setupCommand = new Setup(eswTestPrefix, 'command', [])
const sequence: SequenceCommand[] = [setupCommand]
let validToken = ''
let sequencerServiceWithToken: SequencerService
let sequencerServiceWithoutToken: SequencerService
const componentId = new ComponentId(new Prefix('ESW', 'MoonNight'), 'Sequencer')
const startedResponse: SubmitResponse = {
  _type: 'Started',
  runId: '123'
}
beforeAll(async () => {
  //todo: fix this console.error for jsdom errors
  console.error = jest.fn()
  // setup location service and gateway
  await startServices(['AAS', 'Gateway'])
  validToken = await getToken('tmt-frontend-app', 'sm-user1', 'sm-user1', 'TMT')
  sequencerServiceWithToken = await SequencerService(componentId, () => validToken)
  sequencerServiceWithoutToken = await SequencerService(componentId, () => undefined)
})
afterAll(async () => {
  await stopServices()
  jest.clearAllMocks()
})

describe('Sequencer Client', () => {
  test('should get unauthorized error when invalid token is provided | ESW-307, ESW-99', async () => {
    expect.assertions(3)
    await sequencerServiceWithoutToken.goOffline().catch((e) => {
      expect(e.status).toBe(401)
      expect(e.message).toBe('Unauthorized')
      expect(e.reason).toBe(
        'The resource requires authentication, which was not supplied with the request'
      )
    })
  })

  test('should get ok response on load sequence | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.loadSequence(sequence)
    expect(response._type).toEqual('Ok')
  })

  test('should get submit response on startSequence | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.startSequence()
    expect(response).toEqual(startedResponse)
  })

  test('should get ok response on add commands | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.add(sequence)
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on prepend commands | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.prepend(sequence)
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on replace | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.replace('123', sequence)
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on insertAfter | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.insertAfter('123', sequence)
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on delete | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.delete('123')
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on addBreakpoint | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.addBreakpoint('123')
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on removeBreakpoint | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.removeBreakpoint('123')
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on reset | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.reset()
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on resume | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.resume()
    expect(response._type).toEqual('Ok')
  })

  test('should get ok response on pause | ESW-307, ESW-99', async () => {
    const response = await sequencerServiceWithToken.pause()
    expect(response._type).toEqual('Ok')
  })

  test('should get option of step list on getSequence from running sequencer | ESW-307', async () => {
    const stepList: Option<StepList> = await sequencerServiceWithoutToken.getSequence()
    const expected = [
      {
        command: {
          _type: 'Setup',
          commandName: 'command-1',
          maybeObsId: [],
          paramSet: [],
          source: { componentName: 'IRIS', subsystem: 'CSW' }
        },
        hasBreakpoint: false,
        id: stepList?.[0]?.id,
        status: { _type: 'Pending' }
      }
    ]
    expect(stepList).toEqual(expected)
  })

  test('is up and available | ESW-307', async () => {
    const available = await sequencerServiceWithToken.isAvailable()

    expect(available).toBeTruthy()
  })

  test('is online | ESW-307', async () => {
    const online = await sequencerServiceWithToken.isOnline()

    expect(online).toBeTruthy()
  })

  test('should get ok response on go online | ESW-307, ESW-99', async () => {
    const res = await sequencerServiceWithToken.goOnline()

    expect(res._type).toEqual('Ok')
  })

  test('should get ok response on go offline | ESW-307, ESW-99', async () => {
    const res = await sequencerServiceWithToken.goOffline()

    expect(res._type).toEqual('Ok')
  })

  test('should get ok response on abort sequence | ESW-307, ESW-99', async () => {
    const res = await sequencerServiceWithToken.abortSequence()

    expect(res._type).toEqual('Ok')
  })

  test('should get ok response on stop sequence | ESW-307, ESW-99', async () => {
    const res = await sequencerServiceWithToken.stop()

    expect(res._type).toEqual('Ok')
  })

  test('should get ok response on diagnosticMode | ESW-307, ESW-99', async () => {
    const res = await sequencerServiceWithToken.diagnosticMode(new Date(), 'starting')

    expect(res._type).toEqual('Ok')
  })

  test('should get ok response on operationsMode | ESW-307, ESW-99', async () => {
    const res = await sequencerServiceWithToken.operationsMode()

    expect(res._type).toEqual('Ok')
  })

  test('should submit sequence to sequencer | ESW-307, ESW-99, ESW-344', async () => {
    const response = await sequencerServiceWithToken.submit(sequence)
    expect(response).toEqual(startedResponse)
  })

  test('should submitAndWait sequence to sequencer | ESW-307, ESW-99, ESW-344', async () => {
    const response = await sequencerServiceWithToken.submitAndWait(sequence)
    expect(response).toEqual(startedResponse)
  })

  test('should query sequencer | ESW-307, ESW-99, ESW-344', async () => {
    const response = await sequencerServiceWithToken.query('123')
    expect(response).toEqual(startedResponse)
  })

  test('should get sequencer state on query final | ESW-307, ESW-99', async () => {
    const response: SubmitResponse = await sequencerServiceWithToken.startSequence()
    const res = await sequencerServiceWithoutToken.queryFinal(response.runId, 10)

    expect(res).toEqual(response)
  })
})
