import { GraphQLNonNull, GraphQLInt, GraphQLObjectType } from 'graphql';
import { camelCase, isArray, isObject } from 'lodash';
import { Op } from 'sequelize';
import deepMapKeys from 'deep-map-keys';
import mapKeysDeep from 'map-keys-deep';

export const updateUsingId = async (model, args) => {
  let affectedRows;
  try {
    [affectedRows] = await model.update(args, {
      where: {
        id: args.id,
        deletedAt: null
      }
    });
  } catch (e) {
    console.log(`e update error`, e.message);
    throw new Error(`Failed to update ${model.name}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return model.findOne({ where: { id: args.id } });
};

export const upsertUsingCriteria = async (model, args, criteria) => {
  let affectedRows;
  try {
    [affectedRows] = await model.update(args, {
      where: {
        ...criteria,
        deletedAt: null
      }
    });
  } catch (e) {
    throw new Error(`Failed to update ${model.name}`);
  }
  if (!affectedRows) {
    // create a new record
    await model.create({ ...args }).then((d) => d.toJSON());
  }
  return model.findOne({ where: criteria });
};

export const deleteUsingId = async (model, args) => {
  let affectedRows;
  try {
    affectedRows = await model.destroy({ where: { id: args.id, deletedAt: null } });
  } catch (e) {
    throw new Error(`Failed to delete ${model.name}`);
  }
  if (!affectedRows) {
    throw new Error('Data not found');
  }
  return args;
};

export const deletedId = new GraphQLObjectType({
  name: 'Id',
  fields: () => ({ id: { type: GraphQLNonNull(GraphQLInt) } })
});

export const findOneById = async (model, id) => {
  try {
    const data = await model.findOne({ where: { id }, raw: true });
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const findOneByCriteria = async (model, args) => {
  try {
    const data = await model.findOne({ where: { ...args }, raw: true });
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const insertRecord = async (model, args, returning = true) => {
  try {
    const data = await model.create({ ...args }).then((d) => d.toJSON());
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const sequelizedWhere = (currentWhere = {}, where = {}) => {
  where = deepMapKeys(where, (k) => {
    if (Op[k]) {
      return Op[k];
    }
    return k;
  });
  return { ...currentWhere, ...where };
};

export const removeDBReferenceKeyFromResponse = (dbResponse) => {
  let convertedObject = {};
  for (const [key, value] of Object.entries(dbResponse)) {
    if (typeof value === 'object' && isObject(value)) {
      convertedObject = Object.assign({}, convertedObject, removeDBReferenceKeyFromResponse(value));
    } else {
      const allKeys = key.split('.');
      convertedObject[allKeys[allKeys.length - 1]] = value;
    }
  }
  return convertedObject;
};

export const convertDbResponseToRawResponse = (dbResponse) => {
  if (dbResponse) {
    return removeDBReferenceKeyFromResponse(
      dbResponse.get({
        plain: true,
        raw: true
      })
    );
  }
  return null;
};
export const transformDbArrayResponseToRawResponse = (arr) => {
  if (!isArray(arr)) {
    throw new Error('The required type should be an object(array)');
  } else {
    return arr.map((resource) => mapKeysDeep(convertDbResponseToRawResponse(resource), (keys) => camelCase(keys)));
  }
};

export const mapKeysToCamelCase = (arr) =>
  arr.map((resource) => mapKeysDeep(removeDBReferenceKeyFromResponse(resource), (keys) => camelCase(keys)));
