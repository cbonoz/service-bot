from ai_util import dot_product, get_normalized_terms
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from tinydb import TinyDB, Query

db = TinyDB('./db.json')
table = db.table('questions')

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/count")
def count():
    return {'count': len(table)}

@app.post("/data")
async def upload_data(request: Request):
    data = await request.json()
    db.drop_table('questions')
    table = db.table('questions')
    questions = data['data']
    for q in questions:
        q['terms'] = get_normalized_terms(q['question'])
        table.insert(q)


@app.post("/chat")
async def post_chat(request: Request):
    data = await request.json()
    if 'query' not in data or not data['query']:
        raise HTTPException(status_code=400, detail='query body field required')
    query = data['query']
    # https://towardsdatascience.com/visualizing-what-docs-are-really-about-with-expert-ai-cd537e7a2798
    query_terms = get_normalized_terms(query)
    question_set = table.all()
    best_result = max(question_set, key=lambda x: dot_product(query_terms, x['terms']))
    if best_result and best_result['terms'] and dot_product(query_terms, best_result['terms']) > 0:
        # We have a non-empty best result based on the dot product of concepts.
        print('best result', best_result)
        return best_result
    return {}