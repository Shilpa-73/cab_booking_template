import { GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import moment from 'moment';

export const timestamps = {
  createdAt: {
    sqlColumn: 'created_at',
    type: GraphQLDateTime,
    resolve(obj) {
      return moment(obj.createdAt).utc().toDate();
    }
  },
  updatedAt: {
    sqlColumn: 'updated_at',
    type: GraphQLDateTime,
    resolve(obj) {
      return obj.updatedAt ? moment(obj.updatedAt).utc().toDate() : null;
    }
  },
  deletedAt: {
    sqlColumn: 'deleted_at',
    type: GraphQLDateTime,
    resolve(obj) {
      return obj.deletedAt ? moment(obj.deletedAt).utc().toDate() : null;
    }
  }
};

export const times = {
  startTime: {
    sqlColumn: 'start_time',
    type: GraphQLTime,
    resolve(obj) {
      console.log(`data startDate`, obj);
      return obj.startTime ? moment(obj.startTime, 'HH:mm:ss').utc().toDate() : null;
    }
  },
  endTime: {
    sqlColumn: 'end_time',
    type: GraphQLTime,
    resolve(obj) {
      return obj.endTime ? moment(obj.endTime, 'HH:mm:ss').utc().toDate() : null;
    }
  }
};
