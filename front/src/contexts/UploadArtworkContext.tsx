import {
  createContext,
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useRelayEnvironment } from "react-relay";
import { useHistory } from "react-router-dom";
import { PayloadError } from "relay-runtime";

import { useArtworkInformation } from "../hooks/useArtworkInformation";
import { commitUploadArtworkMutation } from "../mutation/UploadArtwork";
import { tagWithAgeRestriction } from "./ArtworkInformationContext";

type UplaodArtworkContextValue = {
  isUploading: boolean;
  notifySlack: boolean;
  showThumbnail: boolean;
  slackChannel: string;
  files: (File | Blob)[];
  uploadErrors: PayloadError[] | null | undefined;
  filesizeLimitExceeded: boolean;

  setIsUploading: (b: boolean) => void;
  setNotifySlack: (b: boolean) => void;
  setShowThumbnail: (b: boolean) => void;
  setSlackChannel: (ch: string) => void;
  setFiles: Dispatch<SetStateAction<File[] | Blob[]>>;
  setUploadErrors: (errors: PayloadError[] | null | undefined) => void;

  handleSubmit: FormEventHandler;
};

const defaultValue = {
  isUploading: false,
  notifySlack: false,
  showThumbnail: false,
  slackChannel: "",
  files: [],
  uploadErrors: null,
  filesizeLimitExceeded: false,

  setIsUploading: () => {
    /* noop */
  },
  setNotifySlack: () => {
    /* noop */
  },
  setShowThumbnail: () => {
    /* noop */
  },
  setSlackChannel: () => {
    /* noop */
  },
  setFiles: () => {
    /* noop */
  },
  setUploadErrors: () => {
    /* noop */
  },

  handleSubmit: () => {
    /* noop */
  },
};

// nginxのclient_max_body_sizeに合わせる
export const MAX_FILESIZE_MB = 10

// client_max_body_sizeより厳しめに制限する
const MAX_FILESIZE = (MAX_FILESIZE_MB * 0.95) * 1024 * 1024;

export const UploadArtworkContext =
  createContext<UplaodArtworkContextValue>(defaultValue);

export const UploadArtworkProvider: React.FC = ({ children }) => {
  const { title, caption, tags, ageRestriction } = useArtworkInformation();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[] | Blob[]>([]);
  const filesizeLimitExceeded = useMemo(() => {
    const totalFileSize = files
      .map((file) => file.size)
      .reduce((a, b) => a + b, 0);
    return totalFileSize >= MAX_FILESIZE;
  }, [files]);

  const [notifySlack, setNotifySlack] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [slackChannel, setSlackChannel] = useState("C039TN7Q1"); // #graphics
  const [uploadErrors, setUploadErrors] = useState<
    PayloadError[] | null | undefined
  >(null);

  const environment = useRelayEnvironment();
  const history = useHistory();

  const handleSubmit: FormEventHandler = useCallback(
    (event) => {
      event.preventDefault();

      const shareOption = notifySlack
        ? showThumbnail
          ? "SHARE_TO_SLACK_WITH_IMAGE"
          : "SHARE_TO_SLACK"
        : "NONE";

      setIsUploading(true);
      const uploadables = Object.fromEntries<File | Blob>(
        Array.from(files, (file, i) => [`variables.input.files.${i}`, file])
      );
      commitUploadArtworkMutation(environment, {
        variables: {
          connections: [],
          input: {
            title,
            caption,
            tags: tagWithAgeRestriction(tags, ageRestriction),
            files: Array.from(files, (_, i) => null),
            shareOption,
            channelId: slackChannel,
          },
        },
        uploadables,
        onCompleted: (resp, errors) => {
          setIsUploading(false);
          if (errors) {
            setUploadErrors(errors.slice());
            return;
          }

          if (!resp.uploadArtwork?.artwork) {
            return;
          }

          history.replace(`/artwork/${resp.uploadArtwork.artwork.id}`);
        },
      });
    },
    [
      ageRestriction,
      caption,
      environment,
      files,
      history,
      notifySlack,
      showThumbnail,
      slackChannel,
      tags,
      title,
    ]
  );

  return (
    <UploadArtworkContext.Provider
      value={{
        isUploading,
        files,
        notifySlack,
        showThumbnail,
        slackChannel,
        uploadErrors,
        filesizeLimitExceeded,
        setIsUploading,
        setFiles,
        setNotifySlack,
        setShowThumbnail,
        setSlackChannel,
        setUploadErrors,
        handleSubmit,
      }}
    >
      {children}
    </UploadArtworkContext.Provider>
  );
};
