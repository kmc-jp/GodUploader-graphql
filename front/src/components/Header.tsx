import type { Collapse as BSCollapse } from "bootstrap";
import React, { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link active" : "nav-link";

export const Header: React.VFC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const collapseRef = useRef<BSCollapse | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    // bootstrap は document に触るので動的にロードする (SPA pre-render を破壊しないため)
    let disposed = false;
    import("bootstrap").then(({ Collapse }) => {
      if (disposed || !ref.current) {
        return;
      }
      // toggle: false を指定しないとページ遷移するたびにドロップダウンメニューが開閉してしまう
      collapseRef.current = new Collapse(ref.current, { toggle: false });
    });

    return () => {
      disposed = true;
      collapseRef.current?.dispose();
      collapseRef.current = null;
    };
  }, []);

  // ページ遷移時にドロップダウンメニューが閉じるようにする
  useEffect(() => {
    collapseRef.current?.hide();
  }, [location.pathname, location.search]);

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
              <NavLink to="/artwork/new" className={navLinkClassName}>
                アップロード
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/my" className={navLinkClassName}>
                マイページ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tags" className={navLinkClassName}>
                タグ検索
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tegaki" className={navLinkClassName}>
                tegaki_du
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
