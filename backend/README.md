[Back to root](https://github.com/israelias/lantutors#contents)  
[Go to frontend](https://github.com/israelias/lantutors/tree/master/frontend)
# Lantutors Back-End

The restful API is deployed at [appspot.com](https://fsdisraelias.df.r.appspot.com/) via GoogleCloud App Engine. The database is also served via GCloud's Cloud SQL on a personal account.
## Development Requirements

Postman:
https://www.getpostman.com/collections/fdd4d23afa552d169904

Required softwares:

1. NodeJS
2. MySQL

## Local Database Setup
1. Create a local database named `development-student-management` and `test-student-management`
   * You can do this via the MySQL CLI or a GUI like MySQL Workbench.
   * Install mysql via `brew install mysql` or download the installer from the [MySQL website](https://dev.mysql.com/downloads/mysql/).
   * Run `mysql -u root -p` to login to the MySQL CLI.
2. Create a `.env` file in the root folder with the following format:
``` shell
APP_PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=development-student-management
DB_DIALECT=mysql
DB_PORT=3306
APP_HOST=localhost
NODE_ENV=development
```
3. Run `yarn db:create` to create the database.
4. Run `yarn db:migrate` to run the migrations.
5. Run `yarn dev` to start the server.


If you dont have MYSQL, you can run a local db server via Docker using something similar to the `docker-compose.yml` in this repo and run `docker-compose up`

## Methods
### Sign in as a Tutor
#### `api/account`: POST
* Request body example
``` json
{
  "email": "tutorken@gmail.com",
  "password": "tutorkenpassword"
} 
```
* Successful Response body example
``` json
{
    "tutor": "tutorken@gmail.com",
    "message": "Account Created",
    "code": 200
}
```

### Register your students
#### ***Live Endpoint***: [appspot.com/api/register](https://fsdisraelias.df.r.appspot.com/api/register)
#### `api/register`: POST

* Request body example
``` json
{
  "tutor": "tutorken@gmail.com",
  "students":
    [
      "studentholt@gmail.com",
      "studentjohn@gmail.com"
    ]
} 
```
* Successful Response body example
``` json
{
    "tutor": "tutorken@gmail.com",
    "students": [
        "studentholt@gmail.com",
        "studentjohn@gmail.com"
    ],
    "message": "Students Registered",
    "code": 200

}
```



### Post a Notification 
#### ***Live Endpoint***: [appspot.com/api/retrievenotifications](https://fsdisraelias.df.r.appspot.com/api/retrievenotifications)
#### `api/retrievenotifications`: POST
* Request body example 
* In this example, `@studentann` and `@studentmary` are already registered students via `api/register` by another tutor. 
* In this example, `studentcommon` and `studentshared` are students `tutorken` had registered previously.

``` json
{
  "tutor": "tutorken@gmail.com",
  "notification": "Hello students! @studentanne@gmail.com @studentmary@gmail.com"
  
} 
```
* Successful Response body example
* In this example, all registered students assigned to `@tutorken` recieve the notification, along with any student `@mentioned` in his `notification`.
* Any students in the recipients list have to have a student record, whether or not they are registered to `@tutorken`
``` json
{
    "tutor": "tutorken@gmail.com",
    "recipients": [
        "studentanne@gmail.com",
        "studentmary@gmail.com",
        "studentholt@gmail.com",
        "studentjohn@gmail.com",
        "studentcommon@gmail.com",
        "studentshared@gmail.com"
    ],
    "message": "Notification posted",
    "code": 200
}
```
>>> BUG: Currently, mentioning a student twice returns that student's email twice in `recipients`. This does ***not***, however, duplicate that student's record.

### Suspend or Unsuspend a Student 
#### ***Live Endpoint***: [appspot.com/api/suspend](https://fsdisraelias.df.r.appspot.com/api/suspend)
#### `api/suspend`: POST 
* Request body example  (Toggles the `suspended` field for `student`)

``` json
{
  "student": "studentanne@gmail.com",
  
} 
```
* Successful Response body example
``` json
{
    "student": "studentanne@gmail.com",
    "messsage": "studentann has been suspended",
    "code": 200
}
```
#### `api/suspend`: POST
* Request body example (Toggles the `suspended` field for `student`)

``` json
{
  "student": "studentanne@gmail.com",
  
} 
```
* Successful Response body example
``` json
{
    "student": "studentanne@gmail.com",
    "messsage": "studentann's suspension has been lifted",
    "code": 200
}
```


### Get Students common to Tutor(s)
#### ***Live Endpoint***: [appspot.com/api/commonstudents](https://fsdisraelias.df.r.appspot.com/api/commonstudents)
#### `api/commonstudents?`: GET
* If using Postman, ensure that the body is empyty.

* Returns all students if there are no web args
* In this example `studentsjared`, `studentcommon`, were previously registered by `tutorken` and `studentanother` was previosly registered by and to another tutor `tutoranother`

``` json
{
    "students": [
        "studentann@gmail.com",
        "studentmary@gmail.com",
        "studentholt@gmail.com",
        "studentjohn@gmail.com",
        "studentanother@gmail.com",
        "studentcommon@gmail.com",
        "studentshared@gmail.com"
    ]
}
```

#### ***Live Endpoint***: [appspot.com/api/commonstudents?tutor=isabel@isabel.com](https://fsdisraelias.df.r.appspot.com/api/commonstudents?tutor=isabel@isabel.com) (with existing tutor `isabel` record params)
#### `api/commonstudents?tutor=tutorken@gmail.com`: GET
* If using Postman, ensure that the body is empyty.

* Returns all students assigned to `tutorken` via the URL query param `tutor` i.e. `?tutor=tutorken@gmail.com` 
``` json
{
    "students": [
        "studentann@gmail.com",
        "studentmary@gmail.com",
        "studentholt@gmail.com",
        "studentjohn@gmail.com",
        "studentshared@gmail.com",
        "studentcommon@gmail.com",
    ]
}
```

#### ***Live Endpoint***: [appspot.com/api/commonstudents?tutor=john@john.com](https://fsdisraelias.df.r.appspot.com/api/commonstudents?tutor=john@john.com) (with existing tutor `john` record params)
#### `api/commonstudents?tutor=tutoranother@gmail.com`: GET
* If using Postman, ensure that the body is empyty.

* Returns all students assigned to `tutoranother` via the URL query param `tutor` i.e. `?tutor=tutoranother@gmail.com` 
``` json
{
    "students": [
        "studentanother@gmail.com",
        "studentshared@gmail.com",
        "studentcommon@gmail.com",
    ]
}
```

#### ***Live Endpoint***: [appspot.com/api/commonstudents?tutor=john@john.com&tutor=isabel@isabel.com](https://fsdisraelias.df.r.appspot.com/api/commonstudents?tutor=john@john.com&tutor=isabel@isabel.com) (with existing tutor `isabel` and `john` record params)
#### `api/commonstudents?tutor=tutorken@gmail.com&tutor=tutoranother@gmail.com`: GET
* If using Postman, ensure that the body is empyty.

* Returns students if and only if those students are assigned to both `tutorken` and `tutoranother` via the URL query param `tutor` i.e. `?tutor=tutorken@gmail.com&tutor=tutoranother@gmail.com`
* The sample logic applies to as many number of `tutor`s in the query param 
* Note the exlusion of all of `tutorken`'s other students and our new variable, `tutoranother`'s other student, `studentanother`.

``` json
{
    "students": [
        "studentshared@gmail.com",
        "studentcommon@gmail.com",
    ]
}
```

### Get all Students
#### ***Live Endpoint***: [appspot.com/api/allstudents](https://fsdisraelias.df.r.appspot.com/api/allstudents)
#### `api/allstudents`: GET
* If using Postman, ensure that the body is empyty.

* Returns all raw student records
``` json
[
  {
    "id": 1,
    "email": "email@email.com",
    "suspended": false,
    "createdAt": "2021-06-25T07:58:37.000Z",
    "updatedAt": "2021-06-26T13:35:55.000Z"
  },
  {...students}
]
```

#### ***Live Endpoint***: [appspot.com/api/students](https://fsdisraelias.df.r.appspot.com/api/students)
#### `api/students`: GET
* If using Postman, ensure that the body is empyty.

* Returns all registered student emails
``` json
[
  {
     "students": [
        "kate@kate.com",
        "chris@chris.com",
        "noah@noah.com",
        "elias@elias.com",
    ]
  }

]
```

### Get one Student
#### ***Live Endpoint***: [appspot.com/api/elias@elias.com](https://fsdisraelias.df.r.appspot.com/api/students/elias@elias.com)
#### `api/students/email@email.com`: GET
* If using Postman, ensure that the body is empyty.

* Returns one raw student record
``` json
 {
    "id": 1,
    "email": "email@email.com",
    "suspended": false,
    "createdAt": "2021-06-25T07:58:37.000Z",
    "updatedAt": "2021-06-26T13:35:55.000Z"
  }
```


### Get all Tutors
#### ***Live Endpoint***: [appspot.com/api/tutors](https://fsdisraelias.df.r.appspot.com/api/tutors)
#### `api/tutors`: GET
* If using Postman, ensure that the body is empyty.

* Returns all raw tutor records
``` json
[
  {
    "id": 1,
    "email": "tutor@tutor.com",
    "password": "$2a$10$TH0sytl7DCVXIhVTF0kgJ.IffcOTAnGtTiZgNU9BLQ0KLE1JsXFh2",
    "createdAt": "2021-06-25T07:58:37.000Z",
    "updatedAt": "2021-06-26T13:35:55.000Z"
  },
  {...tutors}
]
```

### Get one Tutor
#### ***Live Endpoint***: [appspot.com/api/tutors/john@john.com](https://fsdisraelias.df.r.appspot.com/api/tutors/john@john.com)
#### `api/tutors/email@email.com`: GET
* If using Postman, ensure that the body is empyty.

* Returns one raw student record
``` json
 {
    "id": 1,
    "email": "tutor@tutor.com",
    "password": "$2a$10$TH0sytl7DCVXIhVTF0kgJ.IffcOTAnGtTiZgNU9BLQ0KLE1JsXFh2",
    "createdAt": "2021-06-25T07:58:37.000Z",
    "updatedAt": "2021-06-26T13:35:55.000Z"
  }
```


### Get all Notifications
#### ***Live Endpoint***: [appspot.com/api/allnotifications](https://fsdisraelias.df.r.appspot.com/api/allnotifications)
#### `api/allnotifications`: GET
* If using Postman, ensure that the body is empyty.

* Returns all raw `Tutor-Student-Notification` association records
``` json
[
    {
        "id": 1,
        "student": "kevin@kevin.com",
        "tutor": "alfred@alred.com",
        "title": "[Tutor alfred]: Fri Jun 25 2021 08:04:58 GMT+0000 (Coordinated Universal Time)",
        "message": "Great to meet everyone and see you all on our site visit next Friday. Reminding @kevin@kevin.com @kate@kate.com and @joem@joem.com to bring their registration forms.",
        "createdAt": "2021-06-25T08:04:58.000Z",
        "updatedAt": "2021-06-25T08:04:58.000Z",
    },
    { ...notifications}
]
```

### Get all Notifications by Tutor
#### ***Live Endpoint***: [appspot.com/api/notifications/john@john.com](https://fsdisraelias.df.r.appspot.com/api/notifications/john@john.com)
#### `api/notifications/tutor@email.com`: GET
* If using Postman, ensure that the body is empyty.

* Returns all raw `Tutor-Student-Notification` association records issued by `tutor`
``` json
[
     {
        "id": 13,
        "student": "kate@kate.com",
        "tutor": "john@john.com",
        "title": "[Tutor john]: Fri Jun 25 2021 08:09:31 GMT+0000 (Coordinated Universal Time)",
        "message": "See you guys next week!",
        "createdAt": "2021-06-25T08:09:31.000Z",
        "updatedAt": "2021-06-25T08:09:31.000Z"
    },
    { ...notificationsFromJohn}
]
```


### Get all Tutor-Student associations
#### ***Live Endpoint***: [appspot.com/api/alltutorstudents](https://fsdisraelias.df.r.appspot.com/api/alltutorstudents)
#### `api/alltutorstudents`: GET
* If using Postman, ensure that the body is empyty.

* Returns all raw `Tutor-Student` association records
``` json
[
      {
        "id": 1,
        "tutor": "alfred@alfred.com",
        "student": "kate@kate.com",
        "active": true,
        "createdAt": "2021-06-25T07:58:38.000Z",
        "updatedAt": "2021-06-25T07:58:38.000Z"
    },
    { ...tutorStudents}
]
```

### Get all Tutor-Student associations by Tutor
#### ***Live Endpoint***: [appspot.com/api/commonstudents/john@john.com](https://fsdisraelias.df.r.appspot.com/api/commonstudents/john@john.com)
#### `api/commonstudents/tutor@email.com`: GET
* If using Postman, ensure that the body is empyty.

* Returns a reduced object of tutor email and students' emails via `Tutor-Student` associations where students are assigned to the tutor in the web argument.
``` json
{
    "tutor": "john@john.com",
    "students": [
        "kate@kate.com",
        "kevin@kevin.com",
        "joem@joem.com"
    ]
}
```

## Frameworks and Libraries
- [ExpressJS:](https://expressjs.com/) 
- [Sequelize:](https://sequelize.org/) 
- [NextJS:](https://nextjs.org/) 
- [Axios](https://github.com/axios/axios) 
- [Joi](https://joi.dev/api/?v=17.4.0) via [Express-Validation](https://github.com/AndrewKeig/express-validation)
- [Factory-Girl](https://github.com/simonexmachina/factory-girl)
- [Faker](https://github.com/fzaninotto/Faker)

## Resources
- [GCloud Deployment](https://cloud.google.com/appengine)
- [GCloud SQL](https://cloud.google.com/sql)


## Running Locally and Available Scripts

1. **Clone the repo and go inside the folder.**

2. **Install the project dependencies**

   ```shell
    npm install
   ```

3. **Create `.env` file in the root folder, with the ff. format.**
   Fill in the appropriate mysql credentials.

   ```shell
    APP_PORT=4000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=password
    DB_NAME=development-student-management
    DB_DIALECT=mysql
    DB_PORT=3306
    APP_HOST=localhost
    NODE_ENV=development
   ```

4. **Create development database.**
   ```shell
     npm run db:create
   ```
5. **Run the migrations.**
   ```shell
     npm run db:migrate
   ```
6. **Run the app**
   ```shell
     npm run dev
   ```

## 🚀 How to run test

1. **Create `.env.test` file in the root folder, with the ff. format.**
   Fill in the appropriate mysql credentials for test evironment.
   ```shell
     APP_PORT=4000
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=password
     DB_NAME=test-student-management
     DB_DIALECT=mysql
     DB_PORT=3306
     APP_HOST=localhost
     NODE_ENV=test
   ```
2. **Run the test**

   ```shell
     npm run test
   ```

   The test results should look like this.

   ```shell
      PASS  src/controllers/api.controller.spec.js (12.529 s)
      Api Controller
        Register API
          Invalid body
            ✓ should fail without tutor  (23 ms)
            ✓ should fail without students  (22 ms)
            ✓ should fail if tutor is not an email (8 ms)
            ✓ should fail if students are not in email format (3 ms)
          Valid body
            ✓ should pass for new tutor and students (132 ms)
            ✓ should pass for existing tutor and new students (20 ms)
            ✓ should pass for new tutor and old students (1024 ms)
        GetCommonStudents API
          Invalid query
            ✓ should fail without tutor  (3 ms)
            ✓ should fail if tutor is not an email  (4 ms)
          Valid query
            ✓ should pass for single common tutor  (1075 ms)
            ✓ should pass for multiple common tutor (1037 ms)
        SuspendStudent API
          Invalid body
            ✓ should fail for nonexistent student (4 ms)
          Valid body
            ✓ should pass for existing student (13 ms)
        ReceiveNotifications API
          Invalid body
            ✓ should fail if tutor is empty (2 ms)
            ✓ should fail if notification is empty (3 ms)
        Valid body
          ✓ should fail if tutor doesnt exist (5 ms)
          ✓ should pass and retrieve students that belongs to the tutor (1033 ms)
          ✓ should pass and retrieve students that belongs to the tutor and mentioned students (2045 ms)
          ✓ should pass and retrieve students that are not suspended only (2035 ms)
   ```
