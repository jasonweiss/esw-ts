# Event Service
This service provides methods to interact with the event server which implements the publish/subscribe messaging paradigm
where one component publishes an event and all clients that have subscribed receive the event.

Event service has the following [APIs](#apis):

|  API                      | Input args                                           | Returns        |
| ------------------------- | ---------------------------------------------------- | ---------------|
| [publish](#publish)       | event                                                | Done           |
| [get](#get)               | eventKeys                                            | Event[]        |
| [subscribe](#subscribe)   | eventKeys, maxFrequency, onEventCallback             | Subscription   |
| [pSubscribe](#psubscribe) | eventKeys, maxFrequency, pattern, onEventCallback    | Subscription   |


## Creation of Event Service

### Pre-requisite

1. The Location Service, Event Service and Gateway Server needs to be running in the network
2. The necessary configuration, environment variables or system properties should be defined to point to the correct host and port number(s) for the Location Service nodes.

#### Examples to create client for Event service

Typescript
: @@snip [Location-Service](../../../../../example/src/documentation/event/EventExample.ts) { #event-service }

## Event Model
-  Event : it includes informatio related to an particular event
    * type : ObserveEvent / SystemEvent
    * eventId: unique id for an event
    * source: prefix of the source from which event is sent
    * eventName: event key / logical name for the event
    * eventTime: instant at which event is created


## APIs

###publish

This API publishes an event to the event server and returns Done as a promise.

Example for publish looks like following:

Typescript
: @@snip [Event-Service](../../../../../example/src/documentation/event/EventExample.ts) { #publish }


###get

This API takes set of EventKeys as input and receives the list of events against those specific set of EventKeys.

Example for get looks like following:

Typescript
: @@snip [Event-Service](../../../../../example/src/documentation/event/EventExample.ts) { #get }

###subscribe

This API subscribes to multiple `eventKeys` and receive events at `every` frequency
and return subscription handle which can be used as a kill switch.
It takes callback function which gets triggered when ever the events are received.
The latest events available for the given Event Keys will be received first.

Example for subscribe looks like following:

Typescript
: @@snip [Event-Service](../../../../../example/src/documentation/event/EventExample.ts) { #subscribe }

###pSubscribe

This API subscribes to events of all the EventKeys specified using a `Subsystem`
and a `pattern` to match the remaining Event Key and return subscription handle
which can be used as a kill switch.
It takes callback function which gets triggered when ever the events are received.
The latest events available for the given Event Keys will be received first.

Example for pSubscribe looks like following:

Typescript
: @@snip [Event-Service](../../../../../example/src/documentation/event/EventExample.ts) { #p-subscribe }