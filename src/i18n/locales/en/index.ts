import common from "./common";
import home from "./home";
import search from "./search";
import singerDetails from "./singerDetails";
import bookings from "./bookings";
import payments from "./payments";
import auth from "./auth";
import contact from "./contact";

const en = {
  ...common,
  ...home,
  ...search,
  ...singerDetails,
  ...bookings,
  ...payments,
  ...auth,
  ...contact,
} as const;

export default en;
