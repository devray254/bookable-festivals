
import { query } from './db-connection';
import { fetchEvents } from './events';
import { logActivity } from './logs';
import { resetUserPassword } from './auth/user-authentication';

// Generic CRUD operations
export interface CrudOperations<T> {
  getAll: (limit?: number, offset?: number) => Promise<T[]>;
  getById: (id: number) => Promise<T | null>;
  create: (data: Partial<T>, user: string) => Promise<{ success: boolean; id?: number; message?: string }>;
  update: (id: number, data: Partial<T>, user: string) => Promise<{ success: boolean; message?: string }>;
  delete: (id: number, user: string) => Promise<{ success: boolean; message?: string }>;
  count: () => Promise<number>;
}

// Creates a generic CRUD operation set for any table
export const createCrudOperations = <T>(
  tableName: string,
  idField: string = 'id',
  allowedFields: string[] = []
): CrudOperations<T> => {
  return {
    // Get all records
    getAll: async (limit = 100, offset = 0) => {
      try {
        const sql = `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`;
        const result = await query(sql, [limit, offset]);
        return result || [];
      } catch (error) {
        console.error(`Error fetching ${tableName}:`, error);
        return [];
      }
    },

    // Get record by ID
    getById: async (id: number) => {
      try {
        const sql = `SELECT * FROM ${tableName} WHERE ${idField} = ?`;
        const result = await query(sql, [id]);
        return result && result.length > 0 ? result[0] : null;
      } catch (error) {
        console.error(`Error fetching ${tableName} by ID:`, error);
        return null;
      }
    },

    // Create new record
    create: async (data: Partial<T>, user: string) => {
      try {
        // Filter data to include only allowed fields
        const filteredData: Record<string, any> = {};
        for (const key of Object.keys(data)) {
          if (allowedFields.includes(key)) {
            filteredData[key] = (data as any)[key];
          }
        }

        if (Object.keys(filteredData).length === 0) {
          return { success: false, message: 'No valid fields provided' };
        }

        const fields = Object.keys(filteredData).join(', ');
        const placeholders = Object.keys(filteredData).map(() => '?').join(', ');
        const values = Object.values(filteredData);

        const sql = `INSERT INTO ${tableName} (${fields}) VALUES (${placeholders})`;
        const result = await query(sql, values);

        if (result && result.insertId) {
          // Log the activity
          await logActivity({
            action: `${tableName} Created`,
            user,
            details: `Created new ${tableName} with ID: ${result.insertId}`,
            level: 'info'
          });

          return { success: true, id: result.insertId };
        } else {
          return { success: false, message: `Failed to create ${tableName}` };
        }
      } catch (error) {
        console.error(`Error creating ${tableName}:`, error);
        return { success: false, message: String(error) };
      }
    },

    // Update existing record
    update: async (id: number, data: Partial<T>, user: string) => {
      try {
        // Filter data to include only allowed fields
        const filteredData: Record<string, any> = {};
        for (const key of Object.keys(data)) {
          if (allowedFields.includes(key)) {
            filteredData[key] = (data as any)[key];
          }
        }

        if (Object.keys(filteredData).length === 0) {
          return { success: false, message: 'No valid fields provided' };
        }

        const setClause = Object.keys(filteredData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(filteredData), id];

        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${idField} = ?`;
        const result = await query(sql, values);

        if (result && result.affectedRows > 0) {
          // Log the activity
          await logActivity({
            action: `${tableName} Updated`,
            user,
            details: `Updated ${tableName} with ID: ${id}`,
            level: 'info'
          });

          return { success: true };
        } else {
          return { success: false, message: `Failed to update ${tableName} or no changes made` };
        }
      } catch (error) {
        console.error(`Error updating ${tableName}:`, error);
        return { success: false, message: String(error) };
      }
    },

    // Delete record
    delete: async (id: number, user: string) => {
      try {
        const sql = `DELETE FROM ${tableName} WHERE ${idField} = ?`;
        const result = await query(sql, [id]);

        if (result && result.affectedRows > 0) {
          // Log the activity
          await logActivity({
            action: `${tableName} Deleted`,
            user,
            details: `Deleted ${tableName} with ID: ${id}`,
            level: 'important'
          });

          return { success: true };
        } else {
          return { success: false, message: `${tableName} not found or already deleted` };
        }
      } catch (error) {
        console.error(`Error deleting ${tableName}:`, error);
        return { success: false, message: String(error) };
      }
    },

    // Count records
    count: async () => {
      try {
        const sql = `SELECT COUNT(*) as count FROM ${tableName}`;
        const result = await query(sql);
        return result[0]?.count || 0;
      } catch (error) {
        console.error(`Error counting ${tableName}:`, error);
        return 0;
      }
    }
  };
};

// Test the database connection
export const testDatabaseConnection = async () => {
  try {
    // Simple query to test connection
    await query('SELECT 1');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, message: String(error) };
  }
};

// Export events functions
export { 
  fetchEvents
};

// Export the categories functions from the categories file
export { 
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from './categories';

// Export auth functions
export {
  resetUserPassword
};
