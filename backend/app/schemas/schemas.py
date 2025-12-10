from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional

# Authentication Schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(min_length=2, max_length=100)
    last_name: str = Field(min_length=2, max_length=100)

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=256)

class User(UserBase):
    id: int
    is_active: bool = True
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Career Path Schemas
class CareerPathBase(BaseModel):
    name: str
    description: Optional[str] = None
    avg_salary: Optional[str] = None
    growth_rate: Optional[str] = None

class CareerPathCreate(CareerPathBase):
    pass

class CareerPath(CareerPathBase):
    id: int
    course_id: int
    model_config = ConfigDict(from_attributes=True)

# Course Schemas
class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration: Optional[str] = None
    degree_type: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    university_id: int
    career_paths: List['CareerPath'] = []
    model_config = ConfigDict(from_attributes=True)

# University Schemas
class UniversityBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    country: Optional[str] = None
    city: Optional[str] = None
    type: Optional[str] = None  # public, private, research, etc.
    ranking: Optional[int] = None
    website: Optional[str] = None

class UniversityCreate(UniversityBase):
    pass

class University(UniversityBase):
    id: int
    courses: List['Course'] = []
    model_config = ConfigDict(from_attributes=True)

# Update forward references
Course.model_rebuild()
University.model_rebuild()
