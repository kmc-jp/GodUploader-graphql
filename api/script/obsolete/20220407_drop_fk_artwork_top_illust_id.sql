CREATE TABLE artwork_new (
  id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  caption TEXT NOT NULL,
  nsfw BOOLEAN NOT NULL,
  top_illust_id INTEGER,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(account_id) REFERENCES account (id)
);

INSERT INTO artwork_new SELECT * FROM artwork;

-- 行数が一致しなかったら中断
SELECT COUNT(*) FROM artwork;
SELECT COUNT(*) FROM artwork_new;

DROP TABLE artwork;
ALTER TABLE artwork_new RENAME TO artwork;
