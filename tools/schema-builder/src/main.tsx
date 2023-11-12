import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import createIframe from './createIframe';
interface IProps {
  widgets: any
  settings: any
  [key: string]: any
}

let iframe: any;

const Design = (props: IProps, ref: any) => {
  const { widgets, settings, ...restProps } = props;
  const containerRef: any = useRef();

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return iframe?.contentWindow?.__FR_ENGINE__?.expotSchema();
    },
    setValue: (schema: any) => {
      return iframe?.contentWindow?.__FR_ENGINE__?.impotSchema(schema);
    },
    copyValue: () => {
      return iframe?.contentWindow?.__FR_ENGINE__?.copySchema();
    }
  }))

  useEffect(() => {
    initIframe();
    window.addEventListener('message', engineOnLoad);
    return () => {
      window.removeEventListener('message', engineOnLoad);
    }
  }, []);

  const initIframe = () => {
    iframe = createIframe();
    containerRef.current.appendChild(iframe);
  }

  const engineOnLoad = (event: any) => {
    if (event.data.type !== 'engine-load') {
      return;
    }

    iframe?.contentWindow?.__FR_ENGINE__?.init({
      settings,
      widgets,
      // recordEnable: true,
      logo: {
        title: 'XRender'
      },
      ...restProps
    });
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%'}} />
  );
}

export default forwardRef(Design);