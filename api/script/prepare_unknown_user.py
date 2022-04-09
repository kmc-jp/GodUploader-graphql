from goduploader.db import engine, session
from goduploader.model.account import Account

engine.echo = True


def main():
    with session.begin():
        unknown_user = session.query(Account).filter_by(kmcid="unknown_user").first()
        if unknown_user is not None:
            return
        new_account = Account(
            id=68,
            kmcid="unknown_user",
            name="unknown_user",
            artworks_count=12,
        )
        session.add(new_account)


if __name__ == "__main__":
    main()
