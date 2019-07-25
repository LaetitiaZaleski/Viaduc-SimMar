package main

import (
	"log"
	"net/http"
	"ws"
)





func main() {
	/*
		Etape 1 : Main > Initialisation.
	*/
		games := ws.Initialisation()

	/*
		Etape 2 : definition du serveur web.
	*/

	http.HandleFunc("/", games.ViewHandler) //Redirection de l'URL RACINE pour l'interface web
	fs := http.FileServer(http.Dir("www/sources")) //Definition du PATH pour les fichiers sources (pour que le site puisse acceder aux autres fichiers (JS, CSS, etc.))
	http.Handle("/sources/",  http.StripPrefix("/sources/", fs))
	http.HandleFunc ("/api", ws.Api) // Définition de L'URL pour les requetes serveurs.

	log.Fatal(http.ListenAndServe(":8080", nil)) // lancement du serveur en HTTP sur le port 8080



}

