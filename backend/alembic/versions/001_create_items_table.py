"""create items table

Revision ID: 001_create_items_table
Revises: 
Create Date: 2026-11-06 23:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001_create_items_table"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Define enum types with check for sqlite/postgres compatibility
    item_type_enum = sa.Enum("LOST", "FOUND", name="item_type_enum")
    item_status_enum = sa.Enum("OPEN", "RETURNED", name="item_status_enum")

    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("title", sa.String(length=150), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("type", item_type_enum, nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("location", sa.String(length=150), nullable=False),
        sa.Column("item_date", sa.Date(), nullable=False),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("image_key", sa.String(length=500), nullable=True),
        sa.Column("contact_name", sa.String(length=100), nullable=False),
        sa.Column("contact_email", sa.String(length=255), nullable=False),
        sa.Column("contact_phone", sa.String(length=30), nullable=True),
        sa.Column("status", item_status_enum, server_default="OPEN", nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False
        ),
        sa.PrimaryKeyConstraint("id")
    )

    op.create_index("idx_items_type", "items", ["type"], unique=False)
    op.create_index("idx_items_category", "items", ["category"], unique=False)
    op.create_index("idx_items_location", "items", ["location"], unique=False)
    op.create_index("idx_items_created_at", "items", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index("idx_items_created_at", table_name="items")
    op.drop_index("idx_items_location", table_name="items")
    op.drop_index("idx_items_category", table_name="items")
    op.drop_index("idx_items_type", table_name="items")
    op.drop_table("items")
