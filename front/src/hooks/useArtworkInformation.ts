import { useContext } from "react";

import { ArtworkInformationContext } from "../contexts/ArtworkInformationContext";

export const useArtworkInformation = () =>
  useContext(ArtworkInformationContext);
