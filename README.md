# System Rejestracji Szczepień COVID-19

## 1. Opis Aplikacji

### 1.1 Opisanie Aplikacji

System Rejestracji Szczepień COVID-19 to aplikacja backendowa oparta na frameworku NestJS, która umożliwia kompleksowe zarządzanie procesem rejestracji i realizacji szczepień przeciwko COVID-19. System wspiera pełny cykl życia pacjenta - od rejestracji, przez umawianie wizyt, aż po dokumentowanie wykonanych szczepień.

Aplikacja została zbudowana z wykorzystaniem:

- **NestJS 11** - nowoczesny framework Node.js
- **PostgreSQL** - relacyjna baza danych
- **Prisma ORM** - narzędzie do zarządzania bazą danych
- **JWT** - uwierzytelnianie i autoryzacja
- **Swagger/OpenAPI** - dokumentacja API

### 1.2 Opis Funkcjonalności w Postaci User Stories

#### Zarządzanie Pacjentami

- **US-001**: Jako administrator/staff, chcę dodać nowego pacjenta do systemu, aby móc zarządzać jego danymi.
- **US-002**: Jako administrator/staff, chcę wyszukać pacjenta po PESEL, aby szybko znaleźć jego dane.
- **US-003**: Jako administrator/staff, chcę zaktualizować dane pacjenta, aby utrzymać aktualne informacje.
- **US-004**: Jako administrator/staff, chcę usunąć pacjenta z systemu, jeśli nie ma aktywnych wizyt.
- **US-005**: Jako administrator/staff, chcę przeglądać listę pacjentów z paginacją i filtrowaniem, aby efektywnie zarządzać danymi.

#### Zarządzanie Wizytami

- **US-006**: Jako pacjent/staff, chcę umówić wizytę na szczepienie, wybierając klinikę i datę.
- **US-007**: Jako system, chcę sprawdzić dostępność miejsc w klinice na wybraną datę, aby uniknąć przepełnienia.
- **US-008**: Jako pacjent/staff, chcę anulować wizytę, jeśli nie mogę przyjść.
- **US-009**: Jako administrator/staff, chcę zaktualizować szczegóły wizyty, aby dostosować je do zmienionych okoliczności.
- **US-010**: Jako administrator/staff, chcę przeglądać wizyty z filtrowaniem po pacjencie, klinice, dacie i statusie.

#### Zarządzanie Klinikami

- **US-011**: Jako administrator, chcę przeglądać listę wszystkich klinik, aby zarządzać infrastrukturą.
- **US-012**: Jako administrator, chcę zaktualizować dane kliniki, aby utrzymać aktualne informacje.
- **US-013**: Jako pacjent/staff, chcę sprawdzić dostępność terminów w klinice na wybraną datę, aby umówić wizytę.

#### Dokumentowanie Szczepień

- **US-014**: Jako lekarz, chcę zarejestrować wykonane szczepienie, aby udokumentować proces.
- **US-015**: Jako administrator/staff/lekarz, chcę przeglądać historię szczepień, aby śledzić postępy pacjentów.
- **US-016**: Jako lekarz, chcę dodać informacje o ewentualnych skutkach ubocznych, aby prowadzić dokumentację medyczną.

#### Integracja z Zewnętrznymi API

- **US-017**: Jako administrator/staff, chcę pobrać statystyki szczepień z zewnętrznego API, aby mieć aktualne dane globalne.

#### Bezpieczeństwo i Autoryzacja

- **US-018**: Jako użytkownik, chcę zalogować się do systemu, aby uzyskać dostęp do funkcji zgodnie z moją rolą.
- **US-019**: Jako system, chcę weryfikować uprawnienia użytkownika, aby zapewnić bezpieczny dostęp do danych.
- **US-020**: Jako administrator, chcę mieć pełny dostęp do wszystkich funkcji systemu.

### 1.3 Odbiorcy Systemu

System został zaprojektowany dla dwóch głównych grup odbiorców:

1. **Personel Medyczny i Administracyjny**
   - Lekarze (DOCTOR) - rejestrowanie szczepień, przeglądanie historii pacjentów
   - Personel administracyjny (STAFF) - zarządzanie pacjentami, wizytami, klinikami
   - Administratorzy (ADMIN) - pełne zarządzanie systemem, aktualizacja danych klinik

