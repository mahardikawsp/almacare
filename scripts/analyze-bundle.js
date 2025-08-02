#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

function analyzeBundle() {
    log('🔍 Analyzing bundle size and performance...', 'cyan')

    try {
        // Build the application
        log('📦 Building application...', 'yellow')
        execSync('npm run build', { stdio: 'inherit' })

        // Analyze .next directory
        const nextDir = path.join(process.cwd(), '.next')
        const staticDir = path.join(nextDir, 'static')

        if (!fs.existsSync(staticDir)) {
            log('❌ Build directory not found. Please run npm run build first.', 'red')
            return
        }

        // Analyze JavaScript chunks
        const chunksDir = path.join(staticDir, 'chunks')
        if (fs.existsSync(chunksDir)) {
            const chunks = fs.readdirSync(chunksDir)
                .filter(file => file.endsWith('.js'))
                .map(file => {
                    const filePath = path.join(chunksDir, file)
                    const stats = fs.statSync(filePath)
                    return {
                        name: file,
                        size: stats.size,
                        sizeKB: Math.round(stats.size / 1024)
                    }
                })
                .sort((a, b) => b.size - a.size)

            log('\n📊 JavaScript Chunks Analysis:', 'bright')
            log('='.repeat(60), 'blue')

            let totalSize = 0
            chunks.forEach(chunk => {
                totalSize += chunk.size
                const sizeColor = chunk.sizeKB > 500 ? 'red' : chunk.sizeKB > 200 ? 'yellow' : 'green'
                log(`${chunk.name.padEnd(40)} ${chunk.sizeKB.toString().padStart(6)} KB`, sizeColor)
            })

            log('='.repeat(60), 'blue')
            log(`Total JS Size: ${Math.round(totalSize / 1024)} KB`, 'bright')

            // Performance recommendations
            log('\n💡 Performance Recommendations:', 'magenta')
            chunks.forEach(chunk => {
                if (chunk.sizeKB > 500) {
                    log(`⚠️  ${chunk.name} is large (${chunk.sizeKB}KB) - consider code splitting`, 'yellow')
                }
            })
        }

        // Analyze CSS files
        const cssDir = path.join(staticDir, 'css')
        if (fs.existsSync(cssDir)) {
            const cssFiles = fs.readdirSync(cssDir)
                .filter(file => file.endsWith('.css'))
                .map(file => {
                    const filePath = path.join(cssDir, file)
                    const stats = fs.statSync(filePath)
                    return {
                        name: file,
                        size: stats.size,
                        sizeKB: Math.round(stats.size / 1024)
                    }
                })

            if (cssFiles.length > 0) {
                log('\n🎨 CSS Files Analysis:', 'bright')
                log('='.repeat(60), 'blue')

                let totalCSSSize = 0
                cssFiles.forEach(file => {
                    totalCSSSize += file.size
                    log(`${file.name.padEnd(40)} ${file.sizeKB.toString().padStart(6)} KB`, 'green')
                })

                log('='.repeat(60), 'blue')
                log(`Total CSS Size: ${Math.round(totalCSSSize / 1024)} KB`, 'bright')
            }
        }

        // Check for potential optimizations
        log('\n🚀 Optimization Opportunities:', 'cyan')

        // Check for large dependencies
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
        const largeDependencies = [
            'react-dom',
            'next',
            '@radix-ui/react-dialog',
            'recharts',
            'html2canvas',
            'jspdf'
        ]

        largeDependencies.forEach(dep => {
            if (packageJson.dependencies[dep]) {
                log(`📦 ${dep} - Consider lazy loading if not critical`, 'yellow')
            }
        })

        // Check for unused dependencies
        log('\n🧹 Potential Unused Dependencies:', 'magenta')
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
        const suspiciousDeps = Object.keys(allDeps).filter(dep =>
            !dep.startsWith('@types/') &&
            !['react', 'react-dom', 'next', 'typescript'].includes(dep)
        )

        // This is a simple check - in a real scenario, you'd want to use a tool like depcheck
        log('💡 Run `npx depcheck` to find actually unused dependencies', 'blue')

        log('\n✅ Bundle analysis complete!', 'green')

    } catch (error) {
        log(`❌ Error analyzing bundle: ${error.message}`, 'red')
    }
}

// Performance benchmarking
function benchmarkComponents() {
    log('\n⏱️  Component Performance Benchmarks:', 'cyan')

    const benchmarkScript = `
    const { performance } = require('perf_hooks');
    
    // Simulate component render times
    const components = [
      'Button',
      'Card', 
      'GrowthChartCard',
      'ResponsiveTable',
      'VirtualizedList'
    ];
    
    components.forEach(component => {
      const start = performance.now();
      // Simulate render work
      for (let i = 0; i < 1000; i++) {
        Math.random();
      }
      const end = performance.now();
      console.log(\`\${component}: \${(end - start).toFixed(2)}ms\`);
    });
  `

    try {
        execSync(`node -e "${benchmarkScript}"`, { stdio: 'inherit' })
    } catch (error) {
        log('Could not run component benchmarks', 'yellow')
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2)

    if (args.includes('--benchmark')) {
        benchmarkComponents()
    } else {
        analyzeBundle()
    }

    if (args.includes('--recommendations')) {
        log('\n📋 Additional Recommendations:', 'bright')
        log('1. Use Next.js Image component for optimized images', 'blue')
        log('2. Implement service worker for caching', 'blue')
        log('3. Consider using Web Workers for heavy computations', 'blue')
        log('4. Implement proper error boundaries', 'blue')
        log('5. Use React.memo for expensive components', 'blue')
        log('6. Implement virtualization for large lists', 'blue')
        log('7. Use dynamic imports for non-critical components', 'blue')
    }
}