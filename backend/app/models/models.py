from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    country = Column(String, index=True)
    city = Column(String)
    type = Column(String)  # public, private, research, etc.
    ranking = Column(Integer)
    website = Column(String)

    courses = relationship("Course", back_populates="university")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    duration = Column(String)  # e.g., "4 years", "2 years"
    degree_type = Column(String)  # Bachelor's, Master's, PhD, etc.
    university_id = Column(Integer, ForeignKey("universities.id"))

    university = relationship("University", back_populates="courses")
    career_paths = relationship("CareerPath", back_populates="course")

class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    avg_salary = Column(String)  # e.g., "$60,000 - $90,000"
    growth_rate = Column(String)  # e.g., "15% growth expected"
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="career_paths")
