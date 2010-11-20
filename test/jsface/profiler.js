/**
 * profiler.js - Pointcuts for jsFace itself to profile jsFace's internal APIs.
 */
(function() {

// Export profiling data to jsface.profileData
jsface.profileData = {};

// Profile jsFace itself
jsface.profile(jsface, jsface.profileData);

})();
