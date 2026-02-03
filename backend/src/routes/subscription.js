import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Subscription from '../models/Subscription.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Valid promo codes configuration
const VALID_PROMO_CODES = {
  'BFSALE25': {
    discount: 0.5, // 50% discount
    description: 'Black Friday Sale - 50% off',
  },
};

/**
 * @route   POST /api/subscribe
 * @desc    Subscribe to a course
 * @access  Private (requires JWT)
 */
router.post(
  '/',
  protect,
  [
    body('courseId')
      .notEmpty()
      .withMessage('Course ID is required')
      .custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error('Invalid Course ID format');
        }
        return true;
      }),
    body('promoCode')
      .optional()
      .trim()
      .toUpperCase(),
  ],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { courseId, promoCode } = req.body;
      const userId = req.user._id; // From JWT middleware

      // Teachers cannot subscribe to courses - only students can
      if (req.user.role === 'teacher') {
        return res.status(403).json({
          success: false,
          message: 'Teachers cannot subscribe to courses. Only students can enroll in courses.',
        });
      }

      // Step 1: Find the course
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      // Check if course is published
      if (!course.isPublished) {
        return res.status(400).json({
          success: false,
          message: 'This course is not available for subscription',
        });
      }

      // Check if user is trying to subscribe to their own course
      if (course.instructor && course.instructor.toString() === userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You cannot subscribe to your own course',
        });
      }

      // Step 2: Check for duplicate subscription
      const existingSubscription = await Subscription.isUserSubscribed(userId, courseId);

      if (existingSubscription) {
        return res.status(409).json({
          success: false,
          message: 'You are already subscribed to this course',
        });
      }

      // Step 3: Calculate price based on course price and promo code
      let pricePaid = course.price;
      let promoCodeUsed = null;

      if (course.price === 0) {
        // Free course - instant subscription
        pricePaid = 0;
      } else {
        // Paid course - promo code is REQUIRED
        if (!promoCode) {
          return res.status(400).json({
            success: false,
            message: 'Promo code is required for paid courses',
            originalPrice: course.price,
          });
        }

        // Validate promo code
        const promoCodeUpper = promoCode.toUpperCase();
        const promoConfig = VALID_PROMO_CODES[promoCodeUpper];

        if (!promoConfig) {
          return res.status(400).json({
            success: false,
            message: 'Invalid promo code',
            validCodes: ['BFSALE25'], // For development/testing only
          });
        }

        // Apply discount
        pricePaid = course.price * (1 - promoConfig.discount);
        promoCodeUsed = promoCodeUpper;
      }

      // Step 4: Create subscription
      const subscription = new Subscription({
        userId,
        courseId,
        pricePaid,
        promoCodeUsed,
      });

      await subscription.save();

      // Step 5: Return success response
      return res.status(201).json({
        success: true,
        message: 'Successfully subscribed to course',
        data: {
          subscriptionId: subscription._id,
          courseId: subscription.courseId,
          courseTitle: course.title,
          originalPrice: course.price,
          pricePaid: subscription.pricePaid,
          discount: course.price > 0 ? `${(1 - pricePaid / course.price) * 100}%` : '0%',
          promoCodeUsed: subscription.promoCodeUsed,
          subscribedAt: subscription.subscribedAt,
        },
      });
    } catch (error) {
      console.error('Subscription error:', error);

      // Handle duplicate key error (unique index violation)
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'You are already subscribed to this course',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Server error while processing subscription',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

/**
 * @route   GET /api/subscribe/my-courses
 * @desc    Get user's subscribed courses
 * @access  Private (requires JWT)
 */
router.get('/my-courses', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const subscriptions = await Subscription.getUserSubscriptions(userId);

    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching subscriptions',
    });
  }
});

/**
 * @route   GET /api/subscribe/check/:courseId
 * @desc    Check if user is subscribed to a course
 * @access  Private (requires JWT)
 */
router.get('/check/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
    }

    const isSubscribed = await Subscription.isUserSubscribed(userId, courseId);

    return res.status(200).json({
      success: true,
      isSubscribed,
      courseId,
    });
  } catch (error) {
    console.error('Check subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while checking subscription',
    });
  }
});

/**
 * @route   DELETE /api/subscribe/:subscriptionId
 * @desc    Remove a free course subscription (only allowed for free courses)
 * @access  Private (requires JWT)
 */
router.delete('/:subscriptionId', protect, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription ID',
      });
    }

    // Teachers cannot remove subscriptions
    if (req.user.role === 'teacher') {
      return res.status(403).json({
        success: false,
        message: 'Only students can remove their course subscriptions',
      });
    }

    const subscription = await Subscription.findById(subscriptionId)
      .populate('courseId', 'price title');

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Only allow removal if subscription belongs to current user
    if (subscription.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only remove your own subscriptions',
      });
    }

    // Only allow removal for free course subscriptions (pricePaid === 0 or course is free)
    const isFreeCourse = subscription.pricePaid === 0 ||
      subscription.pricePaid === undefined ||
      (subscription.courseId && subscription.courseId.price === 0);
    if (!isFreeCourse) {
      return res.status(400).json({
        success: false,
        message: 'Only free course subscriptions can be removed. Paid courses cannot be unsubscribed.',
      });
    }

    await Subscription.findByIdAndDelete(subscriptionId);

    return res.status(200).json({
      success: true,
      message: 'Subscription removed successfully',
      data: { subscriptionId },
    });
  } catch (error) {
    console.error('Remove subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while removing subscription',
    });
  }
});

/**
 * @route   POST /api/subscribe/validate-promo
 * @desc    Validate a promo code and get discount info
 * @access  Public
 */
router.post('/validate-promo', (req, res) => {
  const { promoCode } = req.body;

  if (!promoCode) {
    return res.status(400).json({
      success: false,
      message: 'Promo code is required',
    });
  }

  const promoCodeUpper = promoCode.toUpperCase().trim();
  const promoConfig = VALID_PROMO_CODES[promoCodeUpper];

  if (!promoConfig) {
    return res.status(400).json({
      success: false,
      message: 'Invalid promo code',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Valid promo code',
    data: {
      code: promoCodeUpper,
      discount: `${promoConfig.discount * 100}%`,
      description: promoConfig.description,
    },
  });
});

export default router;
