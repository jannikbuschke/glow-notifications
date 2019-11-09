import * as React from "react"
import mitt from "mitt"

interface IMittContext {
  emitter: mitt.Emitter
}

export const MittContext = React.createContext<IMittContext>(null as any)

export function MittProvider({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement
}) {
  const value = React.useMemo(
    () => ({
      emitter: mitt(),
    }),
    [],
  )

  return <MittContext.Provider value={value}>{children}</MittContext.Provider>
}

export function useMitt() {
  const { emitter } = React.useContext(MittContext)
  return emitter
}
