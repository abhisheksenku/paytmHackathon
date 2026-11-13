import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, DateTime, ForeignKey, 
    Text, Boolean, Numeric, Index
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    business_name = Column(String(255), nullable=False, index=True)
    owner_name = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    category = Column(String(100), default="Kirana & General Store") # Kirana, Restaurant, Apparel, etc.
    upi_vpa = Column(String(100), default="merchant@paytm")
    city = Column(String(100), default="Hyderabad")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    users = relationship("User", back_populates="merchant", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="merchant", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="merchant", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="merchant", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="merchant", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="merchant", cascade="all, delete-orphan")
    daily_aggregates = relationship("DailyAggregate", back_populates="merchant", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="owner")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="users")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    sku = Column(String(100), nullable=True)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), default="General", index=True)
    unit_price = Column(Float, nullable=False)
    cost_price = Column(Float, nullable=True)
    stock_qty = Column(Integer, default=100)
    reorder_level = Column(Integer, default=15)
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="products")
    transaction_items = relationship("TransactionItem", back_populates="product")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    customer_ref = Column(String(100), nullable=False, index=True) # VPA or masked phone
    name = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)
    total_spent = Column(Float, default=0.0)
    total_orders = Column(Integer, default=0)
    segment = Column(String(50), default="New") # Champions, Regulars, At Risk, One-time
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="customers")
    transactions = relationship("Transaction", back_populates="customer")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id"), nullable=True, index=True)
    external_txn_id = Column(String(100), nullable=False, index=True)
    transaction_date = Column(DateTime, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    payment_mode = Column(String(50), default="UPI") # UPI, CARD, CASH, WALLET
    status = Column(String(50), default="SUCCESS") # SUCCESS, FAILED, PENDING
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="transactions")
    customer = relationship("Customer", back_populates="transactions")
    items = relationship("TransactionItem", back_populates="transaction", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_merchant_date", "merchant_id", "transaction_date"),
    )


class TransactionItem(Base):
    __tablename__ = "transaction_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    transaction_id = Column(String(36), ForeignKey("transactions.id"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=True, index=True)
    product_name = Column(String(255), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    transaction = relationship("Transaction", back_populates="items")
    product = relationship("Product", back_populates="transaction_items")


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    target_segment = Column(String(100), nullable=False)
    objective = Column(String(100), default="Retention") # Retention, Clearance, Weekend Spurt
    message_text = Column(Text, nullable=False)
    discount_code = Column(String(50), nullable=True)
    discount_pct = Column(Integer, default=10)
    status = Column(String(50), default="DRAFT") # DRAFT, APPROVED, REJECTED, SENT
    created_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="campaigns")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    title = Column(String(255), default="Dukaan Assistant Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    merchant = relationship("Merchant", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id"), nullable=False, index=True)
    role = Column(String(50), nullable=False) # user, assistant, tool
    content = Column(Text, nullable=False)
    tool_calls_json = Column(Text, nullable=True) # JSON string of executed tools & outputs
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")


class DailyAggregate(Base):
    __tablename__ = "daily_aggregates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    merchant_id = Column(String(36), ForeignKey("merchants.id"), nullable=False, index=True)
    date = Column(String(10), nullable=False, index=True) # YYYY-MM-DD
    total_revenue = Column(Float, default=0.0)
    total_transactions = Column(Integer, default=0)
    unique_customers = Column(Integer, default=0)
    avg_order_value = Column(Float, default=0.0)

    merchant = relationship("Merchant", back_populates="daily_aggregates")

    __table_args__ = (
        Index("idx_merchant_date_agg", "merchant_id", "date", unique=True),
    )
