CREATE TABLE account (
  id INTEGER NOT NULL,
  kmcid VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  artworks_count INTEGER NOT NULL,
  last_logged_in DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (kmcid)
);

CREATE TABLE tag (
  id INTEGER NOT NULL,
  edit_freezed BOOLEAN NOT NULL,
  canonical_name VARCHAR(255) COLLATE "utf8mb4_general_ci" NOT NULL,
  name VARCHAR(255) COLLATE "utf8mb4_general_ci" NOT NULL,
  artworks_count INTEGER NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (canonical_name)
);

CREATE TABLE artwork (
  id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  caption TEXT NOT NULL,
  rating VARCHAR(5) DEFAULT 'safe' NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(account_id) REFERENCES account (id)
);

CREATE TABLE artwork_tag_relation (
  artwork_id INTEGER,
  tag_id INTEGER,
  FOREIGN KEY(artwork_id) REFERENCES artwork (id),
  FOREIGN KEY(tag_id) REFERENCES tag (id)
);

CREATE TABLE comment (
  id INTEGER NOT NULL,
  text TEXT NOT NULL,
  account_id INTEGER NOT NULL,
  artwork_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(account_id) REFERENCES account (id),
  FOREIGN KEY(artwork_id) REFERENCES artwork (id)
);

CREATE TABLE illust (
  id INTEGER NOT NULL,
  artwork_id INTEGER NOT NULL,
  filename VARCHAR(2048) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(artwork_id) REFERENCES artwork (id)
);

CREATE TABLE "like" (
  id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  artwork_id INTEGER NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(account_id) REFERENCES account (id),
  FOREIGN KEY(artwork_id) REFERENCES artwork (id)
);
