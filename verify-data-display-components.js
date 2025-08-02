#!/usr/bin/env node

/**
 * Verification script for data display components
 * This script checks if all components are properly implemented with BayiCare styling
 */

const fs = require('fs');
const path = require('path');

const componentsToCheck = [
    'src/components/ui/table.tsx',
    'src/components/ui/tabs.tsx',
    'src/components/ui/accordion.tsx',
    'src/components/ui/responsive-table.tsx',
    'src/components/ui/data-display-demo.tsx',
    'src/components/ui/badge.tsx'
];

const requiredFeatures = {
    'table.tsx': [
        'BayiCare colors (#04A3E8, #163461, #EEF3FC, #F1F5FC)',
        'font-nunito',
        'responsive padding (px-3 sm:px-4)',
        'mobile text sizing (text-xs sm:text-sm)',
        'rounded-xl borders',
        'shadow styling'
    ],
    'tabs.tsx': [
        'BayiCare colors',
        'font-nunito',
        'min-h-[44px] touch targets',
        'keyboard navigation support',
        'focus-visible styles',
        'responsive design (w-full sm:w-auto)',
        'reduced motion support'
    ],
    'accordion.tsx': [
        'BayiCare colors',
        'font-nunito',
        'min-h-[44px] touch targets',
        'rounded-xl styling',
        'proper ARIA attributes',
        'smooth animations',
        'reduced motion support'
    ],
    'responsive-table.tsx': [
        'mobile card view',
        'desktop table view',
        'BayiCare-specific components (GrowthTable, ImmunizationTable)',
        'status badges with proper colors',
        'Indonesian date formatting',
        'empty state handling'
    ],
    'badge.tsx': [
        'BayiCare color variants',
        'font-nunito',
        'rounded-lg styling',
        'success, warning, destructive variants',
        'proper hover states'
    ]
};

console.log('🔍 Verifying Data Display Components Implementation...\n');

let allPassed = true;

// Check if all component files exist
componentsToCheck.forEach(componentPath => {
    const fullPath = path.join(__dirname, componentPath);

    if (!fs.existsSync(fullPath)) {
        console.log(`❌ Missing component: ${componentPath}`);
        allPassed = false;
        return;
    }

    console.log(`✅ Found component: ${componentPath}`);

    // Read file content and check for required features
    const content = fs.readFileSync(fullPath, 'utf8');
    const fileName = path.basename(componentPath);

    if (requiredFeatures[fileName]) {
        console.log(`   Checking features for ${fileName}:`);

        requiredFeatures[fileName].forEach(feature => {
            let found = false;

            // Check for specific patterns
            if (feature.includes('BayiCare colors')) {
                found = content.includes('#04A3E8') && content.includes('#163461') && content.includes('#EEF3FC');
            } else if (feature.includes('font-nunito')) {
                found = content.includes('font-nunito');
            } else if (feature.includes('min-h-[44px]')) {
                found = content.includes('min-h-[44px]');
            } else if (feature.includes('rounded-xl')) {
                found = content.includes('rounded-xl');
            } else if (feature.includes('responsive')) {
                found = content.includes('sm:') || content.includes('md:') || content.includes('lg:');
            } else if (feature.includes('keyboard navigation')) {
                found = content.includes('focus-visible') || content.includes('ArrowRight') || content.includes('keyboard');
            } else if (feature.includes('reduced motion')) {
                found = content.includes('reduce-motion');
            } else if (feature.includes('ARIA')) {
                found = content.includes('aria-') || content.includes('role=');
            } else if (feature.includes('Indonesian')) {
                found = content.includes('toLocaleDateString(\'id-ID\')') || content.includes('Tidak ada data');
            } else if (feature.includes('mobile card view')) {
                found = content.includes('sm:hidden') && content.includes('space-y-3');
            } else if (feature.includes('status badges')) {
                found = content.includes('Normal') && content.includes('Selesai') && content.includes('bg-[#04A3E8]/10');
            } else {
                // Generic search for other features
                const searchTerm = feature.toLowerCase().replace(/[^a-z0-9]/g, '');
                found = content.toLowerCase().replace(/[^a-z0-9]/g, '').includes(searchTerm);
            }

            if (found) {
                console.log(`   ✅ ${feature}`);
            } else {
                console.log(`   ❌ ${feature}`);
                allPassed = false;
            }
        });

        console.log('');
    }
});

// Check for demo component
const demoPath = path.join(__dirname, 'src/components/ui/data-display-demo.tsx');
if (fs.existsSync(demoPath)) {
    console.log('✅ Demo component exists');
    const demoContent = fs.readFileSync(demoPath, 'utf8');

    const demoFeatures = [
        'Comprehensive examples of all components',
        'BayiCare health-specific use cases',
        'Responsive design demonstrations',
        'Accessibility feature explanations',
        'Indonesian language content'
    ];

    console.log('   Demo component features:');
    demoFeatures.forEach(feature => {
        let found = false;

        if (feature.includes('Comprehensive examples')) {
            found = demoContent.includes('Tabs') && demoContent.includes('Table') && demoContent.includes('Accordion');
        } else if (feature.includes('health-specific')) {
            found = demoContent.includes('GrowthTable') && demoContent.includes('ImmunizationTable');
        } else if (feature.includes('Responsive design')) {
            found = demoContent.includes('grid-cols-1') && demoContent.includes('md:grid-cols');
        } else if (feature.includes('Accessibility')) {
            found = demoContent.includes('keyboard navigation') && demoContent.includes('screen reader');
        } else if (feature.includes('Indonesian')) {
            found = demoContent.includes('Pertumbuhan') && demoContent.includes('Imunisasi');
        }

        if (found) {
            console.log(`   ✅ ${feature}`);
        } else {
            console.log(`   ❌ ${feature}`);
            allPassed = false;
        }
    });
} else {
    console.log('❌ Demo component missing');
    allPassed = false;
}

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('🎉 All data display components are properly implemented!');
    console.log('\nFeatures implemented:');
    console.log('• Table component with BayiCare styling and responsive design');
    console.log('• Tabs component with keyboard navigation and touch targets');
    console.log('• Accordion component with proper accessibility');
    console.log('• Responsive table components for health data');
    console.log('• Badge component with BayiCare variants');
    console.log('• Comprehensive demo with real-world examples');
    console.log('• Indonesian language support');
    console.log('• Mobile-first responsive design');
    console.log('• Accessibility features (ARIA, keyboard nav, screen readers)');
    console.log('• Reduced motion support');

    console.log('\nNext steps:');
    console.log('1. Test components in the browser');
    console.log('2. Verify keyboard navigation works properly');
    console.log('3. Test on mobile devices');
    console.log('4. Run accessibility tests');

    process.exit(0);
} else {
    console.log('❌ Some components or features are missing or incomplete.');
    console.log('Please review the implementation and ensure all required features are present.');
    process.exit(1);
}