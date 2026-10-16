"""Quick backend smoke tests (no webcam needed)."""
import asyncio
import sys
sys.path.insert(0, ".")

from app.detector import detector
from app.puzzle import create_demo_image, generate_puzzle
from app.database import init_db, add_score, get_top_scores


async def main():
    print("1. Init DB...")
    await init_db()
    print("   OK")

    print("2. Load YOLO...")
    detector.load()
    assert detector.is_ready()
    print("   OK")

    print("3. Demo image + detect...")
    img = create_demo_image()
    found, info, _ = detector.detect_person(img)
    print(f"   Person found: {found} (expected False on demo art)")
    print("   OK")

    print("4. Generate puzzles...")
    for g in (3, 4, 5):
        p = generate_puzzle(img, g)
        assert len(p["pieces"]) == g * g
        assert len(p["solution"]) == g * g
        print(f"   {g}x{g}: {len(p['pieces'])} pieces OK")

    print("5. Leaderboard...")
    await add_score("TestPlayer", "easy", 1500, 42.0)
    scores = await get_top_scores(5)
    assert any(s["nickname"] == "TestPlayer" for s in scores)
    print(f"   Top scores: {len(scores)}")
    print("   OK")

    print("\nAll backend tests passed.")


if __name__ == "__main__":
    asyncio.run(main())
