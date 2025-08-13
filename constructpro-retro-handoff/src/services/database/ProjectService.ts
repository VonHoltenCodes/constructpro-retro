import DatabaseService, { Project, Photo, TeamMember } from './DatabaseService';
import PhotoStorageService from '../storage/PhotoStorageService';

class ProjectService {
  // Create a new project
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const query = `
      INSERT INTO projects (name, location, client, status)
      VALUES (?, ?, ?, ?)
    `;
    const params = [project.name, project.location, project.client, project.status];
    
    const result = await DatabaseService.executeCommand(query, params);
    return result.lastInsertRowId;
  }

  // Get all projects
  async getProjects(): Promise<Project[]> {
    const query = `
      SELECT * FROM projects
      ORDER BY updated_at DESC
    `;
    return DatabaseService.executeQuery<Project>(query);
  }

  // Get project by ID
  async getProjectById(id: number): Promise<Project | null> {
    const query = `SELECT * FROM projects WHERE id = ?`;
    const projects = await DatabaseService.executeQuery<Project>(query, [id]);
    return projects.length > 0 ? projects[0] : null;
  }

  // Update project
  async updateProject(id: number, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<boolean> {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return false;
    
    // Add updated_at to the update
    fields.push('updated_at');
    values.push(new Date().toISOString());
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const query = `UPDATE projects SET ${setClause} WHERE id = ?`;
    values.push(id);
    
    const result = await DatabaseService.executeCommand(query, values);
    return result.changes > 0;
  }

  // Delete project
  async deleteProject(id: number): Promise<boolean> {
    const query = `DELETE FROM projects WHERE id = ?`;
    const result = await DatabaseService.executeCommand(query, [id]);
    return result.changes > 0;
  }

  // Assign photo to project - integrates with PhotoStorageService
  async assignPhotoToProject(projectId: number, photoUri: string, metadata?: any): Promise<number> {
    // First, use PhotoStorageService to physically move the photo
    const photoId = photoUri.split('/').pop()?.replace(/\.(jpg|jpeg|png)$/, '') || `photo_${Date.now()}`;
    const success = await PhotoStorageService.assignPhotosToProject([photoId], projectId.toString());
    
    if (!success) {
      throw new Error('Failed to assign photo to project');
    }
    
    // Then record it in our database
    const query = `
      INSERT INTO photos (uri, project_id, metadata)
      VALUES (?, ?, ?)
    `;
    const metadataString = metadata ? JSON.stringify(metadata) : null;
    const result = await DatabaseService.executeCommand(query, [photoUri, projectId, metadataString]);
    return result.lastInsertRowId;
  }

  // Get project photos
  async getProjectPhotos(projectId: number): Promise<Photo[]> {
    const query = `
      SELECT * FROM photos
      WHERE project_id = ?
      ORDER BY created_at DESC
    `;
    const photos = await DatabaseService.executeQuery<Photo>(query, [projectId]);
    
    // Parse metadata JSON for each photo
    return photos.map(photo => ({
      ...photo,
      metadata: photo.metadata ? JSON.parse(photo.metadata) : null
    }));
  }

  // Add team member to project
  async addTeamMember(projectId: number, name: string, role: string): Promise<number> {
    const query = `
      INSERT INTO team_members (name, role, project_id)
      VALUES (?, ?, ?)
    `;
    const result = await DatabaseService.executeCommand(query, [name, role, projectId]);
    return result.lastInsertRowId;
  }

  // Get project team members
  async getProjectTeamMembers(projectId: number): Promise<TeamMember[]> {
    const query = `
      SELECT * FROM team_members
      WHERE project_id = ?
    `;
    return DatabaseService.executeQuery<TeamMember>(query, [projectId]);
  }

  // Get project statistics
  async getProjectStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    pending: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM projects
    `;
    const result = await DatabaseService.executeQuery<any>(query);
    return result[0];
  }

  // Search projects by name or client
  async searchProjects(searchTerm: string): Promise<Project[]> {
    const query = `
      SELECT * FROM projects
      WHERE name LIKE ? OR client LIKE ?
      ORDER BY updated_at DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    return DatabaseService.executeQuery<Project>(query, [searchPattern, searchPattern]);
  }

  // Assign multiple photos to project from gallery
  async assignMultiplePhotosToProject(photoIds: string[], projectId: number): Promise<boolean> {
    try {
      // Use PhotoStorageService to physically move photos
      const success = await PhotoStorageService.assignPhotosToProject(photoIds, projectId.toString());
      
      if (!success) {
        return false;
      }
      
      // Update project's updated_at timestamp
      await this.updateProject(projectId, {});
      
      return true;
    } catch (error) {
      console.error('Error assigning photos to project:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new ProjectService();