2. **Pacjenci**
   - Rejestracja w systemie
   - Umawianie wizyt na szczepienia
   - Sprawdzanie dostępności terminów
   - Przeglądanie historii własnych szczepień

### 1.4 Korzyści dla Użytkowników

#### Dla Personelu Medycznego:

- **Centralizacja danych**: Wszystkie informacje o pacjentach i szczepieniach w jednym miejscu
- **Automatyzacja**: System automatycznie sprawdza dostępność miejsc i zapobiega przepełnieniu klinik
- **Bezpieczeństwo**: Kontrola dostępu oparta na rolach zapewnia, że tylko uprawnione osoby mają dostęp do danych
- **Efektywność**: Szybkie wyszukiwanie pacjentów, filtrowanie wizyt i zarządzanie harmonogramem

#### Dla Pacjentów:

- **Dostępność**: Możliwość sprawdzenia dostępnych terminów w czasie rzeczywistym
- **Przejrzystość**: Pełna historia własnych szczepień i wizyt
- **Wygoda**: Prosty proces rejestracji i umawiania wizyt
- **Bezpieczeństwo danych**: Ochrona danych osobowych poprzez szyfrowanie haseł i kontrolę dostępu

## 2. Schemat Bazy Danych

System wykorzystuje relacyjną bazę danych PostgreSQL z następującym schematem:

![Database Schema](./docs/schemat-bazy.png)

### Główne Encje:

1. **User** - Użytkownicy systemu (ADMIN, STAFF, DOCTOR)
   - Identyfikacja: UUID
   - Rola: ADMIN, STAFF, DOCTOR
   - Dane osobowe: email, imię, nazwisko

2. **Patient** - Pacjenci
   - Identyfikacja: UUID
   - Unikalny PESEL
   - Dane kontaktowe: email, telefon, adres

3. **Clinic** - Kliniki
   - Identyfikacja: Integer (auto-increment)
   - Dane lokalizacyjne: adres, miasto, kod pocztowy
   - Pojemność dzienna (capacityPerDay)

4. **Doctor** - Lekarze
   - Identyfikacja: UUID
   - Powiązanie z User i Clinic
   - Numer licencji medycznej

5. **Vaccine** - Szczepionki
   - Identyfikacja: Integer
   - Dane: nazwa, producent, numer partii, data ważności
   - Wymagana liczba dawek

6. **Appointment** - Wizyty
   - Identyfikacja: UUID
   - Status: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
   - Powiązania: Patient, Clinic, Doctor (opcjonalnie)
   - Data wizyty, numer dawki

7. **Vaccination** - Szczepienia (wykonane)
   - Identyfikacja: UUID
   - Powiązania: Appointment, Vaccine, Doctor
   - Data wykonania, ewentualne skutki uboczne

### Relacje:

- User 1:1 Doctor
- Clinic 1:N Doctor
- Clinic 1:N Appointment
- Patient 1:N Appointment
- Doctor 1:N Appointment
- Doctor 1:N Vaccination
- Appointment 1:1 Vaccination
- Vaccine 1:N Vaccination

## 3. Implementacja Bazowego Serwera z Zabezpieczeniami

### 3.1 Technologie i Konfiguracja

- **NestJS 11** - Framework aplikacji
- **Prisma ORM** - Zarządzanie bazą danych
- **PostgreSQL** - Baza danych
- **JWT** - Uwierzytelnianie
- **Swagger** - Dokumentacja API

### 3.2 Zastosowane Zabezpieczenia

#### 1. **Helmet** - Ochrona nagłówków HTTP

- Automatyczne ustawianie bezpiecznych nagłówków HTTP
- Ochrona przed atakami XSS, clickjacking, MIME sniffing
- Implementacja: `app.use(helmet())` w `main.ts`

#### 2. **CORS (Cross-Origin Resource Sharing)**

- Konfiguracja dozwolonych źródeł żądań
- Wsparcie dla credentials (cookies, authorization headers)
- Implementacja: `app.enableCors()` w `main.ts`

#### 3. **Rate Limiting (Ograniczenie Częstotliwości Żądań)**

