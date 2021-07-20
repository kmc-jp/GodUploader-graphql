import React, { createContext, useState } from "react";

export type ArtworkInformationContextValue = {
  title: string;
  caption: string;
  tags: string[];

  setTitle: (title: string) => void;
  setCaption: (caption: string) => void;
  setTags: (tags: string[]) => void;
};

const defaultInformation: ArtworkInformationContextValue = {
  title: "",
  caption: "",
  tags: [],

  setTitle: () => {
    /* noop */
  },
  setCaption: () => {
    /* noop */
  },
  setTags: () => {
    /* noop */
  },
};

export const ArtworkInformationContext =
  createContext<ArtworkInformationContextValue>(defaultInformation);

type ArtworkInformationProviderProps = {
  initialTitle?: string;
  initialCaption?: string;
  initialTags?: string[];
};

export const ArtworkInformationProvider: React.FC<ArtworkInformationProviderProps> =
  ({ initialTitle, initialCaption, initialTags, children }) => {
    const [title, setTitle] = useState<string>(initialTitle ?? "");
    const [caption, setCaption] = useState<string>(initialCaption ?? "");
    const [tags, setTags] = useState<string[]>(initialTags ?? []);

    return (
      <ArtworkInformationContext.Provider
        value={{ title, caption, tags, setTitle, setCaption, setTags }}
      >
        {children}
      </ArtworkInformationContext.Provider>
    );
  };
