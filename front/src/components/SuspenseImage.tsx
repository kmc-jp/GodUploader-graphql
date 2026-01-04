import React, { ImgHTMLAttributes } from "react";

// idea from https://css-tricks.com/pre-caching-image-with-react-suspense/
const cache = {
  __data: new Map<string, boolean | Promise<void>>(),
  read(src: string, timeout?: number) {
    if (!this.__data.get(src)) {
      this.__data.set(
        src,
        new Promise((resolve) => {
          const img = new Image();
          if (timeout) {
            window.setTimeout(resolve, timeout);
          }
          img.onload = () => {
            this.__data.set(src, true);
            resolve(this.__data.get(src));
          };
          img.src = src;
        }).then(() => {
          this.__data.set(src, true);
        })
      );
    }
    if (this.__data.get(src) instanceof Promise) {
      throw this.__data.get(src);
    }
    return this.__data.get(src);
  },
};

interface SuspenseImageProps {
  timeout?: number;
}

export const SuspenseImage: React.VFC<
  React.DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > &
    SuspenseImageProps
> = ({ src, timeout, ...rest }) => {
  if (!src) {
    return null;
  }

  cache.read(src, timeout || 2000);

  return <img src={src} {...rest} />;
};
