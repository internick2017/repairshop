const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Ensure images directory exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function createMockDashboardHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Computer Repair Shop</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Computer Repair Shop</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Admin User</button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Dashboard</h1>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                        <span class="text-white text-sm font-medium">📋</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Tickets</dt>
                                        <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">24</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                                        <span class="text-white text-sm font-medium">⏰</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Open Tickets</dt>
                                        <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">8</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                        <span class="text-white text-sm font-medium">✅</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completed</dt>
                                        <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">16</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                        <span class="text-white text-sm font-medium">📈</span>
                                    </div>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Success Rate</dt>
                                        <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">87%</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
                    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <span class="text-blue-500 mr-3">➕</span>
                            <span class="text-gray-900 dark:text-gray-100">Create Ticket</span>
                        </button>
                        <button class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <span class="text-green-500 mr-3">👤</span>
                            <span class="text-gray-900 dark:text-gray-100">Add Customer</span>
                        </button>
                        <button class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <span class="text-orange-500 mr-3">📋</span>
                            <span class="text-gray-900 dark:text-gray-100">View All Tickets</span>
                        </button>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h2>
                    <div class="space-y-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">Ticket #1234 completed - Laptop repair</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">New customer registered - John Smith</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span class="text-sm text-gray-600 dark:text-gray-400">Ticket #1235 assigned to Tech Team</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
  `;
}

function createMockTicketsHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tickets - Computer Repair Shop</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Computer Repair Shop</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Admin User</button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Tickets</h1>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Create Ticket</button>
                </div>
                
                <!-- Search and Filters -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                    <div class="flex flex-col md:flex-row gap-4">
                        <input type="text" placeholder="Search tickets..." class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
                        <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
                            <option>All Status</option>
                            <option>Open</option>
                            <option>Completed</option>
                        </select>
                        <button class="bg-gray-600 text-white px-4 py-2 rounded-md">Search</button>
                    </div>
                </div>

                <!-- Tickets Table -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tech</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#1234</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">John Smith</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Laptop won't turn on</td>
                                <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Completed</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Mike Johnson</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2024-01-15</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#1235</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Sarah Wilson</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Slow computer performance</td>
                                <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Open</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Lisa Chen</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2024-01-16</td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#1236</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">David Brown</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Virus removal</td>
                                <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Open</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Unassigned</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2024-01-17</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
  `;
}

function createMockCustomersHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customers - Computer Repair Shop</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
</head>
<body class="bg-gray-50 dark:bg-gray-900">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Computer Repair Shop</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Admin User</button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
                    <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Add Customer</button>
                </div>
                
                <!-- Search -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                    <div class="flex gap-4">
                        <input type="text" placeholder="Search customers..." class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md">
                        <button class="bg-gray-600 text-white px-4 py-2 rounded-md">Search</button>
                    </div>
                </div>

                <!-- Customers Table -->
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">City</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">John Smith</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">john@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">(555) 123-4567</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">New York</td>
                                <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <button class="text-blue-600 hover:text-blue-900">Edit</button>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">Sarah Wilson</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">sarah@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">(555) 234-5678</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Los Angeles</td>
                                <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <button class="text-blue-600 hover:text-blue-900">Edit</button>
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">David Brown</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">david@example.com</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">(555) 345-6789</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">Chicago</td>
                                <td class="px-6 py-4 whitespace-nowrap"><span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span></td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <button class="text-blue-600 hover:text-blue-900">Edit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
  `;
}

async function captureMockScreenshots() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  const mockPages = [
    {
      name: 'dashboard',
      html: createMockDashboardHTML(),
      description: 'Main dashboard with statistics and quick actions'
    },
    {
      name: 'tickets',
      html: createMockTicketsHTML(),
      description: 'Tickets management page with table view'
    },
    {
      name: 'customers',
      html: createMockCustomersHTML(),
      description: 'Customer management page'
    }
  ];
  
  for (const mockPage of mockPages) {
    try {
      console.log(`Creating mock ${mockPage.name}...`);
      
      // Set the HTML content
      await page.setContent(mockPage.html);
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      const filename = `${mockPage.name}-mock.png`;
      const filepath = path.join(imagesDir, filename);
      
      await page.screenshot({ 
        path: filepath,
        fullPage: false,
        clip: { x: 0, y: 0, width: 1200, height: 800 }
      });
      
      console.log(`✓ ${filename} saved`);
      
    } catch (error) {
      console.error(`✗ Error creating mock ${mockPage.name}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('\nMock screenshot creation completed!');
}

// Run the mock screenshot creation
captureMockScreenshots().catch(console.error); 