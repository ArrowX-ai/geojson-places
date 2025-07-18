const fs = require('fs');
const path = require('path');

// Check if optimized data exists
const optimizedDir = path.join(__dirname, '../data/optimized');
const useOptimized = fs.existsSync(path.join(optimizedDir, 'admin1.json'));

if (useOptimized) {
    console.log('[geojson-places] Using optimized data for US/CA/MX/IN/AU');
    
    // Load optimized data
    const admin1 = require('../data/optimized/admin1.json');
    const continents = require('../data/optimized/continents.json');
    const countries = require('../data/optimized/countries.json');
    const countryGroupings = require('../data/country-groupings/country-groupings.json'); // Keep full for now
    const regions = require('../data/optimized/regions.json');
    
    module.exports = {
        admin1,
        continents,
        countries,
        countryGroupings,
        regions,
        isOptimized: true
    };
} else {
    // Fall back to full data
    console.log('[geojson-places] Optimized data not found, using full dataset');
    const fullData = require('./data');
    
    module.exports = {
        ...fullData,
        isOptimized: false
    };
}