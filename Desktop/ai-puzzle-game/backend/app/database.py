"""SQLite leaderboard – simple and reliable."""
from __future__ import annotations

import aiosqlite
from pathlib import Path
from typing import List, Optional

from .config import DB_PATH


async def init_db() -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nickname TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                score INTEGER NOT NULL,
                time_seconds REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE INDEX IF NOT EXISTS idx_scores_score
            ON scores(score DESC)
        """)
        await db.commit()


async def add_score(nickname: str, difficulty: str, score: int, time_seconds: float) -> int:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "INSERT INTO scores (nickname, difficulty, score, time_seconds) VALUES (?, ?, ?, ?)",
            (nickname.strip()[:32], difficulty, score, time_seconds),
        )
        await db.commit()
        return cursor.lastrowid or 0


async def get_top_scores(limit: int = 5) -> List[dict]:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            """
            SELECT nickname, difficulty, score, time_seconds, created_at
            FROM scores
            ORDER BY score DESC, time_seconds ASC
            LIMIT ?
            """,
            (limit,),
        )
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def clear_scores() -> None:
    """Utility for testing."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM scores")
        await db.commit()
