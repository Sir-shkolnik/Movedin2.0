"""Initialize database tables"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '../../src/backend'))

from app.core.database import init_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("🚀 Initializing database...")
    init_db()
    logger.info("✅ Database initialized successfully!")

