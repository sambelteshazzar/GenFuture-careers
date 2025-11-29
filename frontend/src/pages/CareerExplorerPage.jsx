import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getNearbyUniversities, getUniversityCourses, getCourseCareerPaths, searchUniversitiesExternal, getCourseCareersExternal } from '../services/api';
import { suggestCareersForCourse } from '../services/careerFallbacks';
import Header from '../components/Header';
import SearchFilters from '../components/SearchFilters';
import UniversityList from '../components/UniversityList';
import CourseList from '../components/CourseList';
import CareerPathsList from '../components/CareerPathsList';

const CareerExplorerPage = ({ user, onLogout }) => {
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: universities, 2: courses, 3: career paths
  const [isLoading, setIsLoading] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    type: '',
    ranking: '',
    field: ''
  });
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (_err) => {
        setError('Location access denied. Using default location.');
        // Fallback to multiple default locations for global coverage
        setLocation({
          latitude: 40.7128,  // New York City
          longitude: -74.0060
        });
      }
    );
  }, []);

  useEffect(() => {
    if (location) {
      console.info('[UI] location set for nearby fetch', location);
      // Build optional filters for backend nearby-lite
      const countryCodeToNameLocal = {
        US: 'United States',
        UK: 'United Kingdom',
        CA: 'Canada',
        AU: 'Australia',
        DE: 'Germany',
        FR: 'France',
        GH: 'Ghana',
        NG: 'Nigeria',
        KE: 'Kenya',
        ZA: 'South Africa',
      };
      const extra = {
        country: filters.country ? (countryCodeToNameLocal[filters.country] || filters.country) : undefined,
        type: filters.type || undefined,
        rankingMax:
          filters.ranking === 'top100' ? 100 :
          filters.ranking === 'top500' ? 500 :
          filters.ranking === 'top1000' ? 1000 : undefined,
      };
      getNearbyUniversities(location.latitude, location.longitude, limit, offset, extra)
        .then(response => {
          const data = response?.data;
          const count = Array.isArray(data) ? data.length : -1;
          console.info('[UI] nearby-lite fetched', { count, sample: Array.isArray(data) ? data.slice(0, 3) : data });
          setUniversities(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          const status = err?.response?.status;
          const payload = err?.response?.data;
          console.error('[UI] nearby-lite error', { message: err?.message, status, payload });
          setError('Could not fetch universities.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [location, offset, filters.country, filters.type, filters.ranking]);

  const handleUniversitySelect = (universityId) => {
    setSelectedUniversity(universityId);
    setStep(2);
    setIsLoading(true);
    getUniversityCourses(universityId)
      .then(response => {
        setCourses(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Could not fetch courses.');
        setIsLoading(false);
      });
  };

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setStep(3);
    setIsLoading(true);

    const courseName = courses.find(c => c.id === courseId)?.name || 'Selected Course';
    const useFallback = () => {
      const suggestions = suggestCareersForCourse(courseName);
      setCareerPaths(suggestions);
    };

    try {
      const extResp = await getCourseCareersExternal(courseId);
      const ext = Array.isArray(extResp?.data) ? extResp.data : [];
      if (ext.length > 0) {
        setCareerPaths(ext);
        return;
      }
    } catch (_e) {
      // Ignore external error and fallback to local
    }

    try {
      const response = await getCourseCareerPaths(courseId);
      const local = Array.isArray(response?.data) ? response.data : [];
      if (local.length > 0) {
        setCareerPaths(local);
      } else {
        useFallback();
      }
    } catch (_e2) {
      // If local fails, provide heuristic suggestions
      useFallback();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUniversities = () => {
    setStep(1);
    setSelectedUniversity(null);
    setSelectedCourse(null);
    setCourses([]);
    setCareerPaths([]);
  };

  const handleBackToCourses = () => {
    setStep(2);
    setSelectedCourse(null);
    setCareerPaths([]);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    // Map ISO-like country codes to Hipolabs expected country names (and local DB)
    const countryCodeToName = {
      US: 'United States',
      UK: 'United Kingdom',
      CA: 'Canada',
      AU: 'Australia',
      DE: 'Germany',
      FR: 'France',
      GH: 'Ghana',
      NG: 'Nigeria',
      KE: 'Kenya',
      ZA: 'South Africa',
    };
    try {
      const name = searchQuery?.trim() ? searchQuery.trim() : undefined;
      const rawCountry = filters.country?.trim();
      const country =
        rawCountry && countryCodeToName[rawCountry]
          ? countryCodeToName[rawCountry]
          : (rawCountry || undefined);
      const resp = await searchUniversitiesExternal(name, country);
      setUniversities(resp.data);
      setStep(1);
    } catch (_e) {
      setError('Could not fetch universities from external API. Falling back to local.');
      try {
        if (location) {
          // Align local nearby-lite with selected filters
          const extra = {
            country: filters.country ? (countryCodeToName[filters.country] || filters.country) : undefined,
            type: filters.type || undefined,
            rankingMax:
              filters.ranking === 'top100' ? 100 :
              filters.ranking === 'top500' ? 500 :
              filters.ranking === 'top1000' ? 1000 : undefined,
          };
          setOffset(0);
          const local = await getNearbyUniversities(location.latitude, location.longitude, limit, 0, extra);
          setUniversities(local.data);
          setStep(1);
        }
      } catch {
        // ignore
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="career-explorer-app min-h-screen bg-slate-50">
      <Header 
        user={user} 
        onLogout={onLogout}
        onProfileClick={() => console.log('Profile clicked')}
      />

      <main className="main-content">
        {/* Hero Section - Only show on step 1 */}
        {step === 1 && (
          <motion.section
            id="explore"
            className="explorer-hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-content">
              <h1>Discover Your Perfect Career Path</h1>
              <p>
                Explore thousands of universities worldwide, find courses that match 
                your interests, and discover exciting career opportunities.
              </p>
            </div>
          </motion.section>
        )}

        {/* Search and Filters */}
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
        />

        {/* Progress Breadcrumb */}
        <div className="progress-breadcrumb">
          <div className="breadcrumb-container">
            <div className={`breadcrumb-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Universities</span>
            </div>
            <div className="breadcrumb-arrow">→</div>
            <div className={`breadcrumb-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Courses</span>
            </div>
            <div className="breadcrumb-arrow">→</div>
            <div className={`breadcrumb-step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Career Paths</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div 
            className="error-banner"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <p>Loading...</p>
          </div>
        )}

        {/* Content Sections */}
        <div className="content-container">
          {!location && !isLoading ? (
            <div className="location-loading">
              <div className="location-icon">🌍</div>
              <h3>Getting your location...</h3>
              <p>We're finding universities near you for the best experience</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <motion.section
                  id="universities"
                  className="universities-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="section-header">
                    <h2>🏛️ Universities Near You</h2>
                    <p>Select a university to explore available courses and career opportunities</p>
                  </div>
                  <UniversityList
                    universities={universities}
                    onSelect={handleUniversitySelect}
                    isLoading={isLoading}
                    canPrev={offset > 0}
                    canNext={Array.isArray(universities) && universities.length >= limit}
                    onPrevPage={() => { if (offset <= 0) return; setIsLoading(true); setOffset(Math.max(0, offset - limit)); }}
                    onNextPage={() => { setIsLoading(true); setOffset(offset + limit); }}
                    userId={user?.id}
                  />
                </motion.section>
              )}

              {step === 2 && selectedUniversity && (
                <motion.section
                  id="courses"
                  className="courses-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="section-header">
                    <button onClick={handleBackToUniversities} className="back-button">
                      ← Back to Universities
                    </button>
                    <h2>📚 Available Courses</h2>
                    <p>Choose a course to discover related career paths and opportunities</p>
                  </div>
                  <CourseList
                    courses={courses}
                    onSelect={handleCourseSelect}
                    isLoading={isLoading}
                    userId={user?.id}
                  />
                </motion.section>
              )}

              {step === 3 && selectedCourse && (
                <motion.section
                  id="careers"
                  className="careers-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="section-header">
                    <button onClick={handleBackToCourses} className="back-button">
                      ← Back to Courses
                    </button>
                    <h2>🚀 Your Future Career Paths</h2>
                    <p>Explore exciting career opportunities and plan your professional journey</p>
                  </div>
                  <CareerPathsList
                    careerPaths={careerPaths}
                    isLoading={isLoading}
                    userId={user?.id}
                  />
                </motion.section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CareerExplorerPage;