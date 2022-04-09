import { useContext } from "react";

import { UploadArtworkContext } from "../contexts/UploadArtworkContext";

export const useUploadArtworkContext = () => useContext(UploadArtworkContext);
