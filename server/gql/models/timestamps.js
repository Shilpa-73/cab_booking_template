import { GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import moment from 'moment';

export const timestamps = {
  createdAt: {
    sqlColumn: 'created_at',
    type: GraphQLDateTime,
    resolve(obj) {
      console.log(`obj.createdAt is`, obj);
      return moment(obj.createdAt).format();
    }
  },
  updatedAt: { sqlColumn: 'updated_at', type: GraphQLDateTime },
  deletedAt: { sqlColumn: 'deleted_at', type: GraphQLDateTime }
};

export const times = {
  startTime: {
    sqlColumn: 'start_time',
    type: GraphQLTime,
    resolve(obj) {
      console.log(`data startDate`, obj);
      return moment(obj.startTime, 'HH:mm:ss').utc();
    }
  },
  endTime: {
    sqlColumn: 'end_time',
    type: GraphQLTime,
    resolve(obj) {
      return moment(obj.startTime, 'HH:mm:ss').utc();
    }
  }
};
