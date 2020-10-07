# TODOS

### db code - all in one helper.
- [x] function - pass in all config options for db... return a conencted db 
- [x] func - sqlQuery code (takesi n db, do query)
- [x] seed Db code

### router - extract routes
- [x] could extract helper functions
- [x] coordinator routes
- [x] url routes

### app:  config startup...
- [x] extract port function
- [x] extract counter service (current count = current range)

### USER AUTHENTICATOR
- [] route for coordinator to post to
- [] coordinator to post on this route whenever change occurs regarding USER AUTHENTICATOR : ServiceData
- [] info stored in REDIS. key: use

##### issues
current assumption: only one user authenticator running.
problems to solve to allow multiple to run:
- each user authenticator app keeps track of session. 
  - therefore urlShortener can't switch between them naively
  - possible solution: session data is stored in a database? 
    - then user authenticator can retrieve session data if it is not available locally
  - if user authenticator crashes, user will be logged out
- 

### REDIS CACHING
- [] to store last 100,000 shorturls hit
- [] to remove entries in cache if not hit in last 7 days