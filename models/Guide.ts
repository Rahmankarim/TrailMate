import { ObjectId } from "mongodb";

export interface Guide {
  _id?: ObjectId;
  userId: ObjectId;
  places: string[];
  availableDates: string[];
}
