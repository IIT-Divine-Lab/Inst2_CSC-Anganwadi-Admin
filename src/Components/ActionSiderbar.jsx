import React, { useState } from 'react'
import { Download, Save, Edit, Copy, X, ChevronDown } from "lucide-react";

const ActionSidebar = ({
  onExport,
  onSave,
  onEdit,
  onDuplicate,
  onDelete,
  savedDescription,
  graphSaved,
  hasUnsavedChanges
}) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleExportClick = () => {
    console.log("handleExportClick")
    setShowExportOptions(!showExportOptions);
  };

  const handleOptionSelect = (format) => {
    console.log("handleOptionSelect")
    onExport(format);
    setShowExportOptions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-700 mb-6">What's your next action?</h2>

      <div className="space-y-3">
        <div className="relative">
          <button
            onClick={handleExportClick}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="text-indigo-600" size={20} />
              <span className="text-indigo-600 font-medium">Export Graph</span>
            </div>
            <ChevronDown className={`text-indigo-600 transition-transform ${showExportOptions ? 'transform rotate-180' : ''}`} size={16} />
          </button>

          {showExportOptions && (
            <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10">
              <button
                onClick={() => handleOptionSelect('png')}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">Download as PNG</span>
              </button>
              <button
                onClick={() => handleOptionSelect('pdf')}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700">Download as PDF</span>
              </button>
            </div>
          )}
        </div>

        {(!graphSaved || hasUnsavedChanges) && (
          <button
            onClick={onSave}
            className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
          >
            <Save className="text-indigo-600" size={20} />
            <span className="text-indigo-600 font-medium">Save Graph</span>
          </button>
        )}

        {graphSaved && (
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-3 px-4 py-3 border border-red-200 rounded-lg text-left hover:bg-red-50 transition-colors"
          >
            <X className="text-red-600" size={20} />
            <span className="text-red-600 font-medium">Delete Graph</span>
          </button>
        )}

        <button
          onClick={onEdit}
          className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
        >
          <Edit className="text-indigo-600" size={20} />
          <span className="text-indigo-600 font-medium">Edit Graph</span>
        </button>

        <button
          onClick={onDuplicate}
          className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
        >
          <Copy className="text-indigo-600" size={20} />
          <span className="text-indigo-600 font-medium">Duplicate Graph</span>
        </button>
      </div>

      {graphSaved && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
            {savedDescription}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionSidebar