import {GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLFloat} from 'graphql';
import {bookCabs, checkCabAvailability, getCabById} from "../../daos/cabs";

//This is response fields of the query
export const cabBookingFields = {
    flag: {
        type: GraphQLNonNull(GraphQLBoolean),
        description: 'The flag state the boolean value identify the booking is successful or not!'
    },
    message: {
        type: GraphQLNonNull(GraphQLString),
        description: 'The text message will show up on front-end!'
    }
};

//This is a query argument that will passed from the graphiql/front-end
export const cabBookingArgs = {
    pickupAddress: {
        type: GraphQLNonNull(GraphQLString),
        description: 'pickup address of the customer!'
    },
    destinationAddress: {
        type: GraphQLNonNull(GraphQLString),
        description: 'destination address of the customer!'
    },
    pickupLat:{
        type: GraphQLNonNull(GraphQLFloat),
        description: 'latitude of pickup address'
    },
    pickupLong:{
        type: GraphQLNonNull(GraphQLFloat),
        description: 'longitude of pickup address'
    },
    destinationLat:{
        type: GraphQLNonNull(GraphQLFloat),
        description: 'latitude of destination address'
    },
    destinationLong:{
        type: GraphQLNonNull(GraphQLFloat),
        description: 'longitude of destination address'
    },
    vehicleId:{
        type: GraphQLNonNull(GraphQLInt),
        description: 'id of cab that customer wants to book!'
    },
};

export const cabBookingResponse = new GraphQLObjectType({
    name: 'cabBookingResponse',
    fields: () => ({
        ...cabBookingFields
    })
});

export const cabBookingMutation = {
    type: cabBookingResponse,
    args: {
        ...cabBookingArgs
    },
    async resolve(source, {
        pickupLat, pickupLong, destinationLat, destinationLong, pickupAddress,destinationAddress, vehicleId
    }, context, info) {
        try {
            //Check the cab that is customer is requesting is available or not!
            let cabAvailable = await checkCabAvailability(vehicleId)
            if(!cabAvailable)
                throw new Error(`The requested cab is not available for booking!`)

            //Do other stuff for booking once the cab is available
            //Get cab details
            let cabDetails = await getCabById(vehicleId)

            //Do entry in the booking table for booking request!
            let response = await bookCabs({
                pickupLat,
                pickupLong,
                destinationLat,
                destinationLong,
                pickupAddress,
                destinationAddress,
                vehicleId,
                amount:cabDetails.amount, //Because it happens sometime that cab amount will
                // change in future so we could fetch the exact amount of booking time
                customerId:51 //Todo to remove later and use user.id from the context! after auth middleware implementation
            })

            return {
                flag:true,
                message:`Your booking has been requested!,
                 Please wait util confirmation`,
            };
        } catch (e) {
            throw Error(`Internal Error: ${e}`);
        }
    },
    description: 'Cab booking mutation for customer!'
};