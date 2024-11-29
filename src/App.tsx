import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { NavigationMenu } from './components/NavigationMenu';
import { ViewsConfig } from './components/ViewsConfig';
import { TagsPage } from './components/TagsPage';
import { View, Tag, Email } from './types';
import emailData from './data/emails.json';

function App() {
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 768);
  
  const [views, setViews] = useState<View[]>([
    { 
      id: 'docs', 
      name: 'Official Documents', 
      visible: true,
      conditions: [{ 
        type: 'includes-any',
        tags: ['document', 'official']
      }]
    },
    {
      id: 'living',
      name: 'Living',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: ['living', 'home', 'utilities']
      }]
    },
    {
      id: 'banking',
      name: 'Banking',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: ['banking', 'finance']
      }]
    },
    {
      id: 'work',
      name: 'Work',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: ['work']
      }]
    },
    {
      id: 'education',
      name: 'Education',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: ['education', 'school']
      }]
    },
    {
      id: 'business',
      name: 'Business',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: ['business']
      }]
    }
  ]);

  const [tags, setTags] = useState<Tag[]>([
    { id: 'document', name: 'Document' },
    { id: 'official', name: 'Official' },
    { id: 'living', name: 'Living' },
    { id: 'home', name: 'Home' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'banking', name: 'Banking' },
    { id: 'finance', name: 'Finance' },
    { id: 'work', name: 'Work' },
    { id: 'education', name: 'Education' },
    { id: 'school', name: 'School' },
    { id: 'business', name: 'Business' },
    { id: 'gov', name: 'Government' },
    { id: 'tax', name: 'Tax' },
    { id: 'health-ins', name: 'Health Insurance' },
    { id: 'invest', name: 'Investment' },
    { id: 'housing', name: 'Housing' },
    { id: 'job', name: 'Job' },
    { id: 'prof', name: 'Professional' },
    { id: 'edu', name: 'Education' }
  ]);

  const [emails] = useState<Email[]>(emailData.emails);

  const getTagHierarchy = (tagId: string): string[] => {
    const tag = tags.find(t => t.id === tagId);
    if (!tag) return [];
    return [tag.name];
  };

  const handleUpdateViews = (updatedViews: View[]) => {
    setViews(updatedViews);
  };

  const handleUpdateTags = (updatedTags: Tag[]) => {
    setTags(updatedTags);
  };

  const handleViewSelect = (view: string) => {
    setSelectedView(view);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsNavMenuOpen(false);
    if (page === 'home') {
      setSelectedView(null);
    }
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onSelectView={handleViewSelect} 
        onMenuClick={() => setIsNavMenuOpen(true)}
      />
      <NavigationMenu
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <div className="flex flex-1 overflow-hidden">
        {currentPage === 'home' && (
          <Sidebar
            views={views.filter(v => v.visible)}
            selectedView={selectedView}
            onViewSelect={handleViewSelect}
            currentPage={currentPage}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
          />
        )}
        {currentPage === 'views' ? (
          <ViewsConfig
            views={views}
            onUpdateViews={handleUpdateViews}
          />
        ) : currentPage === 'tags' ? (
          <TagsPage 
            tags={tags}
            onUpdateTags={handleUpdateTags}
          />
        ) : (
          <div className="flex-1 md:ml-0 ml-24 overflow-hidden bg-surface dark:bg-surface-dark">
            <EmailList 
              emails={emails}
              selectedView={selectedView}
              views={views}
              getParentView={getTagHierarchy}
              tags={tags}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;