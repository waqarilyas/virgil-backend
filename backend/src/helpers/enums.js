const FRIEND_STATUS = {
  friend: "FRIEND",
  anon: "ANONYMOUS",
  requested: "REQUESTED",
  currentUser: "CURRENT_USER",
};

const ENVIRONMENTS = {
  staging: "STAGING",
  production: "PRODUCTION",
};

const ROUTE_FILTERS = {
  NEAR_ME: "nearMe",
  MOST_RIDDEN: "mostRidden",
  LEAST_RIDDEN: "leastRidden",
  SHORTEST_PATH: "shortestPath",
  LONGEST_PATH: "longestPath",
  TOP_RATED: "topRated",
  LEAST_RATED: "leastRidden",
  MOST_STOPS: "mostStops",
  LEAST_STOPS: "leastStops",
};

const NOTIFICATION_TYPES = {
  FRIEND_REQUEST: "friendRequest",
  RIDE_REQUEST: "rideRequest",
};

module.exports = {
  FRIEND_STATUS,
  ENVIRONMENTS,
  ROUTE_FILTERS,
  NOTIFICATION_TYPES,
};
