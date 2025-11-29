/**
 * Simple heuristic-based fallback suggestions for career paths
 * when a course does not have mapped career data from backend/external APIs.
 *
 * Returns normalized career objects compatible with CareerPathsList:
 *   { id: string, name: string, source?: 'suggested', confidence?: number, description?: string }
 */

const slugify = (s) =>
    String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const suggestCareersForCourse = (courseNameRaw) => {
    const name = (courseNameRaw || '').toLowerCase();
    const out = [];
    let idx = 1;

    const add = (title, description = '', confidence = 0.6) => {
        const id = `suggested-${slugify(title)}-${idx++}`;
        out.push({
            id,
            name: title,
            description,
            source: 'suggested',
            confidence,
        });
    };

    const addMany = (items, baseConfidence = 0.6) => {
        items.forEach((item, i) =>
            add(
                item.title,
                item.description,
                (item.confidence !== undefined && item.confidence !== null) ?
                item.confidence :
                (baseConfidence - (i * 0.02))
            )
        );
    };

    // Tech / Computing
    if (/computer|software|information\s*technology|it|informatics|programming|cs\b/.test(name)) {
        addMany(
            [
                { title: 'Software Engineer', description: 'Design and build applications, services, and systems.' },
                { title: 'Frontend Developer', description: 'Develop user interfaces and web experiences.' },
                { title: 'Backend Developer', description: 'Build APIs, services, and data processing systems.' },
                { title: 'DevOps Engineer', description: 'Focus on automation, CI/CD, and infrastructure.' },
                { title: 'Data Scientist', description: 'Analyze data and build predictive models.' },
                { title: 'AI/ML Engineer', description: 'Develop machine learning models and AI systems.' },
                { title: 'Cybersecurity Analyst', description: 'Protect systems, networks, and data.' },
                { title: 'Product Manager', description: 'Lead product strategy and execution.' },
                { title: 'QA Engineer', description: 'Test and ensure software quality.' },
            ],
            0.75
        );
    }

    // Business / Management
    if (/business|management|commerce|mba|administration/.test(name)) {
        addMany(
            [
                { title: 'Business Analyst', description: 'Analyze business processes and recommend improvements.' },
                { title: 'Operations Manager', description: 'Oversee day-to-day operations.' },
                { title: 'Product Manager', description: 'Drive product lifecycle and roadmap.' },
                { title: 'Entrepreneur', description: 'Start and grow a business venture.' },
                { title: 'Marketing Manager', description: 'Lead marketing strategies and campaigns.' },
                { title: 'Human Resources Specialist', description: 'Manage recruitment and employee relations.' },
                { title: 'Project Manager', description: 'Plan and deliver projects successfully.' },
            ],
            0.65
        );
    }

    // Finance / Accounting / Economics
    if (/finance|accounting|economics|banking|audit/.test(name)) {
        addMany(
            [
                { title: 'Financial Analyst', description: 'Analyze financial data and performance.' },
                { title: 'Accountant', description: 'Manage financial records and compliance.' },
                { title: 'Auditor', description: 'Assess financial controls and statements.' },
                { title: 'Investment Analyst', description: 'Evaluate investments and portfolios.' },
                { title: 'Risk Analyst', description: 'Identify and manage financial risks.' },
                { title: 'Actuary', description: 'Apply statistics to assess risk and uncertainty.' },
            ],
            0.64
        );
    }

    // Healthcare / Medicine / Nursing / Pharmacy / Public Health
    if (/medicine|medical|nursing|pharmacy|public\s*health|clinical|physiology|biomedical/.test(name)) {
        addMany(
            [
                { title: 'Registered Nurse', description: 'Provide patient care and support.' },
                { title: 'Pharmacist', description: 'Dispense medication and advise on therapy.' },
                { title: 'Public Health Specialist', description: 'Improve population health and policies.' },
                { title: 'Clinical Research Associate', description: 'Coordinate clinical trials and data.' },
                { title: 'Health Informatics Specialist', description: 'Manage healthcare data and systems.' },
                { title: 'Biomedical Engineer', description: 'Design medical devices and technologies.' },
            ],
            0.66
        );
    }

    // Engineering
    if (/mechanical|civil|electrical|chemical|industrial|mechatronics|materials|petroleum/.test(name)) {
        addMany(
            [
                { title: 'Mechanical Engineer', description: 'Design mechanical systems and components.' },
                { title: 'Civil Engineer', description: 'Plan and build infrastructure projects.' },
                { title: 'Electrical Engineer', description: 'Develop electrical systems and circuits.' },
                { title: 'Chemical Engineer', description: 'Optimize chemical processes and production.' },
                { title: 'Industrial Engineer', description: 'Improve systems, workflows, and efficiency.' },
                { title: 'Project Engineer', description: 'Coordinate engineering project delivery.' },
            ],
            0.63
        );
    }

    // Law / Legal
    if (/law|legal|juris|llb|llm|bar/.test(name)) {
        addMany(
            [
                { title: 'Lawyer', description: 'Represent clients and offer legal advice.' },
                { title: 'Paralegal', description: 'Support legal research and documentation.' },
                { title: 'Compliance Officer', description: 'Ensure regulatory compliance within organizations.' },
                { title: 'Corporate Counsel', description: 'Advise on corporate legal matters.' },
            ],
            0.62
        );
    }

    // Education
    if (/education|teaching|pedagogy|curriculum|teacher/.test(name)) {
        addMany(
            [
                { title: 'Teacher', description: 'Instruct students and develop lesson plans.' },
                { title: 'Curriculum Developer', description: 'Design educational curricula and materials.' },
                { title: 'Academic Counselor', description: 'Guide students on academic pathways.' },
                { title: 'Education Administrator', description: 'Manage educational programs and institutions.' },
            ],
            0.6
        );
    }

    // Architecture / Design / Urban Planning
    if (/architecture|architect|urban|planning|design|interior/.test(name)) {
        addMany(
            [
                { title: 'Architect', description: 'Plan and design buildings and structures.' },
                { title: 'Urban Planner', description: 'Develop urban plans and policies.' },
                { title: 'Interior Designer', description: 'Design functional and aesthetic interiors.' },
                { title: 'Landscape Architect', description: 'Plan outdoor spaces and environments.' },
            ],
            0.6
        );
    }

    // Agriculture / Environment
    if (/agriculture|agronomy|soil|horticulture|environment|sustainability|ecology/.test(name)) {
        addMany(
            [
                { title: 'Agronomist', description: 'Optimize crop production and soil health.' },
                { title: 'Farm Manager', description: 'Manage farm operations and resources.' },
                { title: 'Food Scientist', description: 'Research and improve food quality and safety.' },
                { title: 'Environmental Consultant', description: 'Advise on environmental impact and sustainability.' },
                { title: 'Sustainability Specialist', description: 'Develop sustainability strategies and programs.' },
            ],
            0.58
        );
    }

    // Science: Math / Stats / Physics / Chemistry / Biology
    if (/mathematics|math|statistics|stat|quant|applied\s*math/.test(name)) {
        addMany(
            [
                { title: 'Data Analyst', description: 'Analyze data to produce insights.' },
                { title: 'Quantitative Analyst', description: 'Model financial/operational systems.' },
                { title: 'Actuary', description: 'Apply statistics to risk and uncertainty.' },
                { title: 'Operations Research Analyst', description: 'Optimize decision-making.' },
            ],
            0.62
        );
    }

    if (/physics|physical\s*science/.test(name)) {
        addMany(
            [
                { title: 'Research Scientist', description: 'Conduct experiments and publish findings.' },
                { title: 'Systems Engineer', description: 'Design complex systems and simulations.' },
                { title: 'Energy Analyst', description: 'Work on energy systems and sustainability.' },
            ],
            0.58
        );
    }

    if (/chemistry|chemical\s*science/.test(name)) {
        addMany(
            [
                { title: 'Chemist', description: 'Research chemical compounds and reactions.' },
                { title: 'Lab Technician', description: 'Perform laboratory experiments and analysis.' },
                { title: 'Process Engineer', description: 'Improve chemical manufacturing processes.' },
            ],
            0.58
        );
    }

    if (/biology|biotech|biological\s*science|microbiology|genetics/.test(name)) {
        addMany(
            [
                { title: 'Biotechnologist', description: 'Apply biological systems to technology.' },
                { title: 'Environmental Scientist', description: 'Study environment and conservation.' },
                { title: 'Laboratory Scientist', description: 'Conduct biological lab work and analysis.' },
            ],
            0.58
        );
    }

    // Marketing / Communications / Media
    if (/marketing|communication|media|journalism|pr\b|advertising/.test(name)) {
        addMany(
            [
                { title: 'Digital Marketer', description: 'Run online campaigns and growth initiatives.' },
                { title: 'Content Strategist', description: 'Plan and produce content for audiences.' },
                { title: 'Public Relations Specialist', description: 'Manage brand reputation and media relations.' },
                { title: 'UX Writer', description: 'Craft microcopy and product messaging.' },
            ],
            0.59
        );
    }

    // Generic fallback if nothing matched
    if (out.length === 0) {
        addMany([
            { title: 'Research Assistant', description: 'Support research and data collection.', confidence: 0.5 },
            { title: 'Project Coordinator', description: 'Coordinate project tasks and communication.', confidence: 0.5 },
            { title: 'Consultant', description: 'Advise organizations on improvements.', confidence: 0.48 },
            { title: 'Entrepreneur', description: 'Create and grow a business based on your field.', confidence: 0.45 },
            { title: 'Internship Pathways', description: 'Explore internships to gain practical experience.', confidence: 0.45 },
        ]);
    }

    return out;
};