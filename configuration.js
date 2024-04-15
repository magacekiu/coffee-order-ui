const mode = 0;

const host_local = "https://coffee-order-latest-1-8htg.onrender.com";

const host_remote = "https://coffee-order-latest-1-8htg.onrender.com";

function getHost () {
    return (mode == 0) ? host_local : host_remote;
}
function isLoggedIn() {
if (localStorage.getItem ("token")) {
return true;
} else {
return false;
}
}
function getTheToken () {
return localStorage.getItem ("token");
}
function saveTheToken (token) {
localStorage.setItem("token", token); updateTheNavigationBar ();
}
function removeTheToken () {
localStorage. removeItem ("token"); updateTheNavigationBar ();
}
let configuration = {
    isLoggedIn: () => isLoggedIn(),
    host: () => getHost(),
    token: () => getTheToken ()
};

updateTheNavigationBar ();
async function updateTheNavigationBar() {
const navigation = document.getElementsByClassName ("topnav" ) [0];
let loginTag = navigation.children[navigation.children.length -1];
if(configuration. isLoggedIn()) {
loginTag. innerHTML =`<li class="right"><a href="#" onclick="logout ()">Logout</a></li>`;
}else{
loginTag.innerHTML =`<li class="right"><a href="login.html">Login</a></li>`;
}
}

async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let customer = { username: username, password: password }
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    };
    try {
        let response = await fetch(getHost() + "/signin", request);
        if (response.status == 200 || response.status == 201) {
            alert("The login was successful!");
            const token = await response.text();
            saveTheToken(token);
            location.href = "home.html";
        } else {
            console.log(`response status:${response.status}`);
            removeTheToken();
            alert("Something went wrong!");
        }
    }
    catch(error) {
        console.log(error);
        removeTheToken();
        alert("Something went wrong!");
    }
}

async function logout() {
    removeTheToken();
}

async function fetchWithAuth(url, options = {}) {
    const token = getTheToken(); // Retrieve the stored token
    const headersWithAuth = {
        ...options.headers,
        "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
    };
    const response = await fetch(getHost() + url, { ...options, headers: headersWithAuth });
    if (response.status == 200 || response.status == 201) {
        return response.json(); 
    } else {
        console.error(`Failed to fetch ${url}:`, response.status);
        throw new Error(`Request failed: ${response.status}`);
    }
}


