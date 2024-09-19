from pydantic import BaseModel
from typing import Optional

class ToDoBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str  # Add the status field here

class ToDoCreate(ToDoBase):
    pass

class ToDoUpdate(ToDoBase):
    pass

class ToDo(ToDoBase):
    id: int

    class Config:
        orm_mode = True
