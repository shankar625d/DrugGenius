// Get references to all sections
const loginPage = document.getElementById('login-page');
const registerPage = document.getElementById('register-page');
const recommendationPage = document.getElementById('recommendation-page');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginNavBtn = document.getElementById('loginNavBtn');
const registerNavBtn = document.getElementById('registerNavBtn');
const homepage = document.getElementById("homepage");
const result = document.getElementById("result");
const contactpage = document.getElementById("contact-page");

// Function to show only one section and handle navigation state
function showPage(page) {
    // Hide all sections first
    const allSections = [homepage, loginPage, registerPage, recommendationPage, result, contactpage];
    allSections.forEach(section => section.classList.add('hidden'));
    
    // Remove active class from all nav buttons
    const allNavButtons = ['homeNavBtn', 'loginNavBtn', 'registerNavBtn', 'contactNavBtn'];
    allNavButtons.forEach(btnId => {
        document.getElementById(btnId)?.classList.remove('active');
    });
    
    // Show selected page and set active state
    switch(page) {
        case 'home':
            homepage.classList.remove('hidden');
            document.getElementById('homeNavBtn').classList.add('active');
            break;
        case 'login':
            loginPage.classList.remove('hidden');
            loginNavBtn.classList.add('active');
            break;
        case 'register':
            registerPage.classList.remove('hidden');
            registerNavBtn.classList.add('active');
            break;
        case 'recommendation':
            recommendationPage.classList.remove('hidden');
            break;
        case 'contact':
            contactpage.classList.remove('hidden');
            document.getElementById('contactNavBtn').classList.add('active');
            break;
    }
}

// Set up navigation event listeners
const navigationHandlers = {
    'homeNavBtn': 'home',
    'loginNavBtn': 'login',
    'registerNavBtn': 'register',
    'contactNavBtn': 'contact'
};

Object.entries(navigationHandlers).forEach(([btnId, page]) => {
    document.getElementById(btnId)?.addEventListener('click', () => showPage(page));
});

// Form-related event listeners
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your login authentication logic here
    showPage('recommendation');
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your registration logic here
    showPage('login');
});

// Handle "switch form" links
document.getElementById('showRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('register');
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('login');
});

// Check if user is already logged in (you can modify this based on your authentication method)
function checkAuthState() {
    // Add your authentication check logic here
    // For now, we'll assume user is not logged in
    showPage('home');
}

// Initialize the page
checkAuthState();

// Get form and result elements
const symptomForm = document.getElementById('symptomForm');
const resultDiv = document.getElementById('result');
const recommendationDiv = document.getElementById('recommendation');

// Drug recommendations database
const drugRecommendations = {
    // Common Symptoms
    fever: ['Acetaminophen (Tylenol)', 'Ibuprofen (Advil)'],
    headache: ['Acetaminophen (Tylenol)', 'Ibuprofen (Advil)', 'Aspirin'],
    muscle_aches: ['Ibuprofen (Advil)', 'Naproxen (Aleve)'],
    joint_pain: ['Ibuprofen (Advil)', 'Naproxen (Aleve)'],
    
    // Respiratory Symptoms
    runny_nose: ['Loratadine (Claritin)', 'Cetirizine (Zyrtec)'],
    sneezing: ['Loratadine (Claritin)', 'Cetirizine (Zyrtec)', 'Fexofenadine (Allegra)'],
    shortness_of_breath: ['Albuterol Inhaler'],
    wheezing: ['Albuterol Inhaler', 'Fluticasone (Flovent)'],
    asthma: ['Albuterol Inhaler', 'Fluticasone (Flovent)'],
    sinus_infection: ['Amoxicillin', 'Azithromycin'],
    
    // Digestive Symptoms
    heartburn: ['Omeprazole (Prilosec)', 'Famotidine (Pepcid)'],
    acid_reflux: ['Omeprazole (Prilosec)', 'Esomeprazole (Nexium)'],
    stomach_pain: ['Bismuth subsalicylate (Pepto-Bismol)', 'Simethicone (Gas-X)'],
    
    // Chronic Conditions
    high_blood_pressure: ['Lisinopril', 'Amlodipine'],
    type_2_diabetes: ['Metformin', 'Glipizide'],
    hypothyroidism: ['Levothyroxine'],
    
    // Mental Health
    depression: ['Sertraline (Zoloft)', 'Fluoxetine (Prozac)'],
    anxiety: ['Sertraline (Zoloft)', 'Escitalopram (Lexapro)'],
    
    // Other Symptoms
    itchy_eyes: ['Ketotifen eye drops', 'Artificial tears'],
    bacterial_infection: ['Amoxicillin', 'Azithromycin'],
    sore_throat: ['Acetaminophen (Tylenol)', 'Throat lozenges'],

    //Additional Symptoms
    fatigue: ['Vitamin B Complex', 'Iron Supplements'],
    dizziness: ['Meclizine (Antivert)', 'Dimenhydrinate (Dramamine)'],
    nausea: ['Ondansetron (Zofran)', 'Promethazine (Phenergan)'],
    vomiting: ['Prochlorperazine (Compazine)', 'Metoclopramide (Reglan)'],
    blurred_vision: ['Artificial Tears', 'Timolol (for glaucoma-related blurred vision)'],
    chest_pain: ['Nitroglycerin (for angina)', 'Aspirin'],
    palpitations: ['Beta-blockers (e.g., Metoprolol)', 'Calcium channel blockers (e.g., Verapamil)'],
    sweating: ['Antiperspirants', 'Clonidine (for hyperhidrosis)'],
    dry_mouth: ['Biotene Oral Balance Gel', 'Saliva substitutes'],
    difficulty_swallowing: ['Throat lozenges', 'Thickening agents for liquids'],
    insomnia: ['Melatonin', 'Diphenhydramine (Benadryl)'],
    hair_loss: ['Minoxidil (Rogaine)', 'Finasteride (Propecia)'],
    skin_rash: ['Hydrocortisone cream', 'Antihistamines'],
    constipation: ['Polyethylene glycol (MiraLAX)', 'Docusate (Colace)'],
    diarrhea: ['Loperamide (Imodium)', 'Bismuth subsalicylate (Pepto-Bismol)'],
    loss_of_appetite: ['Megestrol acetate (Megace)', 'Cyproheptadine (Periactin)'],
    weight_loss: ['Megestrol acetate (Megace)', 'Nutritional supplements'],
    frequent_urination: ['Tolterodine (Detrol)', 'Oxybutynin (Ditropan)'],
    back_pain: ['Ibuprofen (Advil)', 'Acetaminophen (Tylenol)'],
    cold_intolerance: ['Levothyroxine (if hypothyroid)', 'Wear warmer clothing']
};

