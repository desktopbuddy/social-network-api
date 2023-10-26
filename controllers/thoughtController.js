const { Thought, User } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select('-__v');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err)
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(
        {
          thoughtText: req.body.thoughtText,
          username: req.body.username
        }
      );
      //push new thought to associated user
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Thought created, but found no user with that ID' });
      }

      res.json('Created the thought');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // update a thought 
  async updateThought (req,res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      console.log(thought);
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // delete a thought
  async deleteThought(req,res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that id' });
      }

      res.json({ message: 'Thought has been deleted' })
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // add reaction
  async addReaction(req,res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body }},
        { runValidators: true, new: true }
      )
      .select('-__v')
      .populate (
        {
          path: 'reactions',
          select: '-__v'
        }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // delete reaction
  async removeReaction(req,res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )
      .select('-__v')
      .populate (
        {
          path: 'reactions',
          select: '-__v'
        }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
