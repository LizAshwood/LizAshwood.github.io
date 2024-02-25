package utils

import (
	"fmt"
	"log"
	"net/http"
)

func RunServer() {
	mux := http.NewServeMux()
	mux.HandleFunc("/login", loginHandler)
	mux.HandleFunc("/graphql", graphqlHandler)

	cssServer := http.FileServer(http.Dir("./static/"))
	mux.Handle("/static/", http.StripPrefix("/static/", cssServer))

	jsServer := http.FileServer(http.Dir("./script/"))
	mux.Handle("/script/", http.StripPrefix("/script/", jsServer))

	fmt.Println("server started at: http://localhost:8085/login")
	log.Fatal(http.ListenAndServe(":8085", mux))
}
