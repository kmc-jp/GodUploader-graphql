import React, { createContext, useState } from "react";

import { ArtworkRatingEnum } from "../mutation/__generated__/UpdateArtworkMutation.graphql";

type AgeRestriction =
  | "UNSELECTED" // 選択していない (この設定では作品を投稿できない)
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
  ageRestriction: "UNSELECTED",

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

interface ArtworkInformationProviderProps {
  initialTitle?: string;
  initialCaption?: string;
  initialTags?: string[];
  initialAgeRestriction?: AgeRestriction;
  children: React.ReactNode;
}

export const ArtworkInformationProvider: React.VFC<ArtworkInformationProviderProps> =
  ({
    initialTitle,
    initialCaption,
    initialTags,
    initialAgeRestriction,
    children,
  }) => {
    const [title, setTitle] = useState<string>(initialTitle ?? "");
    const [caption, setCaption] = useState<string>(initialCaption ?? "");
    const [tags, setTags] = useState<string[]>(initialTags ?? []);
    const [ageRestriction, setAgeRestriction] = useState<AgeRestriction>(
      initialAgeRestriction ?? "UNSELECTED"
    );

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

export const ageRestirctionToRating = (
  r: AgeRestriction
): ArtworkRatingEnum | null => {
  switch (r) {
    case "SAFE":
      return "safe";
    case "R-18":
      return "r_18";
    case "R-18G":
      return "r_18g";
    default:
      return null;
  }
};

export const ratingToAgeRestriction = (
  r: ArtworkRatingEnum
): AgeRestriction => {
  switch (r) {
    case "safe":
      return "SAFE";
    case "r_18":
      return "R-18";
    case "r_18g":
      return "R-18G";
    default:
      return "UNSELECTED";
  }
};
