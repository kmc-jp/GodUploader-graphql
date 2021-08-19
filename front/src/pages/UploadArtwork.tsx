import {
  closestCenter,
  DndContext,
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
import React, { useCallback, useMemo } from "react";

import { AgeRestrictionInput } from "../components/ArtworkInfoForm/AgeRestrictionInput";
import { CaptionInput } from "../components/ArtworkInfoForm/CaptionInput";
import { SlackChannelInput } from "../components/ArtworkInfoForm/SlackChannelInput";
import { TagsInput } from "../components/ArtworkInfoForm/TagsInput";
import { TitleInput } from "../components/ArtworkInfoForm/TitleInput";
import { ArtworkInformationProvider } from "../contexts/ArtworkInformationContext";
import { UploadArtworkProvider } from "../contexts/UploadArtworkContext";
import { useUploadArtworkContext } from "../hooks/useUploadArtworkContext";

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
    uploadErrors,
    setFiles,
    setShowThumbnail,
    setNotifySlack,
    handleSubmit,
  } = useUploadArtworkContext();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        if (!(e.target.files && e.target.files.length > 0)) {
          return;
        }
        setFiles([...files, ...Array.from(e.target.files)]);
        e.target.value = "";
      },
      [files, setFiles]
    );

  const handleDeleteImage = useCallback(
    (index: number) => {
      setFiles(files.filter((file, i) => i !== index));
    },
    [files, setFiles]
  );

  const images = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div className="card">
      <div className="card-header">画像のアップロード</div>
      <div className="panel-body px-4 py-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              アップロードする画像を追加{" "}
              <span className="text-danger">
                (GIF/JPEG/PNG形式, 必須, 先頭の画像がサムネイルになります)
              </span>
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              multiple
              accept="image/gif,image/png,image/jpeg"
              onChange={handleFileChange}
            />
            {images.length > 0 && (
              <div className="d-flex mt-2">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => {
                    const { active, over } = event;
                    if (!over) {
                      return;
                    }
                    if (active.id === over?.id) {
                      return;
                    }
                    const itemIds = images.map((im, i) => `${i}-${im}`);
                    const oldIndex = itemIds.indexOf(active.id);
                    const newIndex = itemIds.indexOf(over.id);
                    console.log(oldIndex, newIndex);
                    setFiles(arrayMove(files, oldIndex, newIndex));
                  }}
                >
                  <SortableContext
                    items={images.map((im, i) => `${i}-${im}`)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {images.map((dataURL, i) => (
                      <SortableImage
                        key={`${i}-${dataURL}`}
                        dataURL={dataURL}
                        index={i}
                        handleDeleteImage={handleDeleteImage}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
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
            <label htmlFor="notify_slack">Slackに通知する</label>
            <input
              type="checkbox"
              id="notify_slack"
              checked={notifySlack}
              onChange={(e) => setNotifySlack(e.target.checked)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="show_thumbnail">
              サムネイルを表示する (Gyazoに自動的に投稿されます)
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
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div>
                    <span
                      className="spinner-border text-light"
                      role="status"
                    ></span>
                  </div>
                  <div>アップロード中……</div>
                </div>
              ) : (
                "アップロードする"
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
    useSortable({ id: `${index}-${dataURL}` });

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
        aria-label="この画像を削除する"
        onClick={() => handleDeleteImage(index)}
      ></button>
    </div>
  );
};
