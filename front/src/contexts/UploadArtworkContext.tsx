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
import { ageRestirctionToRating } from "./ArtworkInformationContext";

type UplaodArtworkContextValue = {
  isUploading: boolean;
  notifySlack: boolean;
  notifyTwitter: boolean;
  twitterUserName: string;
  showThumbnail: boolean;
  slackChannel: string;
  files: (File | Blob)[];
  uploadErrors: PayloadError[] | null | undefined;
  totalFilesize: number;
  filesizeLimitExceeded: boolean;

  setIsUploading: (b: boolean) => void;
  setNotifySlack: (b: boolean) => void;
  setNotifyTwitter: (b: boolean) => void;
  setShowThumbnail: (b: boolean) => void;
  setTwitterUserName: (n: string) => void;
  setSlackChannel: (ch: string) => void;
  setFiles: Dispatch<SetStateAction<File[] | Blob[]>>;
  setUploadErrors: (errors: PayloadError[] | null | undefined) => void;

  handleSubmit: FormEventHandler;
};

const defaultValue: UplaodArtworkContextValue = {
  isUploading: false,
  notifySlack: false,
  notifyTwitter: false,
  twitterUserName: "",
  showThumbnail: false,
  slackChannel: "",
  files: [],
  totalFilesize: 0,
  uploadErrors: null,
  filesizeLimitExceeded: false,

  setIsUploading: () => {
    /* noop */
  },
  setNotifySlack: () => {
    /* noop */
  },
  setNotifyTwitter: () => {
    /* noop */
  },
  setTwitterUserName: () => {
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
export const MAX_FILESIZE_MB = 40;

// client_max_body_sizeより厳しめに制限する
export const MAX_FILESIZE = MAX_FILESIZE_MB * 0.95 * 1024 * 1024;

export const UploadArtworkContext =
  createContext<UplaodArtworkContextValue>(defaultValue);

interface UploadArtworkProviderProps {
  children: React.ReactNode;
}

export const UploadArtworkProvider: React.VFC<UploadArtworkProviderProps> = ({
  children,
}) => {
  const { title, caption, tags, ageRestriction } = useArtworkInformation();
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[] | Blob[]>([]);
  const totalFilesize = useMemo(
    () => files.map((file) => file.size).reduce((a, b) => a + b, 0),
    [files]
  );
  const filesizeLimitExceeded = useMemo(() => {
    return totalFilesize >= MAX_FILESIZE;
  }, [totalFilesize]);

  const [notifySlack, setNotifySlack] = useState(false);
  const [notifyTwitter, setNotifyTwitter] = useState(false);
  const [twitterUserName, setTwitterUserName] = useState("");
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
      const twitterShareOption = {
        share: notifyTwitter,
        username: twitterUserName,
      };

      const rating = ageRestirctionToRating(ageRestriction);

      if (rating === null) {
        return;
      }

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
            tags,
            files: Array.from(files, () => null),
            shareOption,
            twitterShareOption,
            rating,
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
        onError: (error) => {
          setIsUploading(false);
          setUploadErrors([error]);
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
      notifyTwitter,
      twitterUserName,
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
        notifyTwitter,
        twitterUserName,
        showThumbnail,
        slackChannel,
        uploadErrors,
        totalFilesize,
        filesizeLimitExceeded,
        setIsUploading,
        setFiles,
        setNotifySlack,
        setNotifyTwitter,
        setTwitterUserName,
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
