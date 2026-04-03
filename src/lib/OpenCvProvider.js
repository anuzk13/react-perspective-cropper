// Based on https://github.com/giacomocerquone/opencv-react/blob/master/src/lib/OpenCvProvider.js


import * as React from 'react'

const OpenCvContext = React.createContext()

const { Consumer: OpenCvConsumer, Provider } = OpenCvContext

export { OpenCvConsumer, OpenCvContext }

const scriptId = 'opencv-react'
const CV_READY_EVENT = 'opencv-ready'
const moduleConfig = {
  wasmBinaryFile: 'opencv_js.wasm',
  usingWasm: true
}

export const OpenCvProvider = ({
  openCvVersion = '3.4.16',
  openCvPath = '',
  children
}) => {
  const [cvInstance, setCvInstance] = React.useState({
    loaded: false,
    cv: undefined
  })

  React.useEffect(() => {
    if (window.cv?.imread) {
      setCvInstance({ loaded: true, cv: window.cv })
      return
    }

    if (document.getElementById(scriptId)) {
      const onReady = () => setCvInstance({ loaded: true, cv: window.cv })
      document.addEventListener(CV_READY_EVENT, onReady, { once: true })
      return () => document.removeEventListener(CV_READY_EVENT, onReady)
    }

    moduleConfig.onRuntimeInitialized = () => {
      setCvInstance({ loaded: true, cv: window.cv })
      document.dispatchEvent(new Event(CV_READY_EVENT))
    }
    window.Module = moduleConfig

    const generateOpenCvScriptTag = () => {
      const js = document.createElement('script')
      js.id = scriptId
      js.src =
        openCvPath || `https://docs.opencv.org/${openCvVersion}/opencv.js`

      js.nonce = true
      js.defer = true
      js.async = true

      return js
    }

    document.body.appendChild(generateOpenCvScriptTag())
  }, [openCvPath, openCvVersion])

  return <Provider value={cvInstance}>{children}</Provider>
}

export const useOpenCv = () => React.useContext(OpenCvContext)
