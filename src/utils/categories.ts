
// Categories related utilities
import { query } from './db-connection';
import { logActivity } from './logs';

// Fetch categories from database
export const fetchCategories = async () => {
  try {
    console.log('Fetching categories from database');
    const categories = await query(`
      SELECT c.*, COUNT(e.id) as events_count
      FROM categories c
      LEFT JOIN events e ON c.id = e.category_id
      GROUP BY c.id
      ORDER BY c.name
    `);
    console.log('Categories fetched:', categories ? categories.length : 0);
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Create a new category
export const createCategory = async (categoryData: any, adminEmail: string) => {
  try {
    console.log('Creating category:', categoryData);
    
    const sql = `
      INSERT INTO categories (name, description)
      VALUES (?, ?)
    `;
    
    const params = [
      categoryData.name,
      categoryData.description || ''
    ];
    
    const result = await query(sql, params);
    
    if (result && result.insertId) {
      // Log the activity
      await logActivity({
        action: 'Category Created',
        user: adminEmail,
        details: `Created new category: ${categoryData.name}`,
        level: 'info'
      });
      
      return { success: true, id: result.insertId };
    } else {
      return { success: false, message: 'Failed to create category' };
    }
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, message: String(error) };
  }
};

// Update an existing category
export const updateCategory = async (categoryId: number, categoryData: any, adminEmail: string) => {
  try {
    console.log('Updating category:', categoryId, categoryData);
    
    const sql = `
      UPDATE categories 
      SET name = ?, description = ?
      WHERE id = ?
    `;
    
    const params = [
      categoryData.name,
      categoryData.description || '',
      categoryId
    ];
    
    const result = await query(sql, params);
    
    if (result && result.affectedRows > 0) {
      // Log the activity
      await logActivity({
        action: 'Category Updated',
        user: adminEmail,
        details: `Updated category: ${categoryData.name}`,
        level: 'info'
      });
      
      return { success: true };
    } else {
      return { success: false, message: 'Failed to update category or no changes made' };
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, message: String(error) };
  }
};

// Delete a category
export const deleteCategory = async (categoryId: number, adminEmail: string) => {
  try {
    console.log('Deleting category:', categoryId);
    
    // First get the category details for logging
    const categoryDetails = await query('SELECT name FROM categories WHERE id = ?', [categoryId]);
    const categoryName = categoryDetails[0]?.name || 'Unknown category';
    
    // Check if the category is in use
    const eventsCount = await query(
      'SELECT COUNT(*) as count FROM events WHERE category_id = ?', 
      [categoryId]
    );
    
    if (eventsCount[0]?.count > 0) {
      return { 
        success: false, 
        message: `Cannot delete category "${categoryName}" because it is used by ${eventsCount[0].count} events`
      };
    }
    
    const sql = 'DELETE FROM categories WHERE id = ?';
    const result = await query(sql, [categoryId]);
    
    if (result && result.affectedRows > 0) {
      // Log the activity
      await logActivity({
        action: 'Category Deleted',
        user: adminEmail,
        details: `Deleted category: ${categoryName} (ID: ${categoryId})`,
        level: 'warning'
      });
      
      return { success: true };
    } else {
      return { success: false, message: 'Category not found or already deleted' };
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: String(error) };
  }
};
