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
  initialAgeRestriction?: AgeRestriction;
};

export const ArtworkInformationProvider: React.FC<ArtworkInformationProviderProps> =
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
      initialAgeRestriction ?? "SAFE"
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

// タグ一覧の先頭に、指定されたタグを足して返す。
// 既にタグ一覧に指定されたタグが含まれているなら先頭に持ってきて返す。
const prependTag = (tags: string[], newTag: string) => {
  const filteredTags = tags.filter((t) => t !== newTag);
  return [newTag, ...filteredTags];
};

// タグ一覧から年齢制限を計算する
export const ageRestirctionFromTags = (tags: string[]): AgeRestriction => {
  for (const tag of tags) {
    if (tag === "R-18") {
      return "R-18";
    }
    if (tag === "R-18G") {
      return "R-18G";
    }
  }
  return "SAFE";
};

// 作品のタグに年齢制限タグを加えて返す
export const tagWithAgeRestriction = (
  tags: string[],
  ageRestriction: AgeRestriction
) => {
  if (ageRestriction === "SAFE") {
    return tags;
  } else if (ageRestriction === "R-18") {
    return prependTag(tags, "R-18");
  } else if (ageRestriction === "R-18G") {
    return prependTag(tags, "R-18G");
  } else {
    throw new Error(`Unknown age restriction: ${ageRestriction}`);
  }
};
