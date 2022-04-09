import React, { createContext, useState } from "react";

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
  // 年齢制限にまつわるタグは予め取り除いておく
  const tagsWithoutAgeRestriction = tags.filter(
    (t) => t.toLowerCase() !== "r-18" && t.toLowerCase() !== "r-18g"
  );

  if (ageRestriction === "SAFE") {
    return tagsWithoutAgeRestriction;
  } else if (ageRestriction === "R-18") {
    return prependTag(tagsWithoutAgeRestriction, "R-18");
  } else if (ageRestriction === "R-18G") {
    return prependTag(tagsWithoutAgeRestriction, "R-18G");
  } else {
    throw new Error(`Unknown age restriction: ${ageRestriction}`);
  }
};
