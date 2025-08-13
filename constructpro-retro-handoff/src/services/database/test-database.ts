// Simple test script to verify database functionality
// This can be imported and run in the app for testing

import ProjectService from './ProjectService';

export async function testDatabaseFunctions() {
  console.log('=== Testing Database Functions ===');
  
  try {
    // Test 1: Create a project
    console.log('\n1. Creating test project...');
    const projectId = await ProjectService.createProject({
      name: 'Test Construction Site',
      location: '123 Main St, City',
      client: 'ABC Construction Co.',
      status: 'active'
    });
    console.log('✓ Project created with ID:', projectId);
    
    // Test 2: Get all projects
    console.log('\n2. Getting all projects...');
    const projects = await ProjectService.getProjects();
    console.log('✓ Found', projects.length, 'projects');
    
    // Test 3: Get project by ID
    console.log('\n3. Getting project by ID...');
    const project = await ProjectService.getProjectById(projectId);
    console.log('✓ Retrieved project:', project?.name);
    
    // Test 4: Update project
    console.log('\n4. Updating project status...');
    const updated = await ProjectService.updateProject(projectId, {
      status: 'completed'
    });
    console.log('✓ Project updated:', updated);
    
    // Test 5: Add team member
    console.log('\n5. Adding team member...');
    const memberId = await ProjectService.addTeamMember(
      projectId,
      'John Smith',
      'Project Manager'
    );
    console.log('✓ Team member added with ID:', memberId);
    
    // Test 6: Get team members
    console.log('\n6. Getting team members...');
    const members = await ProjectService.getProjectTeamMembers(projectId);
    console.log('✓ Found', members.length, 'team members');
    
    // Test 7: Get project stats
    console.log('\n7. Getting project statistics...');
    const stats = await ProjectService.getProjectStats();
    console.log('✓ Stats:', stats);
    
    // Test 8: Search projects
    console.log('\n8. Searching projects...');
    const searchResults = await ProjectService.searchProjects('Test');
    console.log('✓ Found', searchResults.length, 'projects matching "Test"');
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Helper to clear all test data
export async function clearTestData() {
  try {
    const projects = await ProjectService.getProjects();
    for (const project of projects) {
      if (project.name.includes('Test') && project.id) {
        await ProjectService.deleteProject(project.id);
      }
    }
    console.log('✓ Test data cleared');
  } catch (error) {
    console.error('Error clearing test data:', error);
  }
}