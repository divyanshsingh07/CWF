import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PlusIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  LinkIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { coursesAPI, contentAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TRANSITION = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] };

const contentTypeIcons = {
  video: VideoCameraIcon,
  document: DocumentTextIcon,
  note: PencilSquareIcon,
  link: LinkIcon,
};

const contentTypeColors =
  {
    video: 'text-sky-600 bg-sky-100 dark:bg-sky-900/30',
    document: 'text-sky-600 bg-sky-100 dark:bg-sky-900/30',
    note: 'text-sky-600 bg-sky-100 dark:bg-sky-900/30',
    link: 'text-sky-600 bg-sky-100 dark:bg-sky-900/30',
  };

export default function CourseManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCourseAndContent();
  }, [id]);

  const fetchCourseAndContent = async () => {
    try {
      setLoading(true);
      const [courseData, contentData] = await Promise.all([
        coursesAPI.getById(id),
        contentAPI.getCourseContent(id).catch(() => ({ data: [] })),
      ]);
      
      // Check if user owns this course
      const instructorId = courseData.data?.instructor?._id || courseData.data?.instructor;
      if (instructorId !== user?._id) {
        navigate('/teacher-dashboard');
        return;
      }
      
      setCourse(courseData.data);
      setContents(contentData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await contentAPI.delete(contentId);
      setContents(contents.filter(c => c._id !== contentId));
      setSuccessMessage('Content deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTogglePublish = async (content) => {
    try {
      await contentAPI.update(content._id, { isPublished: !content.isPublished });
      setContents(contents.map(c => 
        c._id === content._id ? { ...c, isPublished: !c.isPublished } : c
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-zinc-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent" />
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading course...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-20 pb-12 bg-white dark:bg-zinc-800 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={TRANSITION}
          onClick={() => navigate('/teacher-dashboard')}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </motion.button>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={TRANSITION}
              className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-sm"
            >
              <CheckCircleIcon className="h-5 w-5" />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION}
          className="bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl p-6 mb-8 border border-zinc-200 dark:border-zinc-700"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
                {course?.title}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Manage course content - videos, notes, and documents
              </p>
            </div>
            <button
              onClick={() => {
                setEditingContent(null);
                setShowAddModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-md shadow-sky-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 text-sm"
            >
              <PlusIcon className="h-5 w-5" />
              Add Content
            </button>
          </div>
        </motion.div>

        {/* Content List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, ...TRANSITION }}
        >
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Course Content ({contents.length})
          </h2>

          {contents.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl p-10 text-center border border-zinc-200 dark:border-zinc-700">
              <DocumentTextIcon className="h-14 w-14 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">
                No content added yet
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-medium text-sm transition-colors"
              >
                Add your first lesson
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contents.map((content, index) => {
                const Icon = contentTypeIcons[content.type];
                return (
                  <motion.div
                    key={content._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, ...TRANSITION }}
                    className={`bg-zinc-50 dark:bg-zinc-800/80 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center gap-4 ${
                      !content.isPublished ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      {/* Order Number */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <span className="text-lg sm:text-xl font-semibold text-zinc-400 dark:text-zinc-500 tabular-nums">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className={`p-3 rounded-lg ${contentTypeColors[content.type]}`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-zinc-900 dark:text-white truncate text-sm sm:text-base">
                          {content.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                          <span className="capitalize">{content.type}</span>
                          {content.duration > 0 && (
                            <>
                              <span>•</span>
                              <span>{content.duration} min</span>
                            </>
                          )}
                          {!content.isPublished && (
                            <>
                              <span>•</span>
                              <span className="text-amber-500">Draft</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleTogglePublish(content)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            content.isPublished
                              ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                              : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                          title={content.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {content.isPublished ? (
                            <EyeIcon className="h-5 w-5" />
                          ) : (
                            <EyeSlashIcon className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingContent(content);
                            setShowAddModal(true);
                          }}
                          className="p-2 rounded-lg text-zinc-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors duration-200"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(content._id)}
                          className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Content Modal */}
      <AnimatePresence>
        {showAddModal && (
          <ContentModal
            courseId={id}
            content={editingContent}
            onClose={() => {
              setShowAddModal(false);
              setEditingContent(null);
            }}
            onSuccess={(newContent, isEdit) => {
              if (isEdit) {
                setContents(contents.map(c => c._id === newContent._id ? newContent : c));
              } else {
                setContents([...contents, newContent]);
              }
              setShowAddModal(false);
              setEditingContent(null);
              setSuccessMessage(isEdit ? 'Content updated successfully' : 'Content added successfully');
              setTimeout(() => setSuccessMessage(''), 3000);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ContentModal({ courseId, content, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    description: content?.description || '',
    type: content?.type || 'video',
    videoUrl: content?.videoUrl || '',
    fileUrl: content?.fileUrl || '',
    textContent: content?.textContent || '',
    externalLink: content?.externalLink || '',
    duration: content?.duration || 0,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (100MB max)
    if (file.size > 100 * 1024 * 1024) {
      setError('File is too large. Maximum size is 100MB');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadAPI.uploadFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update form data with the uploaded file URL
      const fullUrl = uploadAPI.getFileUrl(result.data.url);
      setFormData({ ...formData, [fieldName]: fullUrl });
      setUploadedFileName(result.data.originalName);

      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 500);
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (content) {
        // Update existing
        result = await contentAPI.update(content._id, formData);
      } else {
        // Create new
        result = await contentAPI.create({ ...formData, courseId });
      }
      onSuccess(result.data, !!content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
            {content ? 'Edit Content' : 'Add New Content'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Content Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(contentTypeIcons).map(([type, Icon]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                    formData.type === type
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="e.g., Introduction to React"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Brief description of this content"
            />
          </div>

          {/* Type-specific fields */}
          {formData.type === 'video' && (
            <>
              {/* Video Upload or URL */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Video Source
                </label>
                
                {/* File Upload */}
                <div className="mb-3">
                  <label className="block w-full cursor-pointer">
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                      uploading ? 'border-sky-500 bg-sky-100 dark:bg-sky-900/30' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}>
                      {uploading ? (
                        <div className="space-y-2">
                          <ArrowPathIcon className="h-8 w-8 mx-auto text-sky-500 animate-spin" />
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">Uploading... {uploadProgress}%</p>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                            <div 
                              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="text-sky-500 dark:text-sky-400 font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">MP4, WebM, MOV up to 100MB</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'videoUrl')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Or URL Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">OR paste URL</span>
                  </div>
                </div>

                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full mt-3 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=... or uploaded file URL"
                />

                {formData.videoUrl && (
                  <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    Video source set
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {formData.type === 'document' && (
            <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Document Source
              </label>
              
              {/* File Upload */}
              <div className="mb-3">
                <label className="block w-full cursor-pointer">
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                    uploading ? 'border-sky-500 bg-sky-100 dark:bg-sky-900/30' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}>
                    {uploading ? (
                      <div className="space-y-2">
                        <ArrowPathIcon className="h-8 w-8 mx-auto text-sky-500 animate-spin" />
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Uploading... {uploadProgress}%</p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                          <div 
                            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          <span className="text-sky-500 dark:text-sky-400 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PDF, DOC, DOCX, PPT, XLS up to 100MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                    onChange={(e) => handleFileUpload(e, 'fileUrl')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Or URL Input */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500">OR paste URL</span>
                </div>
              </div>

              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className="w-full mt-3 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="https://drive.google.com/... or uploaded file URL"
              />

              {formData.fileUrl && (
                <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  Document source set {uploadedFileName && `(${uploadedFileName})`}
                </p>
              )}
            </div>
          )}

          {formData.type === 'note' && (
            <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Note Content
              </label>
              <textarea
                value={formData.textContent}
                onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                rows={6}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                placeholder="Write your notes here... (supports markdown)"
              />
            </div>
          )}

          {formData.type === 'link' && (
            <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                External Link
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || !formData.title}
              className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              {loading ? 'Saving...' : content ? 'Update' : 'Add Content'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
