import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal, engine
from app.models import models
from app.core.auth import get_password_hash

def seed_data():
    db = SessionLocal()

    # Create tables
    models.Base.metadata.create_all(bind=engine)

    # Clear existing data
    db.query(models.CareerPath).delete()
    db.query(models.Course).delete()
    db.query(models.University).delete()
    db.query(models.User).delete()
    db.commit()

    # Create sample users
    users_data = [
        {
            "email": "demo@genfuture.com",
            "first_name": "Demo",
            "last_name": "User",
            "password": "password123"
        },
        {
            "email": "john.doe@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "password123"
        }
    ]

    for user_data in users_data:
        user = models.User(
            email=user_data["email"],
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            hashed_password=get_password_hash(user_data["password"])
        )
        db.add(user)

    # International Universities with comprehensive data
    universities_data = [
        # United States
        {"name": "Harvard University", "latitude": 42.3744, "longitude": -71.1169, "country": "United States", "city": "Cambridge", "type": "Private", "ranking": 1, "website": "https://harvard.edu"},
        {"name": "Stanford University", "latitude": 37.4275, "longitude": -122.1697, "country": "United States", "city": "Stanford", "type": "Private", "ranking": 2, "website": "https://stanford.edu"},
        {"name": "MIT", "latitude": 42.3601, "longitude": -71.0942, "country": "United States", "city": "Cambridge", "type": "Private", "ranking": 3, "website": "https://mit.edu"},
        {"name": "University of California Berkeley", "latitude": 37.8719, "longitude": -122.2585, "country": "United States", "city": "Berkeley", "type": "Public", "ranking": 4, "website": "https://berkeley.edu"},
        
        # United Kingdom
        {"name": "University of Oxford", "latitude": 51.7548, "longitude": -1.2544, "country": "United Kingdom", "city": "Oxford", "type": "Public", "ranking": 5, "website": "https://ox.ac.uk"},
        {"name": "University of Cambridge", "latitude": 52.2053, "longitude": 0.1218, "country": "United Kingdom", "city": "Cambridge", "type": "Public", "ranking": 6, "website": "https://cam.ac.uk"},
        {"name": "Imperial College London", "latitude": 51.4988, "longitude": -0.1749, "country": "United Kingdom", "city": "London", "type": "Public", "ranking": 7, "website": "https://imperial.ac.uk"},
        {"name": "University College London", "latitude": 51.5246, "longitude": -0.1340, "country": "United Kingdom", "city": "London", "type": "Public", "ranking": 8, "website": "https://ucl.ac.uk"},
        
        # Canada
        {"name": "University of Toronto", "latitude": 43.6629, "longitude": -79.3957, "country": "Canada", "city": "Toronto", "type": "Public", "ranking": 25, "website": "https://utoronto.ca"},
        {"name": "McGill University", "latitude": 45.5048, "longitude": -73.5772, "country": "Canada", "city": "Montreal", "type": "Public", "ranking": 30, "website": "https://mcgill.ca"},
        {"name": "University of British Columbia", "latitude": 49.2606, "longitude": -123.2460, "country": "Canada", "city": "Vancouver", "type": "Public", "ranking": 35, "website": "https://ubc.ca"},
        
        # Australia
        {"name": "Australian National University", "latitude": -35.2777, "longitude": 149.1185, "country": "Australia", "city": "Canberra", "type": "Public", "ranking": 20, "website": "https://anu.edu.au"},
        {"name": "University of Melbourne", "latitude": -37.7964, "longitude": 144.9612, "country": "Australia", "city": "Melbourne", "type": "Public", "ranking": 33, "website": "https://unimelb.edu.au"},
        {"name": "University of Sydney", "latitude": -33.8886, "longitude": 151.1873, "country": "Australia", "city": "Sydney", "type": "Public", "ranking": 40, "website": "https://sydney.edu.au"},
        
        # Germany
        {"name": "Technical University of Munich", "latitude": 48.1489, "longitude": 11.5671, "country": "Germany", "city": "Munich", "type": "Public", "ranking": 50, "website": "https://tum.de"},
        {"name": "University of Heidelberg", "latitude": 49.4093, "longitude": 8.7129, "country": "Germany", "city": "Heidelberg", "type": "Public", "ranking": 65, "website": "https://uni-heidelberg.de"},
        
        # France
        {"name": "Sorbonne University", "latitude": 48.8566, "longitude": 2.3522, "country": "France", "city": "Paris", "type": "Public", "ranking": 75, "website": "https://sorbonne-universite.fr"},
        {"name": "École Polytechnique", "latitude": 48.7135, "longitude": 2.2070, "country": "France", "city": "Palaiseau", "type": "Public", "ranking": 85, "website": "https://polytechnique.edu"},
        
        # Japan
        {"name": "University of Tokyo", "latitude": 35.7128, "longitude": 139.7617, "country": "Japan", "city": "Tokyo", "type": "Public", "ranking": 23, "website": "https://u-tokyo.ac.jp"},
        {"name": "Kyoto University", "latitude": 35.0263, "longitude": 135.7817, "country": "Japan", "city": "Kyoto", "type": "Public", "ranking": 36, "website": "https://kyoto-u.ac.jp"},
        
        # Singapore
        {"name": "National University of Singapore", "latitude": 1.2966, "longitude": 103.7764, "country": "Singapore", "city": "Singapore", "type": "Public", "ranking": 11, "website": "https://nus.edu.sg"},
        {"name": "Nanyang Technological University", "latitude": 1.3483, "longitude": 103.6831, "country": "Singapore", "city": "Singapore", "type": "Public", "ranking": 12, "website": "https://ntu.edu.sg"},
        
        # Ghana (Original universities)
        {"name": "University of Ghana", "latitude": 5.6506, "longitude": -0.1871, "country": "Ghana", "city": "Accra", "type": "Public", "ranking": 500, "website": "https://ug.edu.gh"},
        {"name": "Kwame Nkrumah University of Science and Technology", "latitude": 6.6745, "longitude": -1.5716, "country": "Ghana", "city": "Kumasi", "type": "Public", "ranking": 600, "website": "https://knust.edu.gh"},
        {"name": "Accra Technical University", "latitude": 5.5560, "longitude": -0.2057, "country": "Ghana", "city": "Accra", "type": "Public", "ranking": 800, "website": "https://atu.edu.gh"},
        
        # Nigeria
        {"name": "University of Ibadan", "latitude": 7.3775, "longitude": 3.9470, "country": "Nigeria", "city": "Ibadan", "type": "Public", "ranking": 450, "website": "https://ui.edu.ng"},
        {"name": "University of Lagos", "latitude": 6.5244, "longitude": 3.3792, "country": "Nigeria", "city": "Lagos", "type": "Public", "ranking": 480, "website": "https://unilag.edu.ng"},
        
        # Kenya
        {"name": "University of Nairobi", "latitude": -1.2921, "longitude": 36.8219, "country": "Kenya", "city": "Nairobi", "type": "Public", "ranking": 520, "website": "https://uonbi.ac.ke"},
        
        # South Africa
        {"name": "University of Cape Town", "latitude": -33.9249, "longitude": 18.4241, "country": "South Africa", "city": "Cape Town", "type": "Public", "ranking": 200, "website": "https://uct.ac.za"},
        {"name": "University of the Witwatersrand", "latitude": -26.1929, "longitude": 28.0305, "country": "South Africa", "city": "Johannesburg", "type": "Public", "ranking": 250, "website": "https://wits.ac.za"},
    ]

    universities = []
    for uni_data in universities_data:
        university = models.University(**uni_data)
        db.add(university)
        universities.append(university)

    db.commit()

    # Comprehensive courses with descriptions and details
    courses_data = [
        # Computer Science and Technology
        {"name": "Computer Science", "description": "Study of computational systems, algorithms, and computer technology", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Software Engineering", "description": "Design and development of software systems and applications", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Data Science", "description": "Analysis and interpretation of complex data to inform decision-making", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Artificial Intelligence", "description": "Development of intelligent systems and machine learning algorithms", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Cybersecurity", "description": "Protection of digital systems and networks from cyber threats", "duration": "4 years", "degree_type": "Bachelor's"},
        
        # Engineering
        {"name": "Electrical Engineering", "description": "Design and development of electrical systems and electronics", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Mechanical Engineering", "description": "Design and manufacturing of mechanical systems and machines", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Civil Engineering", "description": "Design and construction of infrastructure and buildings", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Chemical Engineering", "description": "Application of chemistry and physics to industrial processes", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Biomedical Engineering", "description": "Application of engineering principles to healthcare and medicine", "duration": "4 years", "degree_type": "Bachelor's"},
        
        # Business and Economics
        {"name": "Business Administration", "description": "Management and operation of business organizations", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Economics", "description": "Study of production, distribution, and consumption of goods and services", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Finance", "description": "Management of money, investments, and financial planning", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Marketing", "description": "Promotion and selling of products and services", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "International Business", "description": "Business operations across international markets", "duration": "4 years", "degree_type": "Bachelor's"},
        
        # Medical and Health Sciences
        {"name": "Medicine", "description": "Diagnosis, treatment, and prevention of human diseases", "duration": "6 years", "degree_type": "Medical Degree"},
        {"name": "Nursing", "description": "Healthcare provision and patient care", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Pharmacy", "description": "Preparation and dispensing of medicinal drugs", "duration": "5 years", "degree_type": "Pharmacy Degree"},
        {"name": "Public Health", "description": "Prevention of disease and promotion of health in populations", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Biomedical Sciences", "description": "Scientific study of human biology and health", "duration": "4 years", "degree_type": "Bachelor's"},
        
        # Sciences
        {"name": "Physics", "description": "Study of matter, energy, and their interactions", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Chemistry", "description": "Study of matter and chemical reactions", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Biology", "description": "Study of living organisms and life processes", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Mathematics", "description": "Study of numbers, structures, space, and change", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Environmental Science", "description": "Study of environmental problems and solutions", "duration": "4 years", "degree_type": "Bachelor's"},
        
        # Arts and Humanities
        {"name": "Psychology", "description": "Study of human behavior and mental processes", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "English Literature", "description": "Study of written works and literary analysis", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "History", "description": "Study of past events and human civilization", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "Philosophy", "description": "Study of fundamental questions about existence and knowledge", "duration": "4 years", "degree_type": "Bachelor's"},
        {"name": "International Relations", "description": "Study of relationships between countries and global politics", "duration": "4 years", "degree_type": "Bachelor's"},
    ]

    # Add courses to multiple universities
    courses_list = []
    for i, university in enumerate(universities):
        # Each university gets a selection of courses based on their type and ranking
        num_courses = 15 if university.ranking and university.ranking <= 100 else 10
        selected_courses = courses_data[:num_courses]
        
        for course_data in selected_courses:
            course = models.Course(
                university_id=university.id,
                **course_data
            )
            db.add(course)
            courses_list.append(course)

    db.commit()

    # Career paths with detailed information
    career_paths_data = {
        "Computer Science": [
            {"name": "Software Developer", "description": "Design and develop software applications", "avg_salary": "$70,000 - $150,000", "growth_rate": "22% growth expected"},
            {"name": "Data Scientist", "description": "Analyze complex data to derive business insights", "avg_salary": "$80,000 - $180,000", "growth_rate": "25% growth expected"},
            {"name": "Machine Learning Engineer", "description": "Develop AI and ML systems", "avg_salary": "$90,000 - $200,000", "growth_rate": "35% growth expected"},
            {"name": "DevOps Engineer", "description": "Manage development and operations processes", "avg_salary": "$75,000 - $160,000", "growth_rate": "20% growth expected"},
        ],
        "Business Administration": [
            {"name": "Management Consultant", "description": "Advise organizations on business strategy", "avg_salary": "$80,000 - $200,000", "growth_rate": "15% growth expected"},
            {"name": "Project Manager", "description": "Lead and coordinate business projects", "avg_salary": "$65,000 - $140,000", "growth_rate": "12% growth expected"},
            {"name": "Business Analyst", "description": "Analyze business processes and requirements", "avg_salary": "$60,000 - $120,000", "growth_rate": "18% growth expected"},
            {"name": "Operations Manager", "description": "Oversee daily business operations", "avg_salary": "$70,000 - $130,000", "growth_rate": "10% growth expected"},
        ],
        "Medicine": [
            {"name": "General Practitioner", "description": "Provide primary healthcare services", "avg_salary": "$150,000 - $300,000", "growth_rate": "8% growth expected"},
            {"name": "Specialist Doctor", "description": "Provide specialized medical care", "avg_salary": "$200,000 - $500,000", "growth_rate": "10% growth expected"},
            {"name": "Surgeon", "description": "Perform surgical procedures", "avg_salary": "$250,000 - $600,000", "growth_rate": "7% growth expected"},
            {"name": "Medical Researcher", "description": "Conduct medical and clinical research", "avg_salary": "$100,000 - $200,000", "growth_rate": "12% growth expected"},
        ],
        "Electrical Engineering": [
            {"name": "Electrical Engineer", "description": "Design electrical systems and equipment", "avg_salary": "$70,000 - $140,000", "growth_rate": "8% growth expected"},
            {"name": "Power Systems Engineer", "description": "Design and maintain power generation systems", "avg_salary": "$75,000 - $150,000", "growth_rate": "10% growth expected"},
            {"name": "Electronics Engineer", "description": "Design electronic devices and systems", "avg_salary": "$70,000 - $135,000", "growth_rate": "12% growth expected"},
            {"name": "Control Systems Engineer", "description": "Design automated control systems", "avg_salary": "$80,000 - $160,000", "growth_rate": "15% growth expected"},
        ],
        "Finance": [
            {"name": "Financial Analyst", "description": "Analyze financial data and investment opportunities", "avg_salary": "$60,000 - $120,000", "growth_rate": "15% growth expected"},
            {"name": "Investment Banker", "description": "Facilitate financial transactions and investments", "avg_salary": "$100,000 - $300,000", "growth_rate": "12% growth expected"},
            {"name": "Financial Advisor", "description": "Provide financial planning and investment advice", "avg_salary": "$55,000 - $150,000", "growth_rate": "18% growth expected"},
            {"name": "Risk Manager", "description": "Assess and mitigate financial risks", "avg_salary": "$80,000 - $180,000", "growth_rate": "20% growth expected"},
        ]
    }

    # Add career paths to courses
    for course in courses_list:
        if course.name in career_paths_data:
            for career_data in career_paths_data[course.name]:
                career_path = models.CareerPath(
                    course_id=course.id,
                    **career_data
                )
                db.add(career_path)

    db.commit()
    db.close()

if __name__ == "__main__":
    seed_data()
    print("Database seeded successfully with international data!")
