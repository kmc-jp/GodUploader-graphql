import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback, useEffect, useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";

import { AgeRestrictionInput } from "../components/ArtworkInfoForm/AgeRestrictionInput";
import { CaptionInput } from "../components/ArtworkInfoForm/CaptionInput";
import { FilesizeBar } from "../components/ArtworkInfoForm/FilesizeBar";
import { SlackChannelInput } from "../components/ArtworkInfoForm/SlackChannelInput";
import { TagsInput } from "../components/ArtworkInfoForm/TagsInput";
import { TitleInput } from "../components/ArtworkInfoForm/TitleInput";
import { ArtworkInformationProvider } from "../contexts/ArtworkInformationContext";
import {
  MAX_FILESIZE,
  MAX_FILESIZE_MB,
  UploadArtworkProvider,
} from "../contexts/UploadArtworkContext";
import { useArtworkInformation } from "../hooks/useArtworkInformation";
import { useUploadArtworkContext } from "../hooks/useUploadArtworkContext";
import { UploadArtworkQuery } from "./__generated__/UploadArtworkQuery.graphql";

export const UploadArtwork: React.VFC = () => {
  return (
    <ArtworkInformationProvider>
      <UploadArtworkProvider>
        <UploadArtworkForm />
      </UploadArtworkProvider>
    </ArtworkInformationProvider>
  );
};

const UploadArtworkForm = () => {
  const {
    isUploading,
    files,
    showThumbnail,
    notifySlack,
    notifyTwitter,
    twitterUserName,
    uploadErrors,
    totalFilesize,
    filesizeLimitExceeded,
    setFiles,
    setShowThumbnail,
    setNotifySlack,
    setNotifyTwitter,
    setTwitterUserName,
    handleSubmit,
  } = useUploadArtworkContext();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setFiles((files) =>
          e.target.files ? [...files, ...Array.from(e.target.files)] : files
        );
      },
      [setFiles]
    );

  const handleDeleteImage = useCallback(
    (index: number) => {
      setFiles((files) => files.filter((file, i) => i !== index));
    },
    [setFiles]
  );

  const images = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) {
        return;
      }
      if (active.id === over?.id) {
        return;
      }
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      setFiles((files) => arrayMove(files, oldIndex, newIndex));
    },
    [images, setFiles]
  );

  const { viewer } = useLazyLoadQuery<UploadArtworkQuery>(
    graphql`
      query UploadArtworkQuery {
        viewer {
          kmcid
        }
      }
    `,
    {},
    { fetchPolicy: "store-or-network" }
  );
  useEffect(() => {
    setTwitterUserName(viewer === null ? "" : viewer.kmcid);
  }, []);

  const { ageRestriction } = useArtworkInformation();

  return (
    <div className="card">
      <div className="card-header">???????????????????????????</div>
      <div className="panel-body px-4 py-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <p>
              ???????????????????????????????????????{" "}
              <span className="text-danger">
                (GIF/JPEG/PNG??????, ??????{MAX_FILESIZE_MB}MB??????,
                ????????????????????????????????????????????????)
              </span>
            </p>
            <input
              type="file"
              className="form-control"
              id="file"
              multiple
              accept="image/gif,image/png,image/jpeg"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <FilesizeBar filesize={totalFilesize} maxFilesize={MAX_FILESIZE} />
            {filesizeLimitExceeded && (
              <div className="alert alert-danger mt-3" role="alert">
                ?????????????????????????????????????????????????????????????????????
              </div>
            )}
            <div className="d-flex mt-2">
              {images.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={images}
                    strategy={horizontalListSortingStrategy}
                  >
                    {images.map((dataURL, i) => (
                      <SortableImage
                        key={dataURL}
                        dataURL={dataURL}
                        index={i}
                        handleDeleteImage={handleDeleteImage}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
              <label
                htmlFor="file"
                title="???????????????????????????????????????"
                className="form-label card"
                style={{
                  width: 186,
                  height: 186,
                  cursor: "pointer",
                }}
              >
                <i
                  className="bi bi-plus-lg mx-auto my-auto"
                  style={{ fontSize: "2em" }}
                ></i>
              </label>
            </div>
          </div>
          <div className="mb-3">
            <TitleInput />
          </div>
          <div className="mb-3">
            <CaptionInput />
          </div>
          <div className="mb-3">
            <TagsInput />
          </div>
          <div className="mb-3">
            <AgeRestrictionInput />
          </div>
          <div className="mb-3">
            <label htmlFor="notify_slack">Slack???????????????</label>
            <input
              type="checkbox"
              id="notify_slack"
              checked={notifySlack}
              onChange={(e) => setNotifySlack(e.target.checked)}
            />
          </div>
          {
            <>
              <div className="mb-3">
                <label htmlFor="notify_twitter">
                  Twitter?????????????????? (KMC????????????????????????????????????????????????)
                </label>
                <input
                  type="checkbox"
                  id="notify_twitter"
                  checked={ageRestriction === "SAFE" && notifyTwitter}
                  disabled={ageRestriction !== "SAFE"}
                  onChange={(e) => setNotifyTwitter(e.target.checked)}
                />
              </div>
              {ageRestriction === "SAFE" ? (
                notifyTwitter && (
                  <div className="mb-3">
                    Twitter???????????????????????????
                    <input
                      type="text"
                      id="twitter_name"
                      value={twitterUserName}
                      onChange={(e) => setTwitterUserName(e.target.value)}
                    />
                  </div>
                )
              ) : (
                <p className="mb-3 text-danger">
                  ??????????????????????????????Twitter???????????????????????????????????????
                </p>
              )}
            </>
          }
          <div className="mb-3">
            <label htmlFor="show_thumbnail">
              ?????????????????????????????? (Gyazo?????????????????????????????????)
            </label>
            <input
              type="checkbox"
              id="show_thumbnail"
              disabled={!notifySlack}
              checked={showThumbnail}
              onChange={(e) => setShowThumbnail(e.target.checked)}
            />
          </div>
          <div className="mb-3">
            <SlackChannelInput />
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary form-control"
              disabled={
                files.length === 0 || isUploading || filesizeLimitExceeded
              }
            >
              {isUploading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div>
                    <span
                      className="spinner-border text-light"
                      role="status"
                    ></span>
                  </div>
                  <div>???????????????????????????</div>
                </div>
              ) : (
                "????????????????????????"
              )}
            </button>
          </div>
          {uploadErrors &&
            uploadErrors.map((error, i) => (
              <div key={i} className="alert alert-danger mt-3" role="alert">
                {error.message}
              </div>
            ))}
        </form>
      </div>
    </div>
  );
};

const SortableImage: React.VFC<{
  index: number;
  dataURL: string;
  handleDeleteImage: (i: number) => void;
}> = ({ index, dataURL, handleDeleteImage }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: dataURL });

  return (
    <div
      className="card me-2"
      style={{
        width: 186,
        height: 186,
        backgroundImage: `url(${dataURL})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="btn-close ms-auto"
        aria-label="???????????????????????????"
        onClick={() => handleDeleteImage(index)}
      ></button>
    </div>
  );
};
