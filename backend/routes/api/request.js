const express = require("express");
const router = express.Router();
const Request = require("../../models/Request");
const passport = require("passport");
const validateRequestInput = require("../../validation/request");

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

router.get("/request/:id", (req, res) => {
  Request.find({ _id: req.params.id })
    .then((request) => res.status(200).json(request))
    .catch((err) =>
      res.status(400).json({ id: "Error fetching request by id!" })
    );
});

router.get("/user/:user", (req, res) => {
  Request.find({ user: req.params.user })
    .then((requests) => res.status(200).json(requests))
    .catch((err) =>
      res
        .status(400)
        .json({ user: "Error fetching requests of specific user!" })
    );
});

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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

    newRequest
      .save()
      .then((doc) => res.send(doc))
      .catch((err) => res.send(err));
  }
);

router.patch(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = req.user.user_name;
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
        res.status(400).json({ update: "Error updating existing request" })
      );
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

module.exports = router;
