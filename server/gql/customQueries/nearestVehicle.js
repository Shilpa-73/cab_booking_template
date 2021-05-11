import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLFloat
} from 'graphql';
import db from '@database/models';

 const vehicleResponse = new GraphQLObjectType({
    name: 'vehicleResponse',
    fields: () => ({
        id:{
            type: GraphQLNonNull(GraphQLInt)
        },
        vehicle_number:{
            type: GraphQLNonNull(GraphQLString)
        },
        category:{
            type: GraphQLNonNull(GraphQLString)
        },
        sub_category:{
            type: GraphQLString
        },
        disdiff:{
            type: GraphQLNonNull(GraphQLFloat)
        },
    })
});

//This is response fields of the nearest vehicle queries
export const nearestVehicleFields = {
    flag:{
        type: GraphQLNonNull(GraphQLBoolean),
        description    : 'This field state that the customer signup is done perfectly or not!'
    },

    data: {
        type : GraphQLList(vehicleResponse)
    }
};

//This is a query argument that will passed from the graphiql/front-end
export const nearestVehicleArgs = {
    lat:{
        type: GraphQLNonNull(GraphQLFloat),
        description: 'first name of the customer!'
    },
    long:{
        type: GraphQLNonNull(GraphQLFloat),
        description: 'Last name of customer!'
    }
};

export const nearestVehicleResponse = new GraphQLObjectType({
    name: 'nearestVehicleResponse',
    fields: () => ({
        ...nearestVehicleFields
    })
});

export const nearestVehicleQueries = {
    type: nearestVehicleResponse,
    args: {
        ...nearestVehicleArgs
    },
    async resolve(source, { lat, long }, context, info) {
        try {
            let { sequelize } = db
            const { QueryTypes } = sequelize

            let distanceQuery = `
               (
                               select *
                               from distance(
                                       ${lat}, ${long},
                                       addr.lat, addr.long
                                   )
                           )       as disDiff
            `
            let sqlQuery = `
                with distanceDiff as (
                    select vh.*,
                           vc.name as category,
                           vs.name as sub_category,
                           ${distanceQuery}
                    from address addr
                    inner join vehicles vh on vh.id = addr.item_id
                    inner join vehicle_categories vc on vc.id = vh.vehicle_category_id
                    inner join vehicle_sub_categories vs on vs.id = vh.vehicle_sub_category_id
                    where addr.type = 'VEHICLE'
                    order by disDiff ASC
                    limit 5
                    )
                select *
                from distanceDiff;
            `

            let allNearestVehicles = await sequelize.query(
                sqlQuery, { type: QueryTypes.SELECT }
            );

            return {
                flag:true,
                data:allNearestVehicles
            }
        } catch (e) {
            throw Error(`Internal Error: ${e}`);
        }
    },
    description: 'To get nearest devices available for customer'
};