const express = require("express");
const router = express.Router();
const Request = require("../../models/Request");
const passport = require("passport");
const validateRequestInput = require("../../validation/request");

router.get("/", (req, res) => {
  Request.find({})
    //.populate('requestFavors.from').exec()
    .then((requests) => res.status(200).json(requests))
    .catch((err) =>
      res
        .status(400)
        .json({ user: "Error fetching requests of logged in user!" })
    );
});

//test insert request //////////////////////////////////////
router.post("/test/insert", (req, res) => {
  const requestContent = req.body.requestContent;
  const requestFavors = req.body.requestFavors;
  const resolverID = req.body.resolverID;
  const proof = req.body.proof;
  /////////////////////////////////////////////////////////////

  console.log(req);

  const newReq = new Request({
    requestContent: requestContent,
    requestFavors: requestFavors,
    resolverID: resolverID,
    resolverProof: proof,
  });

  newReq.save();
  res.send(newReq);
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

    console.log(req.body.requestFavors);

    res.status(200).send(req.body);

    // newReq
    //   .save()
    //   .then((doc) => res.status(200).send(doc))
    //   .catch((err) =>
    //     console.log({ error: "Error creating new request! " + err })
    //   );
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
  (req, res) => {
    const user = req.user.user_name;
    Request.findOneAndDelete({ user, _id: req.params.id })
      .then((doc) => res.status(200).json(doc))
      .catch((err) =>
        res.status(400).json({ delete: "Error deleting a request" })
      );
  }
);

module.exports = router;
