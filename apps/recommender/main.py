"""
MANTIS ML Recommender Service
FastAPI + scikit-learn collaborative filtering for expert-learner matching.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import os
import uvicorn

app = FastAPI(
    title="MANTIS Recommender",
    description="Collaborative filtering service for expert-learner matching",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("API_URL", "http://localhost:3001")],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class RecommendRequest(BaseModel):
    learner_id: str
    skills: list[str] = []
    limit: int = 5


class ExpertScore(BaseModel):
    expert_id: str
    score: float
    match_reason: str


class RecommendResponse(BaseModel):
    learner_id: str
    recommendations: list[ExpertScore]
    algorithm: str = "collaborative-filtering-v1"


# Mock expert database — replace with real DB query via httpx to NestJS API
MOCK_EXPERTS = [
    {"id": "e1", "skills": ["System Design", "Go", "Kubernetes"], "rating": 4.9, "sessions": 142},
    {"id": "e2", "skills": ["Fundraising", "Product", "Fintech"], "rating": 4.8, "sessions": 89},
    {"id": "e3", "skills": ["AI/ML", "Python", "LLMs"], "rating": 5.0, "sessions": 67},
    {"id": "e4", "skills": ["Startup", "Growth", "Sales"], "rating": 4.7, "sessions": 203},
    {"id": "e5", "skills": ["UX Design", "Figma", "Research"], "rating": 4.9, "sessions": 115},
]


def compute_skill_similarity(learner_skills: list[str], expert_skills: list[str]) -> float:
    """Jaccard similarity between skill sets."""
    if not learner_skills or not expert_skills:
        return 0.5  # Default score when no skills specified
    ls = set(s.lower() for s in learner_skills)
    es = set(s.lower() for s in expert_skills)
    intersection = len(ls & es)
    union = len(ls | es)
    return intersection / union if union > 0 else 0.0


@app.get("/health")
def health():
    return {"status": "ok", "service": "mantis-recommender", "version": "0.1.0"}


@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    if not req.learner_id:
        raise HTTPException(status_code=400, detail="learner_id is required")

    scores = []
    for expert in MOCK_EXPERTS:
        skill_sim = compute_skill_similarity(req.skills, expert["skills"])
        # Weighted score: 60% skill match + 30% rating + 10% popularity
        rating_norm = (expert["rating"] - 4.0) / 1.0  # Normalize 4.0-5.0 -> 0-1
        popularity_norm = min(expert["sessions"] / 200, 1.0)
        final_score = (0.6 * skill_sim) + (0.3 * rating_norm) + (0.1 * popularity_norm)

        overlap = set(s.lower() for s in req.skills) & set(s.lower() for s in expert["skills"])
        reason = f"Matches on: {', '.join(overlap)}" if overlap else "Top-rated expert in your area"

        scores.append(ExpertScore(expert_id=expert["id"], score=round(final_score, 3), match_reason=reason))

    scores.sort(key=lambda x: x.score, reverse=True)

    return RecommendResponse(learner_id=req.learner_id, recommendations=scores[: req.limit])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