const diseaseMappings = {
    thyroid: ['fatigue', 'weight_gain', 'cold_intolerance'],
    heart_disease: ['shortness_of_breath', 'chest_pain', 'high_blood_pressure'],
    allergy: ['sneezing', 'itchy_eyes', 'runny_nose'],
    cold: ['sneezing', 'runny_nose', 'sore_throat'],
    dehydration: ['dry_mouth', 'dizziness', 'nausea'],
    anemia: ['fatigue', 'dizziness', 'pale_skin'],
    diabetes: ['frequent_urination', 'weight_loss', 'blurred_vision'],
    hypertension: ['headache', 'high_blood_pressure', 'dizziness'],
    insomnia: ['insomnia', 'anxiety'],
    asthma: ['shortness_of_breath', 'wheezing', 'chest_tightness']
};

// Define the identifyDisease function
function identifyDisease(symptoms) {
    const identifiedDiseases = [];
    for (const [disease, diseaseSymptoms] of Object.entries(diseaseMappings)) {
        // Check if all symptoms for each disease are present in the checked symptoms
        if (diseaseSymptoms.every(symptom => symptoms.includes(symptom))) {
            identifiedDiseases.push(disease);
        }
    }
    return identifiedDiseases.length > 0 ? identifiedDiseases : ['No specific disease identified'];
}

// Handle form submission
symptomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get all checked symptoms
    const checkedSymptoms = [];
    const checkboxes = symptomForm.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        checkedSymptoms.push(checkbox.name);
    });
    
    // Get patient information
    const patientInfo = {
        age: document.getElementById('age').value,
        sex: document.getElementById('sex').value,
        bp: document.getElementById('bp').value,
        temperature: document.getElementById('temperature').value
    };

//identify potential disease
    const diseases = identifyDisease(checkedSymptoms);
    
    // Generate recommendations
    const recommendations = generateRecommendations(checkedSymptoms, patientInfo);
    
    // Display recommendations
    showRecommendations(recommendations, patientInfo,diseases);
});

function generateRecommendations(symptoms, patientInfo) {
    let recommendations = new Set();
    
    // Get recommendations for each symptom
    symptoms.forEach(symptom => {
        if (drugRecommendations[symptom]) {
            drugRecommendations[symptom].forEach(drug => {
                recommendations.add(drug);
            });
        }
    });
    
    // Convert Set to Array and apply any patient-specific filters
    let finalRecommendations = Array.from(recommendations);
    
    // Apply age-based filters
    if (parseInt(patientInfo.age) < 18) {
        // Filter out adult-only medications
        finalRecommendations = finalRecommendations.filter(drug => 
            !drug.includes('Zoloft') && 
            !drug.includes('Prozac') && 
            !drug.includes('Lexapro')
        );
    }
    
    return finalRecommendations;
}

