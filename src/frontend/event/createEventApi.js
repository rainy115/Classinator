import EventApi from "./EventApi"; // set up the repository service, and API
import EventService from "./EventService";
import MongoEventRepository from "./MongoEventRepository";

export default function createEventApi() {
  const repository = new MongoEventRepository();
  const service = new EventService(repository);
  return new EventApi(service);
}
