import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required'],
    index: true,
  },
  pricePaid: {
    type: Number,
    required: [true, 'Price paid is required'],
    min: [0, 'Price paid cannot be negative'],
  },
  promoCodeUsed: {
    type: String,
    default: null,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate subscriptions
// One user can only subscribe to a course once
subscriptionSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Static method to check if user is already subscribed
subscriptionSchema.statics.isUserSubscribed = async function (userId, courseId) {
  const subscription = await this.findOne({ userId, courseId });
  return !!subscription;
};

// Static method to get user's subscriptions
subscriptionSchema.statics.getUserSubscriptions = async function (userId) {
  return this.find({ userId })
    .populate('courseId', 'title description price thumbnail')
    .sort({ subscribedAt: -1 });
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