- Ograniczenie: 10 żądań na 60 sekund na IP
- Ochrona przed atakami DDoS i brute force
- Implementacja: `ThrottlerModule` z globalnym `ThrottlerGuard`

## 4. Implementacja Endpointów

### 4.1 Dodawanie Danych do Bazy

#### Endpointy POST:

- **POST /api/patients** - Dodawanie nowego pacjenta
  - Walidacja: PESEL (11 cyfr), wymagane pola (imię, nazwisko, data urodzenia)
  - Obsługa błędów: ConflictException dla duplikatu PESEL
  - Autoryzacja: ADMIN, STAFF

- **POST /api/appointments** - Tworzenie wizyty
  - Walidacja: data w przyszłości, dostępność miejsc w klinice
  - Obsługa błędów: BadRequestException dla pełnej kliniki
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **POST /api/vaccinations** - Rejestracja szczepienia
  - Walidacja: status wizyty, przypisanie lekarza do kliniki
  - Obsługa błędów: BadRequestException dla nieprawidłowego statusu
  - Autoryzacja: DOCTOR

- **POST /api/auth/login** - Logowanie użytkownika
  - Walidacja: email i hasło
  - Zwraca JWT token
  - Publiczny endpoint

### 4.2 Aktualizacja Danych w Bazie

#### Endpointy PATCH:

- **PATCH /api/patients/:id** - Aktualizacja danych pacjenta
  - Walidacja: częściowa aktualizacja (partial update)
  - Obsługa błędów: NotFoundException, ConflictException dla duplikatu PESEL
  - Autoryzacja: ADMIN, STAFF

- **PATCH /api/appointments/:id** - Aktualizacja wizyty
  - Walidacja: nie można aktualizować zakończonych wizyt
  - Sprawdzanie dostępności przy zmianie daty
  - Obsługa błędów: BadRequestException dla zakończonych wizyt
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **PATCH /api/appointments/:id/cancel** - Anulowanie wizyty
  - Walidacja: nie można anulować zakończonych wizyt
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **PATCH /api/clinics/:id** - Aktualizacja danych kliniki
  - Autoryzacja: ADMIN

### 4.3 Pobieranie Danych z Bazy

#### Endpointy GET:

- **GET /api/patients** - Lista pacjentów
  - Paginacja: `page`, `limit`
  - Filtrowanie: `search`, `city`
  - Sortowanie: `sortBy`, `sortOrder`
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **GET /api/patients/:id** - Szczegóły pacjenta
  - Opcjonalne relacje: `?include=appointments`
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **GET /api/appointments** - Lista wizyt
  - Filtrowanie: `patientId`, `clinicId`, `doctorId`, `status`, `startDate`, `endDate`
  - Paginacja i sortowanie
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **GET /api/appointments/:id** - Szczegóły wizyty
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **GET /api/clinics** - Lista klinik
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **GET /api/clinics/:id** - Szczegóły kliniki
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **GET /api/clinics/:id/availability** - Dostępność terminów
  - Query parameter: `date` (YYYY-MM-DD)
  - Zwraca dostępne sloty czasowe
  - **Publiczny endpoint** (bez autoryzacji)

- **GET /api/vaccinations** - Lista szczepień
  - Autoryzacja: ADMIN, STAFF, DOCTOR

- **GET /api/vaccinations/:id** - Szczegóły szczepienia
  - Autoryzacja: ADMIN, STAFF, DOCTOR

### 4.4 Kasowanie Danych z Bazy

#### Endpointy DELETE:

- **DELETE /api/patients/:id** - Usuwanie pacjenta
  - Walidacja: nie można usunąć pacjenta z aktywnymi wizytami
  - Obsługa błędów: ConflictException dla aktywnych wizyt
  - Autoryzacja: ADMIN, STAFF

- **DELETE /api/appointments/:id** - Usuwanie wizyty
  - Walidacja: nie można usunąć zakończonych wizyt
  - Obsługa błędów: BadRequestException dla zakończonych wizyt
  - Autoryzacja: ADMIN, STAFF

### 4.5 Endpoint Łączący się z Zewnętrznym API

