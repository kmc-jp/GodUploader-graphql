import React from "react";

import { useArtworkInformation } from "../../hooks/useArtworkInformation";

export const AgeRestrictionInput: React.VFC = () => {
  const { ageRestriction, setAgeRestriction } = useArtworkInformation();

  return (
    <div className="form-group row">
      <div className="col-sm-1">
        年齢制限 <span className="text-danger">(必須)</span>
      </div>
      <div className="col-sm-11">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="age_restriction"
            required
            id="age_restriction_safe"
            checked={ageRestriction === "SAFE"}
            onChange={() => setAgeRestriction("SAFE")}
          />
          <label className="form-check-label" htmlFor="age_restriction_safe">
            全年齢
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="age_restriction"
            required
            id="age_restriction_r_18"
            checked={ageRestriction === "R-18"}
            onChange={() => setAgeRestriction("R-18")}
          />
          <label className="form-check-label" htmlFor="age_restriction_r_18">
            R-18
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="age_restriction"
            required
            id="age_restriction_r_18g"
            checked={ageRestriction === "R-18G"}
            onChange={() => setAgeRestriction("R-18G")}
          />
          <label className="form-check-label" htmlFor="age_restriction_r_18g">
            R-18G
          </label>
        </div>
      </div>
    </div>
  );
};
