import { convertDbResponseToRawResponse } from '../database/dbUtils';
import db from '@database/models';

// Return customer/driver passport detail by their id
export const getPassportById = async (id) =>
  convertDbResponseToRawResponse(
    await db.passport.findOne({
      where: {
        id
      }
    })
  );

// find single customer/driver detail by their id
export const getPassportByWhere = async (where) =>
  convertDbResponseToRawResponse(
    await db.passport.findOne({
      where
    })
  );
