import { tipcClient } from "@renderer/lib/client"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { useCallback } from "react"

const proxyAtom = atom("")

proxyAtom.onMount = (setAtom) => {
  tipcClient?.getProxyConfig().then((proxy: string) => {
    setAtom(proxy)
  })
}

export const useProxyAtomValue = () => useAtomValue(proxyAtom)

export const useSetProxy = () => {
  const setProxy = useSetAtom(proxyAtom)
  return useCallback(
    (proxyString: string) => {
      if (!window.electron) {
        return
      }
      setProxy(proxyString)
      tipcClient?.setProxyConfig(proxyString)
    },
    [setProxy],
  )
}