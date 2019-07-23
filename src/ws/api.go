package ws

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)



func IsInMap(dic url.Values, key string) bool {
	_, ok := dic[key]
	return ok
}

func MyExit(w http.ResponseWriter, err error) {
	fmt.Println("ERROR:", err)
	w.WriteHeader(http.StatusInternalServerError)
}


func GetMethod(w http.ResponseWriter, r *http.Request) {
	param := r.URL.Query()
	if !IsInMap(param, "fnct") {
		MyExit(w, errors.New("missing func"))
		return
	}
	fnct := param["fnct"][0]

	if strings.Compare(fnct, "get_func") == 0 &&
		IsInMap(param, "param1") &&
		IsInMap(param, "param1") {
		//Do some stuff
	} else {
		MyExit(w, errors.New("wrong format GET"))
		return
	}
}

func PostMethod(w http.ResponseWriter, r *http.Request) {

	r.ParseForm()

	param := r.Form
	if IsInMap(param, "fnct") && param["fnct"][0] == "post_func" &&
		IsInMap(param, "param1") && IsInMap(param, "param2") && IsInMap(param, "param3") &&
		len(param["param3"][0]) > 0 && len(param["param3"][0]) > 0 && len(param["param3"][0]) > 0 {
		//Do some stuff
	} else {
		MyExit(w, errors.New("wrong format POST"))
		return
	}

}



func Api(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	switch r.Method {
	case http.MethodGet:
		GetMethod(w,r)
	case http.MethodPost:
		PostMethod(w, r)
	case http.MethodPut:
		http.Error(w, "401 - Access denied exit ws!", 401)
	case http.MethodDelete:
		http.Error(w, "401 - Access denied exit ws!", 401)
	default:
		http.Error(w, "401 - Access denied exit ws!", 401)
	}
}

