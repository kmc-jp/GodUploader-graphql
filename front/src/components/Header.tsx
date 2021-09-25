import { Collapse } from "bootstrap";
import React, { useEffect, useRef } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";

export const Header: React.VFC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const history = useHistory();

  // ページ遷移時にドロップダウンメニューが閉じるようにする
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    // toggle: false を指定しないとページ遷移するたびにドロップダウンメニューが開閉してしまう
    const collapse = new Collapse(ref.current, { toggle: false });
    const unsubscribe = history.listen(() => {
      collapse.hide();
    });

    return () => {
      collapse.dispose();
      unsubscribe();
    };
  }, [history]);

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
                className="nav-link"
                activeClassName="active"
              >
                アップロード
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/my" className="nav-link" activeClassName="active">
                マイページ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tags" className="nav-link" activeClassName="active">
                タグ検索
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/tegaki"
                className="nav-link"
                activeClassName="active"
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
