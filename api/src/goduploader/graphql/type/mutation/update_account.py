import graphene
from goduploader.db import session
from goduploader.graphql.type.account import Account


class UpdateAccount(graphene.ClientIDMutation):
    class Input:
        name = graphene.String(desciption="更新後の表示名", required=True)

    account = graphene.Field(Account)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        current_user = info.context.user
        if current_user is None:
            raise Exception("Please login")

        current_user.name = input["name"]

        session.commit()

        return UpdateAccount(account=current_user)
