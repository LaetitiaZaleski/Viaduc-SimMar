package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"ws"
)



func GetOutboundIP() net.IP {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)

	return localAddr.IP
}

func main() {

	fmt.Printf("Local address for server : %v\n", GetOutboundIP())
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
	http.HandleFunc ("/api", games.Api) // Définition de L'URL pour les requetes serveurs.
	log.Fatal(http.ListenAndServe(":8086", nil)) // lancement du serveur en HTTP sur le port 8086

}

