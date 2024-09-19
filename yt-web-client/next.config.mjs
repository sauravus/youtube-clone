// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      // Add a rule to handle .mjs files in the node_modules directory
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // Treat the import statement as a module specifier
        },
        include: /node_modules/, // Apply this rule to modules in node_modules
        type: 'javascript/auto',
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  