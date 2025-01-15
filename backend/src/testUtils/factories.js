var factory = require('factory-girl');
const adapter = new factory.SequelizeAdapter();
factory = factory.factory;
factory.setAdapter(adapter);

const faker = require('faker');

import * as db from '../models/index';

factory.define('Tutor', db.Tutor, {
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Student', db.Student, {
  email: faker.internet.email(),
  suspended: faker.datatype.boolean(),
});

factory.define('TutorStudent', db.TutorStudent, {
  tutor: factory.assoc('Tutor', 'email'),
  student: factory.assoc('Student', 'email'),
  active: faker.datatype.boolean(),
});

factory.define('StudentNotification', db.StudentNotification, {
  tutor: factory.assoc('Tutor', 'email'),
  student: factory.assoc('Student', 'email'),
  title: faker.lorem.words(3),
  message: faker.hacker.phrase() + faker.internet.email() + faker.hacker.phrase() + faker.internet.email(),
});

module.exports = factory;
