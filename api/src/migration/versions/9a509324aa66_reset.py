"""reset

Revision ID: 9a509324aa66
Revises:
Create Date: 2022-04-07 19:35:28.159565

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9a509324aa66'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('account',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('kmcid', sa.String(length=255), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('artworks_count', sa.Integer(), nullable=False),
    sa.Column('last_logged_in', sa.DateTime(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('kmcid')
    )
    op.create_index('account_artworks_count', 'account', ['artworks_count'], unique=False)
    op.create_table('tag',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('edit_freezed', sa.Boolean(), nullable=False),
    sa.Column('canonical_name', sa.String(length=255), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('artworks_count', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('canonical_name')
    )
    op.create_index('tag_artworks_count', 'tag', ['artworks_count'], unique=False)
    op.create_table('artwork',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('account_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('caption', sa.Text(), nullable=False),
    sa.Column('nsfw', sa.Boolean(), nullable=False),
    sa.Column('top_illust_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('artwork_tag_relation',
    sa.Column('artwork_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['artwork_id'], ['artwork.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], )
    )
    op.create_table('comment',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('account_id', sa.Integer(), nullable=False),
    sa.Column('artwork_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.ForeignKeyConstraint(['artwork_id'], ['artwork.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('illust',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('artwork_id', sa.Integer(), nullable=False),
    sa.Column('filename', sa.String(length=2048), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['artwork_id'], ['artwork.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('like',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('account_id', sa.Integer(), nullable=False),
    sa.Column('artwork_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['account_id'], ['account.id'], ),
    sa.ForeignKeyConstraint(['artwork_id'], ['artwork.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('like')
    op.drop_table('illust')
    op.drop_table('comment')
    op.drop_table('artwork_tag_relation')
    op.drop_table('artwork')
    op.drop_index('tag_artworks_count', table_name='tag')
    op.drop_table('tag')
    op.drop_index('account_artworks_count', table_name='account')
    op.drop_table('account')
    # ### end Alembic commands ###
