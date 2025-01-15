/**
 * Test Suites
 * run `yarn pretest`
 * then `yarn test`
 */

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const request = require('supertest');
const app = require('../testEntry');
const faker = require('faker');

import factories from '../testUtils/factories';
const { truncate } = require('../testHelper');

describe('Api Controller', () => {
  beforeEach(() => {
    return truncate();
  });

  describe('Register API', () => {
    describe('Invalid body', () => {
      beforeEach(() => {
        return truncate();
      });

      it('should fail without tutor ', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/register')
          .send();
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it('should fail without students ', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/register')
          .send({
            tutor: faker.internet.email(),
          });
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([
          { students: '"students" is required' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });

      it('should fail if tutor is not an email', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/register')
          .send({
            tutor: faker.random.word(),
            students: [
              faker.internet.email(),
              faker.internet.email(),
            ],
          });
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([
          { tutor: '"tutor" must be a valid email' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });

      it('should fail if students are not in email format', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/register')
          .send({
            tutor: faker.internet.email(),
            students: ['not@email', 'email.com'],
          });
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([
          { 0: '"students[0]" must be a valid email' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe('Valid body', () => {
      beforeEach(() => {
        return truncate();
      });
      it('should pass for new tutor and students', async (done) => {
        /**
         * Register all new tutor and student emails without model instances
         */
        const { statusCode, body } = await request(app)
          .post('/api/register')
          .send({
            tutor: faker.internet.email(),
            students: [
              faker.internet.email(),
              faker.internet.email(),
              faker.internet.email(),
            ],
          });
        const { message } = body;

        expect(message).toEqual('Students Registered');
        expect(statusCode).toEqual(200);
        done();
      });

      it('should pass for existing tutor and new students', async (done) => {
        /**
         * Instantiate one new tutor
         */
        const tutor = await factories.create('Tutor', {
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        /**
         * Register new unassigned student emails with pre-existing tutor
         */
        const { statusCode, body } = await request(app)
          .post('/api/register')
          .send({
            tutor: tutor.email,
            students: [
              faker.internet.email(),
              faker.internet.email(),
              faker.internet.email(),
            ],
          });
        const { message } = body;

        expect(message).toEqual('Students Registered');
        expect(statusCode).toEqual(200);
        done();
      });

      it('should pass for new tutor and old students', async (done) => {
        /**
         * Instantiate three students
         */
        const students = await factories
          .createMany('Student', 3, [
            { email: faker.internet.email() },
            { email: faker.internet.email() },
            { email: faker.internet.email() },
          ])
          .then((results) => results.map((result) => result.email));
        /**
         * Instantiate a new tutor
         */
        const tutorEmail = faker.internet.email();
        await factories.create('Tutor', {
          email: tutorEmail,
          password: faker.internet.password(),
        });
        /**
         * Register existing students to new unregistered tutor
         */
        const { statusCode, body } = await request(app)
          .post('/api/register')
          .send({
            tutor: tutorEmail,
            students: students.map((student) => student),
          });
        const { message } = body;

        expect(message).toEqual('Students Registered');
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });

  describe('GetCommonStudents API', () => {
    beforeEach(() => {
      return truncate();
    });
    describe('Invalid query', () => {
      afterEach(() => {
        return truncate();
      });
      it('should fail without tutor ', async (done) => {
        const { statusCode, body } = await request(app)
          .get('/api/commonstudents?tutor=')
          .send();

        const { students } = body;

        /**
         * `students` in response body should be an empty array
         * as there are no students to an empty tutor
         */
        expect(students).toEqual([]);
        expect(statusCode).toEqual(200);
        done();
      });

      it('should fail if tutor is not an email ', async (done) => {
        const error = faker.random.word();
        const { statusCode, body } = await request(app)
          .get('/api/commonstudents' + `?tutor=${error}'`)
          .send();
        const { students } = body;

        /**
         * `students` in response body should be an empty array
         * as there are no students to a tutor that is not an email
         */
        expect(students).toEqual([]);
        expect(statusCode).toEqual(200);
        done();
      });
    });

    describe('Valid query', () => {
      afterEach(() => {
        return truncate();
      });
      it('should pass for single common tutor ', async (done) => {
        /**
         * Initialize an email for constant tutor
         */
        const constantTutorEmail = faker.internet.email();
        /**
         * Initialize emails for constant tutor's students
         */
        const constantStudent1 = faker.internet.email();
        const constantStudent2 = faker.internet.email();
        const constantStudent3 = faker.internet.email();

        /**
         * Instantiate a Tutor using above variables
         */
        await factories.create('Tutor', {
          email: constantTutorEmail,
          password: faker.internet.password(),
        });

        /**
         * Instantiate students using above variables
         */
        await factories.createMany('Student', 3, [
          {
            email: constantStudent1,
          },
          {
            email: constantStudent2,
          },
          {
            email: constantStudent3,
          },
        ]);

        /**
         * Create `constantTutor` to `constantStudent` associations
         * with the new records
         */
        await factories.createMany('TutorStudent', 3, [
          {
            tutor: constantTutorEmail,
            student: constantStudent1,
          },
          {
            tutor: constantTutorEmail,
            student: constantStudent2,
          },
          {
            tutor: constantTutorEmail,
            student: constantStudent3,
          },
        ]);

        const { statusCode, body } = await request(app)
          .get('/api/commonstudents' + `?tutor=${constantTutorEmail}`)
          .send();
        const { students } = body;

        /**
         * `students` in response body should be an array of `constantTutor`'s students
         */
        expect(students.sort()).toEqual([
          constantStudent1,
          constantStudent2,
          constantStudent3,
        ].sort());
        expect(statusCode).toEqual(200);
        done();
      });

      it('should pass for multiple common tutor', async (done) => {
        /**
         * Initialize an email for constant tutor
         */
        const constantTutorEmail = faker.internet.email();

        /**
         * Initialize an email for common tutor
         */
        const commonTutorEmail = faker.internet.email();

        /**
         * Initialize emails for constant tutor's students
         */
        const constantStudent1 = faker.internet.email();
        const constantStudent2 = faker.internet.email();
        const constantStudent3 = faker.internet.email();

        /**
         * Initialize emails for common tutor's students
         */
        const commonStudent1 = faker.internet.email();
        const commonStudent2 = faker.internet.email();
        const commonStudent3 = faker.internet.email();
        /**
         * Initialize emails for common tutor's and constant tutor's shared students
         */
        const sharedStudent1 = faker.internet.email();
        const sharedStudent2 = faker.internet.email();
        const sharedStudent3 = faker.internet.email();

        /**
         * Instantiate Constant Tutor and Common Tutor using above variables
         */

        await factories.createMany('Tutor', 2, [
          {
            email: constantTutorEmail,
            password: faker.internet.password(),
          },
          {
            email: commonTutorEmail,
            password: faker.internet.password(),
          },
        ]);
        /**
         * Instantiate all students with above variables
         */

        await factories.createMany('Student', 9, [
          {
            email: constantStudent1,
          },
          {
            email: constantStudent2,
          },
          {
            email: constantStudent3,
          },
          {
            email: commonStudent1,
          },
          {
            email: commonStudent2,
          },
          {
            email: commonStudent3,
          },
          {
            email: sharedStudent1,
          },
          {
            email: sharedStudent2,
          },
          {
            email: sharedStudent3,
          },
        ]);

        /**
         * Create `constantTutor` to `constantStudent` + `sharedStudent`,
         * `commonTutor` to `commonStudent` + `sharedStudent` associations
         */

        await factories.createMany('TutorStudent', 12, [
          {
            tutor: constantTutorEmail,
            student: constantStudent1,
          },
          {
            tutor: constantTutorEmail,
            student: constantStudent2,
          },
          {
            tutor: constantTutorEmail,
            student: constantStudent3,
          },
          {
            tutor: constantTutorEmail,
            student: sharedStudent1,
          },
          {
            tutor: constantTutorEmail,
            student: sharedStudent2,
          },
          {
            tutor: constantTutorEmail,
            student: sharedStudent3,
          },
          // common
          {
            tutor: commonTutorEmail,
            student: commonStudent1,
          },
          {
            tutor: commonTutorEmail,
            student: commonStudent2,
          },
          {
            tutor: commonTutorEmail,
            student: commonStudent3,
          },
          {
            tutor: commonTutorEmail,
            student: sharedStudent1,
          },
          {
            tutor: commonTutorEmail,
            student: sharedStudent2,
          },
          {
            tutor: commonTutorEmail,
            student: sharedStudent3,
          },
        ]);

        const { statusCode, body } = await request(app)
          .get(
            '/api/commonstudents' +
              `?tutor=${constantTutorEmail}` +
              `&tutor=${commonTutorEmail}`
          )
          .send();
        const { students } = body;

        /**
         * `students` in response body should be an array of `constantTutor` and
         * `commonTutor`'s shared students
         */
        expect(students.sort()).toEqual([
          sharedStudent1,
          sharedStudent2,
          sharedStudent3,
        ].sort());
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });

  describe('SuspendStudent API', () => {
    beforeEach(() => {
      return truncate();
    });
    describe('Invalid body', () => {
      afterEach(() => {
        return truncate();
      });
      it('should fail if student is empty', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/suspend')
          .send({});
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([
          { student: '"student" is required' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });

      it('should fail if student is not an email', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/suspend')
          .send({
            student: faker.random.word(),
          });
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([
          { student: '"student" must be a valid email' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });

      it('should fail for nonexistent student', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/suspend')
          .send({
            student: faker.internet.email(),
          });
        const { message } = body;

        expect(message).toEqual('An account could not be found');

        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe('Valid body', () => {
      it('should pass for existing student', async (done) => {
        /**
         * Initialize a random email
         */
        const email = faker.internet.email();
        /**
         * Instantiate one new student with it
         */
        const student = await factories.create('Student', {
          email: email,
          suspended: 0,
        });
        /**
         * Suspend the new existing student by email
         */
        const { statusCode, body } = await request(app)
          .post('/api/suspend')
          .send({
            student: student.email,
          });
        const { message } = body;

        expect(message).toEqual(
          `${email.split('@')[0]} has been suspended`
        );
        expect(statusCode).toEqual(200);
        done();
      });
    });
  });

  describe('ReceiveNotifications API', () => {
    beforeEach(() => {
      return truncate();
    });
    describe('Invalid body', () => {
      afterEach(() => {
        return truncate();
      });
      it('should fail if tutor is empty', async (done) => {
        const { statusCode, body } = await request(app)
          .post('/api/retrievenotifications')
          .send({
            notification: faker.hacker.phrase(),
          });
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([{ tutor: '"tutor" is required' }]);
        expect(statusCode).toEqual(400);
        done();
      });

      it('should fail if notification is empty', async (done) => {
        /**
         * Register existing students `constants<1-3>@students`
         * with existing new tutor
         */
        const { statusCode, body } = await request(app)
          .post('/api/retrievenotifications')
          .send({
            tutor: 'constant@tutor.com',
          });
        const { message, details } = body;

        expect(message).toEqual('Validation Failed');
        expect(details).toEqual([
          { notification: '"notification" is required' },
        ]);
        expect(statusCode).toEqual(400);
        done();
      });
    });

    describe('Valid body', () => {
      afterEach(() => {
        return truncate();
      });
      it('should fail if tutor doesnt exist', async (done) => {
        /**
         * Register random students emails to an unregistered tutor
         */
        const { statusCode, body } = await request(app)
          .post('/api/retrievenotifications')
          .send({
            tutor: faker.internet.email(),
            notification:
              faker.hacker.phrase() +
              faker.internet.email() +
              faker.hacker.phrase() +
              faker.internet.email(),
          });
        const { message } = body;

        expect(message).toEqual('An account could not be found');
        expect(statusCode).toEqual(400);
        done();
      });

      it('should pass and retrieve students that belongs to the tutor', async (done) => {
        /**
         * Instantiate a new tutor
         */
        const tutor = await factories.create('Tutor', {
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        /**
         * Initialize three new emails
         */
        const student1 = faker.internet.email();
        const student2 = faker.internet.email();
        const student3 = faker.internet.email();
        /**
         * Instantiate new students with those emails
         */
        await factories.createMany('Student', 3, [
          { email: student1 },
          { email: student2 },
          { email: student3 },
        ]);
        /**
         * Associate those new students to the tutor
         */
        await factories.createMany('TutorStudent', 3, [
          { student: student1, tutor: tutor.email },
          { student: student2, tutor: tutor.email },
          { student: student3, tutor: tutor.email },
        ]);
        /**
         * Issue a notification from the tutor
         * with no mentioned students
         */
        const { statusCode, body } = await request(app)
          .post('/api/retrievenotifications')
          .send({
            tutor: tutor.email,
            notification: faker.hacker.phrase(),
          });
        const { message } = body;

        expect(message).toEqual('Notification posted');
        expect(statusCode).toEqual(200);
        done();
      });

      it('should pass and retrieve students that belongs to the tutor and mentioned students', async (done) => {
        /**
         * Instantiate a new tutor
         */
        const tutor = await factories.create('Tutor', {
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        /**
         * Initialize three new emails to assign to tutor
         */
        const student1 = faker.internet.email();
        const student2 = faker.internet.email();
        const student3 = faker.internet.email();
        /**
         * Initialize three new emails to be unassignged but mentioned
         */
        const mentioned1 = faker.internet.email();
        const mentioned2 = faker.internet.email();
        const mentioned3 = faker.internet.email();
        /**
         * Instantiate new students with those emails
         */
        await factories.createMany('Student', 6, [
          { email: student1 },
          { email: student2 },
          { email: student3 },
          { email: mentioned1 },
          { email: mentioned2 },
          { email: mentioned3 },
        ]);
        /**
         * Associate only three of the students to the tutor
         */
        await factories.createMany('TutorStudent', 3, [
          { student: student1, tutor: tutor.email },
          { student: student2, tutor: tutor.email },
          { student: student3, tutor: tutor.email },
        ]);
        /**
         * Issue a notification from `tutor` that doesn't mention
         * `students` belonging to `tutor` and  includes
         * students `mentioned` in the body of the notification
         */
        const { statusCode, body } = await request(app)
          .post('/api/retrievenotifications')
          .send({
            tutor: tutor.email,
            notification:
              mentioned1 +
              ' ' +
              faker.random.word() +
              ' ' +
              'constant1@student.com' +
              ' ' +
              faker.random.word() +
              ' ' +
              mentioned2 +
              ' ' +
              'constant2@student.com' +
              ' ' +
              faker.random.word() +
              ' ' +
              mentioned3 +
              faker.random.word(),
          });
        const { message } = body;

        expect(message).toEqual('Notification posted');

        expect(statusCode).toEqual(200);
        done();
      });

      it('should pass and retrieve students that are not suspended only', async (done) => {
        /**
         * Instantiate a new tutor
         */
        const tutor = await factories.create('Tutor', {
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
        /**
         * Initialize three new emails to assign to tutor
         */
        const student1 = faker.internet.email();
        const student2 = faker.internet.email();
        const student3 = faker.internet.email();
        /**
         * Initialize three new emails to be unassignged
         */
        const mentioned1 = faker.internet.email();
        const mentioned2 = faker.internet.email();
        const mentioned3 = faker.internet.email();
        /**
         * Instantiate all new students with those emails
         * Suspend two students belonging students and two mentioned students
         */
        await factories.createMany('Student', 6, [
          { email: student1, suspended: true },
          { email: student2, suspended: true },
          { email: student3 },
          { email: mentioned1, suspended: true },
          { email: mentioned2, suspended: true },
          { email: mentioned3 },
        ]);
        /**
         * Associate all of the students to the tutor
         */
        await factories.createMany('TutorStudent', 3, [
          { student: student1, tutor: tutor.email },
          { student: student2, tutor: tutor.email },
          { student: student3, tutor: tutor.email },
          { student: mentioned1, tutor: tutor.email },
          { student: mentioned2, tutor: tutor.email },
          { student: mentioned3, tutor: tutor.email },
        ]);

        /**
         * Issue a notification from the tutor that includes
         * and mention all students
         */

        const { statusCode, body } = await request(app)
          .post('/api/retrievenotifications')
          .send({
            tutor: tutor.email,
            notification:
              student1 +
              ' ' +
              faker.random.word() +
              ' ' +
              student2 +
              ' ' +
              faker.random.word() +
              ' ' +
              student3 +
              ' ' +
              mentioned1 +
              ' ' +
              faker.random.word() +
              ' ' +
              mentioned2 +
              ' ' +
              faker.random.word() +
              ' ' +
              mentioned3,
          });
        const { message } = body;

        expect(message).toEqual('Notification posted');

        expect(statusCode).toEqual(200);
        done();
      });
    });
  });
});
