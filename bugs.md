# Bugs 

## Admin

### Main page
* Remove course button not working

### Users
* Remove user button not working

### Images
* Imaginea pentru setup image este cea de la delete image

### Boards
* Toate elementele din tabelul de boards sunt deplasate spre dreapta. Trebuie aranjate
* Disconnect board nu șterge board din lista / schimba status la disconnected.
* Butonul de reboot nu face nimic.
* Status boards nu se updatează
* Stânga sus, boards are imaginea de la users, nu de boards

### Courses
* Remove course nu merge. Lista de boards este goala dar primești mesaj "Please disconnect all boards". 
* Daca am setat o imagine pentru curs, nu o pot deasigna




## User 

### Main page
* Butonul de run nu merge
### Projects
* api/v1/project/dashboard/undefined - asta se apelează când dai project rename. Nu merge.
* api/v1/project/edit/undefined 

### Login
* Dacă dai login fără user și pass sau user și pass greșite, aplicația rămâne în loading.
* Dacă assignezi o placă greșită la login, nu îți zice că este greșită
* După ce treci de login, la choose boardId. Dacă dai change user, nu merge.
* Socket-ul nu se deconecteaza automat la logout

### Editor proiecte
* Indicatorul de editor indică cu un caracter mai mult spre stânga.
	