const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const Request = require('../../models/Request');
const passport = require('passport');
const validateRequestInput = require('../../validation/request');

router.get('/', (req, res) => {
    Request.find({ user: req.user.userName })
      .then((requests) => res.status(200).json(requests))
      .catch((err) =>
        res.status(400).json({ user: 'Error fetching requests of logged in user!' })
      );
  }
);
=======
const Request = require("../../models/Request");
const passport = require("passport");
const validateRequestInput = require("../../validation/request");
const User = require("../../models/User");
const Favor = require("../../models/Favor");
>>>>>>> 85980b0098e38692fdc029bf43a283dce32acf31

router.get("/", (req, res) => {
  Request.find({ resolverID: null })
    .populate({ path: "requestFavors.from", select: "userName" })
    .populate({ path: "requestFavors.rewards.id", select: "prize" })
    .exec()
    .then((requests) => {
      res.status(200).send(requests);
    })
    .catch((err) => res.status(400).send(err));
});

// router.get("/request/:id", (req, res) => {
//   Request.find({ _id: req.params.id })
//     .then((request) => res.status(200).json(request))
//     .catch((err) =>
//       res.status(400).json({ id: "Error fetching request by id!" })
//     );
// });

// router.get("/user/:user", (req, res) => {
//   Request.find({ user: req.params.user })
//     .then((requests) => res.status(200).json(requests))
//     .catch((err) =>
//       res
//         .status(400)
//         .json({ user: "Error fetching requests of specific user!" })
//     );
// });

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
<<<<<<< HEAD
    const user = req.user.userID;
    const request = req.body;
    const { errors, isValid } = validateRequestInput(request);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    request.user = user;
    const newRequest = new Request(request);
=======
    const requestContent = req.body.requestContent;
    const requestFavors = req.body.requestFavors;
    const resolverID = req.body.resolverID;
    const resolverProof = req.body.resolverProof;

    newRequest = Request({
      requestContent,
      requestFavors: [
        {
          from: requestFavors[0].from,
          rewards: [...requestFavors[0].rewards],
        },
      ],
      resolverID,
      resolverProof,
    });

>>>>>>> 85980b0098e38692fdc029bf43a283dce32acf31
    newRequest
      .save()
      .then((doc) => res.send(doc))
      .catch((err) => res.send(err));
  }
);

router.patch(
<<<<<<< HEAD
  '/update/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user.userName;
    const { errors, isValid } = validateRequestInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { title, body } = req.body;
    Request.findOneAndUpdate(
      { user, _id: req.params.id },
      { $set: { title, body } },
      { new: true }
    )
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(400).json({ update: 'Error updating existing request' })
=======
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userID = req.user._id;
    let request = undefined;

    request = await Request.findOne({ _id: req.params.id });

    const requestFavors = [
      ...request.requestFavors,
      { from: userID, rewards: [...req.body.rewards] },
    ];

    try {
      const result = await Request.findOneAndUpdate(
        { _id: req.params.id },
        { requestFavors: requestFavors }
>>>>>>> 85980b0098e38692fdc029bf43a283dce32acf31
      );

      res.status(200).send(result);
    } catch (err) {
      res.send(err);
    }
  }
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userID = req.user._id;
    let request = undefined;

    request = await Request.findOne({ _id: req.params.id });

    function findFavorIdx(userID, listFavor) {
      let result = -1;
      listFavor.forEach((favor, index) => {
        if (userID.toString() === favor.from.toString()) {
          result = index;
        }
      });

      return result;
    }

    const deleteIndex = findFavorIdx(req.user._id, request.requestFavors);

    favorList = [...request.requestFavors];
    favorList.splice(deleteIndex, 1);

    request.requestFavors = favorList;

    if (request.requestFavors.length == 0) {
      try {
        await Request.findOneAndDelete({ _id: req.params.id });
      } catch (err) {
        res.status(400).send(err);
      }
      res.status(200).send("Delete Request");
    } else {
      newReq = Request(request);

      try {
        const doc = await newReq.save();
        res.send(doc);
      } catch (err) {
        res.send(err);
      }
    }
  }
);

router.patch(
  "/resolve/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
<<<<<<< HEAD
    const user = req.user.userName;
    Request.findOneAndDelete({ user, _id: req.params.id })
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(400).json({ delete: 'Error deleting a request' })
      );
=======
    let favors;
    imageURL = req.body.img;
    userID = req.user._id;

    Request.findOneAndUpdate(
      { _id: req.params.id },
      { resolverID: userID, resolverProof: imageURL }
    )
      .then(async (doc) => {
        favors = doc.requestFavors;
        favors.forEach((favor) => {
          const params = {
            ownerID: userID,
            debtorID: favor.from,
            items: [...favor.rewards],
            createdImage: imageURL,
          };

          const newFavor = new Favor(params);
          newFavor.save().catch((err) => res.status(400).json("Error: " + err));
        });

        User.findOneAndUpdate(
          { _id: userID },
          { $inc: { completedRequest: 1 } }
        ).catch((err) => res.send(err));

        res.send(doc);
      })
      .catch((err) => res.send(err));
>>>>>>> 85980b0098e38692fdc029bf43a283dce32acf31
  }
);

module.exports = router;
