"""create transactions table

Revision ID: 0001_create_transactions
Revises:
Create Date: 2025-09-13 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_create_transactions'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'transactions',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('description', sa.String(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('transaction_type', sa.String(), nullable=False),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('auto_tagged', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('timestamp', sa.TIMESTAMP(), server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.CheckConstraint("transaction_type IN ('income','expense')", name='chk_type')
    )

def downgrade():
    op.drop_table('transactions')