/*
*   URL DES API pour les kernels :
* https://sourcesup.renater.fr/wiki/vino/apispecifications
* https://sourcesup.renater.fr/wiki/vino/index
* http://motive.cemagref.fr/vino/problem/new/
* */

// TODO faire des test sur execution, plusieurs personnes, plusieurs rooms
// TODO dans preference : un bouton pour mettre à jour le kernel et un bouton pour
//  l'afficher et un bouton pour mettre à jour les preference
// TODO Commenter
// TODO faire un fichier de config (json)
// TODO déroulement : calcul du noyau par joueur, si non vide --> page résultats --> calcul des intervals, si non vide re-calcul de noyau dans l'interval pour toutes les pref
// TODO affichage de noyaux a la page result

/*
POST METHOD
$.post("https://192.168.1.2:8843/token", {password : "123456"})
        .done(function(data) {
            console.log(data);
        })
        .fail(function() {
            console.log("auth KO");
        })
        .always(function() {
            //$('.loading').addClass('d-none');
        });
        
CURL method : 
curl -X POST --data "password=123456" https://192.168.1.2:8843/token 

curl -X POST -F 'script=Pi.oms' -F 'workDirectory=@pi.tgz' http://localhost:8843/job
--port 8843

// GO 
func SendPostRequest (url string, filename string, filetype string) []byte {
    file, err := os.Open(filename)

    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()


    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, err := writer.CreateFormFile(filetype, filepath.Base(file.Name()))

    if err != nil {
        log.Fatal(err)
    }

    io.Copy(part, file)
    writer.Close()
    request, err := http.NewRequest("POST", url, body)

    if err != nil {
        log.Fatal(err)
    }

    request.Header.Add("Content-Type", writer.FormDataContentType())
    client := &http.Client{}

    response, err := client.Do(request)

    if err != nil {
        log.Fatal(err)
    }
    defer response.Body.Close()

    content, err := ioutil.ReadAll(response.Body)

    if err != nil {
        log.Fatal(err)
    }

    return content
}

*/
