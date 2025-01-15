/**
 * Endpoint: `POST /api/suspend`
 * Class definition of `POST` instance that toggles a student's suspended status
 * @see api.controller.suspendStudent
 * @see api.validator.suspendStudent
 * @file defines SuspendStudent
 */

import * as db from '../models/index';

class SuspendStudent {
  constructor(validatedArgs) {
    this.student = validatedArgs.student;
  }

  async call() {
    /**
     * Identify the student from the database
     */
    const student = await db.Student.findOne({
      where: { email: this.student },
    });
    /**
     * Return an error if the student doesn't exist
     */
    if (!student) {
      return {
        message: 'An account could not be found',
        code: 400,
      };
    }
    /**
     * If the student is not suspended...
     */
    if (student.suspended === false) {
      /**
       * Update the record to suspend the student
       */
      await db.Student.update(
        {
          suspended: true,
        },
        {
          where: {
            email: this.student,
          },
        }
      );
      await db.Student.sync();
      /**
       * Return correspondence to api/frontend
       */
      return {
        student: student.email,
        message: `${student.email.split('@')[0]} has been suspended`,
        code: 200,
      };
    } else {
      /**
       * Otherwise, lift the student's suspension
       */
      await db.Student.update(
        {
          suspended: false,
        },
        {
          where: {
            email: this.student,
          },
        }
      );
      await db.Student.sync();
      /**
       * Return appropriate correspondence to api/frontend
       */
      return {
        student: student.email,
        message: `${
          student.email.split('@')[0]
        }'s suspension has been lifted`,
        code: 200,
      };
    }
  }
}

module.exports = SuspendStudent;
