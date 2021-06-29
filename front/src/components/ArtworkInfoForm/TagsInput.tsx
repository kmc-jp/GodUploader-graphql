import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense, useCallback, useRef } from "react";
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

interface Props {
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TagsInput: React.VFC<Props> = ({ tagList, setTagList }) => {
  const ref = useRef<HTMLInputElement>(null);

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

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!ref.current) {
      return;
    }
    const handleAppendNewTag = (newTag?: string) => {
      if (!ref.current) {
        return;
      }

      if (!newTag) {
        return;
      }

      e.preventDefault();

      appendTag(newTag);
      ref.current.value = "";
    };

    const handleModifyLastTag = () => {
      if (!ref.current) {
        return;
      }

      if (tagList.length === 0) {
        return;
      }

      e.preventDefault();
      const lastTag = popLastTag();
      ref.current.value = lastTag;
    };

    // IMEの変換中はタグを追加しない
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter") {
      const newTag = ref.current.value.trim();
      handleAppendNewTag(newTag);
    } else if (e.key === "Backspace" && ref.current?.value === "") {
      handleModifyLastTag();
    }
  };

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
            onKeyDown={handleKeyDown}
            ref={ref}
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
