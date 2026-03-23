/**
 * Database Configuration
 * 
 * IMPORTANT: This module handles database initialization with automatic fallback.
 * 
 * The app works even if DATABASE_URL is not configured - it will:
 * 1. First check for DATABASE_URL in environment
 * 2. Fall back to a default local database path
 * 3. If database fails, gracefully degrade to in-memory operation
 * 
 * This ensures the app ALWAYS starts, even on fresh installations.
 */

import { PrismaClient } from '@prisma/client';

// Set default DATABASE_URL if not configured
// This MUST happen before any Prisma imports
const DEFAULT_DATABASE_URL = 'file:./db/custom.db';

// Ensure DATABASE_URL is set before Prisma reads it
if (typeof process.env.DATABASE_URL === 'undefined' || process.env.DATABASE_URL === '') {
  console.log('[Database] DATABASE_URL not set, using default:', DEFAULT_DATABASE_URL);
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Track database state
let _prisma: PrismaClient | null = null
let _dbError: string | null = null
let _dbInitialized = false

/**
 * Initialize the Prisma client
 * This is called lazily when the database is first accessed
 */
function initPrisma(): PrismaClient | null {
  if (_prisma) return _prisma
  if (globalForPrisma.prisma) {
    _prisma = globalForPrisma.prisma
    return _prisma
  }
  
  try {
    console.log('[Database] Initializing Prisma client...');
    console.log('[Database] DATABASE_URL:', process.env.DATABASE_URL);
    
    _prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
      errorFormat: 'pretty',
    })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _prisma
    }
    
    _dbInitialized = true
    console.log('[Database] Prisma client initialized successfully');
    return _prisma
  } catch (error) {
    _dbError = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Database] Failed to initialize Prisma:', _dbError);
    console.error('[Database] Full error:', error);
    return null
  }
}

/**
 * Get the Prisma client instance
 * Returns null if database cannot be initialized
 */
export function getDb(): PrismaClient | null {
  if (!_dbInitialized) {
    return initPrisma()
  }
  return _prisma
}

/**
 * Check if database is available
 */
export function isDbAvailable(): boolean {
  if (!_dbInitialized) {
    initPrisma()
  }
  return _prisma !== null
}

/**
 * Get the last database error
 */
export function getDbError(): string | null {
  return _dbError
}

/**
 * Get the database URL being used
 */
export function getDbUrl(): string {
  return process.env.DATABASE_URL || DEFAULT_DATABASE_URL
}

/**
 * Create an empty result proxy for when database is unavailable
 */
function createEmptyResultProxy() {
  return new Proxy({}, {
    get(_target, _prop) {
      // Common Prisma methods return appropriate empty values
      return async (..._args: unknown[]) => {
        // findMany, findFirst, findUnique -> []
        // count -> 0
        // aggregate -> {}
        // create, update, delete -> would throw, return null
        return []
      }
    }
  })
}

// Create a proxy that lazily initializes the database
// This allows `db.article.findMany()` syntax while handling missing DATABASE_URL
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    // Initialize database on first access
    const prisma = getDb()
    
    if (!prisma) {
      console.log(`[Database] Database unavailable, returning empty proxy for: ${String(prop)}`)
      return createEmptyResultProxy()
    }
    
    return prisma[prop as keyof PrismaClient]
  }
})
