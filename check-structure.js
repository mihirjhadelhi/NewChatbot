const fs = require('fs');
const path = require('path');

const requiredFiles = [
  // Backend
  'server/utils/responseHelper.js',
  'server/utils/filterBuilder.js',
  'server/middleware/errorHandler.js',
  'server/middleware/validator.js',
  'server/controllers/propertyController.js',
  'server/controllers/preferenceController.js',
  'server/controllers/nlpController.js',
  'server/routes/propertyRoutes.js',
  'server/routes/preferenceRoutes.js',
  'server/routes/nlpRoutes.js',
  'server/.env.example',
  // Frontend
  'client/src/utils/constants.js',
  'client/src/utils/helpers.js',
  'client/src/hooks/useDebounce.js',
  'client/src/hooks/useProperties.js',
  'client/src/hooks/usePreferences.js',
  'client/src/services/apiClient.js',
  'client/src/components/common/ErrorBoundary.jsx',
];

console.log('Checking file structure...\n');

let allExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allExist = false;
  }
});

if (allExist) {
  console.log('\n✅ All required files exist!');
} else {
  console.log('\n❌ Some files are missing. Please create them.');
}