"""add tag.edit_freezed column

Revision ID: 2edbad656d43
Revises: 4a57c26b84a9
Create Date: 2021-06-26 05:14:12.192945

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2edbad656d43'
down_revision = '4a57c26b84a9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tag', sa.Column('edit_freezed', sa.Boolean(), server_default=sa.text('(FALSE)'), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tag', 'edit_freezed')
    # ### end Alembic commands ###
