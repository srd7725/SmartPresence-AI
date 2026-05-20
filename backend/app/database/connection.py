import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

def init_postgres_db():
    """Tries to connect to Postgres server and create the database if it doesn't exist."""
    db_url = settings.DATABASE_URL
    if "postgresql" in db_url:
        try:
            # Parse connection URL to get base connection to template 'postgres' database
            # DATABASE_URL: postgresql://postgres:password@localhost:5432/smartpresence_ai
            base_url, db_name = db_url.rsplit("/", 1)
            postgres_url = f"{base_url}/postgres"
            
            # Connect to 'postgres' database with autocommit to run CREATE DATABASE
            temp_engine = create_engine(
                postgres_url, 
                isolation_level="AUTOCOMMIT", 
                connect_args={"connect_timeout": 3}
            )
            with temp_engine.connect() as conn:
                # Check if the target database exists
                result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname='{db_name}'"))
                exists = result.scalar()
                if not exists:
                    conn.execute(text(f"CREATE DATABASE {db_name}"))
                    print(f"Database '{db_name}' created successfully in PostgreSQL.")
                else:
                    print(f"Database '{db_name}' already exists in PostgreSQL.")
            temp_engine.dispose()
        except Exception as e:
            print(f"PostgreSQL database pre-creation check skipped/failed: {e}")

# Run the DB pre-creation logic
init_postgres_db()

# Create actual engine with local SQLite fallback
try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        connect_args={"connect_timeout": 3}
    )
    # Test connection
    with engine.connect() as conn:
        pass
    print("Successfully connected to PostgreSQL database.")
except Exception as e:
    print(f"\n[DATABASE WARNING] PostgreSQL connection failed: {e}")
    print("[DATABASE WARNING] Falling back to SQLite ('sqlite:///./smartpresence_ai.db') for local development...\n")
    
    sqlite_url = "sqlite:///./smartpresence_ai.db"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
