import graphene

from goduploader.model.artwork import ArtworkRatingEnum as ArtworkRatingEnumType


class ArtworkRatingEnum(graphene.Enum):
    class Meta:
        enum = ArtworkRatingEnumType
        name = "ArtworkRatingEnum"
        description = "作品の年齢制限 (全年齢/R-18/R-18G) を表すenum"
