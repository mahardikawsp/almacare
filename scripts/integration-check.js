#!/usr/bin/env node

/**
 * Integration Check Script for shadcn/ui Components
 * Verifies that all shadcn/ui components are properly integrated into BayiCare app
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components/ui');
const REQUIRED_COMPONENTS = [
    'button.tsx',
    'card.tsx',
    'input.tsx',
    'label.tsx',
    'select.tsx',
    'textarea.tsx',
    'form.tsx'
];

const OPTIONAL_COMPONENTS = [
    'dialog.tsx',
    'sheet.tsx',
    'toast.tsx',
    'alert.tsx',
    'table.tsx',
    'tabs.tsx',
    'accordion.tsx',
    'progress.tsx',
    'skeleton.tsx'
];

function checkComponentExists(componentName) {
    const componentPath = path.join(COMPONENTS_DIR, componentName);
    return fs.existsSync(componentPath);
}

function checkComponentImports(componentName) {
    const componentPath = path.join(COMPONENTS_DIR, componentName);
    if (!fs.existsSync(componentPath)) return false;

    const content = fs.readFileSync(componentPath, 'utf8');

    // Check for BayiCare specific customizations
    const hasBayiCareColors = content.includes('picton-blue') || content.includes('berkeley-blue');
    const hasAccessibility = content.includes('aria-') || content.includes('role=');
    const hasResponsive = content.includes('sm:') || content.includes('md:') || content.includes('lg:');

    return {
        exists: true,
        hasBayiCareColors,
        hasAccessibility,
        hasResponsive
    };
}

function generateIntegrationReport() {
    console.log('🔍 BayiCare shadcn/ui Integration Check\n');
    console.log('='.repeat(50));

    let allGood = true;

    // Check required components
    console.log('\n📋 Required Components:');
    REQUIRED_COMPONENTS.forEach(component => {
        const check = checkComponentImports(component);
        if (check.exists) {
            console.log(`✅ ${component}`);
            if (check.hasBayiCareColors) console.log(`   🎨 BayiCare theming: ✅`);
            if (check.hasAccessibility) console.log(`   ♿ Accessibility: ✅`);
            if (check.hasResponsive) console.log(`   📱 Responsive: ✅`);
        } else {
            console.log(`❌ ${component} - MISSING`);
            allGood = false;
        }
    });

    // Check optional components
    console.log('\n📋 Optional Components:');
    OPTIONAL_COMPONENTS.forEach(component => {
        const exists = checkComponentExists(component);
        console.log(`${exists ? '✅' : '⚠️'} ${component} ${exists ? '' : '- Not implemented'}`);
    });

    // Check for demo components (should be removed in production)
    console.log('\n🧹 Demo Components Check:');
    const demoFiles = [
        'demo-components.tsx',
        'form-components-demo.tsx',
        'comprehensive-form-demo.tsx',
        'test-shadcn.tsx'
    ];

    demoFiles.forEach(file => {
        const exists = checkComponentExists(file);
        if (exists) {
            console.log(`⚠️ ${file} - Should be removed for production`);
        } else {
            console.log(`✅ ${file} - Not found (good for production)`);
        }
    });

    console.log('\n' + '='.repeat(50));
    console.log(allGood ? '🎉 All required components are integrated!' : '❌ Some components need attention');

    return allGood;
}

if (require.main === module) {
    const success = generateIntegrationReport();
    process.exit(success ? 0 : 1);
}

module.exports = { generateIntegrationReport };