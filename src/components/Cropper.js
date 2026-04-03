import React from 'react'
import { OpenCvProvider } from '../lib/OpenCvProvider'
import Canvas from '../lib/Canvas'
import T from 'prop-types'

const Cropper = React.forwardRef((props, ref) => {
  if (!props.image) {
    return null
  }

  return (
    <OpenCvProvider openCvPath={props.openCvPath}>
      <Canvas {...props} cropperRef={ref} />
    </OpenCvProvider>
  )
})

export default Cropper

Cropper.propTypes = {
  openCvPath: T.string
}
