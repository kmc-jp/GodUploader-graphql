import { Collapse } from "bootstrap";
import React, { useEffect, useRef } from "react";
import { useLocation } from 'react-router';

import { Link } from "./Link";
import { NavLink } from "./NavLink";

export const Header: React.VFC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const collapseRef = useRef<Collapse | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!ref.current) return;
    collapseRef.current = new Collapse(ref.current, { toggle: false });
    return () => {
      collapseRef.current?.dispose();
      collapseRef.current = null;
    };
  }, []);

  // ページ遷移時にドロップダウンメニューが閉じるようにする
  useEffect(() => {
    collapseRef.current?.hide();
  }, [location]);

  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-light mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="d-none d-md-inline">KMC画像アップローダー </span>
          God Illust Uploader
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
          ref={ref}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/artwork/new"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                アップロード
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/my"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                マイページ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tags"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                タグ検索
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tegaki"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                tegaki_du
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
