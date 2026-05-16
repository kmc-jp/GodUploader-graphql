import React, { useCallback, useContext, useState } from "react";
import { Button, Container } from "react-bootstrap";

import { ArtworkInformationProvider } from "../../contexts/ArtworkInformationContext";
import { DrawingContext } from "../../contexts/TegakiDU/DrawingContext";
import { PaintStackContext } from "../../contexts/TegakiDU/PaintStackContext";
import { UploadArtworkProvider } from "../../contexts/UploadArtworkContext";
import { UploadArtworkModal } from "./UploadArtworkModal";

export const Sidebar: React.FC = () => {
  const {
    color,
    backgroundColor,
    strokeWidth,
    setColor,
    setBackgroundColor,
    setStrokeWidth,
    toBlob,
    setIsPosting,
  } = useContext(DrawingContext);
  const { setPaints, append, undo, redo, undoable, redoable } =
    useContext(PaintStackContext);

  const handleDeleteAll = useCallback(() => {
    if (
      !window.confirm(
        "本当に全て消してしまいますか？ (現在の背景色で塗りつぶします。)",
      )
    ) {
      return;
    }

    setPaints([{ tool: "fill", color: backgroundColor }]);
    append([{ tool: "fill", color: backgroundColor }]);
  }, [append, backgroundColor, setPaints]);

  const [isSerializing, setIsSerializing] = useState(false);
  const [serializedBlob, setSerializedBlob] = useState<Blob>();
  const handleDownload = useCallback(async () => {
    setIsSerializing(true);

    const blob = await toBlob();
    setIsSerializing(false);
    if (!blob) {
      return;
    }

    const dataURL = URL.createObjectURL(blob);
    window.open(dataURL);
  }, [toBlob]);

  const handleUpload = useCallback(async () => {
    setIsSerializing(true);

    const blob = await toBlob();
    setIsSerializing(false);
    if (!blob) {
      return;
    }

    setIsPosting(true);
    setSerializedBlob(blob);
  }, [setIsPosting, toBlob]);

  return (
    <Container className="h-100">
      <ArtworkInformationProvider initialTags={["tegaki_du"]}>
        <UploadArtworkProvider>
          <UploadArtworkModal blob={serializedBlob} />
        </UploadArtworkProvider>
      </ArtworkInformationProvider>
      <div className="row">
        <div className="col-sm-10">
          <div className="row mb-2">
            <div className="col-sm-2">
              <label htmlFor="stroke_width">太さ</label>
            </div>
            <div className="col">
              <input
                type="range"
                id="stroke_width"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                min={1}
                max={20}
                className="w-100"
              />
            </div>
            <div className="col-sm-2">{strokeWidth}</div>
          </div>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          ペンの色
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-100"
          />
        </div>
        <div className="col">
          背景色
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-100"
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Button
            variant="secondary"
            className="w-100"
            disabled={!undoable}
            onClick={undo}
          >
            元に戻す
          </Button>
        </div>
        <div className="col">
          <Button
            variant="secondary"
            className="w-100"
            disabled={!redoable}
            onClick={redo}
          >
            やり直す
          </Button>
        </div>
        <div className="my-2">
          <Button variant="danger" className="w-100" onClick={handleDeleteAll}>
            全て消す
          </Button>
        </div>
        <div className="d-flex justify-content-around">
          <div className="col-sm-8">
            <Button variant="success" className="w-100" onClick={handleUpload}>
              アップロード
            </Button>
          </div>
          <div className="col-sm-4">
            <Button
              variant="primary"
              className="w-100"
              onClick={handleDownload}
            >
              DL
            </Button>
          </div>
        </div>
        {isSerializing && <div>シリアライズ中……</div>}
      </div>
    </Container>
  );
};
