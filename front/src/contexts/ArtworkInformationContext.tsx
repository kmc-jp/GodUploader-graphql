import React, { createContext, useState } from "react";

type AgeRestriction =
  | "SAFE" // 全年齢
  | "R-18"
  | "R-18G";

export type ArtworkInformationContextValue = {
  title: string;
  caption: string;
  tags: string[];
  ageRestriction: AgeRestriction;

  setTitle: (title: string) => void;
  setCaption: (caption: string) => void;
  setTags: (tags: string[]) => void;
  setAgeRestriction: (restriction: AgeRestriction) => void;
};

const defaultInformation: ArtworkInformationContextValue = {
  title: "",
  caption: "",
  tags: [],
  ageRestriction: "SAFE",

  setTitle: () => {
    /* noop */
  },
  setCaption: () => {
    /* noop */
  },
  setTags: () => {
    /* noop */
  },
  setAgeRestriction: () => {
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
    const [ageRestriction, setAgeRestriction] =
      useState<AgeRestriction>("SAFE");

    return (
      <ArtworkInformationContext.Provider
        value={{
          title,
          caption,
          tags,
          ageRestriction,
          setTitle,
          setCaption,
          setTags,
          setAgeRestriction,
        }}
      >
        {children}
      </ArtworkInformationContext.Provider>
    );
  };
