import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import eventModel from './models/event';
import { EventInput } from './interfaces/IEventInput';
import { Event } from './interfaces/IEvent';

const APP: Express = express();

APP.use(bodyParser.json());

const events: Event[] = [];

const url = "mongodb://localhost:27017/eventsDb"; // Combine URL and DB name



mongoose.connect(url)
    .then(() => {
        console.log('Mongoose Connected successfully');

        // Move the route definitions inside the then block
        APP.use("/graphql", graphqlHTTP({
            schema: buildSchema(`
                type Event {
                    _id: ID!
                    title: String!
                    description: String!
                    price: Float!
                    date: String!
                }

                input EventInput {
                    title: String!
                    description: String!
                    price: Float!
                    date: String!
                }

                type RootQuery {
                    events: [Event!]!
                }

                type RootMutation {
                    createEvent(eventInput: EventInput): Event
                }

                schema {
                    query: RootQuery,
                    mutation: RootMutation,
                }
            `),
            rootValue: {
                events: () => {
                    return events;
                },
                createEvent: async (args: { eventInput: EventInput }) => {
                    const event = new eventModel({
                        title: args.eventInput.title,
                        description: args.eventInput.description,
                        price: +args.eventInput.price,
                        date: new Date(args.eventInput.date)
                    });
                    try {
                        const result = await event.save();
                        console.log(result);
                        return result;
                    } catch (err) {
                        console.log(err);
                        throw err;
                    }
                }
            },
            graphiql: true
        }));

        APP.get("/", (request: Request, response: Response, next: NextFunction) => {
            response.status(200).send("Hello world");
        });
    })
    .catch((err) => {
        console.error('Erreur de connexion à MongoDB', err);
    });

export default APP;
