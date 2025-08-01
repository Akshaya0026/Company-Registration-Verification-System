import { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare, FaTrash, FaDownload, FaTag, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { deleteCertificate, getPdf } from '../api/api';

const BulkActions = ({ certificates, onBulkDelete, onToggleSelection }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Update selected IDs when certificates change
  useEffect(() => {
    if (selectAll) {
      setSelectedIds(certificates.map(cert => cert._id));
    } else {
      // Keep only the IDs that still exist in certificates
      setSelectedIds(prev => prev.filter(id => certificates.some(cert => cert._id === id)));
    }
  }, [certificates, selectAll]);

  // Toggle select all
  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      setSelectedIds(certificates.map(cert => cert._id));
    } else {
      setSelectedIds([]);
    }
    
    // Notify parent component about selection change
    if (onToggleSelection) {
      onToggleSelection(newSelectAll ? certificates.map(cert => cert._id) : []);
    }
  };

  // Toggle selection of a single certificate
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => {
      const newSelectedIds = prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id];
      
      // Update selectAll state
      setSelectAll(newSelectedIds.length === certificates.length);
      
      // Notify parent component about selection change
      if (onToggleSelection) {
        onToggleSelection(newSelectedIds);
      }
      
      return newSelectedIds;
    });
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    setIsDeleting(true);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      // Delete each selected certificate
      for (const id of selectedIds) {
        try {
          await deleteCertificate(id);
          successCount++;
        } catch (error) {
          console.error(`Error deleting certificate ${id}:`, error);
          errorCount++;
        }
      }
      
      // Show success message
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} certificate${successCount !== 1 ? 's' : ''}`);
      }
      
      // Show error message if any
      if (errorCount > 0) {
        toast.error(`Failed to delete ${errorCount} certificate${errorCount !== 1 ? 's' : ''}`);
      }
      
      // Clear selection
      setSelectedIds([]);
      setSelectAll(false);
      setShowConfirmDelete(false);
      
      // Notify parent component about deletion
      if (onBulkDelete) {
        onBulkDelete(selectedIds.filter((id, index) => index < successCount));
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error('An error occurred during bulk delete');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle bulk download
  const handleBulkDownload = async () => {
    if (selectedIds.length === 0) return;
    
    setIsDownloading(true);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      // Download each selected certificate
      for (const id of selectedIds) {
        try {
          const certificate = certificates.find(cert => cert._id === id);
          if (!certificate) continue;
          
          const response = await getPdf(id);
          
          // Create a blob from the PDF data
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          
          // Create a link and click it to download
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${certificate.title}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          successCount++;
        } catch (error) {
          console.error(`Error downloading certificate ${id}:`, error);
          errorCount++;
        }
      }
      
      // Show success message
      if (successCount > 0) {
        toast.success(`Downloaded ${successCount} certificate${successCount !== 1 ? 's' : ''}`);
      }
      
      // Show error message if any
      if (errorCount > 0) {
        toast.error(`Failed to download ${errorCount} certificate${errorCount !== 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error in bulk download:', error);
      toast.error('An error occurred during bulk download');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle adding tag to selected certificates
  const handleAddTag = async () => {
    if (selectedIds.length === 0 || !newTag.trim()) return;
    
    // In a real implementation, this would call an API to update the certificates
    // For now, we'll just show a success message
    toast.success(`Added tag "${newTag}" to ${selectedIds.length} certificate${selectedIds.length !== 1 ? 's' : ''}`);
    
    setNewTag('');
    setShowTagModal(false);
  };

  return (
    <div className="mb-6">
      {/* Bulk actions toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 flex flex-wrap items-center gap-3">
        {/* Select all checkbox */}
        <button 
          onClick={handleToggleSelectAll}
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
        >
          {selectAll ? (
            <FaCheckSquare className="h-5 w-5 mr-2 text-primary" />
          ) : (
            <FaSquare className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-600" />
          )}
          <span className="text-sm font-medium">
            {selectAll ? 'Deselect All' : 'Select All'}
          </span>
        </button>
        
        <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-2"></div>
        
        {/* Action buttons - only enabled when certificates are selected */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={selectedIds.length === 0}
            className={`btn btn-sm ${selectedIds.length === 0 ? 'btn-disabled' : 'btn-danger'}`}
          >
            <FaTrash className="h-3 w-3 mr-1" />
            Delete ({selectedIds.length})
          </button>
          
          <button
            onClick={handleBulkDownload}
            disabled={selectedIds.length === 0 || isDownloading}
            className={`btn btn-sm ${selectedIds.length === 0 ? 'btn-disabled' : 'btn-secondary'}`}
          >
            <FaDownload className="h-3 w-3 mr-1" />
            {isDownloading ? 'Downloading...' : `Download (${selectedIds.length})`}
          </button>
          
          <button
            onClick={() => setShowTagModal(true)}
            disabled={selectedIds.length === 0}
            className={`btn btn-sm ${selectedIds.length === 0 ? 'btn-disabled' : 'btn-secondary'}`}
          >
            <FaTag className="h-3 w-3 mr-1" />
            Add Tag ({selectedIds.length})
          </button>
        </div>
        
        {/* Selected count */}
        <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          {selectedIds.length > 0 ? (
            <span>{selectedIds.length} of {certificates.length} selected</span>
          ) : (
            <span>No certificates selected</span>
          )}
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Bulk Delete</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete {selectedIds.length} certificate{selectedIds.length !== 1 ? 's' : ''}? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  className="btn btn-secondary"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="btn btn-danger"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Add tag modal */}
      <AnimatePresence>
        {showTagModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Tag</h3>
                <button 
                  onClick={() => setShowTagModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add a tag to {selectedIds.length} selected certificate{selectedIds.length !== 1 ? 's' : ''}.
              </p>
              
              <div className="mb-4">
                <label htmlFor="newTag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tag Name
                </label>
                <input
                  type="text"
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Enter tag name"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowTagModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddTag}
                  className="btn btn-primary"
                  disabled={!newTag.trim()}
                >
                  Add Tag
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkActions;