import { ObjectId } from "mongodb";

export interface Booking {
  _id?: ObjectId;
  destinationId: ObjectId;
  userId: ObjectId;
  name: string;
  email: string;
  seats: number;
  details: string;
}
