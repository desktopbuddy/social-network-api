const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-__v');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate (
          {
            path: 'friends',
            select: '-__v'
          }
        )
        .populate (
          {
            path: 'thoughts',
            select: '-__v'
          }
        );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(
        {
          username: req.body.username,
          email: req.body.email
        }
      );
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update user
  async updateUser(req,res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete user
  async deleteUser(req,res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      // TODO: Delete user's associated thoughts
      Thought.deleteMany({ username: user.username });

      res.json({ message: "User and their thoughts have been deleted." });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // TODO: update and remove friend /api/users/:userId/friends/:friendId
};
