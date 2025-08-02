#!/usr/bin/env node

/**
 * Verification script for layout components and navigation integration
 * This script checks that the new responsive layout components are properly integrated
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying layout components and navigation integration...\n');

// Files to check
const filesToCheck = [
    'src/components/layout/BottomNavigation.tsx',
    'src/components/layout/AppLayout.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/Sidebar.tsx',
    'src/components/ui/layout/mobile-nav.tsx',
    'src/components/ui/layout/responsive-container.tsx',
    'src/components/ui/layout/safe-area-wrapper.tsx',
    'src/components/ui/sheet.tsx'
];

// Check if files exist and contain expected content
const checks = [
    {
        file: 'src/components/layout/BottomNavigation.tsx',
        contains: ['MobileNav', 'MobileNavItem'],
        description: 'BottomNavigation uses new MobileNav component'
    },
    {
        file: 'src/components/layout/AppLayout.tsx',
        contains: ['ResponsiveContainer', 'SafeAreaWrapper'],
        description: 'AppLayout uses responsive layout components'
    },
    {
        file: 'src/components/layout/Header.tsx',
        contains: ['Sheet', 'SheetContent', 'SheetTrigger'],
        description: 'Header uses Sheet component for mobile navigation'
    },
    {
        file: 'src/components/layout/Sidebar.tsx',
        contains: ['SafeAreaWrapper'],
        description: 'Sidebar uses SafeAreaWrapper for safe area handling'
    },
    {
        file: 'src/components/ui/layout/mobile-nav.tsx',
        contains: ['SafeAreaWrapper', 'min-h-touch', 'env(safe-area-inset'],
        description: 'MobileNav has proper safe area and touch target handling'
    },
    {
        file: 'src/components/ui/layout/responsive-container.tsx',
        contains: ['env(safe-area-inset', 'max-w-'],
        description: 'ResponsiveContainer has safe area and responsive width handling'
    },
    {
        file: 'src/components/ui/layout/safe-area-wrapper.tsx',
        contains: ['env(safe-area-inset', 'padding', 'margin'],
        description: 'SafeAreaWrapper properly handles safe area insets'
    },
    {
        file: 'src/components/ui/sheet.tsx',
        contains: ['env(safe-area-inset', 'rounded-', 'backdrop-blur'],
        description: 'Sheet component has safe area handling and proper styling'
    }
];

let allPassed = true;

checks.forEach(check => {
    const filePath = path.join(__dirname, check.file);

    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${check.description}`);
        console.log(`   File not found: ${check.file}\n`);
        allPassed = false;
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const missingItems = check.contains.filter(item => !content.includes(item));

    if (missingItems.length > 0) {
        console.log(`❌ ${check.description}`);
        console.log(`   Missing: ${missingItems.join(', ')}\n`);
        allPassed = false;
    } else {
        console.log(`✅ ${check.description}`);
    }
});

// Check for proper imports
console.log('\n🔍 Checking imports...');

const importChecks = [
    {
        file: 'src/components/layout/BottomNavigation.tsx',
        shouldImport: '@/components/ui/layout/mobile-nav',
        description: 'BottomNavigation imports MobileNav'
    },
    {
        file: 'src/components/layout/AppLayout.tsx',
        shouldImport: '@/components/ui/layout/responsive-container',
        description: 'AppLayout imports ResponsiveContainer'
    },
    {
        file: 'src/components/layout/Header.tsx',
        shouldImport: '@/components/ui/sheet',
        description: 'Header imports Sheet components'
    }
];

importChecks.forEach(check => {
    const filePath = path.join(__dirname, check.file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(check.shouldImport)) {
            console.log(`✅ ${check.description}`);
        } else {
            console.log(`❌ ${check.description}`);
            allPassed = false;
        }
    }
});

// Check for safe area CSS classes
console.log('\n🔍 Checking safe area CSS classes...');

const safeAreaChecks = [
    'env(safe-area-inset-top)',
    'env(safe-area-inset-bottom)',
    'env(safe-area-inset-left)',
    'env(safe-area-inset-right)'
];

let safeAreaFound = false;
filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        safeAreaChecks.forEach(cssClass => {
            if (content.includes(cssClass)) {
                safeAreaFound = true;
            }
        });
    }
});

if (safeAreaFound) {
    console.log('✅ Safe area CSS classes found in components');
} else {
    console.log('❌ Safe area CSS classes not found');
    allPassed = false;
}

// Check for touch-friendly sizing
console.log('\n🔍 Checking touch-friendly sizing...');

const touchChecks = ['min-h-touch', 'min-w-touch', 'min-h-[44px]', 'min-h-[56px]'];
let touchFriendlyFound = false;

filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        touchChecks.forEach(touchClass => {
            if (content.includes(touchClass)) {
                touchFriendlyFound = true;
            }
        });
    }
});

if (touchFriendlyFound) {
    console.log('✅ Touch-friendly sizing classes found');
} else {
    console.log('❌ Touch-friendly sizing classes not found');
    allPassed = false;
}

console.log('\n' + '='.repeat(50));
if (allPassed) {
    console.log('🎉 All layout integration checks passed!');
    console.log('\nLayout components have been successfully updated with:');
    console.log('• New responsive layout components (ResponsiveContainer, SafeAreaWrapper)');
    console.log('• Updated mobile navigation using MobileNav component');
    console.log('• Sheet component integration for mobile menu');
    console.log('• Proper safe area handling for devices with notches');
    console.log('• Touch-friendly sizing for mobile interactions');
} else {
    console.log('❌ Some layout integration checks failed');
    console.log('Please review the issues above and fix them.');
    process.exit(1);
}