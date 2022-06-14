# Projektwanie Aplikacji Webowych

## Identyfikacja zagadnienia biznesowego

### Potrzeba biznesowa  
  Aplikacja pozwala na:  
    - tworzenie notatek użytkowników.  
    - przechowywanie notatek użytkowników.   
    - edycję istniejących notatek należących do danego użytkownika.  
    
## Wymagania systemowe i funkcjonalne

- Backend: NodeJS v16.15.0, wykorzystany framework Express.js
- Baza danych: Sqlite3
  - Przechowywanie haseł: Solony Hash bcrypt
- Frontend: wygenerowany za pomocą silnika szablonow PUG
- Autoryzacja urzytkowników: moduł middleware do obsługi ciasteczek (zgodny z utworzonym na zajęciach)
  - Ciasteczka wygenerowane na podstawie UUID
  - Dodatkwo utworzony został moduł CRON, sprawdzającą co dwie godziny czy w bazie danych nie znajdują się przestarzałe sesje

- Zastosowana architektura Model-View-Controller
  - Poszczególne moduły router odpowiadają za obsługę przychodzących requestów (Controller)
  - Komunikacja z bazą danych za pomocą zbioru funkcji z querry SQL (definicje zawarte w pliku data-model.js, Model)
  - Frontend jako html / PUG (View)

## Analiza zagadnienia i jego modelowanie

Baza Danych:  
  
![DiagramDB](https://user-images.githubusercontent.com/22565779/173464692-f0e5779b-7a76-4fa0-8f2e-adc98ede5543.jpeg)

Notes:
  - UserID (INTEGER, NOT NULL)
  - Content (TEXT)
  - Tags (TEXT)
  - NoteID (INTEGER, NOT NULL, PRIMARY KEY, UNIQUE, AUTOINCREMENT)
  - Title (TEXT, NOT NULL)
  - TIMESTAMP (DATETIME, CURRENT TIMESTAMP)

Sessions:  
  - ID (INTEGER, NOT NULL, UNIQUE)
  - UserID (INTEGER, NOT NULL)
  - UUID (TEXT, NOT NULL)
  - Validity (TEXT, NOT NULL)

Users:  
  - ID (INTEGER NOT NULL)
  - Login (TEXT, NOT NULL, UNIQUE)
  - Password (TEXT, NOT NULL, UNIQUE)

Szczegółowe Diagramy Przepływu Danych dla poszczególnych funkcjonalności znajdują się w pliku DataFlowDiagram_detailed.png.   

## Implementacja

Baza Danych: 
  - sqlite3, ręcznie stworzone dane testowe, później dodawane za pomocą utworzonych endpointów.  
  - plik data-mdel.js zawiera definicje funkcji do pozyskiwania konkretnych wartości z Bazy Danych.  

Routery Express.js:
  - indexRouter -> 
    - ("/" GET) obsługa strony głównej, db.fetchUserNotes pozawala na pobranie notatek urzytkownika, a nastepnie przekazanie ich do widoku ('index')  
  - signupRouter -> 
    - ("/signup" GET) przekazanie widoku 'signup', 
    - ("/signup" POST) pobranie parametrow przekazanych przez urzytkownika, db.createUser utworzenie wpisu do Bazy Danych
  - loginRouter -> 
    - ("/login" GET) przekaznie widoku 'login', 
    - ("/login" POST) pobranie parametrów username/password, db.logginIn porownuje wartości z istniejącymi w bazie danych, db.writeSessionStorage tworzy wpis o sesji i ciasteczko urzytkownika
  - logoutRouter -> 
    - ("/logout" POST) usunięcie ciasteczka (res.clearCookie), db.deleteFromSessionStorage usuwa wpis o sesji 
  - new_noteRouter -> 
    - ("/new_note" GET) przekazanie widoku 'new_note' 
    - ("/new_note" POST) db.createNote tworzy wpis w tabeli Notes
  - edit_noteRouter -> 
    - ("/edit_note" GET z parametrem id), db.fetchNote pobiera notatkę, przekazaną do widoku 'edit_note' z możliwością edycji 
    - ("/edit_note" POST) db.updateNote aktualizacja wpisu
  - view_noteRouter -> 
    - ("/view_note" GET z parametrem id), db.fetchNote pobiera notatkę i przekazuje do widoku 'view_note'
  - search_noteRouter -> 
    - ("/search_notes" POST), zestaw funkcji pozwalających na przeszukiwanie Bazy danych (SQL LIKE Search)

Moduly Middleware:
  - moduł do obsługi ciasteczek, wpisany w app.js
  - moduł z funkcjonalnością cron, do automatycznego usuwania przestarzałych sesji

## Uwagi
- folder /node-modules/ został pominiety
- folder /keys został pominięty, trzeba bedzie wygenerować osobną parę kluczy
