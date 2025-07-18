#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the full datasets
const admin1 = require('../data/states/admin1.json');
const countries = require('../data/countries/countries.json');
const continents = require('../data/continents/continents.json');
const regions = require('../data/regions/regions.json');

// Target countries: US, CA, MX, IN, AU
const TARGET_COUNTRIES = ['US', 'CA', 'MX', 'IN', 'AU'];
const TARGET_COUNTRIES_A3 = ['USA', 'CAN', 'MEX', 'IND', 'AUS'];

console.log('🚀 Starting optimization for countries:', TARGET_COUNTRIES.join(', '));

// Create optimized directory
const optimizedDir = path.join(__dirname, '../data/optimized');
if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
}

// Extract admin1 data for target countries
console.log('📊 Extracting admin1 data...');
const optimizedAdmin1 = {
    type: 'FeatureCollection',
    features: admin1.features.filter(feature => 
        TARGET_COUNTRIES.includes(feature.properties.iso_a2) ||
        TARGET_COUNTRIES_A3.includes(feature.properties.adm0_a3)
    )
};

console.log(`  - Original features: ${admin1.features.length}`);
console.log(`  - Optimized features: ${optimizedAdmin1.features.length}`);
console.log(`  - Reduction: ${Math.round((1 - optimizedAdmin1.features.length / admin1.features.length) * 100)}%`);

// Extract countries data
console.log('\n🌍 Extracting countries data...');
const optimizedCountries = countries.filter(country => 
    TARGET_COUNTRIES.includes(country.country_a2)
);

console.log(`  - Original countries: ${countries.length}`);
console.log(`  - Optimized countries: ${optimizedCountries.length}`);

// Extract continents data (only NA, AS, OC needed)
console.log('\n🗺️  Extracting continents data...');
const neededContinents = new Set();
optimizedCountries.forEach(country => {
    const continent = continents.find(c => c.countries && c.countries.includes(country.country_a2));
    if (continent) {
        neededContinents.add(continent.continent_code);
    }
});

const optimizedContinents = continents.filter(continent => 
    neededContinents.has(continent.continent_code)
);

console.log(`  - Original continents: ${continents.length}`);
console.log(`  - Optimized continents: ${optimizedContinents.length}`);

// Extract regions data
console.log('\n📍 Extracting regions data...');
const optimizedRegions = regions.filter(region => 
    TARGET_COUNTRIES.includes(region.country_a2)
);

console.log(`  - Original regions: ${regions.length}`);
console.log(`  - Optimized regions: ${optimizedRegions.length}`);

// Calculate file sizes
function getFileSizeInMB(obj) {
    const str = JSON.stringify(obj);
    return (Buffer.byteLength(str, 'utf8') / 1024 / 1024).toFixed(2);
}

console.log('\n💾 File size comparison:');
console.log(`  - admin1.json: ${getFileSizeInMB(admin1)} MB → ${getFileSizeInMB(optimizedAdmin1)} MB`);
console.log(`  - countries.json: ${getFileSizeInMB(countries)} MB → ${getFileSizeInMB(optimizedCountries)} MB`);
console.log(`  - continents.json: ${getFileSizeInMB(continents)} MB → ${getFileSizeInMB(optimizedContinents)} MB`);
console.log(`  - regions.json: ${getFileSizeInMB(regions)} MB → ${getFileSizeInMB(optimizedRegions)} MB`);

// Write optimized files
console.log('\n✍️  Writing optimized files...');

fs.writeFileSync(
    path.join(optimizedDir, 'admin1.json'),
    JSON.stringify(optimizedAdmin1, null, 2)
);
console.log('  ✓ admin1.json');

fs.writeFileSync(
    path.join(optimizedDir, 'countries.json'),
    JSON.stringify(optimizedCountries, null, 2)
);
console.log('  ✓ countries.json');

fs.writeFileSync(
    path.join(optimizedDir, 'continents.json'),
    JSON.stringify(optimizedContinents, null, 2)
);
console.log('  ✓ continents.json');

fs.writeFileSync(
    path.join(optimizedDir, 'regions.json'),
    JSON.stringify(optimizedRegions, null, 2)
);
console.log('  ✓ regions.json');

// Create metadata file
const metadata = {
    created: new Date().toISOString(),
    countries: TARGET_COUNTRIES,
    statistics: {
        admin1: {
            original: admin1.features.length,
            optimized: optimizedAdmin1.features.length
        },
        countries: {
            original: countries.length,
            optimized: optimizedCountries.length
        },
        continents: {
            original: continents.length,
            optimized: optimizedContinents.length
        },
        regions: {
            original: regions.length,
            optimized: optimizedRegions.length
        }
    }
};

fs.writeFileSync(
    path.join(optimizedDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
);
console.log('  ✓ metadata.json');

console.log('\n✅ Optimization complete!');
console.log(`📁 Optimized files saved to: ${optimizedDir}`);