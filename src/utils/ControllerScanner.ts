import { join } from 'path';
import { Express } from 'express';
import 'reflect-metadata';

interface Controller {
  registerRoutes(app: Express): void;
}

const registeredControllers: Controller[] = [];

function scanForControllers() {
  const fs = require('fs'); // Require fs module (assuming Node.js environment)

  function walkDir(currentDir: string) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const filePath = currentDir + '/' + file;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath); // Recursively walk through subdirectories
      } else if (file.endsWith('.controller.ts')) {
        // Check for “.controller.ts” files
        try {
          const controller = require(filePath).default; // Require the controller module

          if (controller && typeof controller === 'function' && controller.prototype) {
            // Check for function with prototype
            // Likely a controller class
            registeredControllers.push(controller);
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

export { scanForControllers, registeredControllers };
