from fastapi import FastAPI, Request
app = FastAPI()

@app.post("/ai/suggest_beat/")
async def suggest_beat(request: Request):
    data = await request.json()
    prompt = data["prompt"]
    # return AI beat suggestion (stubbed)
    return {"suggestion": {"mood": "Chill", "key": "Am", "bpm": 85}}