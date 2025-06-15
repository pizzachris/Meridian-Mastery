import React, { useState, useEffect, memo, useCallback } from "react";

const FlaggedIssues = memo(({ navigateTo }) => {
  const [flaggedIssues, setFlaggedIssues] = useState([]);

  useEffect(() => {
    // Use try-catch for localStorage access
    try {
      const flags = JSON.parse(
        localStorage.getItem("meridian-mastery-flags") || "[]",
      );
      setFlaggedIssues(flags.reverse()); // Show newest first
    } catch (error) {
      console.error("Failed to load flagged issues:", error);
      setFlaggedIssues([]);
    }
  }, []);

  // Memoized handlers for better performance
  const clearFlags = useCallback(() => {
    try {
      localStorage.removeItem("meridian-mastery-flags");
      setFlaggedIssues([]);
    } catch (error) {
      console.error("Failed to clear flags:", error);
    }
  }, []);

  const deleteFlag = useCallback(
    (index) => {
      try {
        const updatedFlags = flaggedIssues.filter((_, i) => i !== index);
        localStorage.setItem(
          "meridian-mastery-flags",
          JSON.stringify(updatedFlags.reverse()),
        );
        setFlaggedIssues(updatedFlags);
      } catch (error) {
        console.error("Failed to delete flag:", error);
      }
    },
    [flaggedIssues],
  );

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const getIssueTypeColor = (reason) => {
    const colors = {
      "incorrect-translation": "text-red-400 border-red-600",
      "wrong-location": "text-orange-400 border-orange-600",
      "incorrect-function": "text-yellow-400 border-yellow-600",
      "wrong-meridian": "text-purple-400 border-purple-600",
      "martial-application-error": "text-pink-400 border-pink-600",
      "spelling-grammar": "text-blue-400 border-blue-600",
      "missing-information": "text-green-400 border-green-600",
      other: "text-gray-400 border-gray-600",
    };
    return colors[reason] || colors.other;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <button
            onClick={() => navigateTo("settings")}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to Settings
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-4">
              <svg
                className="w-8 h-8 text-orange-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">FLAGGED ISSUES</h1>
              <h2 className="text-xl text-gray-300">User Reports</h2>
            </div>
          </div>
        </header>
        {/* Stats */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-orange-600 rounded-lg p-4 inline-block">
            <div className="text-3xl font-bold text-orange-400">
              {flaggedIssues.length}
            </div>
            <div className="text-gray-300">Total Reports</div>
          </div>
        </div>
        {/* Actions */}
        {flaggedIssues.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={clearFlags}
              className="bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded border border-red-600"
            >
              Clear All Reports
            </button>
          </div>
        )}
        {/* Issues List */}
        {flaggedIssues.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">
              No issues reported yet
            </div>
            <p className="text-gray-500">
              User reports will appear here when they flag flashcard issues.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedIssues.map((issue, index) => (
              <div
                key={index}
                className={`bg-gradient-to-r from-gray-900 to-gray-800 border rounded-lg p-4 ${getIssueTypeColor(issue.reason)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {issue.pointNumber} - {issue.pointName}
                    </h3>
                    <div className="text-sm text-gray-400">
                      Reported: {formatDate(issue.timestamp)}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFlag(index)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete this report"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                </div>

                <div className="mb-2">
                  <span className="inline-block bg-gray-800 px-3 py-1 rounded text-sm border">
                    Issue Type:{" "}
                    {issue.reason
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Point ID: {issue.pointId}
                </div>
              </div>
            ))}
          </div>
        )}{" "}
        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-12">
          Use this information to improve flashcard accuracy and content
          quality.
        </div>
      </div>
    </div>
  );
});

FlaggedIssues.displayName = "FlaggedIssues";

export default FlaggedIssues;
