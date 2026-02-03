import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Subscription from '../models/Subscription.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Get all published courses
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
    });
  }
});

/**
 * @route   GET /api/courses/my-created-courses
 * @desc    Get courses created by the teacher
 * @access  Private (Teacher only)
 * NOTE: This route MUST be before /:id to avoid being matched as an ID
 */
router.get('/my-created-courses', protect, teacherOnly, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
    });
  }
});

/**
 * @route   GET /api/courses/dashboard
 * @desc    Get teacher dashboard with analytics
 * @access  Private (Teacher only)
 * NOTE: This route MUST be before /:id to avoid being matched as an ID
 */
router.get('/dashboard', protect, teacherOnly, async (req, res) => {
  try {
    // Get all courses by this teacher
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);

    console.log('Teacher ID:', req.user._id);
    console.log('Teacher courses:', courses.length);
    console.log('Course IDs:', courseIds);

    // Get all subscriptions for teacher's courses
    const subscriptions = await Subscription.find({ courseId: { $in: courseIds } })
      .populate('userId', 'name email')
      .populate('courseId', 'title price')
      .sort({ subscribedAt: -1 });

    console.log('Subscriptions found:', subscriptions.length);

    // Calculate stats
    const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.pricePaid || 0), 0);
    const totalStudents = new Set(subscriptions.map(s => s.userId?._id?.toString()).filter(Boolean)).size;
    
    // Course-wise breakdown
    const courseStats = courses.map(course => {
      const courseSubs = subscriptions.filter(
        s => s.courseId?._id?.toString() === course._id.toString()
      );
      return {
        _id: course._id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail,
        isPublished: course.isPublished,
        totalSubscriptions: courseSubs.length,
        revenue: courseSubs.reduce((sum, s) => sum + (s.pricePaid || 0), 0),
        students: courseSubs.map(s => ({
          _id: s._id,
          studentName: s.userId?.name || 'Unknown',
          studentEmail: s.userId?.email || 'Unknown',
          pricePaid: s.pricePaid,
          promoCodeUsed: s.promoCodeUsed,
          subscribedAt: s.subscribedAt,
        })),
      };
    });

    // Recent subscriptions (last 10)
    const recentSubscriptions = subscriptions.slice(0, 10).map(s => ({
      _id: s._id,
      studentName: s.userId?.name || 'Unknown',
      studentEmail: s.userId?.email || 'Unknown',
      courseTitle: s.courseId?.title || 'Unknown',
      pricePaid: s.pricePaid,
      promoCodeUsed: s.promoCodeUsed,
      subscribedAt: s.subscribedAt,
    }));

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCourses: courses.length,
          totalStudents,
          totalSubscriptions: subscriptions.length,
          totalRevenue,
        },
        courseStats,
        recentSubscriptions,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard',
    });
  }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course by ID
 * @access  Public
 * NOTE: This route MUST be AFTER all specific routes like /dashboard, /my-created-courses
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
    }

    const course = await Course.findById(id).populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Get course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching course',
    });
  }
});

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Teacher only)
 */
router.post(
  '/',
  protect,
  teacherOnly,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('thumbnail')
      .optional()
      .trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { title, description, price, thumbnail } = req.body;

      const course = new Course({
        title,
        description,
        price: price || 0,
        thumbnail,
        instructor: req.user._id,
      });

      await course.save();

      return res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course,
      });
    } catch (error) {
      console.error('Create course error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while creating course',
      });
    }
  }
);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update a course
 * @access  Private (Teacher only, must be instructor)
 */
router.put(
  '/:id',
  protect,
  teacherOnly,
  [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Course ID format',
        });
      }

      const course = await Course.findById(id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      // Check ownership
      if (course.instructor && course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this course',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { title, description, price, thumbnail, isPublished } = req.body;

      if (title) course.title = title;
      if (description) course.description = description;
      if (price !== undefined) course.price = price;
      if (thumbnail) course.thumbnail = thumbnail;
      if (isPublished !== undefined) course.isPublished = isPublished;

      await course.save();

      return res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: course,
      });
    } catch (error) {
      console.error('Update course error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while updating course',
      });
    }
  }
);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course
 * @access  Private (Teacher only, must be instructor)
 */
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check ownership
    if (course.instructor && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting course',
    });
  }
});

export default router;
