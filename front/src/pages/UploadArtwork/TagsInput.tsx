import { graphql } from "babel-plugin-relay/macro";
import React, { Suspense, useCallback, useRef } from "react";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";
import { useDebouncedCallback } from "use-debounce";
import { TagsInputQuery } from "./__generated__/TagsInputQuery.graphql";

const tagsInputQuery = graphql`
  query TagsInputQuery($prefix: String!) {
    tagsByPrefix(prefix: $prefix) {
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

export const TagsInput: React.VFC<Props> = ({tagList, setTagList}) => {
  const [preloadedQuery, loadQuery, dispose] =
    useQueryLoader<TagsInputQuery>(tagsInputQuery);

  const ref = useRef<HTMLInputElement>(null);

  const handleChange = useDebouncedCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((e) => {
    const prefix = e.target.value;
    if (prefix === "") {
      return;
    }

    loadQuery({ prefix });
  });

  const appendTag = useCallback((newTag: string) => {
    setTagList((oldTagList) => [...oldTagList, newTag]);
  }, [setTagList]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!ref.current) {
      return;
    }

    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    const newTag = ref.current?.value;
    if (!newTag) {
      return;
    }

    appendTag(newTag);
    dispose();
    ref.current.value = "";
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
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={ref}
          />
        </div>
      </div>
      {preloadedQuery && (
        <Suspense fallback={null}>
          <TagSuggestion preloadedQuery={preloadedQuery} />
        </Suspense>
      )}
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

const TagSuggestion: React.VFC<{
  preloadedQuery: PreloadedQuery<TagsInputQuery>;
}> = ({ preloadedQuery }) => {
  const { tagsByPrefix } = usePreloadedQuery(tagsInputQuery, preloadedQuery);
  if (!(tagsByPrefix && tagsByPrefix.edges)) {
    return null;
  }

  return (
    <datalist id="tagSuggestionList">
      {tagsByPrefix.edges.map((edge, i) => {
        const node = edge?.node;
        if (!node) {
          return null;
        }

        return <option key={i} value={node.name} />;
      })}
    </datalist>
  );
};
