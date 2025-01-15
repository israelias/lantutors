/**
 * Endpoint: `POST /api/register`
 * Class definition of `POST` instance that allows a tutor to register students
 * @see api.controller.registerStudents
 * @see api.validator.registerStudents
 * @file defines RegisterStudents
 */

import * as db from '../models/index';

const { QueryTypes } = require('sequelize');
import { getCommonStudentsByTutors } from '../helpers/index';

class GetCommonStudents {
  constructor(validatedArgs) {
    this.tutor = validatedArgs.tutor;
  }

  async call(req, res) {
    /**
     * Check if there's a query in the url
     */
    if (!this.tutor) {
      return {
        message: 'Validation Failed',
        code: 400,
      };
    }
    const query = req.query.tutor;
    /**
     * If there is...
     */
    if (query) {
      /**
       * If there is only one...
       */
      let where = [];
      /**
       * Append it to a `where` array
       */
      if (typeof query === 'string' && query !== '') {
        where.push(query);
      }
      /**
       * If there are several, add the items to the `where` array
       */
      if (typeof query === 'object' && query.length > 0) {
        where.push(...query);
      }
      /**
       * Raw query the database to select and join ONLY the students
       * that have a TutorStudent record with ALL the tutors in `where`
       */
      const students = await getCommonStudentsByTutors(where);
      /**
       * Return a JSON api response in the spec'd format
       */
      return {
        students: students.map((student) => student.email),
        message: 'Common Students returned',
        code: 200,
      };
      /**
       * Else there are otherwise no queries in the url
       */
    } else {
      /**
       * Raw query the database to select ALL students by email
       */
      const students = await db.sequelize
        .query(
          `
        SELECT s.email from Students s
      `,
          {
            raw: true,
            type: QueryTypes.SELECT,
          }
        )
        .then((results) => results);
      /**
       * Return a JSON api response in the spec'd format
       */
      return {
        students: students.map((student) => student.email),
        message: 'Common Students returned',
        code: 200,
      };
    }
  }
}

module.exports = GetCommonStudents;
