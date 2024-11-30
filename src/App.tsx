import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { NavigationMenu } from './components/NavigationMenu';
import { ViewsConfig } from './components/ViewsConfig';
import { TagsPage } from './components/TagsPage';
import { View, Tag, Email } from './types';
import emailData from './data/emails.json';
import tagData from './data/tags.json';

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
        tags: tagData.tags
          .filter(tag => tag.category === 'general' || tag.category === 'official')
          .map(tag => tag.id)
      }]
    },
    {
      id: 'living',
      name: 'Living',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: tagData.tags
          .filter(tag => tag.category === 'home')
          .map(tag => tag.id)
      }]
    },
    {
      id: 'banking',
      name: 'Banking & Finance',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: tagData.tags
          .filter(tag => tag.category === 'finance')
          .map(tag => tag.id)
      }]
    },
    {
      id: 'work',
      name: 'Professional',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: tagData.tags
          .filter(tag => tag.category === 'professional')
          .map(tag => tag.id)
      }]
    },
    {
      id: 'education',
      name: 'Education',
      visible: true,
      conditions: [{
        type: 'includes-any',
        tags: tagData.tags
          .filter(tag => tag.category === 'learning')
          .map(tag => tag.id)
      }]
    }
  ]);

  const [tags, setTags] = useState<Tag[]>(tagData.tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    description: tag.description,
    category: tag.category
  })));

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
          <div 
            className={`
              flex-1 overflow-hidden bg-surface dark:bg-surface-dark
              ${currentPage === 'home' ? (
                isSidebarCollapsed ? 'md:ml-0' : 'md:ml-0'
              ) : 'ml-0'}
              transition-[margin] duration-300 ease-in-out
            `}
          >
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