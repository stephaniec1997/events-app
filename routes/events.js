const router = require('express').Router();
let Event = require('../models/event.model');

router.route('/').get((req, res) => {
  Event.find()
    .then(events => res.json(events))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Event.findById(req.params.id)
    .then(event => res.json(event))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) =>{
  const name = req.body.name;
  const startDate = Date.parse(req.body.startDate);
  const endDate = Date.parse(req.body.endDate);
  const place = req.body.place;
  const description = req.body.description;

  const newEvent = new Event({
    name,
    startDate,
    endDate,
    place,
    description,
  });

  newEvent.save()
    .then((response) => res.json(response))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json('Event Deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Event.findById(req.params.id)
    .then(event => {
      event.name = req.body.name;
      event.startDate = Date.parse(req.body.startDate);
      event.endDate = Date.parse(req.body.endDate);
      event.place = req.body.place;
      event.description = req.body.description;

      event.save()
        .then(() => res.json('Event updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