function showRecommendations(recommendations, patientInfo, diseases) {
    // Show the result section
    resultDiv.classList.remove('hidden');
    
    // Get all checked symptoms and create a symptom-medicine mapping
    const checkedSymptoms = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => ({
            name: checkbox.name,
            label: checkbox.nextElementSibling.textContent.trim(),
            medicines: drugRecommendations[checkbox.name] || []
        }));

    // Create HTML content
    let html = `
        <div class="recommendation-container">
            <div class="patient-summary">
                <h3>Patient Information:</h3>
                <p>Age: ${patientInfo.age}</p>
                <p>Sex: ${patientInfo.sex}</p>
                <p>Blood Pressure: ${patientInfo.bp}</p>
                <p>Temperature: ${patientInfo.temperature}°C</p>
            </div>
            
            <div class="disease-summary">
                <h3>Identified Diseases:</h3>
                <ul>
                    ${diseases.map(disease => `<li>${disease.charAt(0).toUpperCase() + disease.slice(1)}</li>`).join('')}
                </ul>
            </div>

            <div class="symptoms-medicines">
                <h3>Symptoms and Recommended Medications:</h3>
                <div class="symptoms-grid">
                    ${checkedSymptoms.map(symptom => `
                        <div class="symptom-card">
                            <h4 class="symptom-name">${formatSymptomName(symptom.label)}</h4>
                            <ul class="medicine-list">
                                ${symptom.medicines.map(medicine => `
                                    <li class="medicine-item">${medicine}</li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="all-recommendations">
                <h3>All Recommended Medications:</h3>
                ${recommendations.length > 0 ? `
                    <ul class="drug-list">
                        ${recommendations.map(drug => `<li class="drug-item">${drug}</li>`).join('')}
                    </ul>
                ` : '<p>No specific medications recommended. Please consult with a healthcare provider.</p>'}
            </div>
            
            <div class="disclaimer">
                <p><strong>Important:</strong> This is a preliminary recommendation only. Please consult with a healthcare provider before starting any medication.</p>
            </div>
        </div>
    `;
    
    // Set the HTML content
    recommendationDiv.innerHTML = html;
    
    // Add CSS styles dynamically
    addStyles();
    
    // Scroll to recommendations
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// Helper function to format symptom names
function formatSymptomName(name) {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Function to add styles
function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .recommendation-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .symptoms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .symptom-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .symptom-name {
            color: #2c3e50;
            margin: 0 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #e0e0e0;
        }

        .medicine-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .medicine-item {
            padding: 5px 0;
            color: #34495e;
            border-left: 3px solid #3498db;
            padding-left: 10px;
            margin: 5px 0;
        }

        .patient-summary,
        .disease-summary,
        .all-recommendations {
            margin-bottom: 20px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .disclaimer {
            margin-top: 20px;
            padding: 15px;
            background: #fff3cd;
            border: 1px solid #ffeeba;
            border-radius: 4px;
            color: #856404;
        }

        h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }

        .drug-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
        }

        .drug-item {
            background: #e8f4f8;
            padding: 10px;
            border-radius: 4px;
            color: #2c3e50;
        }
    `;
    document.head.appendChild(styleElement);
}

// Get a reference to the Contact page section
const contactPage = document.getElementById("contact-page");

// Update the showOnlySection function to hide the Contact page as well
function showOnlySection(section) {
    homepage.classList.add("hidden");
    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");
    recommendationPage.classList.add("hidden");
    result.classList.add("hidden");
    contactPage.classList.add("hidden");

    // Display only the requested section
    section.classList.remove("hidden");
}

let rfTrainingInitiated = false;
        let dtTrainingInitiated = false;
        
        // Function to check the training status
        function checkStatus(classifier) {
            if (classifier === 'rf' && rfTrainingInitiated) {
                fetch(`/check_training_status?classifier=rf`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'complete') {
                        const updateElement = document.getElementById('rf-status-update');
                        updateElement.innerText = `Random Forest Model trained successfully `;
                        updateElement.classList.add('success-message');
                        // Stop checking
                        rfTrainingInitiated = false;
                    } else {
                        // Continue checking every 2 seconds
                        setTimeout(() => checkStatus('rf'), 2000);
                    }
                })
                .catch(error => console.error('Error:', error));
            } else if (classifier === 'dt' && dtTrainingInitiated) {
                fetch(`/check_training_status?classifier=dt`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'complete') {
                        const updateElement = document.getElementById('dt-status-update');
                        updateElement.innerText = `Decision Tree Model trained successfully `;
                        updateElement.classList.add('success-message');
                        // Stop checking
                        dtTrainingInitiated = false;
                    } else {
                        // Continue checking every 2 seconds
                        setTimeout(() => checkStatus('dt'), 2000);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        }

        // Listen for the train button clicks to initiate the checking process
        document.getElementById('train-rf-btn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default form submission
            rfTrainingInitiated = true;
            fetch('/train_rf_model', {method: 'POST'}) // Initiate Random Forest training
            .then(() => {
                checkStatus('rf'); // Start checking the status
            })
            .catch(error => console.error('Error initiating training:', error));
        });

        document.getElementById('train-dt-btn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default form submission
            dtTrainingInitiated = true;
            fetch('/train_dt_model', {method: 'POST'}) // Initiate Decision Tree training
            .then(() => {
                checkStatus('dt'); // Start checking the status
            })
            .catch(error => console.error('Error initiating training:', error));
        });


// Add event listener for the Contact button
document.getElementById("contactNavBtn").addEventListener("click", () => {
    showOnlySection(contactPage);
});

function showLoginForm() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
}