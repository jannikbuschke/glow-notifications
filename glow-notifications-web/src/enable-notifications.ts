import * as React from "react"
import * as signalR from "@aspnet/signalr"
import mitt from "mitt"
import { MittContext } from "./mitt-provider"

export interface Message {}

export interface EntryModified extends Message {
  kind: string
  payload: { entityName: string; operation: "Created" | "Modified" | "Deleted" }
}

type PushNotificationType = "Info" | "Success" | "Warning" | "Error"

export interface PushNotification {
  message: string
  type: PushNotificationType
  link: string | null
}

export function EnableNotifications({
  accessTokenFactory,
}: {
  accessTokenFactory?: () => string | Promise<string>
}) {
  const [connectionClosed, setConnectionClosed] = React.useState(Math.random())
  const { emitter } = React.useContext(MittContext)

  const connection = React.useMemo(() => {
    const connection = accessTokenFactory
      ? new signalR.HubConnectionBuilder()
          .withUrl("/notifications", {
            accessTokenFactory,
          })
          .configureLogging(signalR.LogLevel.Information)
          .build()
      : new signalR.HubConnectionBuilder()
          .withUrl("/notifications")
          .configureLogging(signalR.LogLevel.Information)
          .build()
    return connection
  }, [connectionClosed])

  React.useEffect(() => {
    ;(async function setup() {
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

      connection.on("message", (messageType: string, payload: any) => {
        console.log("message", { msgType: messageType, payload })
        emitter.emit(messageType, payload)
      })

      connection.on("push-notification", (payload: PushNotification) => {
        console.log("[push-notification]", { payload })
        emitter.emit("push-notification", payload)
      })
    })()
  }, [connection, emitter])

  return null
}
