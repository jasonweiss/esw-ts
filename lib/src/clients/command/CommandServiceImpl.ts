import * as M from '../../models'
import { Decoder } from '../../utils/Decoder'
import { HttpTransport } from '../../utils/HttpTransport'
import { Subscription, Ws } from '../../utils/Ws'
import { GatewayComponentCommand } from '../gateway/models/Gateway'
import { CommandService } from './CommandService'
import * as Req from './models/PostCommand'
import * as WsReq from './models/WsCommand'

export class CommandServiceImpl implements CommandService {
  constructor(
    private readonly componentId: M.ComponentId,
    private readonly httpTransport: HttpTransport<
      GatewayComponentCommand<Req.CommandServicePostMessage>
    >,
    private readonly ws: () => Ws<GatewayComponentCommand<WsReq.CommandServiceWsMessage>>
  ) {}

  private componentPostCommand(msg: Req.CommandServicePostMessage) {
    return new GatewayComponentCommand(this.componentId, msg)
  }

  private componentWsCommand(msg: WsReq.CommandServiceWsMessage) {
    return new GatewayComponentCommand(this.componentId, msg)
  }

  private postComponentCmd<Res>(msg: Req.CommandServicePostMessage, decoder: Decoder<Res>) {
    return this.httpTransport.requestRes<Res>(this.componentPostCommand(msg), decoder)
  }

  validate(command: M.ControlCommand): Promise<M.ValidateResponse> {
    return this.postComponentCmd(new Req.Validate(command), M.ValidateResponse)
  }

  submit(command: M.ControlCommand): Promise<M.SubmitResponse> {
    return this.postComponentCmd(new Req.Submit(command), M.SubmitResponse)
  }

  oneway(command: M.ControlCommand): Promise<M.OnewayResponse> {
    return this.postComponentCmd(new Req.Oneway(command), M.OnewayResponse)
  }

  query(runId: string): Promise<M.SubmitResponse> {
    return this.postComponentCmd(new Req.Query(runId), M.SubmitResponse)
  }

  private subscribe(
    stateNames: Set<string>,
    onStateChange: (state: M.CurrentState) => void
  ): Subscription {
    return this.ws().subscribe(
      this.componentWsCommand(new WsReq.SubscribeCurrentState(stateNames)),
      onStateChange,
      M.CurrentState
    )
  }

  subscribeCurrentState = (stateNames: Set<string>) => (
    onStateChange: (state: M.CurrentState) => void
  ): Subscription => {
    const subscriptionResponse = this.subscribe(stateNames, onStateChange)
    return {
      cancel: async () => {
        const response = await subscriptionResponse
        return response.cancel()
      }
    }
  }

  queryFinal(runId: string, timeoutInSeconds: number): Promise<M.SubmitResponse> {
    return this.ws().singleResponse(
      this.componentWsCommand(new WsReq.QueryFinal(runId, timeoutInSeconds)),
      M.SubmitResponse
    )
  }
}
