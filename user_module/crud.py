from sqlalchemy.orm import Session
from . import models, schemas

def get_todos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ToDo).offset(skip).limit(limit).all()

def get_todo(db: Session, todo_id: int):
    return db.query(models.ToDo).filter(models.ToDo.id == todo_id).first()

def create_todo(db: Session, todo: schemas.ToDoCreate):
    db_todo = models.ToDo(
        title=todo.title, 
        description=todo.description, 
        status=todo.status  # Handle the status field here
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo: schemas.ToDoUpdate):
    db_todo = db.query(models.ToDo).filter(models.ToDo.id == todo_id).first()
    if db_todo:
        db_todo.title = todo.title
        db_todo.description = todo.description
        db_todo.status = todo.status  # Ensure status is updated
        db.commit()
        db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int):
    db_todo = db.query(models.ToDo).filter(models.ToDo.id == todo_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
    return db_todo
