import { join } from 'path';
import { Express } from 'express';
import 'reflect-metadata';

function scanForControllers(app: Express) {
  const fs = require('fs'); // Require fs module (assuming Node.js environment)

  function walkDir(currentDir: string) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const filePath = currentDir + '/' + file;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath); // Recursively walk through subdirectories
      } else if (file.endsWith('.controller.ts') && !file.startsWith('_schema.')) {
        // Check for “.controller.ts” files
        try {
          const controller = require(filePath).default; // Require the controller module

          if (controller && typeof controller === 'function' && controller.prototype) {
            const params = Reflect.getMetadata('design:paramtypes', controller) || [];
            const resolvedParams = params.map((param: any) => {
              // Check if dependency matches parameter type
              if (typeof param === 'function') {
                return new param();
              }
              // Handle non-dependency parameters (e.g., primitive types)
              return undefined;
            });
            const instance = new controller(...resolvedParams);
            instance._registerRoutes(app, instance);
            // registeredControllers.push(controller);
          } else {
            console.warn(`Ignoring non-controller export in: ${filePath}`); // Handle non-constructible exports
          }
        } catch (err) {
          console.error(`Error loading controller file: ${filePath}`, err);
        }
      }
    }
  }

  walkDir(join(__dirname, '../controllers')); // Start the recursive walk from the specified directory
}

export { scanForControllers };
