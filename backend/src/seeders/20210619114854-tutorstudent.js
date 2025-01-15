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
          studentName: 'elias@elias.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'henry@henry.com',
          studentName: 'noah@noah.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'henry@henry.com',
          studentName: 'kate@kate.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'henry@henry.com',
          studentName: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'isabel@isabel.com',
          studentName: 'noah@noah.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'isabel@isabel.com',
          studentName: 'kate@kate.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'isabel@isabel.com',
          studentName: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'mary@mary.com',
          studentName: 'noah@noah.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'mary@mary.com',
          studentName: 'chris@chris.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'alfred@alfred.com',
          studentName: 'kate@kate.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          tutor: 'alfred@alfred.com',
          studentName: 'chris@chris.com',
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
