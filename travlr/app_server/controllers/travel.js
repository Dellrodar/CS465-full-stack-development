const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
};

const renderTravelPage = (res, json, emptyMessage) => {
  let message = null;
  let trips = json;
  if (!(trips instanceof Array)) {
    message = 'API lookup error';
    trips = [];
  } else if (!trips.length) {
    message = emptyMessage;
  }
  res.render('travel', { title: 'Travlr Getaways', trips, message });
};

/* GET Travel view */
const travel = async (req, res) => {
  try {
    const response = await fetch(tripsEndpoint, options);
    const json = await response.json();
    renderTravelPage(res, json, 'No trips exist in our database');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

/* GET Travel details view */
const travelDetails = async (req, res) => {
  const code = req.params.tripCode;
  try {
    const response = await fetch(`${tripsEndpoint}/${encodeURIComponent(code)}`, options);
    const json = await response.json();
    renderTravelPage(res, json, `No trip found with code ${code}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export {
  travel,
  travelDetails,
};
