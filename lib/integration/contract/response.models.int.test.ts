import fs from 'fs'
import * as D from 'io-ts/lib/Decoder'
import path from 'path'
import { Connection, ConnectionType, Location, TrackingEvent } from '../../src/clients/location'
import * as M from '../../src/models'
import { Decoder } from '../../src/utils/Decoder'
import { getOrThrow } from '../../src/utils/Utils'
import { delay } from '../utils/eventually'
import { executeCswContract } from '../utils/shell'

jest.setTimeout(100000)

const sourceDir = path.resolve(__dirname, '../jsons')
const commandModelsJsonPath = `${sourceDir}/command-service/models.json`
const locationModelsJsonPath = `${sourceDir}/location-service/models.json`

beforeAll(async () => {
  executeCswContract([sourceDir])
})

afterAll(async () => {
  fs.rmdirSync(sourceDir, { recursive: true })
  return await delay(200)
})

const parseModels = (file: string) => JSON.parse(fs.readFileSync(file, 'utf-8'))

describe('models contract test', () => {
  test('should test command models | ESW-305, ESW-343, ESW-348', () => {
    const commandModelSet: Record<string, unknown[]> = parseModels(commandModelsJsonPath)

    // [ ["ComponentType", ["Container", "HCD"] ], ["ValidateResponse", [...] ] ...]

    Object.entries(commandModelSet).forEach(([modelName, models]) => {
      models.forEach((modelJson) => testRoundTrip(modelJson, decoders[modelName]))
    })
  })

  test('should test location models | ESW-308, ESW-343, ESW-348', () => {
    const locationModelSet: Record<string, unknown[]> = parseModels(locationModelsJsonPath)

    Object.entries(locationModelSet).forEach(([modelName, models]) => {
      models.forEach((modelJson) => testRoundTrip(modelJson, locationDecoders[modelName]))
    })
  })
})

const testRoundTrip = (scalaJsonModel: unknown, decoder: Decoder<any>) => {
  const decodedModel = getOrThrow(decoder.decode(scalaJsonModel)) // typescript side of decoding
  const tsJsonModel = JSON.parse(JSON.stringify(decodedModel)) // encoding
  expect(scalaJsonModel).toEqual(tsJsonModel)
}

const decoders: Record<string, Decoder<any>> = {
  Units: M.Units,
  Parameter: M.ParameterD,
  CommandName: D.string,
  CurrentState: M.CurrentState,
  CommandIssue: M.CommandIssue,
  SubmitResponse: M.SubmitResponse,
  OnewayResponse: M.OnewayResponse,
  ValidateResponse: M.ValidateResponse,
  ControlCommand: M.ControlCommand,
  Result: M.ParamSet,
  KeyType: M.keyTagDecoder
}

const locationDecoders: Record<string, Decoder<any>> = {
  TrackingEvent: TrackingEvent,
  ComponentType: M.ComponentType,
  Connection: Connection,
  Registration: D.id(),
  ComponentId: M.ComponentIdD,
  Prefix: M.PrefixD,
  LocationServiceError: D.id(),
  ConnectionType: ConnectionType,
  Subsystem: M.Subsystem,
  Location: Location
}