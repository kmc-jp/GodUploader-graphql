import { Collapse } from "bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";

export const Header: React.VFC = () => {
  const ref = useRef<HTMLDivElement>(null);

  // ページ遷移時にドロップダウンメニューが閉じるようにする
  const router = useRouter();
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // toggle: false を指定しないとページ遷移するたびにドロップダウンメニューが開閉してしまう
    const collapse = new Collapse(ref.current, { toggle: false });
    const handleRouteChange = () => {
      collapse.hide();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      collapse.dispose();
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <nav className="navbar navbar-expand-xl navbar-light bg-light mb-3">
      <div className="container">
        <Link href="/" passHref>
          <a className="navbar-brand">
            <span className="d-none d-md-inline">KMC画像アップローダー </span>
            God Illust Uploader
          </a>
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
              {/* TODO: NavLink */}
              <Link href="/artwork/new" passHref>
                <a className="nav-item">アップロード</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/my" passHref>
                <a className="nav-link">マイページ</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/tags" passHref>
                <a className="nav-link">タグ検索</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/tegaki" passHref>
                <a className="nav-link">tegaki_du</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
