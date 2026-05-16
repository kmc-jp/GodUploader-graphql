import React from "react";
import { Col, Form, Row } from "react-bootstrap";

import { useArtworkInformation } from "../../hooks/useArtworkInformation";

export const AgeRestrictionInput: React.FC = () => {
  const { ageRestriction, setAgeRestriction } = useArtworkInformation();

  return (
    <Form.Group as={Row}>
      <Col sm={2}>
        年齢制限 <span className="text-danger">(必須)</span>
      </Col>
      <Col sm={10}>
        <Form.Check
          inline
          type="radio"
          name="age_restriction"
          required
          id="age_restriction_safe"
          label="全年齢"
          checked={ageRestriction === "SAFE"}
          onChange={() => setAgeRestriction("SAFE")}
        />
        <Form.Check
          inline
          type="radio"
          name="age_restriction"
          required
          id="age_restriction_r_18"
          label="R-18"
          checked={ageRestriction === "R-18"}
          onChange={() => setAgeRestriction("R-18")}
        />
        <Form.Check
          inline
          type="radio"
          name="age_restriction"
          required
          id="age_restriction_r_18g"
          label="R-18G"
          checked={ageRestriction === "R-18G"}
          onChange={() => setAgeRestriction("R-18G")}
        />
      </Col>
    </Form.Group>
  );
};
