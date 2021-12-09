import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { renderToBody } from '../../utils/render-to-body'
import {
  ImageViewerProps,
  ImageViewer,
  MultiImageViewerProps,
  MultiImageViewer,
} from './image-viewer'
import { useUnmountedRef } from 'ahooks'

type Ref = {
  close: () => void
}

const imageViewerCaches: {
  ref: React.RefObject<Ref>
  unmount: () => void
}[] = []

export function showImageViewer(props: Omit<ImageViewerProps, 'visible'>) {
  const Wrapper = forwardRef<Ref>((_, ref) => {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
      setVisible(true)
    }, [])
    const isUnmountedRef = useUnmountedRef()
    useImperativeHandle(ref, () => ({
      close: () => {
        if (isUnmountedRef.current) return
        setVisible(false)
      },
    }))
    return (
      <ImageViewer
        {...props}
        visible={visible}
        onClose={() => {
          props.onClose?.()
          setVisible(false)
        }}
        afterClose={() => {
          props.afterClose?.()
          unmount()
        }}
      />
    )
  })
  const ref = createRef<Ref>()
  const unmount = renderToBody(<Wrapper ref={ref} />)
  unmountImageViewers()
  imageViewerCaches.push({
    ref,
    unmount,
  })
  return {
    close: () => {
      ref.current?.close()
    },
  }
}

export function showMultiImageViewer(
  props: Omit<MultiImageViewerProps, 'visible'>
) {
  const Wrapper = forwardRef<Ref>((_, ref) => {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
      setVisible(true)
    }, [])
    const isUnmountedRef = useUnmountedRef()
    useImperativeHandle(ref, () => ({
      close: () => {
        if (isUnmountedRef.current) return
        setVisible(false)
      },
    }))
    return (
      <MultiImageViewer
        {...props}
        visible={visible}
        onClose={() => {
          props.onClose?.()
          setVisible(false)
        }}
        afterClose={() => {
          props.afterClose?.()
          unmount()
        }}
      />
    )
  })
  const ref = createRef<Ref>()
  const unmount = renderToBody(<Wrapper ref={ref} />)
  unmountImageViewers()
  imageViewerCaches.push({
    ref,
    unmount,
  })
  return {
    close: () => {
      ref.current?.close()
    },
  }
}

function unmountImageViewers() {
  while (true) {
    const cache = imageViewerCaches.pop()
    if (!cache) break
    cache.unmount?.()
  }
}

export function clearImageViewer() {
  while (true) {
    const cache = imageViewerCaches.pop()
    if (!cache) break
    cache.ref.current?.close()
  }
}
