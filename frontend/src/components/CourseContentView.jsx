import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  LinkIcon,
  PlayCircleIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { coursesAPI, contentAPI, uploadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const contentTypeIcons = {
  video: VideoCameraIcon,
  document: DocumentTextIcon,
  note: PencilSquareIcon,
  link: LinkIcon,
};

const contentTypeColors = {
  video: 'text-red-500 bg-red-500/10 border-red-500/30',
  document: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  note: 'text-green-500 bg-green-500/10 border-green-500/30',
  link: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
};

export default function CourseContentView() {
  const { courseId, contentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [currentContent, setCurrentContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCourseAndContent();
  }, [courseId]);

  useEffect(() => {
    if (contents.length > 0 && contentId) {
      const content = contents.find(c => c._id === contentId);
      if (content) {
        setCurrentContent(content);
      }
    } else if (contents.length > 0 && !contentId) {
      // Default to first content
      setCurrentContent(contents[0]);
      navigate(`/course/${courseId}/content/${contents[0]._id}`, { replace: true });
    }
  }, [contents, contentId]);

  const fetchCourseAndContent = async () => {
    try {
      setLoading(true);
      const [courseData, contentData] = await Promise.all([
        coursesAPI.getById(courseId),
        contentAPI.getCourseContent(courseId),
      ]);
      
      setCourse(courseData.data);
      setContents(contentData.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    // Direct video URL
    return url;
  };

  const isDirectVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('/uploads/videos/');
  };

  const currentIndex = contents.findIndex(c => c._id === currentContent?._id);
  const prevContent = currentIndex > 0 ? contents[currentIndex - 1] : null;
  const nextContent = currentIndex < contents.length - 1 ? contents[currentIndex + 1] : null;

  const navigateToContent = (content) => {
    setCurrentContent(content);
    navigate(`/course/${courseId}/content/${content._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-purple-400 hover:text-purple-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar - Content List */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col fixed lg:relative h-screen z-40"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-800">
              <Link
                to={`/courses/${courseId}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="text-sm">Back to Course</span>
              </Link>
              <h2 className="font-bold text-white truncate">{course?.title}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {contents.length} lessons
              </p>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto">
              {contents.map((content, index) => {
                const Icon = contentTypeIcons[content.type];
                const isActive = content._id === currentContent?._id;
                
                return (
                  <button
                    key={content._id}
                    onClick={() => navigateToContent(content)}
                    className={`w-full p-4 text-left border-b border-gray-800 transition-all ${
                      isActive
                        ? 'bg-purple-900/30 border-l-4 border-l-purple-500'
                        : 'hover:bg-gray-800/50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${contentTypeColors[content.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {content.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="capitalize">{content.type}</span>
                          {content.duration > 0 && (
                            <>
                              <span>•</span>
                              <span>{content.duration} min</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {sidebarOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
              
              {currentContent && (
                <div>
                  <h1 className="font-bold text-white">{currentContent.title}</h1>
                  <p className="text-sm text-gray-400 capitalize">{currentContent.type}</p>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => prevContent && navigateToContent(prevContent)}
                disabled={!prevContent}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {contents.length}
              </span>
              <button
                onClick={() => nextContent && navigateToContent(nextContent)}
                disabled={!nextContent}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Display */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {currentContent ? (
            <motion.div
              key={currentContent._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* Video Content */}
              {currentContent.type === 'video' && currentContent.videoUrl && (
                <div className="space-y-6">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                    {isDirectVideo(currentContent.videoUrl) ? (
                      <video
                        src={currentContent.videoUrl}
                        controls
                        className="w-full h-full"
                        autoPlay={false}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <iframe
                        src={getVideoEmbedUrl(currentContent.videoUrl)}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    )}
                  </div>
                  
                  {/* Video Info */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-2">{currentContent.title}</h2>
                    {currentContent.duration > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <ClockIcon className="h-4 w-4" />
                        <span>{currentContent.duration} minutes</span>
                      </div>
                    )}
                    {currentContent.description && (
                      <p className="text-gray-300">{currentContent.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Document Content */}
              {currentContent.type === 'document' && currentContent.fileUrl && (
                <div className="space-y-6">
                  {/* PDF Viewer */}
                  {currentContent.fileUrl.toLowerCase().includes('.pdf') ? (
                    <div className="aspect-4/5 rounded-2xl overflow-hidden bg-white shadow-2xl">
                      <iframe
                        src={currentContent.fileUrl}
                        className="w-full h-full"
                        title={currentContent.title}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
                      <DocumentTextIcon className="h-20 w-20 mx-auto text-blue-500 mb-6" />
                      <h2 className="text-2xl font-bold text-white mb-2">{currentContent.title}</h2>
                      {currentContent.description && (
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">{currentContent.description}</p>
                      )}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                          href={currentContent.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                          Open Document
                        </a>
                        <a
                          href={currentContent.fileUrl}
                          download
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Document Info */}
                  <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-2">{currentContent.title}</h2>
                    {currentContent.description && (
                      <p className="text-gray-300">{currentContent.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Note Content */}
              {currentContent.type === 'note' && (
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                        <PencilSquareIcon className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{currentContent.title}</h2>
                        {currentContent.description && (
                          <p className="text-sm text-gray-400">{currentContent.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-gray-300 font-sans text-base leading-relaxed bg-gray-800/50 rounded-xl p-6">
                        {currentContent.textContent}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Link Content */}
              {currentContent.type === 'link' && currentContent.externalLink && (
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
                    <LinkIcon className="h-20 w-20 mx-auto text-purple-500 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">{currentContent.title}</h2>
                    {currentContent.description && (
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">{currentContent.description}</p>
                    )}
                    <a
                      href={currentContent.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                      Open External Link
                    </a>
                    <p className="mt-4 text-sm text-gray-500 break-all">
                      {currentContent.externalLink}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
                {prevContent ? (
                  <button
                    onClick={() => navigateToContent(prevContent)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-colors group"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="font-medium text-gray-300 group-hover:text-white truncate max-w-[150px]">
                        {prevContent.title}
                      </p>
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {nextContent ? (
                  <button
                    onClick={() => navigateToContent(nextContent)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 transition-colors group"
                  >
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Next</p>
                      <p className="font-medium text-gray-300 group-hover:text-white truncate max-w-[150px]">
                        {nextContent.title}
                      </p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                  </button>
                ) : (
                  <Link
                    to={`/courses/${courseId}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-900/30 hover:bg-green-900/50 border border-green-500/30 transition-colors group"
                  >
                    <div className="text-right">
                      <p className="text-xs text-green-400">Completed!</p>
                      <p className="font-medium text-green-300">Back to Course</p>
                    </div>
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AcademicCapIcon className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Select a lesson to begin</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
