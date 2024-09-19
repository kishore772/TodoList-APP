import logging
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from user_module import crud, models, schemas, database
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend's URL if different
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/todos/", response_model=schemas.ToDo)
def create_todo(todo: schemas.ToDoCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_todo(db=db, todo=todo)
    except Exception as e:
        logger.error(f"Error creating todo: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/todos/", response_model=list[schemas.ToDo])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        todos = crud.get_todos(db, skip=skip, limit=limit)
        return todos
    except Exception as e:
        logger.error(f"Error reading todos: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/todos/{todo_id}", response_model=schemas.ToDo)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    try:
        db_todo = crud.get_todo(db, todo_id=todo_id)
        if db_todo is None:
            raise HTTPException(status_code=404, detail="ToDo not found")
        return db_todo
    except Exception as e:
        logger.error(f"Error reading todo {todo_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.put("/todos/{todo_id}", response_model=schemas.ToDo)
def update_todo(todo_id: int, todo: schemas.ToDoCreate, db: Session = Depends(get_db)):
    try:
        updated_todo = crud.update_todo(db=db, todo_id=todo_id, todo=todo)
        if updated_todo is None:
            raise HTTPException(status_code=404, detail="ToDo not found")
        return updated_todo
    except Exception as e:
        logger.error(f"Error updating todo {todo_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.delete("/todos/{todo_id}", response_model=schemas.ToDo)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    try:
        deleted_todo = crud.delete_todo(db=db, todo_id=todo_id)
        if deleted_todo is None:
            raise HTTPException(status_code=404, detail="ToDo not found")
        return deleted_todo
    except Exception as e:
        logger.error(f"Error deleting todo {todo_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
