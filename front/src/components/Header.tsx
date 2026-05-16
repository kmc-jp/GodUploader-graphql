import React, { useState, useEffect } from "react";
import { Container, Navbar } from "react-bootstrap";
import { useLocation } from "react-router";

import { Link } from "./Link";
import { NavLink } from "./NavLink";

export const Header: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  // ページ遷移時にドロップダウンメニューが閉じるようにする
  useEffect(() => {
    setExpanded(false);
  }, [location]);

  return (
    <Navbar
      expand="xl"
      bg="light"
      variant="light"
      className="mb-3"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="d-none d-md-inline">KMC画像アップローダー </span>
          God Illust Uploader
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/artwork/new"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                アップロード
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/my"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                マイページ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tags"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                タグ検索
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tegaki"
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                tegaki_du
              </NavLink>
            </li>
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
