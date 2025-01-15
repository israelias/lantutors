'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'TutorStudents',
      [
        {
          tutor: 'john@john.com',
          student: 'elias@elias.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'john@john.com',
          student: 'noah@noah.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'john@john.com',
          student: 'kate@kate.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'john@john.com',
          student: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'henry@henry.com',
          student: 'elias@elias.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'henry@henry.com',
          student: 'noah@noah.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'henry@henry.com',
          student: 'kate@kate.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'henry@henry.com',
          student: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'isabel@isabel.com',
          student: 'noah@noah.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'isabel@isabel.com',
          student: 'kate@kate.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'isabel@isabel.com',
          student: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'mary@mary.com',
          student: 'noah@noah.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'mary@mary.com',
          student: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'alfred@alfred.com',
          student: 'kate@kate.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'alfred@alfred.com',
          student: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('TutorStudents', null, {});
  },
};
