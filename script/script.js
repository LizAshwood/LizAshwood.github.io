// get login data
const loginSubmitButton = document.getElementById('login-submit');
const loginUser = document.getElementById('login-user');
const loginPassword = document.getElementById('login-password');


if(loginSubmitButton){
loginSubmitButton.addEventListener('click', (event) => {
    event.preventDefault();
    const user = loginUser.value;
    const password = loginPassword.value;

    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: user,
            password: password
        })
    })

    // handle data from the backend
    .then((data) => {
        data.json().then((jsonData) => {
            if (jsonData.token !== "Bearer ") {
                sessionStorage.setItem('token', jsonData.token);
                window.location.href = '/graphql';
            } else {
                loginUser.value = '';
                loginPassword.value = '';
                alert('Invalid username or password');
            }
        });
    })

    .catch((error) => {
        alert(error);
    })
})

loginPassword.addEventListener('keyup', (event) => {
    if(event.key === 'Enter'){
        event.preventDefault();
        loginSubmitButton.click();
    }
})
}


window.addEventListener('DOMContentLoaded', (event) => {
    if(sessionStorage.getItem('token')){
        window.location.href = '/graphql';
    }
})


