// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDEM0AQkqOoBgOUJeWwk-ZbbYNYwT87beY",
    authDomain: "physiques2.firebaseapp.com",
    projectId: "physiques2",
    storageBucket: "physiques2.appspot.com",
    messagingSenderId: "174104508999",
    appId: "1:174104508999:web:8f994f2c1d52aeb53b0f62",
    measurementId: "G-VRMNPEM3XH"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Set up our login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is Outta Line!!');
        return;
        // Don't continue running the code
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            firestore = firebase.firestore();
            const user = auth.currentUser;

            // Check user role in Firestore
            firestore.collection('admins').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const role = doc.data().role;
                        if (role === 'admin') {
                            // Allow access for admin
                            alert('Admin logged in');
                            window.location.replace('Dashboard.html');
                        } else {
                            // Deny access for non-admin
                            alert('User is not an admin');
                            // Sign out the user if not an admin
                            auth.signOut();
                            alert('You do not have admin privileges.');
                        }
                    } else {
                        alert('You are not autherized user');
                        // Sign out the user if document not found
                        auth.signOut();
                    }
                })
                .catch((error) => {
                    alert('Error checking user role:', error);
                    // Sign out the user in case of an error
                    auth.signOut();
                });
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            const error_code = error.code;
            const error_message = error.message;

            alert(error_message);
        });
}

// Validate Functions
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    return password.length >= 6;
}
