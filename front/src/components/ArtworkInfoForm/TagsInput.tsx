import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense, useCallback, useRef, useState } from "react";
import { useLazyLoadQuery } from "react-relay";

import { TagsInputQuery } from "./__generated__/TagsInputQuery.graphql";

const tagsInputQuery = graphql`
  query TagsInputQuery {
    allTags {
      edges {
        node {
          name
          artworksCount
        }
      }
    }
  }
`;

// XXX: Safari/x.x.x だけだと他のブラウザを巻き込む。Version/y.y.y も見ることでSafariであることを確定されている
const isSafari = () =>
  navigator.userAgent.includes("Safari/") &&
  navigator.userAgent.includes("Version/");

interface Props {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagsInput: React.VFC<Props> = ({ tagList, setTagList }) => {
  const appendTag = useCallback(
    (newTag: string) => {
      setTagList((oldTagList) => [...oldTagList, newTag]);
    },
    [setTagList]
  );

  const popLastTag = useCallback(() => {
    const lastTag = tagList[tagList.length - 1];
    setTagList(tagList.slice(0, tagList.length - 1));
    return lastTag;
  }, [tagList, setTagList]);

  const [currentInput, setCurrentInput] = useState("");

  // Mac Safari 14.1.1 (16611.2.7.1.4) では、IMEの入力をEnterで確定すると、
  // compositionend -> keydown(Enter, isComposing = false) の順にイベントが発火するので、
  // IMEの入力確定でタグが入力されてしまう
  // (ChromeやFirefoxではcompositionend -> keyup(Enter) の順)
  // Safariではcompositionendイベントの直後のkeydownイベントを間引くことで回避する
  const isCompositionFinishedJustBefore = useRef(true);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        // IMEの変換中はタグを追加しない
        if (
          (isSafari() && isCompositionFinishedJustBefore.current) ||
          e.nativeEvent.isComposing
        ) {
          isCompositionFinishedJustBefore.current = false;
          return;
        }

        if (e.key === "Enter") {
          const newTag = currentInput.trim();
          if (!newTag) {
            return;
          }

          e.preventDefault();

          appendTag(newTag);
          setCurrentInput("");
        } else if (e.key === "Backspace" && currentInput === "") {
          if (tagList.length === 0) {
            return;
          }

          e.preventDefault();
          const lastTag = popLastTag();
          setCurrentInput(lastTag);
        }
      },
      [appendTag, currentInput, popLastTag, tagList.length]
    );

  return (
    <>
      <label htmlFor="tags">タグ</label>
      <div className="row g-2">
        <TagList tagList={tagList} setTagList={setTagList} />
        <div className="col-lg">
          <input
            type="text"
            id="tags"
            list="tagSuggestionList"
            className="form-control"
            onCompositionStart={() =>
              (isCompositionFinishedJustBefore.current = false)
            }
            onCompositionEnd={() =>
              (isCompositionFinishedJustBefore.current = true)
            }
            onKeyDown={handleKeyDown}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
          />
        </div>
      </div>
      <Suspense fallback={null}>
        <TagSuggestion />
      </Suspense>
    </>
  );
};

const TagList: React.VFC<Props> = ({ tagList, setTagList }) => {
  const removeTag = (targetTag: string) => {
    setTagList((oldTagList) => oldTagList.filter((tag) => tag !== targetTag));
  };

  if (tagList.length === 0) {
    return null;
  }

  return (
    <ul className="list-group list-group-horizontal-md mb-2 col-auto">
      {tagList.map((tag, i) => (
        <li key={i} className="list-group-item">
          <button
            type="button"
            className="btn-sm btn-close"
            aria-label="Close"
            onClick={() => removeTag(tag)}
          ></button>
          {tag}
        </li>
      ))}
    </ul>
  );
};

const TagSuggestion: React.VFC = () => {
  const { allTags } = useLazyLoadQuery<TagsInputQuery>(tagsInputQuery, {});
  if (!(allTags && allTags.edges)) {
    return null;
  }

  return (
    <datalist id="tagSuggestionList">
      {allTags.edges.map((edge, i) => {
        const node = edge?.node;
        if (!node) {
          return null;
        }

        return <option key={i} value={node.name} />;
      })}
    </datalist>
  );
};
