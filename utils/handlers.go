package utils

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"net/http"
)

// func indexHandler(w http.ResponseWriter, r *http.Request) {

// }

type loginRequest struct {
	User     string `json:"user"`
	Password string `json:"password"`
}

type loginResponse struct {
	Token string `json:"token"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/login" {
		http.NotFound(w, r)
		return
	}

	if r.Method == http.MethodGet {
		http.ServeFile(w, r, "./static/login.html")
	}

	if r.Method == http.MethodPost {
		var request loginRequest
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		// fmt.Println("User:", request.User, "Password:", request.Password)
		jwt, _ := obtainJWT(request.User, request.Password)
		loginResp := loginResponse{
			Token: "Bearer " + jwt,
		}
		json.NewEncoder(w).Encode(loginResp)
	}
}

func obtainJWT(username, password string) (string, error) {
	// Encode the username and password in base64 format
	auth := username + ":" + password
	encodedAuth := base64.StdEncoding.EncodeToString([]byte(auth))

	// Create a JSON object containing the credentials
	data := map[string]string{
		"username": username,
		"password": password,
	}
	jsonData, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	// Send a POST request to the signin endpoint with the credentials
	req, err := http.NewRequest("POST", "https://01.kood.tech/api/auth/signin", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Basic "+encodedAuth)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Parse the JSON response to obtain the JWT
	var result string
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return "", err
	}
	// fmt.Println("JWT:", result)
	return result, nil
}

// serve the html file
func graphqlHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/graphql" {
		http.NotFound(w, r)
		return
	}
	if r.Method == http.MethodGet {
		http.ServeFile(w, r, "./static/graphql.html")
	}
}
