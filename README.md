# GetGo scooter applikation

# Översikt
Denna applikation gör det möjligt för användare att hyra elektriska scooters genom en enkel och användarvänlig plattform. Applikationen är byggd för att hantera scooteruthyrning i realtid, inklusive funktioner som användarregistrering, scooterbokning, och betalning.

## Teknologi och Verktyg

- **Docker**: Applikationen körs i containrar för att säkerställa en konsekvent och isolerad utvecklings- och produktionsmiljö.
- **Backend**: [Beskriv backendteknologin, t.ex. Node.js, Python, Java, etc.]
- **Frontend**: [Beskriv frontendteknologin, t.ex. React, Angular, etc.]
- **Databas**: [Beskriv vilken databas som används, t.ex. MySQL, MongoDB, PostgreSQL, etc.]
- **API**: RESTful API för att hantera scooterdata och användarinteraktioner.


### Förutsättningar

Innan du kan köra applikationen lokalt måste du ha följande installerat:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Installera och köra applikationen med Docker

1. Klona detta repository:

   ```bash
   git clone https://github.com/alexanderwittenby1/vteam.git
   cd vteam


Bygg och starta applikationen med Docker Compose:

```
docker-compose up --build
```

Kör detta kommandot om docker-compose visar några fel.

```
docker-compose down --volumes --rmi all
docker-compose up --build
```

Det kan hända att backend-containern inte startar. Gå då in på din docker desktop och starta den manuellt.


# Hur man jobbar med github

Först måste vi börja med att klona ett repo. Med detta menas att man hämtar en kopia av projektet från en fjärrserver (t.ex. GitHub, GitLab) till din lokala maskin.

För att klona ett repo kör följande:
```
git clone https://github.com/username/repo.git

```

# Skapa och arbeta i en branch

Det är viktigt att alla som jobbar på projektet arbetar i separata grenar (branches). Detta gör vi för att undvika konflikter och hålla våra huvudgrenar som main och master rena och stabila.


# Hur man skapar en branch lokalt

```
git checkout -b feature/my-feature
```
Detta skapar en ny gren och byter till den.



# För att uppdatera din gren (branch)

```
git add .
git commit -m "Description of changes made"
```

# För att pusha

```
git push
```

Hämta uppdateringar från huvudgrenen ( Detta bör göras varje gång innan du börjar arbeta för att få de senaste uppdateringarna)

```
git checkout main
git pull origin main
```

Hoppa nu tillbaka till din lokala gren

``
git checkout <din branch>
git merge main
``

Hur hanterar vi mergekonflikter?

Ibland kommer Git att inte kunna slå samman två grenar automatiskt, och då kommer du att få en merge conflict. Detta händer när två personer gör ändringar på samma ställe i filerna.
Åtgärda merge-konflikter genom att öppna de konflikterande filerna och manuellt välja vilken kod som ska behållas.

```
git add <filename>

```
Commit de lösta konflikterna:

```
git commit -m "Resolved merge conflict"

```

Skicka Upp Dina Ändringar till Fjärrrepositoryt

När du har gjort dina ändringar och slått samman dem med huvudgrenen, kan du skicka dem till fjärrservern (origin). Detta görs genom att "push" dina lokala commits.

```
git push origin feature/my-feature

```

När du är klar med din feature och vill slå samman din gren med huvudgrenen, gör du en Pull Request (PR)

1. Gå till ditt repository på GitHub/GitLab.
2. Klicka på "New Pull Request" och välj din featuregren och huvudgrenen (main).
3. Lägg till en beskrivning och skicka PR:n för granskning av dina kollegor.
4. Andra teammedlemmar kan nu granska koden, kommentera och be om ändringar innan den blir sammanfogad med huvudgrenen.

Hämta och Slå Samman Pull Requests

När en PR har godkänts av andra teammedlemmar, kommer den att slås samman (merge) med huvudgrenen.

Följ upp med att hämta de senaste ändringarna från huvudgrenen:

```
git checkout main
git pull origin main

```
Om du har en featuregren som har blivit slutförd, kan du ta bort den:

```
git branch -d feature/my-feature

```


Översikt av Git-flödet i Teamarbete
Här är en sammanfattning av arbetsflödet i ett Git-team:

1. Clone repository: Hämta en kopia av repositoryt till din lokala dator.
2. Skapa en ny branch för att arbeta på en funktion.
3. Gör ändringar och commit dina förändringar.
4. Hämta de senaste uppdateringarna från huvudgrenen och slå samman med din branch.
5. Skicka upp dina ändringar till fjärrrepositoryt (push).
6. Skapa en pull request för att slå samman din branch med huvudgrenen.
7. Granska och slutför PR genom att slå samman den med huvudgrenen.
8. Hämta de senaste ändringarna för att hålla din lokala kod uppdaterad.
