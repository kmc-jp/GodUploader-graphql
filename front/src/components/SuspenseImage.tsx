import React, { ImgHTMLAttributes } from "react";

// idea from https://css-tricks.com/pre-caching-image-with-react-suspense/
const cache = {
  __data: new Map<string, any>(),
  read(src: string) {
    if (!this.__data.get(src)) {
      this.__data.set(
        src,
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            this.__data.set(src, true);
            resolve(this.__data.get(src));
          };
          img.src = src;
        }).then((img) => {
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

export const SuspenseImage: React.VFC<
  React.DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = ({ src, ...rest }) => {
  if (!src) {
    return null;
  }

  cache.read(src);
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={src} {...rest} />;
};
