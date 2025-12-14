/**
 * Type definitions for Cloudflare Pages Functions
 * 
 * These types are used by the functions in the functions/ directory
 */

// @cloudflare/workers-types provides the PagesFunction type
// If you need to install it: npm install -D @cloudflare/workers-types
declare module '@cloudflare/workers-types' {
  export interface PagesFunction {
    (context: {
      request: Request;
      env: Env;
      params: Record<string, string>;
      waitUntil: (promise: Promise<any>) => void;
      next: () => Promise<Response>;
      data: any;
    }): Response | Promise<Response>;
  }
}

// Alternative: Define PagesFunction locally if @cloudflare/workers-types is not installed
export type PagesFunction = (context: {
  request: Request;
  env?: any;
  params?: Record<string, string>;
  waitUntil?: (promise: Promise<any>) => void;
  next?: () => Promise<Response>;
  data?: any;
}) => Response | Promise<Response>;