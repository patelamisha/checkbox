/* MAIN FILE USED TO CREATE FETCHING FUNCTIONS 
If more functions are needed to fetch from an API,
use these as reference 

*/


const realmName = 'demo'; // change to your realm name
const backendIP = 'http://3.137.200.124:8999'; // change to correct backend server ip 3.137.200.124:8999


//This function is called when a user registers for an account
/* Takes in a uid, first, last name, phone number, and date of birth */
/* Json body is sent to API */
export const registerData = async (uid, first, last, number, date) => {
    fetch(backendIP + '/post-data-here', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _key: uid,
            FirstName: first,
            LastName: last,
            phoneNumber: number,
            dateofBirth: date,
            smartID: last + first[0] + date.substring(6, 10)
        })
    });

}


// requests using updated backend routes
// for more info check node_backend/app.js or /keycloakFuncs.js
export const loginBackend = async (email) => {
    const response = await fetch(backendIP + '/keycloak-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email
        })
    });
    return response.text();
}

export const signupBackend = async (first, last, email) => {
    const response = await fetch(backendIP + '/keycloak-signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "first": first,
            "last": last,
            "email": email
        })
    });
    return response.text()
}

export const searchuserBackend = async (email) => {
    const response = await fetch(backendIP + '/keycloak-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email
        })
    });
    return response.json();
}

//function called to extract user information 
/* GET request used to fetch basic user data */
/* Input is the users uid */
/* Returns json response from API */
export const fetchUserData = async (uid) => {
    try {
        let response = await fetch(
            backendIP + '/get-user-data/' + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        throw error
    }
}


//function called to extract covid information 
export const fetchCovidInfo = async (uid) => {
    try {
        let response = await fetch(
            'http://3.137.200.124:8000/fhir/scan?id=' + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}


//function called to extract user information 
export const fetchUserCertificate = async (uid) => {
    try {
        let response = await fetch(
            backendIP + '/get-user-certificate/' + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }


}


//function called to extract user information 
export const fetchUserMedication = async (uid) => {
    try {
        let response = await fetch(
            backendIP + '/get-user-medication/' + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }


}

//function called to extract user information 
export const fetchUserVax = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=Immunization&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract user's Observation information 
export const fetchUserObs = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=Observation&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract user's Claim information 
export const fetchUserCla = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=Claim&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract Encounter information 
export const fetchUserEnc = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=Encounter&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract user's Condition information 
export const fetchUserCon = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=Condition&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract Practitioner information 
export const fetchUserPra = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=Practitioner&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract user's Diagnostic Report information 
export const fetchUserDiaRep = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=DiagnosticReport&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract user's Medication Request information 
export const fetchUserMediReq = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=MedicationRequest&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract Patient information 
export const fetchUserPat = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=Patient&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}
//function called to extract user's Care Plan information 
export const fetchUserCar = async (uid) => {
    try {
        let response = await fetch(
            "http://3.137.200.124:8000/fhir/details?type=CarePlan&id=" + uid, {
            method: 'GET'
        }
        );
        let json = await response.json();
        return json
    } catch (error) {
        console.error(error);
    }
}