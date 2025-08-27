import { ObjectId } from "mongodb";

export interface Destination {
  _id?: ObjectId;
  name: string;
  description: string;
  image: string;
  companyName: string;
  date: string;
  time: string;
  availableSeats: number;
  postedBy: ObjectId;
}
