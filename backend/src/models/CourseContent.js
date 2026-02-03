import mongoose from 'mongoose';

const courseContentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  type: {
    type: String,
    enum: ['video', 'document', 'note', 'link'],
    required: [true, 'Content type is required'],
  },
  // For videos - YouTube/Vimeo URL or uploaded video URL
  videoUrl: {
    type: String,
    trim: true,
  },
  // For documents/notes - file URL or content
  fileUrl: {
    type: String,
    trim: true,
  },
  // For notes - direct text content
  textContent: {
    type: String,
  },
  // For external links
  externalLink: {
    type: String,
    trim: true,
  },
  // Order of content in the course
  order: {
    type: Number,
    default: 0,
  },
  // Duration for videos (in minutes)
  duration: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
courseContentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Get all content for a course
courseContentSchema.statics.getCourseContent = async function (courseId, includeUnpublished = false) {
  const query = { courseId };
  if (!includeUnpublished) {
    query.isPublished = true;
  }
  return this.find(query).sort({ order: 1, createdAt: 1 });
};

const CourseContent = mongoose.model('CourseContent', courseContentSchema);

export default CourseContent;
