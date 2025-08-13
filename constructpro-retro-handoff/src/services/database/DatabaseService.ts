import * as SQLite from 'expo-sqlite';

// Database types
export interface Project {
  id?: number;
  name: string;
  location: string;
  client: string;
  status: 'active' | 'completed' | 'pending';
  created_at?: string;
  updated_at?: string;
}

export interface Photo {
  id?: number;
  uri: string;
  project_id: number;
  metadata?: string;
  created_at?: string;
}

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  project_id: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase;
  private dbName = 'constructpro.db';
  private isInitialized = false;

  constructor() {
    // Use sync API for immediate initialization
    this.db = SQLite.openDatabaseSync(this.dbName);
    this.initDatabase();
  }

  private initDatabase() {
    if (this.isInitialized) return;
    
    try {
      // Projects table
      this.db.execSync(
        `CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          location TEXT NOT NULL,
          client TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );

      // Photos table
      this.db.execSync(
        `CREATE TABLE IF NOT EXISTS photos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uri TEXT NOT NULL,
          project_id INTEGER NOT NULL,
          metadata TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        );`
      );

      // Team members table
      this.db.execSync(
        `CREATE TABLE IF NOT EXISTS team_members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          project_id INTEGER NOT NULL,
          FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        );`
      );

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  // Execute a query with promise support
  async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const result = await this.db.getAllAsync(query, params);
      return result as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Execute a non-query command
  async executeCommand(query: string, params: any[] = []): Promise<SQLite.SQLiteRunResult> {
    try {
      const result = await this.db.runAsync(query, params);
      return result;
    } catch (error) {
      console.error('Database command error:', error);
      throw error;
    }
  }

  // Get database instance for advanced operations
  getDatabase(): SQLite.SQLiteDatabase {
    return this.db;
  }
}

// Export singleton instance
export default new DatabaseService();