import * as React from "react"
import * as signalR from "@aspnet/signalr"
import { MittContext } from "./mitt-provider"

export interface IConnectionContext {
  connection: signalR.HubConnection
}

export const ConnectionContext = React.createContext<IConnectionContext>(
  null as any,
)

export function ConnectionProvider({
  children,
  accessTokenFactory,
}: {
  accessTokenFactory?: () => string | Promise<string>
  children: React.ReactElement[] | React.ReactElement
}) {
  const [connectionClosed, setConnectionClosed] = React.useState(Math.random())
  const { emitter } = React.useContext(MittContext)

  const value = React.useMemo(() => {
    const connection = accessTokenFactory
      ? new signalR.HubConnectionBuilder()
          .withUrl("/signalr/game", {
            accessTokenFactory,
          })
          .configureLogging(signalR.LogLevel.Information)
          .build()
      : new signalR.HubConnectionBuilder()
          .withUrl("/signalr/game")
          .configureLogging(signalR.LogLevel.Information)
          .build()
    return { connection }
  }, [connectionClosed])
  React.useEffect(() => {
    ;(async function setup() {
      const { connection } = value

      connection.onclose((error) => {
        console.log("[notifications] closed", error)
        setTimeout(() => setConnectionClosed(Math.random()), 15000)
      })
      console.log("[notifications] Start event emitter")
      connection
        .start()
        .then(function() {
          console.log("[notifications] event emitter connected")
        })
        .catch((e) => {
          console.error("[notifications] could not start signalr connection")
          console.error(e)
        })
    })()
  }, [value, emitter])

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  )
}

export function useConnection() {
  const { connection } = React.useContext(ConnectionContext)
  return connection
}
