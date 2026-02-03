import express from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import CourseContent from '../models/CourseContent.js';
import Subscription from '../models/Subscription.js';
import { protect, teacherOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/content/course/:courseId
 * @desc    Get all content for a course (for enrolled students)
 * @access  Private (must be enrolled or course owner)
 */
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Course ID format',
      });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user is the course owner (teacher)
    const isOwner = course.instructor?.toString() === req.user._id.toString();

    // Check if user is enrolled (subscribed)
    const isEnrolled = await Subscription.isUserSubscribed(req.user._id, courseId);

    if (!isOwner && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access its content',
      });
    }

    // Get content - owners see all, students see only published
    const content = await CourseContent.getCourseContent(courseId, isOwner);

    return res.status(200).json({
      success: true,
      count: content.length,
      isOwner,
      data: content,
    });
  } catch (error) {
    console.error('Get course content error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching course content',
    });
  }
});

/**
 * @route   GET /api/content/:id
 * @desc    Get single content item
 * @access  Private (must be enrolled or course owner)
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Content ID format',
      });
    }

    const content = await CourseContent.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    // Check course access
    const course = await Course.findById(content.courseId);
    const isOwner = course?.instructor?.toString() === req.user._id.toString();
    const isEnrolled = await Subscription.isUserSubscribed(req.user._id, content.courseId);

    if (!isOwner && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access its content',
      });
    }

    // Students can't access unpublished content
    if (!isOwner && !content.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Get content error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching content',
    });
  }
});

/**
 * @route   POST /api/content
 * @desc    Add content to a course
 * @access  Private (Teacher only, must be course owner)
 */
router.post(
  '/',
  protect,
  teacherOnly,
  [
    body('courseId')
      .notEmpty()
      .withMessage('Course ID is required')
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage('Invalid Course ID format'),
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('type')
      .isIn(['video', 'document', 'note', 'link'])
      .withMessage('Type must be video, document, note, or link'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot exceed 500 characters'),
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

      const { courseId, title, description, type, videoUrl, fileUrl, textContent, externalLink, duration, order } = req.body;

      // Check if user owns the course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }

      if (course.instructor?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only add content to your own courses',
        });
      }

      // Get the highest order number for auto-ordering
      const lastContent = await CourseContent.findOne({ courseId }).sort({ order: -1 });
      const newOrder = order !== undefined ? order : (lastContent ? lastContent.order + 1 : 0);

      const content = new CourseContent({
        courseId,
        title,
        description,
        type,
        videoUrl,
        fileUrl,
        textContent,
        externalLink,
        duration,
        order: newOrder,
      });

      await content.save();

      return res.status(201).json({
        success: true,
        message: 'Content added successfully',
        data: content,
      });
    } catch (error) {
      console.error('Add content error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while adding content',
      });
    }
  }
);

/**
 * @route   PUT /api/content/:id
 * @desc    Update content
 * @access  Private (Teacher only, must be course owner)
 */
router.put('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Content ID format',
      });
    }

    const content = await CourseContent.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    // Check ownership
    const course = await Course.findById(content.courseId);
    if (course?.instructor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update content in your own courses',
      });
    }

    const { title, description, type, videoUrl, fileUrl, textContent, externalLink, duration, order, isPublished } = req.body;

    if (title) content.title = title;
    if (description !== undefined) content.description = description;
    if (type) content.type = type;
    if (videoUrl !== undefined) content.videoUrl = videoUrl;
    if (fileUrl !== undefined) content.fileUrl = fileUrl;
    if (textContent !== undefined) content.textContent = textContent;
    if (externalLink !== undefined) content.externalLink = externalLink;
    if (duration !== undefined) content.duration = duration;
    if (order !== undefined) content.order = order;
    if (isPublished !== undefined) content.isPublished = isPublished;

    await content.save();

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content,
    });
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating content',
    });
  }
});

/**
 * @route   DELETE /api/content/:id
 * @desc    Delete content
 * @access  Private (Teacher only, must be course owner)
 */
router.delete('/:id', protect, teacherOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Content ID format',
      });
    }

    const content = await CourseContent.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }

    // Check ownership
    const course = await Course.findById(content.courseId);
    if (course?.instructor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete content from your own courses',
      });
    }

    await CourseContent.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting content',
    });
  }
});

export default router;