- **GET /api/external/vaccine-statistics** - Statystyki szczepień z zewnętrznego API
  - Integracja z zewnętrznym API COVID-19 (disease.sh)
  - Zwraca dane dla Polski
  - Obsługa błędów: timeout, rate limiting, błędy serwera
  - Transformacja danych do formatu wewnętrznego
  - Publiczny endpoint

### Walidacja Danych

Wszystkie endpointy wykorzystują:

- **DTO (Data Transfer Objects)** z dekoratorami `class-validator`
- **Global Validation Pipe** do automatycznej walidacji danych wejściowych z dekoratorów `class-validator`

### Obsługa Wyjątków

- **NotFoundException** - gdy zasób nie istnieje
- **ConflictException** - gdy występuje konflikt (np. duplikat PESEL)
- **BadRequestException** - gdy żądanie jest nieprawidłowe
- **UnauthorizedException** - gdy brak autoryzacji
- **ForbiddenException** - gdy brak uprawnień
- **Global Exception Filter** - ujednolicony format odpowiedzi błędów

## 5. Wzorce Projektowe

### 5.1 Wzorzec Repozytorium (Repository Pattern)

**Uzasadnienie wyboru:**

- **Separacja odpowiedzialności**: Logika biznesowa nie zależy od szczegółów implementacji Prisma
- **Testowalność**: Łatwe mockowanie repozytoriów w testach jednostkowych
- **Elastyczność**: Możliwość zmiany warstwy dostępu do danych bez modyfikacji logiki biznesowej
- **Utrzymywalność**: Centralizacja logiki dostępu do danych
- **Bezpieczeństwo typów**: Interfejsy TypeScript zapewniają zgodność kontraktów

### 5.2 Wzorzec Warstwy Serwisowej (Service Layer Pattern)

**Uzasadnienie wyboru:**

- **Separacja odpowiedzialności**: Kontrolery są cienkie, tylko obsługują HTTP
- **Reużywalność**: Logika biznesowa może być używana w różnych kontekstach
- **Testowalność**: Łatwe testowanie logiki biznesowej bez kontrolerów
- **Orchestracja**: Serwisy koordynują operacje między wieloma repozytoriami

### Architektura Warstwowa

```
┌─────────────┐
│ Controllers │  (Warstwa HTTP)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │  (Warstwa logiki biznesowej)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repositories│  (Warstwa dostępu do danych)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Prisma    │  (ORM/Baza danych)
└─────────────┘
```

## 6. Implementacja Testów Jednostkowych

komenda `npx nx test covid-vaccination`

### Zaimplementowane Testy

Testy jednostkowe zostały zaimplementowane dla kontrolera `PatientsController` w pliku:
`apps/covid-vaccination/src/patients/patients.controller.spec.ts`

#### Zaimplementowane testy:

1. **Test tworzenia pacjenta**
2. **Test duplikatu PESEL**
3. **Test pobierania pacjenta**
4. **Test usuwania pacjenta z aktywnymi wizytami**
5. **Test walidacji PESEL**

## Instalacja i Uruchomienie

### Wymagania

- Node.js 18+
- PostgreSQL 12+
- npm

### Instalacja

```bash
# Instalacja zależności
npm install

# Konfiguracja bazy danych
# Utwórz plik .env.local w katalogu głównym:
# DATABASE_URL="postgresql://user:password@localhost:5432/covid_vaccination"
# JWT_SECRET="your-secret-key"

# Migracja bazy danych
npm run prisma:migrate

# Generowanie klienta Prisma
npm run prisma:generate

# Seedowanie bazy danych (opcjonalne)
npm run prisma:seed
```

### Uruchomienie

```bash
# Uruchomienie serwera deweloperskiego
npx nx serve covid-vaccination

# Aplikacja dostępna pod adresem:
# http://localhost:3000/api
# Dokumentacja Swagger:
# http://localhost:3000/api/docs
```

### Testowe Dane

Po uruchomieniu seeda dostępne są następujące konta testowe:

| Rola   | Email              | Hasło       |
| ------ | ------------------ | ----------- |
| ADMIN  | admin@example.com  | password123 |
| STAFF  | staff@example.com  | password123 |
| DOCTOR | doctor@example.com | password123 |

## Dokumentacja API

Pełna dokumentacja API dostępna jest w Swagger UI pod adresem:
`http://localhost:3000/api/docs`
